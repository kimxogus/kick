"use client";

import { FormEvent, useEffect, useState } from "react";

import { getOrCreateViewerId } from "@/lib/viewer";
import type { NewsletterResponse, ProductDetailResponse, VoteResponse } from "@/server/kick-service";
import { ProductMedia } from "./product-media";

type ProductDetailViewProps = {
  detail: ProductDetailResponse;
  onVote?: (launchId: string) => Promise<VoteResponse>;
  onSubscribe?: (email: string) => Promise<NewsletterResponse>;
  onSyncDetail?: (slug: string, viewerId: string) => Promise<ProductDetailResponse>;
};

export function ProductDetailView({
  detail,
  onVote = defaultVote,
  onSubscribe = defaultSubscribe,
  onSyncDetail = defaultSyncDetail
}: ProductDetailViewProps) {
  const [launch, setLaunch] = useState(detail.launch);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterState, setNewsletterState] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    let isCancelled = false;
    const viewerId = getOrCreateViewerId();

    void onSyncDetail(detail.product.slug, viewerId)
      .then((syncedDetail) => {
        if (!isCancelled) {
          setLaunch(syncedDetail.launch);
        }
      })
      .catch(() => {
        // 정적 파일 또는 네트워크 없는 시연에서는 초기 상세 정보를 그대로 사용한다.
      });

    return () => {
      isCancelled = true;
    };
  }, [detail.product.slug, onSyncDetail]);

  async function handleVote() {
    const response = await onVote(launch.id);
    setLaunch((current) => ({
      ...current,
      voteCount: response.voteCount,
      isVotedByViewer: response.isVotedByViewer
    }));
  }

  async function handleNewsletter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await onSubscribe(newsletterEmail);
      setNewsletterState("success");
    } catch {
      setNewsletterState("error");
    }
  }

  return (
    <main className="page-shell detail-shell">
      <a className="back-link" href="/week">
        위클리보드
      </a>
      <section className="product-hero">
        <ProductMedia className="product-visual" product={detail.product} />
        <div>
          <p className="eyebrow">{detail.product.tags.slice(0, 2).join(" / ")}</p>
          <span className="category-pill">{detail.product.category}</span>
          <h1>{detail.product.name}</h1>
          <p className="hero-copy">{detail.product.tagline}</p>
          <button
            aria-label={`${detail.product.name} vote`}
            aria-pressed={launch.isVotedByViewer}
            className={launch.isVotedByViewer ? "vote-button active" : "vote-button"}
            type="button"
            onClick={() => void handleVote()}
          >
            <span className="heart" aria-hidden="true">
              ♥
            </span>
            <span>{launch.voteCount}</span>
          </button>
        </div>
      </section>

      <section className="kick-point">
        <h2>Kick Point</h2>
        <p>{detail.product.kickPoint}</p>
      </section>

      <section>
        <h2>카드뉴스</h2>
        <div className="cardnews-grid">
          {detail.product.cardNewsCopy.map((copy, index) => (
            <article className="cardnews-slide" key={copy}>
              <span>{index + 1}</span>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="detail-grid">
        <article>
          <h2>소개</h2>
          <p>{detail.product.description}</p>
        </article>
        <article>
          <h2>대상 사용자</h2>
          <ul>
            {detail.product.targetUsers.map((user) => (
              <li key={user}>{user}</li>
            ))}
          </ul>
        </article>
        <article>
          <h2>Use case</h2>
          <ul>
            {detail.product.useCases.map((useCase) => (
              <li key={useCase}>{useCase}</li>
            ))}
          </ul>
        </article>
        <article>
          <h2>Maker</h2>
          {detail.product.makers.map((maker) => (
            <p key={maker.id}>{maker.name}</p>
          ))}
          <a href={detail.product.websiteUrl}>웹사이트</a>
        </article>
      </section>

      <section>
        <h2>타겟별 홍보 메시지</h2>
        <div className="target-message-grid">
          {detail.product.targetMessages.map((targetMessage) => (
            <article key={targetMessage.audience}>
              <strong>{targetMessage.audience}</strong>
              <p>{targetMessage.message}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2>관련 제품</h2>
        <div className="related-grid">
          {detail.relatedLaunches.map((related) => (
            <a className="related-card" href={`/products/${related.product.slug}`} key={related.id}>
              <ProductMedia className="related-thumb" product={related.product} />
              <strong>{related.product.name}</strong>
              <span>{related.product.tagline}</span>
            </a>
          ))}
        </div>
      </section>

      <form className="newsletter-band" onSubmit={(event) => void handleNewsletter(event)}>
        <label>
          <span>Newsletter</span>
          <input
            value={newsletterEmail}
            placeholder="you@example.com"
            onChange={(event) => setNewsletterEmail(event.target.value)}
          />
        </label>
        <button type="submit">구독</button>
        {newsletterState === "success" ? <p>제품 업데이트 구독 의사를 저장했습니다.</p> : null}
        {newsletterState === "error" ? <p role="alert">이메일 형식을 확인해주세요.</p> : null}
      </form>
    </main>
  );
}

async function defaultVote(launchId: string): Promise<VoteResponse> {
  const response = await fetch("/api/votes", {
    method: "POST",
    body: JSON.stringify({ launchId, viewerId: getOrCreateViewerId() })
  });
  if (!response.ok) {
    throw new Error("vote failed");
  }
  return (await response.json()) as VoteResponse;
}

async function defaultSyncDetail(slug: string, viewerId: string): Promise<ProductDetailResponse> {
  const response = await fetch(`/api/products/${slug}?viewer_id=${viewerId}`);
  if (!response.ok) {
    throw new Error("product detail sync failed");
  }
  return (await response.json()) as ProductDetailResponse;
}

async function defaultSubscribe(email: string): Promise<NewsletterResponse> {
  const response = await fetch("/api/newsletter-subscriptions", {
    method: "POST",
    body: JSON.stringify({ email, source: "product" })
  });
  if (!response.ok) {
    throw new Error("newsletter failed");
  }
  return (await response.json()) as NewsletterResponse;
}
