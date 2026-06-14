import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { ProductDetailView } from "./product-detail-view";
import { createKickService } from "@/server/kick-service";

describe("ProductDetailView", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("제품 상세 핵심 정보와 관련 제품을 보여준다", () => {
    const detail = createKickService().getProductDetail("cursor");

    render(<ProductDetailView detail={detail} />);

    expect(screen.getByRole("heading", { name: "Cursor" })).toBeTruthy();
    expect(screen.getByText("AI와 함께 코드를 읽고 고치는 개발자용 에디터")).toBeTruthy();
    expect(screen.getByText("관련 제품")).toBeTruthy();
    expect(screen.getByText("Perplexity")).toBeTruthy();
  });

  it("제품 상세에서 newsletter 구독 상태를 보여준다", async () => {
    const detail = createKickService().getProductDetail("cursor");

    render(
      <ProductDetailView
        detail={detail}
        onSubscribe={async () => ({
          subscription: {
            id: "newsletter_test",
            email: "maker@example.com",
            source: "product",
            createdAt: "2026-06-14T00:00:00.000Z"
          }
        })}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
      target: { value: "maker@example.com" }
    });
    fireEvent.click(screen.getByRole("button", { name: "구독" }));

    expect(await screen.findByText("제품 업데이트 구독 의사를 저장했습니다.")).toBeTruthy();
  });

  it("같은 viewer의 vote 상태를 제품 상세에서 재동기화한다", async () => {
    const initialService = createKickService();
    const syncedService = createKickService();
    syncedService.toggleVote({ launchId: "launch_cursor", viewerId: "viewer_detail" });
    window.localStorage.setItem("kick_viewer_id", "viewer_detail");
    const fetchSpy = vi.fn(async () =>
      Response.json(syncedService.getProductDetail("cursor", "viewer_detail"))
    );
    vi.stubGlobal("fetch", fetchSpy);

    render(<ProductDetailView detail={initialService.getProductDetail("cursor")} />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Cursor vote" }).getAttribute("aria-pressed")).toBe("true");
    });
    expect(screen.getByRole("button", { name: "Cursor vote" }).textContent).toContain("429");
    expect(fetchSpy).toHaveBeenCalledWith("/api/products/cursor?viewer_id=viewer_detail");
  });
});
