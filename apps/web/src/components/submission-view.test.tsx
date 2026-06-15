import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SubmissionView } from "./submission-view";

describe("SubmissionView", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("localStorage에 저장된 제출 후보 preview를 보여준다", async () => {
    window.localStorage.setItem(
      "kick_submission_submission_test",
      JSON.stringify({
        id: "submission_test",
        status: "received",
        createdAt: "2026-06-14T00:00:00.000Z",
        viewerId: "viewer_test",
        payload: {
          productName: "DemoFlow",
          tagline: "DemoFlow로 발표 준비를 정리하세요.",
          description: "사내 시연 준비를 돕는 제품입니다.",
          tags: ["Demo"],
          makerNote: "MVP 후보"
        }
      })
    );

    render(<SubmissionView id="submission_test" />);

    expect(await screen.findByRole("heading", { name: "DemoFlow" })).toBeTruthy();
    expect(screen.getByText("DemoFlow로 발표 준비를 정리하세요.")).toBeTruthy();
    expect(screen.getByText("MVP에서는 제출 후보를 Weekly board에 자동 반영하지 않습니다.")).toBeTruthy();
  });

  it("API와 local preview 모두 없으면 not found 화면을 보여준다", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json(
          {
            error: {
              code: "NOT_FOUND",
              message: "제출 후보를 찾을 수 없습니다.",
              fields: ["id"]
            }
          },
          { status: 404 }
        )
      )
    );

    render(<SubmissionView id="submission_missing" />);

    expect(await screen.findByRole("heading", { name: "제출 후보를 찾을 수 없습니다." })).toBeTruthy();
  });

  it("local preview가 있으면 API 실패에도 preview를 유지한다", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Promise.reject(new Error("network down")))
    );
    window.localStorage.setItem(
      "kick_submission_submission_cached",
      JSON.stringify({
        id: "submission_cached",
        status: "received",
        createdAt: "2026-06-14T00:00:00.000Z",
        viewerId: "viewer_test",
        payload: {
          productName: "CachedFlow",
          tagline: "CachedFlow로 발표 준비를 정리하세요.",
          description: "local preview가 우선 보여야 합니다.",
          tags: ["Demo"],
          makerNote: "캐시된 후보"
        }
      })
    );

    render(<SubmissionView id="submission_cached" />);

    expect(await screen.findByRole("heading", { name: "CachedFlow" })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "제출 후보를 찾을 수 없습니다." })).toBeNull();
  });
});
