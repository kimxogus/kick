"use client";

import { useEffect, useMemo, useState } from "react";

import { getOrCreateViewerId } from "@/lib/viewer";
import type { Launch, VoteResponse, WeeklyBoardResponse } from "@/server/kick-service";
import { ProductMedia } from "./product-media";

type SortKey = "latest" | "likes";

type ProductsViewProps = {
  initialResponse: WeeklyBoardResponse;
  onVote?: (launchId: string) => Promise<VoteResponse>;
};

export function ProductsView({ initialResponse, onVote = defaultVote }: ProductsViewProps) {
  const [launches, setLaunches] = useState(initialResponse.board.launches);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState<SortKey>("latest");

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

  const categories = useMemo(
    () => [...new Set(launches.map((launch) => launch.product.category))],
    [launches]
  );

  const visible = useMemo(
    () => filterAndSort(launches, query, category, sort),
    [launches, query, category, sort]
  );

  async function handleVote(launch: Launch) {
    const response = await onVote(launch.id);
    setLaunches((current) =>
      current.map((candidate) =>
        candidate.id === response.launchId
          ? { ...candidate, voteCount: response.voteCount, isVotedByViewer: response.isVotedByViewer }
          : candidate
      )
    );
  }

  return (
    <main className="page-shell">
      <section className="board-header">
        <div>
          <p className="section-eyebrow">explore</p>
          <h2>제품 탐색</h2>
          <p>킥을 거친 제품은 모두 같은 품질로 정리됩니다. 들쑥날쑥하지 않아요.</p>
        </div>
      </section>

      <section className="toolbar" aria-label="제품 필터">
        <label className="search-field">
          <span>제품 검색</span>
          <input
            aria-label="제품 검색"
            value={query}
            placeholder="제품·소개·태그 검색"
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <label className="select-field">
          <span>카테고리</span>
          <select
            aria-label="카테고리 필터"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="">전체 카테고리</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="select-field">
          <span>정렬</span>
          <select
            aria-label="정렬"
            value={sort}
            onChange={(event) => setSort(event.target.value as SortKey)}
          >
            <option value="latest">최신순</option>
            <option value="likes">좋아요순</option>
          </select>
        </label>
      </section>

      <p className="result-count">총 {visible.length}개 제품</p>

      {visible.length === 0 ? (
        <p className="empty-state">검색어와 맞는 제품이 없어요. 다른 키워드로 찾아보세요.</p>
      ) : (
        <section className="product-grid" aria-label="제품 목록">
          {visible.map((launch) => (
            <article className="product-card" key={launch.id}>
              <a className="product-card__link" href={`/products/${launch.product.slug}`}>
                <ProductMedia className="product-card__media" product={launch.product} />
                <div className="product-card__body">
                  <strong>{launch.product.name}</strong>
                  <p>{launch.product.tagline}</p>
                </div>
              </a>
              <div className="product-card__foot">
                <span className="category-pill">{launch.product.category}</span>
                <button
                  aria-label={`${launch.product.name} vote`}
                  aria-pressed={launch.isVotedByViewer}
                  className={launch.isVotedByViewer ? "vote-button active" : "vote-button"}
                  type="button"
                  onClick={() => void handleVote(launch)}
                >
                  <span className="heart" aria-hidden="true">
                    ♥
                  </span>
                  <span>{launch.voteCount}</span>
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

function filterAndSort(launches: Launch[], query: string, category: string, sort: SortKey): Launch[] {
  const normalized = query.trim().toLowerCase();
  const filtered = launches.filter((launch) => {
    const product = launch.product;
    const haystack = [product.name, product.tagline, ...product.tags].join(" ").toLowerCase();
    const matchesQuery = !normalized || haystack.includes(normalized);
    const matchesCategory = !category || product.category === category;
    return matchesQuery && matchesCategory;
  });

  return filtered.sort((a, b) =>
    sort === "likes" ? b.voteCount - a.voteCount : a.launchedAt < b.launchedAt ? 1 : -1
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
