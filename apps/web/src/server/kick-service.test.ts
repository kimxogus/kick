import { beforeEach, describe, expect, it } from "vitest";

import {
  createKickService,
  type KickService
} from "./kick-service";

describe("kick MVP backend service", () => {
  let service: KickService;

  beforeEach(() => {
    service = createKickService();
  });

  it("Weekly board를 rank 순서와 필터 metadata로 반환한다", () => {
    const response = service.getWeeklyBoard({});

    expect(response.board.period).toBe("weekly");
    expect(response.board.launches.length).toBeGreaterThanOrEqual(10);
    expect(response.board.launches.map((launch) => launch.rank)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(response.filters.availableTags).toContain("AI");
    expect(response.filters.availableTags).toContain("다이어리");
    expect(response.board.launches.map((launch) => launch.product.slug)).toContain("momento");
    expect(response.board.launches.map((launch) => launch.product.slug)).toContain("pixelmong");
    expect(response.board.launches.find((launch) => launch.product.slug === "momento")?.product.emoji).toBe("📓");
  });

  it("검색어와 태그로 Weekly board launch를 필터링한다", () => {
    const response = service.getWeeklyBoard({
      q: "developer",
      tag: "Productivity"
    });

    expect(response.board.launches.length).toBe(1);
    expect(response.board.launches[0]?.product.slug).toBe("cursor");
    expect(response.filters.q).toBe("developer");
    expect(response.filters.tag).toBe("Productivity");
  });

  it("샘플 HTML에서 되살린 제품을 category와 태그로 검색한다", () => {
    const categoryResponse = service.getWeeklyBoard({ q: "여행" });
    const tagResponse = service.getWeeklyBoard({ tag: "반려동물" });

    expect(categoryResponse.board.launches.map((launch) => launch.product.slug)).toContain("menuddak");
    expect(tagResponse.board.launches.map((launch) => launch.product.slug)).toEqual(["pixelmong"]);
  });

  it("제품 slug로 상세와 관련 launch를 반환한다", () => {
    const detail = service.getProductDetail("cursor", "viewer_test");

    expect(detail.product.name).toBe("Cursor");
    expect(detail.launch.product.slug).toBe("cursor");
    expect(detail.product.kickPoint).toContain("코드");
    expect(detail.product.cardNewsCopy.length).toBeGreaterThanOrEqual(3);
    expect(detail.product.targetMessages[0]?.audience).toBeTruthy();
    expect(detail.relatedLaunches.length).toBeGreaterThan(0);
    expect(detail.relatedLaunches.every((launch) => launch.product.slug !== "cursor")).toBe(true);
  });

  it("공개 contest 목록을 읽기 전용 모델로 반환한다", () => {
    const response = service.getContests();

    expect(response.contests.length).toBeGreaterThanOrEqual(5);
    expect(response.contests[0]?.title).toContain("AI");
    expect(response.contests.map((contest) => contest.slug)).toContain("summer-vibe-coding-challenge-2026");
    expect(response.contests[0]?.featuredLaunches.length).toBeGreaterThan(0);
    expect(response.contests[0]?.featuredLaunches[0]?.product.slug).toBeTruthy();
  });

  it("같은 viewer와 launch 조합에서 vote를 toggle한다", () => {
    const launchId = service.getWeeklyBoard({}).board.launches[0]!.id;

    const voted = service.toggleVote({ launchId, viewerId: "viewer_1" });
    const unvoted = service.toggleVote({ launchId, viewerId: "viewer_1" });

    expect(voted.isVotedByViewer).toBe(true);
    expect(voted.voteCount).toBeGreaterThan(unvoted.voteCount);
    expect(unvoted.isVotedByViewer).toBe(false);
  });

  it("잘못된 newsletter 이메일을 validation error로 거부한다", () => {
    expect(() =>
      service.createNewsletterSubscription({
        email: "not-an-email",
        source: "board"
      })
    ).toThrow(/이메일/);
  });

  it("제작자 런칭 보조 결과와 추가 질문을 생성한다", () => {
    const response = service.createLaunchAssist({
      productName: "DemoFlow",
      descriptionDraft: "시연 흐름을 정리하는 도구",
      targetUsers: [],
      problem: "",
      features: ["데모 스크립트 생성", "발표 체크리스트"]
    });

    expect(response.result.tagline).toContain("DemoFlow");
    expect(response.result.appealPoints).toHaveLength(3);
    expect(response.result.followUpQuestions).toContain("대상 사용자를 더 구체적으로 알려주세요.");
    expect(response.result.followUpQuestions).toContain("제품이 해결하려는 문제를 한 문장으로 알려주세요.");
  });

  it("제작자 제출 후보를 저장하고 ID로 다시 조회한다", () => {
    const created = service.createMakerSubmission({
      viewerId: "viewer_maker",
      payload: {
        productName: "DemoFlow",
        tagline: "DemoFlow로 발표 준비를 정리하세요.",
        description: "사내 시연 준비를 돕는 제품입니다.",
        websiteUrl: "https://example.com",
        tags: ["Demo", "Productivity"],
        makerNote: "MVP 후보"
      }
    });

    const detail = service.getMakerSubmission(created.submission.id);

    expect(created.status).toBe("received");
    expect(created.previewUrl).toBe(`/submissions/${created.submission.id}`);
    expect(detail.submission.payload.productName).toBe("DemoFlow");
  });
});
