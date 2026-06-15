import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

import {
  boardBase,
  contestFixtures,
  createKickService,
  createResetResponse,
  type AdminResetResponse,
  type ContestListResponse,
  type KickService,
  KickServiceError,
  type KickState,
  type KickSubmissionPayload,
  type LaunchAssistResponse,
  type MakerSubmission,
  type MakerSubmissionDetailResponse,
  type MakerSubmissionDraft,
  type MakerSubmissionRequest,
  type MakerSubmissionResponse,
  type NewsletterRequest,
  type NewsletterResponse,
  type NewsletterSubscription,
  type Product,
  type ProductDetailResponse,
  seedLaunches,
  type StoredContest,
  type StoredLaunch,
  type VoteRequest,
  type VoteResponse,
  type WeeklyBoardRequest,
  type WeeklyBoardResponse,
  getAvailableTags,
  matchesSearch,
  withViewerVote
} from "./kick-service";

type Sql = NeonQueryFunction<false, false>;
type UnknownRecord = Record<string, unknown>;

type ProductRow = {
  id: string;
  data: Product | string;
};

type BoardRow = {
  id: string;
  period: KickState["board"]["period"];
  title: string;
  starts_on: string;
  ends_on: string;
};

type LaunchRow = {
  id: string;
  rank: number;
  product_id: string;
  base_vote_count: number;
  comment_count: number;
  featured_reason: string;
  launched_at: string;
};

type ContestRow = Omit<StoredContest, "featuredLaunchIds" | "startsOn" | "endsOn" | "productCount"> & {
  starts_on: string;
  ends_on: string;
  product_count: number;
  featured_launch_ids: string[] | string;
};

type VoteRow = {
  launch_id: string;
  viewer_id: string;
};

type VoteCountRow = {
  launch_id: string;
  vote_count: number | string;
};

type SubmissionRow = {
  id: string;
  payload: KickSubmissionPayload | string;
  viewer_id: string;
  status: MakerSubmission["status"];
  created_at: string;
};

