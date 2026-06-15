import { beforeEach, describe, expect, it, vi } from "vitest";
import type { KickService } from "./kick-service";

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
  });

  it("DATABASE_URL이 없으면 memory fallback을 사용한다", async () => {
    const service = createRuntimeKickService({});

    expect(await service.resetToSeed()).toMatchObject({
      status: "reset",
      storage: "memory"
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
