import { neon } from "@neondatabase/serverless";

import { resetKickDatabase } from "../src/server/postgres-kick-service";

async function main(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error("DATABASE_URL 환경 변수가 필요합니다.");
    process.exit(1);
  }

  const result = await resetKickDatabase(neon(databaseUrl));
  console.log(JSON.stringify(result, null, 2));
}

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
