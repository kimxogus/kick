// kick 프로젝트에서 AI를 어떻게 활용했는지 보여주는 스크롤 단일 페이지.
// 1단계: 기획과 발표 준비 과정. 디자인 가이드(에디토리얼 + 컬러 블록, 이모지 금지)를 따른다.

type Step = {
  no: string;
  tag: string;
  title: string;
  body: string;
  /** 실제로 한 일 / 산출물 */
  artifacts: string[];
  bg: string;
  ink: string;
  accent: string;
};

const PLANNING_STEPS: Step[] = [
  {
    no: "01",
    tag: "문제 정의",
    title: "“무엇을 만들지”를 AI와 대화하며 좁혔다",
    body:
      "막연한 아이디어를 AI에게 던지고, 되묻는 질문에 답하며 문제를 구체화했다. " +
      "Product Hunt·Disquiet와 무엇이 다른지, 누구의 어떤 통증을 푸는지를 한 문장으로 압축할 때까지 반복했다.",
    artifacts: [
      "한 줄 정의: “제품은 AI가 만들었는데, 홍보는 왜 직접 하세요?”",
      "Why / What / How / If 네 문장으로 핵심 정리",
      "경쟁 서비스 대비 차별점 표"
    ],
    bg: "#f3c4e7",
    ink: "#5a2147",
    accent: "#5a2147"
  },
  {
    no: "02",
    tag: "문서 우선",
    title: "코드보다 문서를 먼저 썼다",
    body:
      "요구사항·아키텍처·의사결정을 SPEC, ARCHITECTURE, ADR 문서로 먼저 고정하고 구현으로 넘어가는 " +
      "문서 우선 흐름을 AI agent 규칙(AGENTS.md)으로 못 박았다. 설계가 바뀌면 문서를 먼저 갱신했다.",
    artifacts: [
      "SPEC.md · ARCHITECTURE.md · docs/pitch.md",
      "주요 결정은 docs/adr/ 에 ADR로 기록",
      "AGENTS.md 단일 기준으로 Codex·Claude 공통 규칙 통일"
    ],
    bg: "#cdd8f7",
    ink: "#1b2b54",
    accent: "#1b2b54"
  },
  {
    no: "03",
    tag: "구현",
    title: "TDD 흐름으로 agent가 구현했다",
    body:
      "실패하는 테스트나 검증 시나리오를 먼저 세우고, 최소 구현으로 통과시킨 뒤 lint·typecheck·build로 회귀를 막았다. " +
      "AI agent가 코드를 쓰되 사람이 검증 명령과 결과를 확인하는 루프를 유지했다.",
    artifacts: [
      "Next.js App Router MVP 앱 (apps/web)",
      "Weekly board · vote · 제품 상세 · newsletter UI",
      "typecheck · build · UI smoke 검증 통과"
    ],
    bg: "#cfe3cf",
    ink: "#1f4329",
    accent: "#1f4329"
  }
];

const PRESENTATION_STEPS: Step[] = [
  {
    no: "04",
    tag: "메시지 설계",
    title: "발표 한 줄과 서사를 AI와 다듬었다",
    body:
      "여러 후보 문장을 뽑고, 통증을 직격하는 한 줄을 골랐다. 그 톤에 맞춰 Why·What·How·If를 " +
      "짧고 임팩트 있게 추려, 발표 전체가 하나의 메시지로 관통하도록 정렬했다.",
    artifacts: [
      "한 줄 훅과 네이밍 스토리(kick = 킥오프, 첫 발을 찬다)",
      "길게 → 핵심만, 반복 압축",
      "발표 톤·서사 일관성 점검"
    ],
    bg: "#c9a8f0",
    ink: "#33215e",
    accent: "#33215e"
  },
  {
    no: "05",
    tag: "슬라이드 구성",
    title: "3분 발표 구성을 역산했다",
    body:
      "콘테스트 심사 기준(참신성·완성도·실용성)에 맞춰 8장 흐름을 짰다. 라이브 데모에 시간을 몰아주고, " +
      "문제→솔루션은 빠르게, 차별점·비전은 짧게 배분했다.",
    artifacts: [
      "타이틀 → Why → What → Demo → Loop → Edge → If → 클로징",
      "슬라이드당 텍스트 3줄 이하 원칙",
      "심사 기준별 슬라이드 매핑"
    ],
    bg: "#bfe8dd",
    ink: "#0f4a3c",
    accent: "#0f4a3c"
  },
  {
    no: "06",
    tag: "발표 자료 구현",
    title: "발표 덱을 데모 사이트 안에 넣었다",
    body:
      "별도 슬라이드 도구 대신, 발표 덱을 데모 앱의 /pitch 라우트로 직접 구현했다. " +
      "단계별 노출·키보드 네비·풀스크린을 외부 의존성 없이 만들어, 데모와 발표가 한 URL·한 배포에서 이어지게 했다.",
    artifacts: [
      "/pitch — 자체 구현 발표 덱(외부 dep 0)",
      "“다음”마다 줄 하나씩 노출되는 단계 reveal",
      "데모 사이트와 동일 배포로 완성도 어필"
    ],
    bg: "#f4e84d",
    ink: "#4a4300",
    accent: "#4a4300"
  }
];

function StepBlock({ step }: { step: Step }) {
  return (
    <article className="kh-step" style={{ background: step.bg, color: step.ink }}>
      <div className="kh-step-inner">
        <span className="kh-step-no" style={{ color: step.accent }}>
          {step.no}
        </span>
        <span className="kh-step-tag">{step.tag}</span>
        <h3 className="kh-step-title">{step.title}</h3>
        <p className="kh-step-body">{step.body}</p>
        <ul className="kh-step-artifacts">
          {step.artifacts.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export function KnowhowView() {
  return (
    <main className="kh-page">
      <header className="kh-hero">
        <span className="kh-hero-kicker">Know-how</span>
        <h1 className="kh-hero-title">
          이 프로젝트를
          <br />
          AI와 이렇게 만들었다
        </h1>
        <p className="kh-hero-lead">
          기획부터 발표 준비까지, kick을 만드는 과정에서 AI를 어떻게 썼는지 기록한다.
          코드를 대신 쓰게 한 게 아니라, 생각을 좁히고 문서로 고정하고 검증하는 흐름 전체에 AI를 끼워 넣었다.
        </p>
        <a className="kh-scroll-hint" href="#planning">
          아래로 스크롤 ↓
        </a>
      </header>

      <section id="planning" className="kh-section">
        <div className="kh-section-head">
          <span className="kh-section-index">Part 1</span>
          <h2 className="kh-section-title">기획</h2>
          <p className="kh-section-sub">아이디어를 문서로, 문서를 구현으로.</p>
        </div>
        {PLANNING_STEPS.map((step) => (
          <StepBlock key={step.no} step={step} />
        ))}
      </section>

      <section id="presentation" className="kh-section">
        <div className="kh-section-head">
          <span className="kh-section-index">Part 2</span>
          <h2 className="kh-section-title">발표 준비</h2>
          <p className="kh-section-sub">메시지를 다듬고, 발표를 제품 안에 넣었다.</p>
        </div>
        {PRESENTATION_STEPS.map((step) => (
          <StepBlock key={step.no} step={step} />
        ))}
      </section>

      <section className="kh-outro">
        <p className="kh-outro-line">만드는 건 AI에게 넘겼으면,</p>
        <p className="kh-outro-line kh-outro-strong">알리는 것도 넘겨라.</p>
        <a className="kh-outro-cta" href="/pitch">
          발표 덱 보기 →
        </a>
      </section>
    </main>
  );
}
