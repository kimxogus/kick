import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProductDetailView } from "./product-detail-view";
import { createKickService } from "@/server/kick-service";

describe("ProductDetailView", () => {
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
});
