"use client";

import { useEffect, useState } from "react";

import { readSubmissionPreview } from "@/lib/submission-storage";
import type { MakerSubmission } from "@/server/kick-service";

export function SubmissionView({ id }: { id: string }) {
  const [submission, setSubmission] = useState<MakerSubmission | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const localSubmission = readSubmissionPreview(id);
    if (localSubmission) {
      setSubmission(localSubmission);
    }

    fetch(`/api/maker/submissions/${id}`)
      .then(async (response) => {
        if (!response.ok) {
          if (!localSubmission) {
            setNotFound(true);
          }
          return;
        }
        const body = (await response.json()) as { submission: MakerSubmission };
        setSubmission(body.submission);
      })
      .catch(() => {
        if (!localSubmission) {
          setNotFound(true);
        }
      });
  }, [id]);

  if (notFound) {
    return (
      <main className="page-shell">
        <a className="back-link" href="/maker">
          제작자 등록 보조
        </a>
        <section className="submission-preview">
          <h1>제출 후보를 찾을 수 없습니다.</h1>
        </section>
      </main>
    );
  }

  if (!submission) {
    return (
      <main className="page-shell">
        <section className="submission-preview">
          <p>제출 후보를 불러오는 중입니다.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <a className="back-link" href="/maker">
        제작자 등록 보조
      </a>
      <section className="submission-preview">
        <p className="eyebrow">{submission.status}</p>
        <h1>{submission.payload.productName}</h1>
        <p className="hero-copy">{submission.payload.tagline}</p>
        <p>{submission.payload.description}</p>
        <div className="meta-row">
          {submission.payload.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <p>{submission.payload.makerNote}</p>
        <p className="featured-reason">MVP에서는 제출 후보를 Weekly board에 자동 반영하지 않습니다.</p>
      </section>
    </main>
  );
}
