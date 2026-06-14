"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import { getOrCreateViewerId } from "@/lib/viewer";
import type { Launch, VoteResponse, WeeklyBoardResponse } from "@/server/kick-service";

type HomeViewProps = {
  initialResponse: WeeklyBoardResponse;
  onVote?: (launchId: string) => Promise<VoteResponse>;
};

export function HomeView({ initialResponse, onVote = defaultVote }: HomeViewProps) {
  const [launches, setLaunches] = useState(initialResponse.board.launches);
  const [query, setQuery] = useState(initialResponse.filters.q);
  const [activeTag, setActiveTag] = useState<string | null>(initialResponse.filters.tag);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterState, setNewsletterState] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams({ viewer_id: getOrCreateViewerId() });
    fetch(`/api/boards/weekly?${params.toString()}`)
      .then(async (response) => {
        if (!response.ok) {
          return;
        }
        const synced = (await response.json()) as WeeklyBoardResponse;
        if (!cancelled) {
          setLaunches(synced.board.launches);
        }
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  const visibleLaunches = useMemo(
    () => filterLaunches(launches, query, activeTag),
    [launches, query, activeTag]
  );

  async function handleVote(launch: Launch) {
    const response = await onVote(launch.id);
    setLaunches((current) =>
      current.map((candidate) =>
        candidate.id === response.launchId
          ? {
              ...candidate,
              voteCount: response.voteCount,
              isVotedByViewer: response.isVotedByViewer
            }
          : candidate
      )
    );
  }

  async function handleNewsletter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch("/api/newsletter-subscriptions", {
      method: "POST",
      body: JSON.stringify({ email: newsletterEmail, source: "board" })
    });
    setNewsletterState(response.ok ? "success" : "error");
  }

  return (
    <main className="page-shell">
      <section className="board-hero">
        <div>
          <p className="eyebrow">kick weekly</p>
          <h1>이번 주 눈여겨볼 제품</h1>
          <p className="hero-copy">
            실제 서비스 기반 seed를 바탕으로 탐색자와 제작자 흐름을 함께 보여준다.
          </p>
        </div>
        <a className="primary-link" href="/maker">
          제작자 등록 보조
        </a>
      </section>

      <section className="toolbar" aria-label="board filters">
        <label className="search-field">
          <span>제품 검색</span>
          <input
            aria-label="제품 검색"
            value={query}
            placeholder="제품명, 태그, 대상 사용자"
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <div className="tag-row" aria-label="태그 필터">
          <button
            className={activeTag === null ? "chip active" : "chip"}
            type="button"
            onClick={() => setActiveTag(null)}
          >
            전체
          </button>
          {initialResponse.filters.availableTags.map((tag) => (
            <button
              className={activeTag === tag ? "chip active" : "chip"}
              key={tag}
              type="button"
              onClick={() => setActiveTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      <section className="launch-list" aria-label={initialResponse.board.title}>
        {visibleLaunches.length === 0 ? (
          <p className="empty-state">조건에 맞는 제품이 없습니다.</p>
        ) : (
          visibleLaunches.map((launch) => (
            <article className="launch-card" key={launch.id}>
              <div className="rank">#{launch.rank}</div>
              <img alt="" className="product-thumb" src={launch.product.thumbnailUrl} />
              <div className="launch-main">
                <a className="product-title" href={`/products/${launch.product.slug}`}>
                  {launch.product.name}
                </a>
                <p>{launch.product.tagline}</p>
                <div className="launch-stats">
                  <span>{launch.product.makers.map((maker) => maker.name).join(", ")}</span>
                  <span>{launch.commentCount} comments</span>
                </div>
                <div className="meta-row">
                  {launch.product.tags.slice(0, 3).map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <p className="featured-reason">{launch.featuredReason}</p>
              </div>
              <button
                aria-label={`${launch.product.name} vote`}
                aria-pressed={launch.isVotedByViewer}
                className={launch.isVotedByViewer ? "vote-button active" : "vote-button"}
                type="button"
                onClick={() => void handleVote(launch)}
              >
                <span>{launch.voteCount}</span>
                <small>vote</small>
              </button>
            </article>
          ))
        )}
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
        {newsletterState === "success" ? <p>구독 의사를 저장했습니다.</p> : null}
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

function filterLaunches(launches: Launch[], query: string, tag: string | null): Launch[] {
  const normalized = query.trim().toLowerCase();
  return launches.filter((launch) => {
    const product = launch.product;
    const searchable = [
      product.name,
      product.tagline,
      product.description,
      ...product.tags,
      ...product.targetUsers
    ]
      .join(" ")
      .toLowerCase();
    return (!normalized || searchable.includes(normalized)) && (!tag || product.tags.includes(tag));
  });
}
