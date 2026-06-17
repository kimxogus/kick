"use client";

import { useEffect, useMemo, useState } from "react";

import { getOrCreateViewerId } from "@/lib/viewer";
import type { Launch, VoteResponse, WeeklyBoardResponse } from "@/server/kick-service";
import { ProductMedia } from "./product-media";

type WeeklyBoardViewProps = {
  initialResponse: WeeklyBoardResponse;
  onVote?: (launchId: string) => Promise<VoteResponse>;
};

export function WeeklyBoardView({ initialResponse, onVote = defaultVote }: WeeklyBoardViewProps) {
  const [launches, setLaunches] = useState(initialResponse.board.launches);

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

  const dateGroups = useMemo(() => groupByDate(launches), [launches]);
  const ranking = useMemo(() => [...launches].sort((a, b) => b.voteCount - a.voteCount), [launches]);

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
          <p className="section-eyebrow">weekly board</p>
          <h2>위클리보드</h2>
          <p>
            {initialResponse.board.startsOn} - {initialResponse.board.endsOn} · 마음에 들면 좋아요, 그게 곧
            순위예요.
          </p>
        </div>
        <span className="muted-link" aria-disabled="true">
          ← 지난주
        </span>
      </section>

      <div className="week-layout">
        <div className="week-list" aria-label={initialResponse.board.title}>
          {dateGroups.map(([date, items]) => (
            <div className="date-group" key={date}>
              <div className="date-label">{date}</div>
              {items.map((launch) => (
                <article className="row-card" key={launch.id}>
                  <ProductMedia className="row-thumb" product={launch.product} />
                  <div className="row-body">
                    <a className="product-title" href={`/products/${launch.product.slug}`}>
                      {launch.product.name}
                    </a>
                    <p>{launch.product.tagline}</p>
                    <span className="category-pill">{launch.product.category}</span>
                  </div>
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
                </article>
              ))}
            </div>
          ))}
        </div>

        <aside className="rank-panel" aria-label="주간 랭킹">
          <h3>주간 랭킹</h3>
          {ranking.map((launch, index) => (
            <a
              className={index < 3 ? "rank-item top" : "rank-item"}
              href={`/products/${launch.product.slug}`}
              key={launch.id}
            >
              <span className="rank-badge">{index + 1}</span>
              <span className="rank-name">{launch.product.name}</span>
              <span className="rank-likes">♥ {launch.voteCount}</span>
            </a>
          ))}
        </aside>
      </div>
    </main>
  );
}

function groupByDate(launches: Launch[]): Array<[string, Launch[]]> {
  const byDate = new Map<string, Launch[]>();
  for (const launch of launches) {
    const date = launch.launchedAt.slice(0, 10);
    const bucket = byDate.get(date) ?? [];
    bucket.push(launch);
    byDate.set(date, bucket);
  }
  return [...byDate.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1));
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
