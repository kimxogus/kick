import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { SubmissionView } from "./submission-view";

describe("SubmissionView", () => {
  beforeEach(() => {
    window.localStorage.clear();
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
});
