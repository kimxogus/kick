import { describe, expect, it } from "vitest";

import { createRuntimeKickService } from "./service-singleton";

describe("runtime kick service selection", () => {
  it("DATABASE_URL이 없으면 memory fallback을 사용한다", async () => {
    const service = createRuntimeKickService({});

    expect(await service.resetToSeed()).toMatchObject({
      status: "reset",
      storage: "memory"
    });
  });
});