export function createPostgresKickService(databaseUrl: string): KickService {
  const sql = neon(databaseUrl);
  const launchAssistService = createKickService();
  let migration: Promise<void> | null = null;

  async function ensureSchema(): Promise<void> {
    migration ??= migrateKickDatabase(sql);
    await migration;
  }

  return {
    async getWeeklyBoard(request: WeeklyBoardRequest): Promise<WeeklyBoardResponse> {
      await ensureSchema();
      const state = await loadState(sql);
      const q = request.q?.trim().toLowerCase() ?? "";
      const tag = request.tag?.trim() || null;
      const launches = state.launches
        .filter((launch) => matchesSearch(launch.product, q))
        .filter((launch) => (tag ? launch.product.tags.includes(tag) : true))
        .sort((left, right) => left.rank - right.rank)
        .map((launch) => withViewerVote(launch, state, request.viewerId));

      return {
        board: {
          ...state.board,
          launches
        },
        filters: {
          q,
          tag,
          availableTags: getAvailableTags(state.launches)
        }
      };
    },

    async getProductDetail(slug: string, viewerId?: string): Promise<ProductDetailResponse> {
      await ensureSchema();
      const state = await loadState(sql);
      const launch = state.launches.find((candidate) => candidate.product.slug === slug);
      if (!launch) {
        throw new KickServiceError("NOT_FOUND", "제품을 찾을 수 없습니다.", ["slug"]);
      }

      return {
        product: launch.product,
        launch: withViewerVote(launch, state, viewerId),
        relatedLaunches: state.launches
          .filter((candidate) => candidate.product.slug !== slug)
          .slice(0, 3)
          .map((candidate) => withViewerVote(candidate, state, viewerId))
      };
    },

    async getContests(): Promise<ContestListResponse> {
      await ensureSchema();
      const state = await loadState(sql);
      return {
        contests: state.contests.map((contest) => ({
          id: contest.id,
          slug: contest.slug,
          title: contest.title,
          host: contest.host,
          description: contest.description,
          status: contest.status,
          startsOn: contest.startsOn,
          endsOn: contest.endsOn,
          productCount: contest.productCount,
          featuredLaunches: contest.featuredLaunchIds
            .map((launchId) => state.launches.find((launch) => launch.id === launchId))
            .filter((launch): launch is StoredLaunch => Boolean(launch))
            .map((launch) => withViewerVote(launch, state))
        }))
      };
    },

    async toggleVote(request: VoteRequest): Promise<VoteResponse> {
      await ensureSchema();
      const body = requireBodyRecord(request);
      const invalidFields: string[] = [];
      const launchId = collectRequiredText(body, "launchId", invalidFields);
      const viewerId = collectRequiredText(body, "viewerId", invalidFields);
      throwIfInvalidFields(invalidFields, "vote 요청을 확인해주세요.");

      const launchRows = await sql`SELECT base_vote_count FROM launches WHERE id = ${launchId} LIMIT 1`;
      if (launchRows.length === 0) {
        throw new KickServiceError("NOT_FOUND", "launch를 찾을 수 없습니다.", ["launchId"]);
      }

      const existing = await sql`
        SELECT 1 FROM votes WHERE launch_id = ${launchId} AND viewer_id = ${viewerId} LIMIT 1
      `;
      const wasVoted = existing.length > 0;
      if (wasVoted) {
        await sql`DELETE FROM votes WHERE launch_id = ${launchId} AND viewer_id = ${viewerId}`;
      } else {
        await sql`
          INSERT INTO votes (launch_id, viewer_id, created_at)
          VALUES (${launchId}, ${viewerId}, ${new Date().toISOString()})
          ON CONFLICT (launch_id, viewer_id) DO NOTHING
        `;
      }

      const voteRows = await sql`
        SELECT base_vote_count + (
          SELECT COUNT(*)::int FROM votes WHERE launch_id = ${launchId}
        ) AS vote_count
        FROM launches
        WHERE id = ${launchId}
      `;
      return {
        launchId,
        voteCount: Number(voteRows[0]?.vote_count ?? 0),
        isVotedByViewer: !wasVoted
      };
    },

    async createNewsletterSubscription(request: NewsletterRequest): Promise<NewsletterResponse> {
      await ensureSchema();
      const body = requireBodyRecord(request);
      const source = body.source;
      if (!isValidNewsletterSource(source)) {
        throw new KickServiceError("VALIDATION_ERROR", "newsletter 요청을 확인해주세요.", ["source"]);
      }
      const email = body.email;
      if (!isValidEmail(email)) {
        throw new KickServiceError("VALIDATION_ERROR", "이메일 형식을 확인해주세요.", ["email"]);
      }

      const subscription: NewsletterSubscription = {
        id: createId("newsletter"),
        email: email.trim(),
        source,
        createdAt: new Date().toISOString()
      };
      await sql`
        INSERT INTO newsletter_subscriptions (id, email, source, created_at)
        VALUES (${subscription.id}, ${subscription.email}, ${subscription.source}, ${subscription.createdAt})
      `;
      return { subscription };
    },

    async createLaunchAssist(request: MakerSubmissionDraft): Promise<LaunchAssistResponse> {
      return launchAssistService.createLaunchAssist(request);
    },

    async createMakerSubmission(request: MakerSubmissionRequest): Promise<MakerSubmissionResponse> {
      await ensureSchema();
      const body = requireBodyRecord(request);
      const invalidFields: string[] = [];
      const viewerId = collectRequiredText(body, "viewerId", invalidFields);
      const payload = collectSubmissionPayload(body.payload, invalidFields);
      throwIfInvalidFields(invalidFields, "제출 내용을 확인해주세요.");

      const submission: MakerSubmission = {
        id: createId("submission"),
        payload,
        viewerId,
        status: "received",
        createdAt: new Date().toISOString()
      };
      await sql`
        INSERT INTO maker_submissions (id, payload, viewer_id, status, created_at)
        VALUES (
          ${submission.id},
          ${JSON.stringify(submission.payload)}::jsonb,
          ${submission.viewerId},
          ${submission.status},
          ${submission.createdAt}
        )
      `;
      return {
        submission,
        status: "received",
        previewUrl: `/submissions/${submission.id}`
      };
    },

    async getMakerSubmission(id: string): Promise<MakerSubmissionDetailResponse> {
      await ensureSchema();
      const rows = (await sql`
        SELECT id, payload, viewer_id, status, created_at
        FROM maker_submissions
        WHERE id = ${id}
        LIMIT 1
      `) as SubmissionRow[];
      const row = rows[0];
      if (!row) {
        throw new KickServiceError("NOT_FOUND", "제출 후보를 찾을 수 없습니다.", ["id"]);
      }
      return {
        submission: {
          id: row.id,
          payload: parseJson<KickSubmissionPayload>(row.payload),
          viewerId: row.viewer_id,
          status: row.status,
          createdAt: row.created_at
        }
      };
    },

    async resetToSeed(): Promise<AdminResetResponse> {
      await ensureSchema();
      return resetKickDatabase(sql);
    }
  };
}

