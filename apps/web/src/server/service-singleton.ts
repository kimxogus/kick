import { createKickService } from "./kick-service";
import type { KickService } from "./kick-service";
import { createPostgresKickService } from "./postgres-kick-service";

export function createRuntimeKickService(env: Record<string, string | undefined> = process.env): KickService {
  return env.DATABASE_URL ? createPostgresKickService(env.DATABASE_URL) : createKickService();
}

export const kickService = createRuntimeKickService();
