import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NeonQueryFunction } from "@neondatabase/serverless";

import {
  createPostgresKickService,
  migrateKickDatabase,
  resetKickDatabase
} from "./postgres-kick-service";
import {
  boardBase,
  contestFixtures,
  KickServiceError,
  type KickSubmissionPayload,
  type MakerSubmission,
  type Product,
  seedLaunches
} from "./kick-service";

const neonMock = vi.hoisted(() => vi.fn());

vi.mock("@neondatabase/serverless", () => ({
  neon: neonMock
}));

type QueryRecord = {
  text: string;
  values: unknown[];
};

type ProductRow = {
  id: string;
  slug: string;
  data: Product | string;
  created_at: string;
};

type BoardRow = {
  id: string;
  period: string;
  title: string;
  starts_on: string;
  ends_on: string;
};

type LaunchRow = {
  id: string;
  rank: number;
  product_id: string;
  board_id: string;
  base_vote_count: number;
  comment_count: number;
  featured_reason: string;
  launched_at: string;
};

type ContestRow = {
  id: string;
  slug: string;
  title: string;
  host: string;
  description: string;
  status: string;
  starts_on: string;
  ends_on: string;
  product_count: number;
  display_order: number;
  featured_launch_ids: string | string[];
};

type SubmissionRow = {
  id: string;
  payload: string | KickSubmissionPayload;
  viewer_id: string;
  status: MakerSubmission["status"];
  created_at: string;
};

type FakeDb = {
  products: Map<string, ProductRow>;
  boards: Map<string, BoardRow>;
  launches: Map<string, LaunchRow>;
  contests: Map<string, ContestRow>;
  votes: Map<string, { launch_id: string; viewer_id: string; created_at: string }>;
  newsletterSubscriptions: Array<{ id: string; email: string; source: string; created_at: string }>;
  submissions: Map<string, SubmissionRow>;
  queries: QueryRecord[];
  transactions: number;
};

