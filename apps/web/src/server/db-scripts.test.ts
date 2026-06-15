import { spawnSync } from "node:child_process";
import path from "node:path";
import { describe, expect, it } from "vitest";

const appRoot = path.resolve(__dirname, "../..");

describe("database CLI scripts", () => {
  it.each(["db:migrate", "db:reset"])("%s는 DATABASE_URL 누락 시 transform 오류 대신 env 오류를 반환한다", (script) => {
    const env = { ...process.env };
    delete env.DATABASE_URL;

    const result = spawnSync("npm", ["run", script], {
      cwd: appRoot,
      env,
      encoding: "utf8"
    });
    const output = `${result.stdout}\n${result.stderr}`;

    expect(result.status).toBe(1);
    expect(output).toContain("DATABASE_URL 환경 변수가 필요합니다.");
    expect(output).not.toContain("Top-level await");
    expect(output).not.toContain("Transform failed");
  });
});
