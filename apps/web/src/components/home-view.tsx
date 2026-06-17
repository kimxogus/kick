"use client";

import { FormEvent, useState } from "react";

import type { ContestSummary } from "@/lib/contest-summary";
import type { Launch } from "@/server/kick-service";
import { ProductMedia } from "./product-media";

type HomeViewProps = {
  highlights: Launch[];
  contestSummary: ContestSummary;
};

const SKILL_PROMPT = "kick 스킬을 참고해서 내 제품 올려줘";
const README_URL = "https://github.com/kimxogus/kick#readme";

export function HomeView({ highlights, contestSummary }: HomeViewProps) {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterState, setNewsletterState] = useState<"idle" | "success" | "error">("idle");
  const [copied, setCopied] = useState(false);

  async function handleNewsletter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch("/api/newsletter-subscriptions", {
      method: "POST",
      body: JSON.stringify({ email: newsletterEmail, source: "board" })
    });
    setNewsletterState(response.ok ? "success" : "error");
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(SKILL_PROMPT);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="page-hero">
        <div>
          <p className="hero-kicker">AGENT-NATIVE PRODUCT LAUNCH</p>
          <h1 className="hero-headline">
            kick에게 말 한마디로
            <br />
            <span className="muted">제품을 런칭하다</span>
          </h1>
          <p className="hero-copy">
            등록 Skill이 제품 설명·카테고리·카드뉴스·홍보 카피까지 만들어 바로 런칭합니다. 탐색자는 일정한 품질로
            정제된 제품을 발견합니다.
          </p>
          <div className="hero-actions">
            <a className="primary-link" href="/week">
              이번 주 보기
            </a>
            <a className="secondary-link" href="/products">
              제품 탐색하기
            </a>
          </div>
        </div>
      </section>

      <section className="step-grid" aria-label="작동 방식">
        <p className="section-eyebrow" style={{ gridColumn: "1 / -1" }}>
          어떻게 동작하나요
        </p>
        <article className="step-card">
          <span className="step-num" aria-hidden="true">
            First
          </span>
          <h2>말합니다</h2>
          <p>agent에게 한마디면 충분해요.</p>
        </article>
        <article className="step-card">
          <span className="step-num" aria-hidden="true">
            Second
          </span>
          <h2>에이전트가 만듭니다</h2>
          <p>소개글·카테고리·카드뉴스·홍보 카피·타겟까지 자동으로.</p>
        </article>
        <article className="step-card">
          <span className="step-num" aria-hidden="true">
            Third
          </span>
          <h2>바로 런칭됩니다</h2>
          <p>일정한 품질의 런칭 페이지가 만들어져 즉시 노출돼요.</p>
        </article>
      </section>

      <div className="skill-guide" aria-label="스킬 등록 안내">
        <section className="skill-setup-callout" aria-label="plugin 설치 안내">
          <div>
            <strong>GitHub repo에서 kick plugin 설치 가이드 확인</strong>
            <p>Codex와 Claude Code에 kick plugin을 설치한 뒤 아래 문구로 제품 등록을 요청합니다.</p>
          </div>
          <a className="skill-setup-callout__link" href={README_URL}>
            설치 가이드 보기
          </a>
        </section>

        <section className="skill-callout" aria-label="스킬 사용 예시">
          <code className="skill-callout__text">{SKILL_PROMPT}</code>
          <button
            className="skill-callout__copy"
            type="button"
            onClick={() => void handleCopy()}
            aria-label="스킬 문구 복사"
          >
            {copied ? "복사됨" : "복사"}
          </button>
        </section>
      </div>

      <section className="board-header" aria-label="이번 주 주목받는 제품">
        <div>
          <p className="section-eyebrow">this week</p>
          <h2>이번 주, 주목받는 제품</h2>
        </div>
        <a className="secondary-link" href="/week">
          위클리보드
        </a>
      </section>

      <section className="product-grid" aria-label="이번 주 하이라이트">
        {highlights.map((launch) => (
          <a className="product-card" href={`/products/${launch.product.slug}`} key={launch.id}>
            <ProductMedia className="product-card__media" product={launch.product} />
            <div className="product-card__body">
              <strong>{launch.product.name}</strong>
              <p>{launch.product.tagline}</p>
            </div>
            <div className="product-card__foot">
              <span className="category-pill">{launch.product.category}</span>
              <span className="like-count" aria-label={`좋아요 ${launch.voteCount}`}>
                ♥ {launch.voteCount}
              </span>
            </div>
          </a>
        ))}
      </section>

      <section className="contest-summary" aria-label="콘테스트 요약">
        <div>
          <p className="section-eyebrow">contest</p>
          <h2>지금 콘테스트</h2>
        </div>
        <div className="contest-summary__counts">
          <div className="contest-summary__stat">
            <strong>{contestSummary.upcoming}</strong>
            <span>예정</span>
          </div>
          <div className="contest-summary__stat">
            <strong>{contestSummary.open}</strong>
            <span>진행중</span>
          </div>
          <div className="contest-summary__stat">
            <strong>{contestSummary.closed}</strong>
            <span>종료</span>
          </div>
        </div>
        <a className="secondary-link" href="/contest">
          콘테스트 보기
        </a>
      </section>

      <section className="news-section" aria-label="뉴스레터">
        <p className="section-eyebrow">매주, 메일함으로</p>
        <div className="news-grid">
          <article className="news-card news-card--user">
            <span className="news-tag">탐색하는 분께</span>
            <h3>이번 주 화제의 제품</h3>
            <p>그 주 가장 사랑받은 제품만 골라 보내드려요. 트렌드를 놓치지 마세요.</p>
            <form onSubmit={(event) => void handleNewsletter(event)}>
              <input
                aria-label="탐색자 뉴스레터 이메일"
                value={newsletterEmail}
                placeholder="이메일 주소"
                onChange={(event) => setNewsletterEmail(event.target.value)}
              />
              <button type="submit">구독</button>
            </form>
            {newsletterState === "success" ? (
              <p className="news-feedback">구독 의사를 저장했습니다.</p>
            ) : null}
            {newsletterState === "error" ? (
              <p className="news-feedback" role="alert">
                이메일 형식을 확인해주세요.
              </p>
            ) : null}
          </article>

          <article className="news-card news-card--maker">
            <span className="news-tag">제품을 올린 분께</span>
            <h3>내 제품 피드백 리포트</h3>
            <p>내 제품에 달린 좋아요·댓글·반응을 한 주간 모아서 자동으로 정리해 드려요.</p>
            <div className="report" aria-label="피드백 리포트 예시">
              <div className="report-head">모먼토 · 이번 주 리포트</div>
              <div className="report-row">
                <span>좋아요</span>
                <b>+128</b>
              </div>
              <div className="report-row">
                <span>새 댓글</span>
                <b>5개</b>
              </div>
              <div className="report-row">
                <span>주간 랭킹</span>
                <b>1위</b>
              </div>
              <p className="report-quote">&ldquo;매일 일기 쓰기 힘들었는데 딱이네요!&rdquo; — 민지</p>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
