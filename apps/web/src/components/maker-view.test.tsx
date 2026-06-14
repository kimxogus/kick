import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MakerView } from "./maker-view";
import type { LaunchAssistResult, MakerSubmissionResponse } from "@/server/kick-service";

const result: LaunchAssistResult = {
  appealPoints: ["명확한 시연 흐름", "등록 payload 생성", "홍보 문구 재사용"],
  targetAnalysis: ["maker"],
  sellingPoints: ["데모 준비 시간을 줄입니다."],
  differentiators: ["분석과 등록을 한 흐름으로 연결합니다."],
  risksOrUnknowns: [],
  tagline: "DemoFlow로 발표 준비를 정리하세요.",
  description: "시연 준비를 돕는 제품입니다.",
  tags: ["Demo", "Productivity"],
  launchPageCopy: "DemoFlow 소개",
  cardNewsCopy: ["문제", "해결", "시연"],
  channelCopy: {
    productHunt: "Launch-ready demo prep.",
    disquiet: "발표 준비를 정리합니다.",
    internalDemo: "사내 시연 포인트를 보여줍니다."
  },
  submissionPayload: {
    productName: "DemoFlow",
    tagline: "DemoFlow로 발표 준비를 정리하세요.",
    description: "시연 준비를 돕는 제품입니다.",
    websiteUrl: "https://example.com",
    tags: ["Demo", "Productivity"],
    makerNote: "MVP 후보"
  },
  followUpQuestions: ["가격 정책을 더 구체적으로 알려주세요."]
};

describe("MakerView", () => {
  it("제작자 입력을 분석하고 제출 후보 저장 CTA를 보여준다", async () => {
    render(
      <MakerView
        onAnalyze={async () => ({ result })}
        onSubmit={async (): Promise<MakerSubmissionResponse> => ({
          submission: {
            id: "submission_test",
            payload: result.submissionPayload,
            viewerId: "viewer_test",
            status: "received",
            createdAt: "2026-06-14T00:00:00.000Z"
          },
          status: "received",
          previewUrl: "/submissions/submission_test"
        })}
      />
    );

    fireEvent.change(screen.getByLabelText("제품명"), { target: { value: "DemoFlow" } });
    fireEvent.change(screen.getByLabelText("제품 설명 초안"), {
      target: { value: "시연 준비를 돕는 제품입니다." }
    });
    fireEvent.change(screen.getByLabelText("대상 사용자"), { target: { value: "maker" } });
    fireEvent.change(screen.getByLabelText("해결 문제"), {
      target: { value: "발표 준비가 흩어져 있다" }
    });
    fireEvent.change(screen.getByLabelText("주요 기능"), {
      target: { value: "데모 스크립트, 체크리스트" }
    });

    fireEvent.click(screen.getByRole("button", { name: "분석하기" }));

    expect(await screen.findByText("DemoFlow로 발표 준비를 정리하세요.")).toBeTruthy();
    expect(screen.getByText("등록 payload")).toBeTruthy();
    expect(screen.getByText("DemoFlow 소개")).toBeTruthy();
    expect(screen.getByText("문제")).toBeTruthy();
    expect(screen.getByText("Launch-ready demo prep.")).toBeTruthy();
    expect(screen.getByText("가격 정책을 더 구체적으로 알려주세요.")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "제출 후보 저장" }));

    expect(await screen.findByText("/submissions/submission_test")).toBeTruthy();
  });

  it("분석 실패 시 오류를 보여주고 버튼 상태를 복구한다", async () => {
    render(<MakerView onAnalyze={async () => Promise.reject(new Error("제품명이 필요합니다."))} />);

    fireEvent.click(screen.getByRole("button", { name: "분석하기" }));

    expect((await screen.findByRole("alert")).textContent).toContain("제품명이 필요합니다.");
    expect(screen.getByRole("button", { name: "분석하기" })).toBeTruthy();
  });
});