describe("postgres kick service", () => {
  beforeEach(() => {
    neonMock.mockReset();
  });

  it("migration은 MVP 테이블과 contest display_order 보강 컬럼을 만든다", async () => {
    const fake = createFakeSql({ seeded: false });

    await migrateKickDatabase(fake.sql);

    expect(fake.queryTexts()).toEqual(
      expect.arrayContaining([
        expect.stringContaining("create table if not exists products"),
        expect.stringContaining("create table if not exists boards"),
        expect.stringContaining("create table if not exists launches"),
        expect.stringContaining("create table if not exists contests"),
        expect.stringContaining("alter table contests add column if not exists display_order"),
        expect.stringContaining("create table if not exists votes"),
        expect.stringContaining("create table if not exists newsletter_subscriptions"),
        expect.stringContaining("create table if not exists maker_submissions")
      ])
    );
  });

  it("reset은 write 데이터를 지우고 현재 seed 제품, 런치, 콘테스트를 Postgres 상태로 복원한다", async () => {
    const fake = createFakeSql({ seeded: true });
    fake.db.votes.set(voteKey("launch_cursor", "viewer_reset"), {
      launch_id: "launch_cursor",
      viewer_id: "viewer_reset",
      created_at: "2026-06-15T00:00:00.000Z"
    });
    fake.db.newsletterSubscriptions.push({
      id: "newsletter_old",
      email: "old@example.com",
      source: "board",
      created_at: "2026-06-15T00:00:00.000Z"
    });
    fake.db.submissions.set("submission_old", {
      id: "submission_old",
      payload: "{}",
      viewer_id: "viewer_old",
      status: "received",
      created_at: "2026-06-15T00:00:00.000Z"
    });

    const result = await resetKickDatabase(fake.sql);

    expect(result).toEqual({
      status: "reset",
      storage: "postgres",
      products: 10,
      launches: 10,
      contests: 5
    });
    expect(fake.db.products.size).toBe(10);
    expect(fake.db.launches.size).toBe(10);
    expect(fake.db.contests.size).toBe(5);
    expect(fake.db.votes.size).toBe(0);
    expect(fake.db.newsletterSubscriptions).toHaveLength(0);
    expect(fake.db.submissions.size).toBe(0);
    expect(fake.queryTexts()).toContain("delete from votes");
    expect(fake.queryTexts()).toContain("delete from products");
  });

  it("weekly board와 contest를 Postgres row에서 조립하고 viewer vote 상태를 반영한다", async () => {
    const fake = createFakeSql({ seeded: true });
    fake.db.votes.set(voteKey("launch_cursor", "viewer_pg"), {
      launch_id: "launch_cursor",
      viewer_id: "viewer_pg",
      created_at: "2026-06-15T00:00:00.000Z"
    });
    neonMock.mockReturnValue(fake.sql);
    const service = createPostgresKickService("postgres://kick-test");

    const board = await service.getWeeklyBoard({
      q: "developer",
      tag: "Productivity",
      viewerId: "viewer_pg"
    });
    const contests = await service.getContests();

    expect(neonMock).toHaveBeenCalledWith("postgres://kick-test");
    expect(board.board.launches).toHaveLength(1);
    expect(board.board.launches[0]?.product.slug).toBe("cursor");
    expect(board.board.launches[0]?.isVotedByViewer).toBe(true);
    expect(board.board.launches[0]?.voteCount).toBe(429);
    expect(board.filters.q).toBe("developer");
    expect(board.filters.availableTags).toContain("Productivity");
    expect(contests.contests).toHaveLength(5);
    expect(contests.contests[0]?.featuredLaunches[0]?.product.slug).toBeTruthy();
  });

  it("비어 있는 Postgres 상태는 조회 시 seed로 초기화한 뒤 board를 반환한다", async () => {
    const fake = createFakeSql({ seeded: false });
    neonMock.mockReturnValue(fake.sql);
    const service = createPostgresKickService("postgres://empty");

    const board = await service.getWeeklyBoard({});

    expect(board.board.launches).toHaveLength(10);
    expect(fake.db.products.size).toBe(10);
    expect(fake.db.contests.size).toBe(5);
  });

  it("vote toggle은 기존 vote 삭제, 신규 vote 삽입, 없는 launch 오류를 처리한다", async () => {
    const fake = createFakeSql({ seeded: true });
    fake.db.votes.set(voteKey("launch_cursor", "viewer_toggle"), {
      launch_id: "launch_cursor",
      viewer_id: "viewer_toggle",
      created_at: "2026-06-15T00:00:00.000Z"
    });
    neonMock.mockReturnValue(fake.sql);
    const service = createPostgresKickService("postgres://votes");

    const unvoted = await service.toggleVote({
      launchId: "launch_cursor",
      viewerId: "viewer_toggle"
    });
    const votedAgain = await service.toggleVote({
      launchId: "launch_cursor",
      viewerId: "viewer_toggle"
    });

    expect(unvoted).toMatchObject({
      launchId: "launch_cursor",
      voteCount: 428,
      isVotedByViewer: false
    });
    expect(votedAgain).toMatchObject({
      launchId: "launch_cursor",
      voteCount: 429,
      isVotedByViewer: true
    });
    await expect(
      service.toggleVote({
        launchId: "launch_missing",
        viewerId: "viewer_toggle"
      })
    ).rejects.toMatchObject({
      code: "NOT_FOUND",
      fields: ["launchId"]
    });
  });

  it("newsletter와 maker submission의 validation, insert, 조회 실패를 검증한다", async () => {
    const fake = createFakeSql({ seeded: true });
    neonMock.mockReturnValue(fake.sql);
    const service = createPostgresKickService("postgres://writes");

    await expect(
      service.createNewsletterSubscription({
        email: "bad-email",
        source: "board"
      })
    ).rejects.toMatchObject({
      code: "VALIDATION_ERROR",
      fields: ["email"]
    });
    await expect(
      service.createNewsletterSubscription({
        email: "maker@example.com",
        source: "unknown" as "board"
      })
    ).rejects.toMatchObject({
      code: "VALIDATION_ERROR",
      fields: ["source"]
    });

    const subscription = await service.createNewsletterSubscription({
      email: " maker@example.com ",
      source: "maker"
    });
    const created = await service.createMakerSubmission({
      viewerId: "viewer_maker",
      payload: {
        productName: "DemoFlow",
        tagline: "DemoFlow로 발표 준비를 정리하세요.",
        description: "사내 시연 준비를 돕는 제품입니다.",
        websiteUrl: "https://example.com",
        tags: ["Demo"],
        makerNote: "MVP 후보"
      }
    });
    const detail = await service.getMakerSubmission(created.submission.id);

    expect(subscription.subscription.email).toBe("maker@example.com");
    expect(fake.db.newsletterSubscriptions).toHaveLength(1);
    expect(created.previewUrl).toBe(`/submissions/${created.submission.id}`);
    expect(detail.submission.payload.productName).toBe("DemoFlow");
    expect(detail.submission.viewerId).toBe("viewer_maker");

    await expect(
      service.createMakerSubmission({
        viewerId: "",
        payload: {
          productName: "",
          tagline: "DemoFlow로 발표 준비를 정리하세요.",
          description: "사내 시연 준비를 돕는 제품입니다.",
          tags: [],
          makerNote: "MVP 후보"
        }
      })
    ).rejects.toMatchObject({
      code: "VALIDATION_ERROR",
      fields: expect.arrayContaining(["viewerId", "productName", "tags"])
    });
    await expect(service.getMakerSubmission("submission_missing")).rejects.toMatchObject({
      code: "NOT_FOUND",
      fields: ["id"]
    });
  });

  it("제품 등록은 Postgres products와 launches에 저장하고 상세와 board에 반영한다", async () => {
    const fake = createFakeSql({ seeded: true });
    neonMock.mockReturnValue(fake.sql);
    const service = createPostgresKickService("postgres://products");

    const created = await service.registerProduct({
      name: "DemoFlow",
      emoji: "🚀",
      category: "생산성",
      tagline: "시연 준비를 한 흐름으로 정리하는 도구",
      description: "DemoFlow는 제품 시연을 준비하는 팀이 핵심 메시지와 체크리스트를 정리하도록 돕습니다.",
      kickPoint: "흩어진 시연 준비를 한 페이지로 모아 바로 공유합니다.",
      tags: ["AI", "Productivity"],
      targetUsers: ["초기 제품팀"],
      useCases: ["데모 스크립트 정리"],
      cardNewsCopy: ["시연 흐름을 한눈에", "체크리스트로 누락 없이"],
      targetMessages: [{ audience: "초기 제품팀", message: "시연 전 핵심 메시지를 빠르게 맞춥니다." }],
      maker: { name: "Demo Team", profileUrl: "https://example.com/demo-team" }
    });
    const duplicated = await service.registerProduct({
      name: "Cursor",
      category: "개발 도구",
      tagline: "중복 slug 검증",
      description: "기존 seed와 같은 이름을 등록해 slug suffix를 확인합니다.",
      kickPoint: "기존 seed slug와 충돌하지 않습니다.",
      tags: [],
      targetUsers: [],
      useCases: [],
      cardNewsCopy: [],
      targetMessages: []
    });
    const detail = await service.getProductDetail("demoflow");
    const board = await service.getWeeklyBoard({ q: "DemoFlow" });

    expect(created.detailUrl).toBe("/products/demoflow");
    expect(created.product.websiteUrl).toBe("#");
    expect(created.product.makers[0]?.profileUrl).toBe("https://example.com/demo-team");
    expect(fake.db.products.get("product_demoflow")?.slug).toBe("demoflow");
    expect(fake.db.launches.get("launch_demoflow")).toMatchObject({
      rank: 11,
      product_id: "product_demoflow",
      board_id: boardBase.id,
      base_vote_count: 0,
      comment_count: 0,
      featured_reason: ""
    });
    expect(fake.db.transactions).toBe(2);
    expect(duplicated.product.slug).toBe("cursor-2");
    expect(detail.product.name).toBe("DemoFlow");
    expect(board.board.launches.map((launch) => launch.product.slug)).toEqual(["demoflow"]);
  });

  it("제품이 없는 launch row는 제품 상세 조립 중 not found로 실패한다", async () => {
    const fake = createFakeSql({ seeded: true });
    fake.db.products.delete("product_cursor");
    neonMock.mockReturnValue(fake.sql);
    const service = createPostgresKickService("postgres://broken");

    await expect(service.getProductDetail("cursor")).rejects.toBeInstanceOf(KickServiceError);
    await expect(service.getProductDetail("cursor")).rejects.toMatchObject({
      code: "NOT_FOUND",
      fields: ["productId"]
    });
  });
});