export async function migrateKickDatabase(sql: Sql): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id text PRIMARY KEY,
      slug text NOT NULL UNIQUE,
      data jsonb NOT NULL,
      created_at text NOT NULL
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS boards (
      id text PRIMARY KEY,
      period text NOT NULL,
      title text NOT NULL,
      starts_on text NOT NULL,
      ends_on text NOT NULL
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS launches (
      id text PRIMARY KEY,
      rank integer NOT NULL,
      product_id text NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      board_id text NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
      base_vote_count integer NOT NULL DEFAULT 0,
      comment_count integer NOT NULL DEFAULT 0,
      featured_reason text NOT NULL,
      launched_at text NOT NULL
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS contests (
      id text PRIMARY KEY,
      slug text NOT NULL UNIQUE,
      title text NOT NULL,
      host text NOT NULL,
      description text NOT NULL,
      status text NOT NULL,
      starts_on text NOT NULL,
      ends_on text NOT NULL,
      product_count integer NOT NULL,
      display_order integer NOT NULL DEFAULT 0,
      featured_launch_ids jsonb NOT NULL
    )
  `;
  await sql`ALTER TABLE contests ADD COLUMN IF NOT EXISTS display_order integer NOT NULL DEFAULT 0`;
  await sql`
    CREATE TABLE IF NOT EXISTS votes (
      launch_id text NOT NULL REFERENCES launches(id) ON DELETE CASCADE,
      viewer_id text NOT NULL,
      created_at text NOT NULL,
      PRIMARY KEY (launch_id, viewer_id)
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
      id text PRIMARY KEY,
      email text NOT NULL,
      source text NOT NULL,
      created_at text NOT NULL
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS maker_submissions (
      id text PRIMARY KEY,
      payload jsonb NOT NULL,
      viewer_id text NOT NULL,
      status text NOT NULL,
      created_at text NOT NULL
    )
  `;
}

export async function resetKickDatabase(sql: Sql): Promise<AdminResetResponse> {
  await migrateKickDatabase(sql);
  await sql`DELETE FROM votes`;
  await sql`DELETE FROM newsletter_subscriptions`;
  await sql`DELETE FROM maker_submissions`;
  await sql`DELETE FROM contests`;
  await sql`DELETE FROM launches`;
  await sql`DELETE FROM boards`;
  await sql`DELETE FROM products`;

  await sql`
    INSERT INTO boards (id, period, title, starts_on, ends_on)
    VALUES (${boardBase.id}, ${boardBase.period}, ${boardBase.title}, ${boardBase.startsOn}, ${boardBase.endsOn})
  `;

  const products = uniqueSeedProducts();
  for (const product of products) {
    await sql`
      INSERT INTO products (id, slug, data, created_at)
      VALUES (${product.id}, ${product.slug}, ${JSON.stringify(product)}::jsonb, ${product.createdAt})
    `;
  }

  for (const launch of seedLaunches) {
    await sql`
      INSERT INTO launches (
        id,
        rank,
        product_id,
        board_id,
        base_vote_count,
        comment_count,
        featured_reason,
        launched_at
      )
      VALUES (
        ${launch.id},
        ${launch.rank},
        ${launch.product.id},
        ${boardBase.id},
        ${launch.voteCount},
        ${launch.commentCount},
        ${launch.featuredReason},
        ${launch.launchedAt}
      )
    `;
  }

  for (const [index, contest] of contestFixtures.entries()) {
    await sql`
      INSERT INTO contests (
        id,
        slug,
        title,
        host,
        description,
        status,
        starts_on,
        ends_on,
        product_count,
        display_order,
        featured_launch_ids
      )
      VALUES (
        ${contest.id},
        ${contest.slug},
        ${contest.title},
        ${contest.host},
        ${contest.description},
        ${contest.status},
        ${contest.startsOn},
        ${contest.endsOn},
        ${contest.productCount},
        ${index},
        ${JSON.stringify(contest.featuredLaunchIds)}::jsonb
      )
    `;
  }

  return createResetResponse("postgres", {
    launches: seedLaunches,
    contests: contestFixtures
  });
}

async function loadState(sql: Sql): Promise<KickState> {
  const productRows = (await sql`SELECT id, data FROM products`) as unknown as ProductRow[];
  const boardRows = (await sql`
    SELECT id, period, title, starts_on, ends_on FROM boards LIMIT 1
  `) as unknown as BoardRow[];
  if (productRows.length === 0 || boardRows.length === 0) {
    await resetKickDatabase(sql);
    return loadState(sql);
  }

  const launchRows = (await sql`
    SELECT id, rank, product_id, base_vote_count, comment_count, featured_reason, launched_at
    FROM launches
    ORDER BY rank ASC
  `) as unknown as LaunchRow[];
  const contestRows = (await sql`
    SELECT id, slug, title, host, description, status, starts_on, ends_on, product_count, featured_launch_ids
    FROM contests
    ORDER BY display_order ASC, id ASC
  `) as unknown as ContestRow[];
  const voteRows = (await sql`SELECT launch_id, viewer_id FROM votes`) as unknown as VoteRow[];
  const voteCountRows = (await sql`
    SELECT launch_id, COUNT(*)::int AS vote_count FROM votes GROUP BY launch_id
  `) as unknown as VoteCountRow[];

  const productsById = new Map(productRows.map((row) => [row.id, parseJson<Product>(row.data)]));
  const voteCounts = new Map(voteCountRows.map((row) => [row.launch_id, Number(row.vote_count)]));
  const votes = new Map<string, Set<string>>();
  for (const row of voteRows) {
    const voters = votes.get(row.launch_id) ?? new Set<string>();
    voters.add(row.viewer_id);
    votes.set(row.launch_id, voters);
  }

  return {
    board: {
      id: boardRows[0]!.id,
      period: boardRows[0]!.period,
      title: boardRows[0]!.title,
      startsOn: boardRows[0]!.starts_on,
      endsOn: boardRows[0]!.ends_on
    },
    launches: launchRows.map((row) => {
      const product = productsById.get(row.product_id);
      if (!product) {
        throw new KickServiceError("NOT_FOUND", "제품을 찾을 수 없습니다.", ["productId"]);
      }
      return {
        id: row.id,
        rank: row.rank,
        product,
        voteCount: Number(row.base_vote_count) + (voteCounts.get(row.id) ?? 0),
        commentCount: Number(row.comment_count),
        featuredReason: row.featured_reason,
        launchedAt: row.launched_at
      };
    }),
    contests: contestRows.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      host: row.host,
      description: row.description,
      status: row.status,
      startsOn: row.starts_on,
      endsOn: row.ends_on,
      productCount: Number(row.product_count),
      featuredLaunchIds: parseJson<string[]>(row.featured_launch_ids)
    })),
    votes,
    subscriptions: [],
    submissions: []
  };
}

function uniqueSeedProducts(): Product[] {
  return Array.from(new Map(seedLaunches.map((launch) => [launch.product.id, launch.product])).values());
}

function parseJson<T>(value: T | string): T {
  return typeof value === "string" ? (JSON.parse(value) as T) : value;
}

function createId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function requireBodyRecord(value: unknown): UnknownRecord {
  if (!isRecord(value)) {
    throw new KickServiceError("VALIDATION_ERROR", "JSON 요청 본문을 확인해주세요.", ["body"]);
  }
  return value;
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function collectRequiredText(body: UnknownRecord, field: string, invalidFields: string[]): string {
  const value = body[field];
  if (typeof value !== "string" || !value.trim()) {
    pushField(invalidFields, field);
    return "";
  }
  return value.trim();
}

function collectOptionalText(body: UnknownRecord, field: string, invalidFields: string[]): string | undefined {
  const value = body[field];
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  if (typeof value !== "string") {
    pushField(invalidFields, field);
    return undefined;
  }
  return value.trim() || undefined;
}

function collectStringArray(body: UnknownRecord, field: string, invalidFields: string[]): string[] {
  const value = body[field];
  if (value === undefined || value === null) {
    return [];
  }
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    pushField(invalidFields, field);
    return [];
  }
  return value.map((item) => item.trim()).filter(Boolean);
}

function collectSubmissionPayload(value: unknown, invalidFields: string[]): KickSubmissionPayload {
  if (!isRecord(value)) {
    pushField(invalidFields, "payload");
    return {
      productName: "",
      tagline: "",
      description: "",
      tags: [],
      makerNote: ""
    };
  }

  const productName = collectRequiredText(value, "productName", invalidFields);
  const tagline = collectRequiredText(value, "tagline", invalidFields);
  const description = collectRequiredText(value, "description", invalidFields);
  const makerNote = collectRequiredText(value, "makerNote", invalidFields);
  const tags = collectStringArray(value, "tags", invalidFields);
  const websiteUrl = collectOptionalText(value, "websiteUrl", invalidFields);
  if (tags.length === 0) {
    pushField(invalidFields, "tags");
  }

  return {
    productName,
    tagline,
    description,
    websiteUrl,
    tags,
    makerNote
  };
}

function throwIfInvalidFields(fields: string[], message: string): void {
  if (fields.length > 0) {
    throw new KickServiceError("VALIDATION_ERROR", message, fields);
  }
}

function pushField(fields: string[], field: string): void {
  if (!fields.includes(field)) {
    fields.push(field);
  }
}

function isValidEmail(email: unknown): email is string {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidNewsletterSource(source: unknown): source is NewsletterRequest["source"] {
  return source === "board" || source === "product" || source === "maker";
}
