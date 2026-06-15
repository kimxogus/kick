import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HomeView } from "./home-view";
import { createKickService } from "@/server/kick-service";

describe("HomeView", () => {
  it("Weekly board 제품을 보여주고 검색어로 필터링한다", () => {
    const initialResponse = createKickService().getWeeklyBoard({});

    render(<HomeView initialResponse={initialResponse} />);

    expect(screen.getByRole("heading", { name: /agent에게 말 한마디로/ })).toBeTruthy();
    expect(screen.getByText("Skill + MCP가 정리")).toBeTruthy();
    expect(screen.getByRole("link", { name: "공개 콘테스트 보기" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Cursor" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Granola" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "모먼토" })).toBeTruthy();
    expect(screen.getByText("📓")).toBeTruthy();
    expect(screen.getAllByText("생산성").length).toBeGreaterThan(0);
    expect(screen.getByText("Anysphere")).toBeTruthy();
    expect(screen.getByText("36 comments")).toBeTruthy();
    const blockedWords = [
      "se" + "ed",
      "더" + "미",
      "데모 " + "미연결",
      "데모 " + "화면",
      "관리" + "자",
      "운영" + "자",
      "표시" + "용",
      "콘테스트 " + "개최하기"
    ];
    for (const word of blockedWords) {
      expect(document.body.textContent).not.toContain(word);
    }

    fireEvent.change(screen.getByLabelText("제품 검색"), {
      target: { value: "meeting" }
    });

    expect(screen.getByRole("link", { name: "Granola" })).toBeTruthy();
    expect(screen.queryByRole("link", { name: "Cursor" })).toBeNull();
  });

  it("샘플 제품 category 검색과 emoji thumbnail을 보여준다", () => {
    const initialResponse = createKickService().getWeeklyBoard({});

    render(<HomeView initialResponse={initialResponse} />);

    fireEvent.change(screen.getByLabelText("제품 검색"), {
      target: { value: "여행" }
    });

    expect(screen.getByRole("link", { name: "메뉴딱" })).toBeTruthy();
    expect(screen.getByText("🍜")).toBeTruthy();
    expect(screen.queryByRole("link", { name: "Cursor" })).toBeNull();
  });

  it("vote 버튼을 누르면 optimistic count와 선택 상태를 갱신한다", async () => {
    const initialResponse = createKickService().getWeeklyBoard({});

    render(
      <HomeView
        initialResponse={initialResponse}
        onVote={async () => ({
          launchId: "launch_cursor",
          voteCount: 429,
          isVotedByViewer: true
        })}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Cursor vote" }));

    expect(await screen.findByText("429")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Cursor vote" }).getAttribute("aria-pressed")).toBe("true");
  });
});