function createFakeSql({ seeded }: { seeded: boolean }) {
  const db = createFakeDb();
  if (seeded) {
    seedFakeDb(db);
  }

  const sql = (async (strings: TemplateStringsArray, ...values: unknown[]) => {
    const text = normalizeSql(strings.join("?"));
    db.queries.push({ text, values });

    if (text.startsWith("create table") || text.startsWith("alter table")) {
      return [];
    }
    if (text.startsWith("delete from votes where launch_id")) {
      const [launchId, viewerId] = values as [string, string];
      db.votes.delete(voteKey(launchId, viewerId));
      return [];
    }
    if (text.startsWith("delete from")) {
      deleteFromTable(db, text);
      return [];
    }
    if (text.startsWith("insert into boards")) {
      db.boards.set(values[0] as string, {
        id: values[0] as string,
        period: values[1] as string,
        title: values[2] as string,
        starts_on: values[3] as string,
        ends_on: values[4] as string
      });
      return [];
    }
    if (text.startsWith("insert into products")) {
      db.products.set(values[0] as string, {
        id: values[0] as string,
        slug: values[1] as string,
        data: values[2] as string,
        created_at: values[3] as string
      });
      return [];
    }
    if (text.startsWith("insert into launches")) {
      db.launches.set(values[0] as string, {
        id: values[0] as string,
        rank: values[1] as number,
        product_id: values[2] as string,
        board_id: values[3] as string,
        base_vote_count: values[4] as number,
        comment_count: values[5] as number,
        featured_reason: values[6] as string,
        launched_at: values[7] as string
      });
      return [];
    }
    if (text.startsWith("insert into contests")) {
      db.contests.set(values[0] as string, {
        id: values[0] as string,
        slug: values[1] as string,
        title: values[2] as string,
        host: values[3] as string,
        description: values[4] as string,
        status: values[5] as string,
        starts_on: values[6] as string,
        ends_on: values[7] as string,
        product_count: values[8] as number,
        display_order: values[9] as number,
        featured_launch_ids: values[10] as string
      });
      return [];
    }
    if (text.startsWith("insert into votes")) {
      const [launchId, viewerId, createdAt] = values as [string, string, string];
      db.votes.set(voteKey(launchId, viewerId), {
        launch_id: launchId,
        viewer_id: viewerId,
        created_at: createdAt
      });
      return [];
    }
    if (text.startsWith("insert into newsletter_subscriptions")) {
      const [id, email, source, createdAt] = values as [string, string, string, string];
      db.newsletterSubscriptions.push({
        id,
        email,
        source,
        created_at: createdAt
      });
      return [];
    }
    if (text.startsWith("insert into maker_submissions")) {
      const [id, payload, viewerId, status, createdAt] = values as [string, string, string, MakerSubmission["status"], string];
      db.submissions.set(id, {
        id,
        payload,
        viewer_id: viewerId,
        status,
        created_at: createdAt
      });
      return [];
    }
    if (text.startsWith("select id, data from products")) {
      return Array.from(db.products.values()).map(({ id, data }) => ({ id, data }));
    }
    if (text.startsWith("select id, period, title, starts_on, ends_on from boards")) {
      return Array.from(db.boards.values()).slice(0, 1);
    }
    if (text.startsWith("select id, rank, product_id")) {
      return Array.from(db.launches.values()).sort((left, right) => left.rank - right.rank);
    }
    if (text.startsWith("select id, slug, title")) {
      return Array.from(db.contests.values()).sort((left, right) => left.display_order - right.display_order || left.id.localeCompare(right.id));
    }
    if (text.startsWith("select launch_id, viewer_id from votes")) {
      return Array.from(db.votes.values()).map(({ launch_id, viewer_id }) => ({ launch_id, viewer_id }));
    }
    if (text.startsWith("select launch_id, count(*)::int as vote_count from votes")) {
      return voteCountRows(db);
    }
    if (text.startsWith("select base_vote_count +")) {
      const launchId = values[0] as string;
      return [{ vote_count: voteCountForLaunch(db, launchId) }];
    }
    if (text.startsWith("select base_vote_count from launches where id")) {
      const launch = db.launches.get(values[0] as string);
      return launch ? [{ base_vote_count: launch.base_vote_count }] : [];
    }
    if (text.startsWith("select 1 from votes where launch_id")) {
      const [launchId, viewerId] = values as [string, string];
      return db.votes.has(voteKey(launchId, viewerId)) ? [{ "?column?": 1 }] : [];
    }
    if (text.startsWith("select id, payload, viewer_id, status, created_at from maker_submissions")) {
      const row = db.submissions.get(values[0] as string);
      return row ? [row] : [];
    }

    throw new Error(`지원하지 않는 fake SQL query: ${text}`);
  }) as unknown as NeonQueryFunction<false, false>;
  (sql as unknown as { transaction: (queriesOrFn: unknown) => Promise<unknown[]> }).transaction = async (queriesOrFn) => {
    db.transactions += 1;
    const queries = typeof queriesOrFn === "function" ? (queriesOrFn as (tx: unknown) => unknown[])(sql) : queriesOrFn;
    return Promise.all(queries as Array<Promise<unknown>>);
  };

  return {
    db,
    sql,
    queryTexts: () => db.queries.map((query) => query.text)
  };
}

