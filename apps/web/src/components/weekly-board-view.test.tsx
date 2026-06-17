import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { WeeklyBoardView } from "./weekly-board-view";
import { createKickService } from "@/server/kick-service";

async function loadBoard() {
  return createKickService().getWeeklyBoard({});
}

describe("WeeklyBoardView", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("날짜별 제품과 주간 랭킹을 보여준다", async () => {
    const initialResponse = await loadBoard();
    vi.stubGlobal("fetch", vi.fn(async () => Response.json(initialResponse)));

    render(<WeeklyBoardView initialResponse={initialResponse} />);

    expect(screen.getByRole("heading", { name: "위클리보드" })).toBeTruthy();
    expect(screen.getByRole("complementary", { name: "주간 랭킹" })).toBeTruthy();
    const firstProduct = initialResponse.board.launches[0].product.name;
    expect(screen.getAllByText(firstProduct).length).toBeGreaterThan(0);
  });

  it("좋아요를 누르면 count와 선택 상태를 갱신한다", async () => {
    const initialResponse = await loadBoard();
    // mount 동기화 fetch가 vote 상태를 덮어쓰지 않도록 reject시킨다.
    vi.stubGlobal("fetch", vi.fn(async () => {
      throw new Error("no network");
    }));
    const target = initialResponse.board.launches[0];
    const onVote = vi.fn(async () => ({
      launchId: target.id,
      voteCount: target.voteCount + 1,
      isVotedByViewer: true
    }));

    render(<WeeklyBoardView initialResponse={initialResponse} onVote={onVote} />);

    fireEvent.click(screen.getByRole("button", { name: `${target.product.name} vote` }));

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: `${target.product.name} vote` }).getAttribute("aria-pressed")
      ).toBe("true")
    );
  });
});
