import type { ContestListResponse } from "@/server/kick-service";
import { ProductMedia } from "./product-media";

type ContestViewProps = {
  initialResponse: ContestListResponse;
};

const statusLabel: Record<ContestListResponse["contests"][number]["status"], string> = {
  open: "진행 중",
  upcoming: "예정",
  closed: "종료"
};

export function ContestView({ initialResponse }: ContestViewProps) {
  return (
    <main className="page-shell contest-shell">
      <section className="page-hero compact-hero">
        <div>
          <p className="eyebrow">kick contest</p>
          <h1>공개 콘테스트</h1>
          <p className="hero-copy">누구나 주제를 걸고 콘테스트를 열 수 있어요. 상금 정보는 화면에만 표기됩니다.</p>
        </div>
        <div className="hero-actions">
          <a className="primary-link" href="/week">
            위클리보드
          </a>
          <a className="secondary-link" href="/products">
            제품 탐색
          </a>
        </div>
      </section>

      <section className="contest-grid" aria-label="공개 콘테스트 목록">
        {initialResponse.contests.map((contest) => (
          <article className="contest-card" key={contest.id}>
            <div className="contest-card-header">
              <span className={`status-pill ${contest.status}`}>{statusLabel[contest.status]}</span>
              <span className="date-range">
                {contest.startsOn} - {contest.endsOn}
              </span>
            </div>
            <h2>{contest.title}</h2>
            <p className="host">주최: {contest.host}</p>
            <p>{contest.description}</p>
            <p className="product-count">참여 제품 {contest.productCount}개</p>
            <div className="featured-products" aria-label={`${contest.title} 대표 제품`}>
              {contest.featuredLaunches.map((launch) => (
                <a className="mini-product-link" href={`/products/${launch.product.slug}`} key={launch.id}>
                  <ProductMedia className="mini-product-thumb" product={launch.product} />
                  <span>{launch.product.name}</span>
                </a>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
