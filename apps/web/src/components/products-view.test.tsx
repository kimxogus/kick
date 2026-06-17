import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ProductsView } from "./products-view";
import { createKickService } from "@/server/kick-service";

async function loadBoard() {
  return createKickService().getWeeklyBoard({});
}

describe("ProductsView", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("검색어로 제품을 필터링한다", async () => {
    const initialResponse = await loadBoard();
    vi.stubGlobal("fetch", vi.fn(async () => Response.json(initialResponse)));

    render(<ProductsView initialResponse={initialResponse} />);

    expect(screen.getByRole("link", { name: /Cursor/ })).toBeTruthy();

    fireEvent.change(screen.getByLabelText("제품 검색"), { target: { value: "meeting" } });

    expect(screen.getByRole("link", { name: /Granola/ })).toBeTruthy();
    expect(screen.queryByRole("link", { name: /Cursor/ })).toBeNull();
  });

  it("검색 결과가 없으면 빈 상태를 보여준다", async () => {
    const initialResponse = await loadBoard();
    vi.stubGlobal("fetch", vi.fn(async () => Response.json(initialResponse)));

    render(<ProductsView initialResponse={initialResponse} />);

    fireEvent.change(screen.getByLabelText("제품 검색"), {
      target: { value: "zzz-no-match-zzz" }
    });

    expect(screen.getByText("검색어와 맞는 제품이 없어요. 다른 키워드로 찾아보세요.")).toBeTruthy();
  });

  it("카테고리 필터와 정렬 옵션을 제공한다", async () => {
    const initialResponse = await loadBoard();
    vi.stubGlobal("fetch", vi.fn(async () => Response.json(initialResponse)));

    render(<ProductsView initialResponse={initialResponse} />);

    expect(screen.getByLabelText("카테고리 필터")).toBeTruthy();
    expect(screen.getByLabelText("정렬")).toBeTruthy();
    expect(screen.getByText(/총 .*개 제품/)).toBeTruthy();
  });
});