function createFakeDb(): FakeDb {
  return {
    products: new Map(),
    boards: new Map(),
    launches: new Map(),
    contests: new Map(),
    votes: new Map(),
    newsletterSubscriptions: [],
    submissions: new Map(),
    queries: [],
    transactions: 0
  };
}

function seedFakeDb(db: FakeDb): void {
  db.boards.set(boardBase.id, {
    id: boardBase.id,
    period: boardBase.period,
    title: boardBase.title,
    starts_on: boardBase.startsOn,
    ends_on: boardBase.endsOn
  });
  for (const product of new Map(seedLaunches.map((launch) => [launch.product.id, launch.product])).values()) {
    db.products.set(product.id, {
      id: product.id,
      slug: product.slug,
      data: JSON.stringify(product),
      created_at: product.createdAt
    });
  }
  for (const launch of seedLaunches) {
    db.launches.set(launch.id, {
      id: launch.id,
      rank: launch.rank,
      product_id: launch.product.id,
      board_id: boardBase.id,
      base_vote_count: launch.voteCount,
      comment_count: launch.commentCount,
      featured_reason: launch.featuredReason,
      launched_at: launch.launchedAt
    });
  }
  for (const [index, contest] of contestFixtures.entries()) {
    db.contests.set(contest.id, {
      id: contest.id,
      slug: contest.slug,
      title: contest.title,
      host: contest.host,
      description: contest.description,
      status: contest.status,
      starts_on: contest.startsOn,
      ends_on: contest.endsOn,
      product_count: contest.productCount,
      display_order: index,
      featured_launch_ids: JSON.stringify(contest.featuredLaunchIds)
    });
  }
}

