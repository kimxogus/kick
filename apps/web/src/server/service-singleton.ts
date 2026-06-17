import { createKickService } from "./kick-service";
import type { KickService } from "./kick-service";
import { createPostgresKickService } from "./postgres-kick-service";
import { createRegisteredStoreKickService } from "./registered-store";

export function createRuntimeKickService(env: Record<string, string | undefined> = process.env): KickService {
  return env.DATABASE_URL
    ? createPostgresKickService(env.DATABASE_URL)
    : createRegisteredStoreKickService(createKickService());
}

export const kickService = createRuntimeKickService();
