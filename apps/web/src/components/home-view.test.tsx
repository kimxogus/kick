import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { HomeView } from "./home-view";
import { createKickService } from "@/server/kick-service";

describe("HomeView", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("Weekly board 제품을 보여주고 검색어로 필터링한다", async () => {
    const initialResponse = await createKickService().getWeeklyBoard({});

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

  it("샘플 제품 category 검색과 emoji thumbnail을 보여준다", async () => {
    const initialResponse = await createKickService().getWeeklyBoard({});

    render(<HomeView initialResponse={initialResponse} />);

    fireEvent.change(screen.getByLabelText("제품 검색"), {
      target: { value: "여행" }
    });

    expect(screen.getByRole("link", { name: "메뉴딱" })).toBeTruthy();
    expect(screen.getByText("🍜")).toBeTruthy();
    expect(screen.queryByRole("link", { name: "Cursor" })).toBeNull();
  });

  it("vote 버튼을 누르면 optimistic count와 선택 상태를 갱신한다", async () => {
    const initialResponse = await createKickService().getWeeklyBoard({});

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

  it("검색 결과가 없으면 empty state를 보여준다", async () => {
    const initialResponse = await createKickService().getWeeklyBoard({});

    render(<HomeView initialResponse={initialResponse} />);

    fireEvent.change(screen.getByLabelText("제품 검색"), {
      target: { value: "no matching launch" }
    });

    expect(screen.getByText("조건에 맞는 제품이 없습니다.")).toBeTruthy();
  });

  it("newsletter 구독 성공과 실패 상태를 보여준다", async () => {
    const initialResponse = await createKickService().getWeeklyBoard({});
    const fetchSpy = vi.fn(async (input: RequestInfo | URL) => {
      if (String(input).startsWith("/api/boards/weekly")) {
        return Response.json(initialResponse);
      }
      return Response.json({
        subscription: {
          id: "newsletter_test",
          email: "maker@example.com",
          source: "board",
          createdAt: "2026-06-15T00:00:00.000Z"
        }
      });
    });
    vi.stubGlobal("fetch", fetchSpy);

    render(<HomeView initialResponse={initialResponse} />);

    fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
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
    const initialResponse = await createKickService().getWeeklyBoard({});
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        if (String(input).startsWith("/api/boards/weekly")) {
          return Response.json(initialResponse);
        }
        return Response.json(
          {
            error: {
              code: "VALIDATION_ERROR",
              message: "이메일 형식을 확인해주세요.",
              fields: ["email"]
            }
          },
          { status: 400 }
        );
      })
    );

    render(<HomeView initialResponse={initialResponse} />);

    fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
      target: { value: "bad-email" }
    });
    fireEvent.click(screen.getByRole("button", { name: "구독" }));

    expect((await screen.findByRole("alert")).textContent).toContain("이메일 형식을 확인해주세요.");
  });
});
