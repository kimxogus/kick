import { beforeEach, describe, expect, it, vi } from "vitest";
import type { KickService } from "./kick-service";
import { clearRegisteredStore } from "./registered-store";

const postgresMocks = vi.hoisted(() => ({
  createPostgresKickService: vi.fn()
}));

vi.mock("./postgres-kick-service", () => ({
  createPostgresKickService: postgresMocks.createPostgresKickService
}));

import { createRuntimeKickService } from "./service-singleton";

describe("runtime kick service selection", () => {
  beforeEach(() => {
    postgresMocks.createPostgresKickService.mockReset();
    clearRegisteredStore();
  });

  it("DATABASE_URL이 없으면 memory fallback을 사용한다", async () => {
    const service = createRuntimeKickService({});

    expect(await service.resetToSeed()).toMatchObject({
      status: "reset",
      storage: "memory"
    });
  });

  it("DATABASE_URL이 없는 runtime service는 파일 store 등록 fallback으로 상세를 조회한다", async () => {
    const service = createRuntimeKickService({});

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
      cardNewsCopy: ["시연 흐름을 한눈에"],
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
    const detail = await service.getProductDetail(created.product.slug);

    expect(created.detailUrl).toBe("/products/demoflow");
    expect(created.product.websiteUrl).toBe("#");
    expect(created.product.makers[0]?.profileUrl).toBe("https://example.com/demo-team");
    expect(duplicated.product.slug).toBe("cursor-2");
    expect(detail.product.name).toBe("DemoFlow");
    expect(detail.launch.voteCount).toBe(0);
  });

  it("DATABASE_URL이 없는 runtime service는 파일 store 등록 제품 vote를 토글한다", async () => {
    const service = createRuntimeKickService({});

    const created = await service.registerProduct({
      name: "DemoFlow",
      category: "생산성",
      tagline: "시연 준비를 한 흐름으로 정리하는 도구",
      description: "DemoFlow는 제품 시연을 준비하는 팀이 핵심 메시지와 체크리스트를 정리하도록 돕습니다.",
      kickPoint: "흩어진 시연 준비를 한 페이지로 모아 바로 공유합니다.",
      tags: [],
      targetUsers: [],
      useCases: [],
      cardNewsCopy: [],
      targetMessages: []
    });

    const voted = await service.toggleVote({
      launchId: created.launch.id,
      viewerId: "viewer_registered"
    });
    const votedDetail = await service.getProductDetail(created.product.slug, "viewer_registered");
    const unvoted = await service.toggleVote({
      launchId: created.launch.id,
      viewerId: "viewer_registered"
    });
    const unvotedDetail = await service.getProductDetail(created.product.slug, "viewer_registered");

    expect(voted).toMatchObject({
      launchId: "launch_demoflow",
      voteCount: 1,
      isVotedByViewer: true
    });
    expect(votedDetail.launch).toMatchObject({
      voteCount: 1,
      isVotedByViewer: true
    });
    expect(unvoted).toMatchObject({
      voteCount: 0,
      isVotedByViewer: false
    });
    expect(unvotedDetail.launch).toMatchObject({
      voteCount: 0,
      isVotedByViewer: false
    });
  });

  it("DATABASE_URL이 있으면 Postgres service를 선택한다", async () => {
    const postgresService = {
      resetToSeed: vi.fn(async () => ({
        status: "reset",
        storage: "postgres",
        products: 10,
        launches: 10,
        contests: 5
      }))
    } as unknown as KickService;
    postgresMocks.createPostgresKickService.mockReturnValue(postgresService);

    const service = createRuntimeKickService({
      DATABASE_URL: "postgres://kick-test"
    });

    expect(service).toBe(postgresService);
    expect(postgresMocks.createPostgresKickService).toHaveBeenCalledWith("postgres://kick-test");
    expect(await service.resetToSeed()).toMatchObject({
      storage: "postgres"
    });
  });
});
