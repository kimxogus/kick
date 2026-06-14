"use client";

import { FormEvent, useState } from "react";

import { saveSubmissionPreview } from "@/lib/submission-storage";
import { getOrCreateViewerId } from "@/lib/viewer";
import type {
  LaunchAssistResponse,
  MakerSubmissionDraft,
  MakerSubmissionResponse
} from "@/server/kick-service";

type MakerViewProps = {
  onAnalyze?: (draft: MakerSubmissionDraft) => Promise<LaunchAssistResponse>;
  onSubmit?: (payload: LaunchAssistResponse["result"]["submissionPayload"]) => Promise<MakerSubmissionResponse>;
};

export function MakerView({ onAnalyze = defaultAnalyze, onSubmit = defaultSubmit }: MakerViewProps) {
  const [productName, setProductName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [descriptionDraft, setDescriptionDraft] = useState("");
  const [targetUsers, setTargetUsers] = useState("");
  const [problem, setProblem] = useState("");
  const [features, setFeatures] = useState("");
  const [result, setResult] = useState<LaunchAssistResponse["result"] | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "generating" | "ready" | "submitted">("idle");

  async function handleAnalyze(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("generating");
    const response = await onAnalyze({
      productName,
      websiteUrl: websiteUrl || undefined,
      descriptionDraft,
      targetUsers: splitInput(targetUsers),
      problem,
      features: splitInput(features)
    });
    setResult(response.result);
    setStatus("ready");
  }

  async function handleSubmit() {
    if (!result) {
      return;
    }
    const response = await onSubmit(result.submissionPayload);
    saveSubmissionPreview(response.submission);
    setPreviewUrl(response.previewUrl);
    setStatus("submitted");
  }

  return (
    <main className="page-shell maker-shell">
      <section className="board-hero">
        <div>
          <p className="eyebrow">maker flow</p>
          <h1>제품 이야기를 launch-ready payload로 정리</h1>
          <p className="hero-copy">제품 설명을 입력하면 타겟, 셀링 포인트, 홍보 문구와 제출 후보를 만든다.</p>
        </div>
        <a className="secondary-link" href="/">
          Weekly board
        </a>
      </section>

      <form className="maker-form" onSubmit={(event) => void handleAnalyze(event)}>
        <label>
          <span>제품명</span>
          <input value={productName} onChange={(event) => setProductName(event.target.value)} />
        </label>
        <label>
          <span>제품 URL</span>
          <input value={websiteUrl} onChange={(event) => setWebsiteUrl(event.target.value)} />
        </label>
        <label>
          <span>제품 설명 초안</span>
          <textarea value={descriptionDraft} onChange={(event) => setDescriptionDraft(event.target.value)} />
        </label>
        <label>
          <span>대상 사용자</span>
          <input value={targetUsers} onChange={(event) => setTargetUsers(event.target.value)} />
        </label>
        <label>
          <span>해결 문제</span>
          <input value={problem} onChange={(event) => setProblem(event.target.value)} />
        </label>
        <label>
          <span>주요 기능</span>
          <input value={features} onChange={(event) => setFeatures(event.target.value)} />
        </label>
        <button type="submit">{status === "generating" ? "분석 중" : "분석하기"}</button>
      </form>

      {result ? (
        <section className="assist-result">
          <h2>{result.tagline}</h2>
          <div className="result-grid">
            <ResultList title="핵심 어필 포인트" items={result.appealPoints} />
            <ResultList title="타겟 분석" items={result.targetAnalysis} />
            <ResultList title="셀링 포인트" items={result.sellingPoints} />
            <ResultList title="개선 피드백과 리스크" items={result.risksOrUnknowns} emptyText="즉시 시연 가능" />
          </div>
          <div className="copy-grid">
            <article>
              <h3>런칭페이지 초안</h3>
              <p>{result.launchPageCopy}</p>
            </article>
            <ResultList title="카드뉴스 문구" items={result.cardNewsCopy} />
            <article>
              <h3>채널별 홍보 카피</h3>
              <ul>
                <li>{result.channelCopy.productHunt}</li>
                <li>{result.channelCopy.disquiet}</li>
                <li>{result.channelCopy.internalDemo}</li>
              </ul>
            </article>
            <ResultList title="추가 확인 질문" items={result.followUpQuestions} emptyText="추가 확인 질문 없음" />
          </div>
          <article className="payload-preview">
            <h3>등록 payload</h3>
            <p>{result.submissionPayload.productName}</p>
            <p>{result.submissionPayload.description}</p>
            <div className="meta-row">
              {result.submissionPayload.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <button type="button" onClick={() => void handleSubmit()}>
              제출 후보 저장
            </button>
            {previewUrl ? <a href={previewUrl}>{previewUrl}</a> : null}
          </article>
        </section>
      ) : null}
    </main>
  );
}

function ResultList({ title, items, emptyText }: { title: string; items: string[]; emptyText?: string }) {
  return (
    <article>
      <h3>{title}</h3>
      <ul>
        {(items.length > 0 ? items : [emptyText ?? "추가 정보 필요"]).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}

function splitInput(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

async function defaultAnalyze(draft: MakerSubmissionDraft): Promise<LaunchAssistResponse> {
  const response = await fetch("/api/maker/launch-assist", {
    method: "POST",
    body: JSON.stringify(draft)
  });
  if (!response.ok) {
    throw new Error("launch assist failed");
  }
  return (await response.json()) as LaunchAssistResponse;
}

async function defaultSubmit(payload: LaunchAssistResponse["result"]["submissionPayload"]): Promise<MakerSubmissionResponse> {
  const response = await fetch("/api/maker/submissions", {
    method: "POST",
    body: JSON.stringify({ payload, viewerId: getOrCreateViewerId() })
  });
  if (!response.ok) {
    throw new Error("submission failed");
  }
  return (await response.json()) as MakerSubmissionResponse;
}
