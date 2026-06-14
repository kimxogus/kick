import { describe, expect, it } from "vitest";

import { GET as getWeeklyBoard } from "./boards/weekly/route";
import { POST as createLaunchAssist } from "./maker/launch-assist/route";
import { GET as getMakerSubmission } from "./maker/submissions/[id]/route";
import { POST as createMakerSubmission } from "./maker/submissions/route";
import { POST as createNewsletterSubscription } from "./newsletter-subscriptions/route";
import { GET as getProduct } from "./products/[slug]/route";
import { POST as toggleVote } from "./votes/route";

describe("kick MVP API route handlers", () => {
  it("GET /api/boards/weekly는 검색과 태그 필터를 적용한다", async () => {
    const response = await getWeeklyBoard(
      new Request("http://localhost/api/boards/weekly?q=developer&tag=Productivity&viewer_id=api_viewer")
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.board.launches).toHaveLength(1);
    expect(body.board.launches[0].product.slug).toBe("cursor");
  });

  it("GET /api/products/:slug는 제품 상세를 반환한다", async () => {
    const response = await getProduct(new Request("http://localhost/api/products/cursor"), {
      params: Promise.resolve({ slug: "cursor" })
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.product.slug).toBe("cursor");
    expect(body.relatedLaunches.length).toBeGreaterThan(0);
  });

  it("POST /api/votes는 vote 상태를 toggle한다", async () => {
    const request = new Request("http://localhost/api/votes", {
      method: "POST",
      body: JSON.stringify({ launchId: "launch_cursor", viewerId: "api_voter" })
    });

    const response = await toggleVote(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.launchId).toBe("launch_cursor");
    expect(body.isVotedByViewer).toBe(true);
  });

  it("POST /api/newsletter-subscriptions는 이메일 형식을 검증한다", async () => {
    const response = await createNewsletterSubscription(
      new Request("http://localhost/api/newsletter-subscriptions", {
        method: "POST",
        body: JSON.stringify({ email: "bad-email", source: "board" })
      })
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
    expect(body.error.fields).toContain("email");
  });

  it("POST /api/maker/launch-assist는 제작자 런칭 보조 결과를 반환한다", async () => {
    const response = await createLaunchAssist(
      new Request("http://localhost/api/maker/launch-assist", {
        method: "POST",
        body: JSON.stringify({
          productName: "DemoFlow",
          descriptionDraft: "시연 준비를 정리하는 제품",
          targetUsers: ["maker"],
          problem: "발표 준비가 흩어져 있다",
          features: ["데모 스크립트", "체크리스트"]
        })
      })
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.result.submissionPayload.productName).toBe("DemoFlow");
    expect(body.result.appealPoints).toHaveLength(3);
  });

  it("POST와 GET /api/maker/submissions는 제출 후보를 저장하고 조회한다", async () => {
    const createResponse = await createMakerSubmission(
      new Request("http://localhost/api/maker/submissions", {
        method: "POST",
        body: JSON.stringify({
          viewerId: "api_maker",
          payload: {
            productName: "DemoFlow",
            tagline: "DemoFlow로 발표 준비를 정리하세요.",
            description: "사내 시연 준비를 돕는 제품입니다.",
            websiteUrl: "https://example.com",
            tags: ["Demo"],
            makerNote: "MVP 후보"
          }
        })
      })
    );
    const created = await createResponse.json();
    const detailResponse = await getMakerSubmission(
      new Request(`http://localhost/api/maker/submissions/${created.submission.id}`),
      {
        params: Promise.resolve({ id: created.submission.id })
      }
    );
    const detail = await detailResponse.json();

    expect(createResponse.status).toBe(200);
    expect(detailResponse.status).toBe(200);
    expect(detail.submission.payload.productName).toBe("DemoFlow");
  });
});
