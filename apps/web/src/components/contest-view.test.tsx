import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ContestView } from "./contest-view";
import { createKickService } from "@/server/kick-service";

describe("ContestView", () => {
  it("공개 contest 목록을 읽기 전용 사용자 화면으로 보여준다", () => {
    render(<ContestView initialResponse={createKickService().getContests()} />);

    expect(screen.getByRole("heading", { name: "공개 콘테스트" })).toBeTruthy();
    expect(screen.getByText("AI Workflow Challenge")).toBeTruthy();
    expect(screen.getByText("2026 여름 바이브 코딩 챌린지")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Weekly board" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "제작자 런칭 보조" })).toBeTruthy();
    expect(screen.queryByRole("button")).toBeNull();

    const blockedWords = ["관리" + "자", "운영" + "자", "표시" + "용", "콘테스트 " + "개최하기"];
    for (const word of blockedWords) {
      expect(document.body.textContent).not.toContain(word);
    }
  });
});
