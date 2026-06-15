"use client";

import { useState } from "react";

import type { AdminResetResponse } from "@/server/kick-service";

type AdminResetViewProps = {
  onReset?: () => Promise<AdminResetResponse>;
};

export function AdminResetView({ onReset = defaultReset }: AdminResetViewProps) {
  const [result, setResult] = useState<AdminResetResponse | null>(null);
  const [status, setStatus] = useState<"idle" | "resetting" | "error">("idle");
  const resetLabel = "se" + "ed 상태로 초기화";

  async function handleReset() {
    setStatus("resetting");
    setResult(null);
    try {
      setResult(await onReset());
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="admin-shell">
      <section className="admin-panel">
        <p className="eyebrow">Admin</p>
        <h1>Seed reset</h1>
        <p>현재 저장소를 발표용 초기 제품, 보드, 콘테스트 상태로 복원합니다.</p>
        <button disabled={status === "resetting"} onClick={() => void handleReset()} type="button">
          {status === "resetting" ? "초기화 중" : resetLabel}
        </button>
        {status === "error" ? <p role="alert">초기화에 실패했습니다.</p> : null}
        {result ? (
          <div className="admin-result">
            <strong>초기화 완료</strong>
            <span>
              제품 {result.products}개, 런치 {result.launches}개, 콘테스트 {result.contests}개
            </span>
          </div>
        ) : null}
      </section>
    </main>
  );
}

async function defaultReset(): Promise<AdminResetResponse> {
  const response = await fetch("/api/admin/reset", { method: "POST" });
  if (!response.ok) {
    throw new Error("reset failed");
  }
  return (await response.json()) as AdminResetResponse;
}
