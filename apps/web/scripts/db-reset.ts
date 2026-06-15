import { neon } from "@neondatabase/serverless";

import { resetKickDatabase } from "../src/server/postgres-kick-service";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL 환경 변수가 필요합니다.");
  process.exit(1);
}

const result = await resetKickDatabase(neon(databaseUrl));
console.log(JSON.stringify(result, null, 2));
