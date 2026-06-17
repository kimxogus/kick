import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { HomeView } from "./home-view";
import { summarizeContests } from "@/lib/contest-summary";
import { createKickService } from "@/server/kick-service";

async function loadHighlights() {
  const board = await createKickService().getWeeklyBoard({});
  return [...board.board.launches].sort((a, b) => a.rank - b.rank).slice(0, 3);
}

const summary = { upcoming: 1, open: 2, closed: 1 };

describe("HomeView", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("hero, 작동 방식, 하이라이트, 콘테스트 요약을 보여준다", async () => {
    const highlights = await loadHighlights();

    render(<HomeView highlights={highlights} contestSummary={summary} />);

    expect(screen.getByRole("heading", { name: /kick에게 말 한마디로/ })).toBeTruthy();
    expect(screen.getByText("에이전트가 만듭니다")).toBeTruthy();
    expect(screen.getByText(/한마디면 충분해요/)).toBeTruthy();
    expect(screen.getByText(/GitHub repo에서 kick plugin 설치 가이드 확인/)).toBeTruthy();
    const readmeLink = screen.getByRole("link", { name: "설치 가이드 보기" });
    expect(readmeLink.getAttribute("href")).toBe("https://github.com/kimxogus/kick#readme");
    expect(screen.getByRole("link", { name: new RegExp(highlights[0].product.name) })).toBeTruthy();
    expect(screen.getByText("예정")).toBeTruthy();
    expect(screen.getByText("진행중")).toBeTruthy();
    expect(screen.getByText("종료")).toBeTruthy();

    const blockedWords = ["se" + "ed", "더" + "미", "표시" + "용", "콘테스트 " + "개최하기"];
    for (const word of blockedWords) {
      expect(document.body.textContent).not.toContain(word);
    }
  });

  it("스킬 문구 복사 버튼이 클립보드에 복사한다", async () => {
    const highlights = await loadHighlights();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(<HomeView highlights={highlights} contestSummary={summary} />);

    fireEvent.click(screen.getByRole("button", { name: "스킬 문구 복사" }));

    await waitFor(() => expect(writeText).toHaveBeenCalledWith("kick 스킬을 참고해서 내 제품 올려줘"));
    expect(await screen.findByText("복사됨")).toBeTruthy();
  });

  it("메이커 카드는 리포트만 있고 이메일 폼은 없다", async () => {
    const highlights = await loadHighlights();

    render(<HomeView highlights={highlights} contestSummary={summary} />);

    expect(screen.getByText(/모먼토 · 이번 주 리포트/)).toBeTruthy();
    // 탐색자 카드의 이메일 입력 1개만 존재한다.
    expect(screen.getAllByPlaceholderText("이메일 주소")).toHaveLength(1);
    expect(screen.getAllByRole("button", { name: "구독" })).toHaveLength(1);
  });

  it("newsletter 구독 성공과 실패 상태를 보여준다", async () => {
    const highlights = await loadHighlights();
    const fetchSpy = vi.fn(async () =>
      Response.json({
        subscription: {
          id: "newsletter_test",
          email: "maker@example.com",
          source: "home",
          createdAt: "2026-06-15T00:00:00.000Z"
        }
      })
    );
    vi.stubGlobal("fetch", fetchSpy);

    render(<HomeView highlights={highlights} contestSummary={summary} />);

    fireEvent.change(screen.getByLabelText("탐색자 뉴스레터 이메일"), {
      target: { value: "maker@example.com" }
    });
    fireEvent.click(screen.getByRole("button", { name: "구독" }));

    expect(await screen.findByText("구독 의사를 저장했습니다.")).toBeTruthy();
    expect(fetchSpy).toHaveBeenCalledWith(
      "/api/newsletter-subscriptions",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ email: "maker@example.com", source: "board" })
      })
    );
  });

  it("newsletter 구독 실패 시 이메일 확인 메시지를 보여준다", async () => {
    const highlights = await loadHighlights();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json(
          { error: { code: "VALIDATION_ERROR", message: "이메일 형식을 확인해주세요.", fields: ["email"] } },
          { status: 400 }
        )
      )
    );

    render(<HomeView highlights={highlights} contestSummary={summary} />);

    fireEvent.change(screen.getByLabelText("탐색자 뉴스레터 이메일"), {
      target: { value: "bad-email" }
    });
    fireEvent.click(screen.getByRole("button", { name: "구독" }));

    expect((await screen.findByRole("alert")).textContent).toContain("이메일 형식을 확인해주세요.");
  });
});

describe("summarizeContests", () => {
  it("status별 콘테스트 수를 집계한다", async () => {
    const contests = await createKickService().getContests();

    const result = summarizeContests(contests);

    const total = result.upcoming + result.open + result.closed;
    expect(total).toBe(contests.contests.length);
  });
});
