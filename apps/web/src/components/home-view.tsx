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
      <section className="page-hero">
        <div>
          <p className="eyebrow">kick weekly</p>
          <h1>agent에게 말 한마디로, 내 제품을 kick하세요</h1>
          <p className="hero-copy">
            제품 설명, 타겟, 카드뉴스 문구, 홍보 카피를 정리해 탐색자가 바로 이해할 수 있는 런칭 페이지로 보여줍니다.
          </p>
        </div>
        <div className="hero-actions">
          <a className="primary-link" href="#weekly-board">
            이번 주 둘러보기
          </a>
          <a className="secondary-link" href="/maker">
            제작자 런칭 보조
          </a>
        </div>
      </section>

      <section className="step-grid" aria-label="작동 방식">
        <article className="step-card">
          <span className="step-icon" aria-hidden="true">
            1
          </span>
          <h2>agent에게 요청</h2>
          <p>제품명, URL, 문제와 기능을 전달하면 런칭 준비가 시작됩니다.</p>
        </article>
        <article className="step-card">
          <span className="step-icon" aria-hidden="true">
            2
          </span>
          <h2>Skill + MCP가 정리</h2>
          <p>타겟 분석, 셀링 포인트, 피드백, 카드뉴스 문구와 홍보 카피를 만듭니다.</p>
        </article>
        <article className="step-card">
          <span className="step-icon" aria-hidden="true">
            3
          </span>
          <h2>제품을 런칭</h2>
          <p>정리된 소개 페이지와 Weekly board를 통해 초기 반응을 확인합니다.</p>
        </article>
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

      <section className="board-header" id="weekly-board">
        <div>
          <p className="eyebrow">weekly board</p>
          <h2>이번 주 눈여겨볼 제품</h2>
          <p>
            {initialResponse.board.startsOn} - {initialResponse.board.endsOn}
          </p>
        </div>
        <a className="secondary-link" href="/contest">
          공개 콘테스트 보기
        </a>
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