function deleteFromTable(db: FakeDb, text: string): void {
  if (text === "delete from votes") {
    db.votes.clear();
  } else if (text === "delete from newsletter_subscriptions") {
    db.newsletterSubscriptions = [];
  } else if (text === "delete from maker_submissions") {
    db.submissions.clear();
  } else if (text === "delete from contests") {
    db.contests.clear();
  } else if (text === "delete from launches") {
    db.launches.clear();
  } else if (text === "delete from boards") {
    db.boards.clear();
  } else if (text === "delete from products") {
    db.products.clear();
  }
}

function voteCountRows(db: FakeDb): Array<{ launch_id: string; vote_count: number }> {
  const counts = new Map<string, number>();
  for (const vote of db.votes.values()) {
    counts.set(vote.launch_id, (counts.get(vote.launch_id) ?? 0) + 1);
  }
  return Array.from(counts.entries()).map(([launch_id, vote_count]) => ({
    launch_id,
    vote_count
  }));
}

function voteCountForLaunch(db: FakeDb, launchId: string): number {
  const launch = db.launches.get(launchId);
  if (!launch) {
    return 0;
  }
  return launch.base_vote_count + (voteCountRows(db).find((row) => row.launch_id === launchId)?.vote_count ?? 0);
}

function normalizeSql(text: string): string {
  return text.replace(/\s+/g, " ").trim().toLowerCase();
}

function voteKey(launchId: string, viewerId: string): string {
  return `${launchId}:${viewerId}`;
}
