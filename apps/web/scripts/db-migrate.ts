import { neon } from "@neondatabase/serverless";

import { migrateKickDatabase } from "../src/server/postgres-kick-service";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL 환경 변수가 필요합니다.");
  process.exit(1);
}

await migrateKickDatabase(neon(databaseUrl));
console.log("kick database migration complete");
