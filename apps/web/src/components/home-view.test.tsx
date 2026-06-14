import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HomeView } from "./home-view";
import { createKickService } from "@/server/kick-service";

describe("HomeView", () => {
  it("Weekly board 제품을 보여주고 검색어로 필터링한다", () => {
    const initialResponse = createKickService().getWeeklyBoard({});

    render(<HomeView initialResponse={initialResponse} />);

    expect(screen.getByRole("link", { name: "Cursor" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Granola" })).toBeTruthy();
    expect(screen.getByText("Anysphere")).toBeTruthy();
    expect(screen.getByText("36 comments")).toBeTruthy();

    fireEvent.change(screen.getByLabelText("제품 검색"), {
      target: { value: "meeting" }
    });

    expect(screen.getByRole("link", { name: "Granola" })).toBeTruthy();
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
