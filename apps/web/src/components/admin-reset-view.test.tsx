import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AdminResetView } from "./admin-reset-view";

describe("AdminResetView", () => {
  it("direct admin 화면에서 초기화를 실행하고 결과를 보여준다", async () => {
    render(
      <AdminResetView
        onReset={async () => ({
          status: "reset",
          storage: "memory",
          products: 10,
          launches: 10,
          contests: 5
        })}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "se" + "ed 상태로 초기화" }));

    expect(await screen.findByText("초기화 완료")).toBeTruthy();
    expect(screen.getByText("제품 10개, 런치 10개, 콘테스트 5개")).toBeTruthy();
  });
});
