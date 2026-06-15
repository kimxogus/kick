# kick

`kick`은 사내 1주 MVP 시연을 목표로 하는 AI 제품 런칭 플랫폼입니다.
AI로 제품을 만드는 사람은 빠르게 늘고 있지만, 제품의 강점과 홍보 포인트를 정리해 공개하는 일은 여전히 어렵습니다. kick은 제작자가 자신의 agent에게 "올려줘"라고 말하면 Skill/MCP가 제품 분석, 런칭 페이지 초안, 카드뉴스 문구, 홍보 카피를 만들어 등록까지 돕는 경험을 지향합니다.

## 현재 상태

- 서비스명은 `kick`으로 확정했습니다. 저장소명 `k-producthunt`는 초기 가제와 코드명으로만 남아 있습니다.
- 문서와 의사결정 기록을 먼저 세우는 초기 단계입니다.
- MVP 애플리케이션 스택은 Next.js App Router로 일원화합니다.
- MVP 실행과 배포는 OpenAI Codex Sites를 1순위로 고려합니다.
- Sites 접근 또는 preview 제약이 생기면 정적 파일 로컬 실행 또는 localhost 실행으로 시연합니다.
- 별도 백엔드와 원격 DB는 두지 않고, Next.js route handler와 fixture/memory store로 MVP API를 구현합니다.
- 모든 문서는 팀 논의를 통해 계속 갱신되는 draft입니다.

## MVP 방향

시연 플로우:

- 탐색자: Weekly board, 검색/필터, 제품 상세, vote, newsletter UI를 통해 정제된 제품을 발견합니다.
- 제작자: MCP/Skill을 통해 제품 분석, 타겟 분석, 셀링 포인트, 피드백, 런칭페이지/카드뉴스/홍보 카피 초안을 만들고 kick 등록 후보까지 이어갑니다.

MVP 우선 기능:

- Product 소개 페이지
- Weekly board와 viewer별 vote toggle
- Search
- Skill + MCP 제작자 런칭 보조 데모
- Newsletter UI
- 실제 서비스 기반 초기 콘텐츠
- 공개 contest 읽기 전용 페이지
- Codex Sites saved version 검토와 가능할 경우 발표용 배포 URL
- fallback 정적 파일 또는 localhost 실행 경로

## 로컬 실행

MVP 앱은 `apps/web/`의 Next.js App Router 앱으로 구현합니다. Codex Sites 검증 전까지 발표 fallback은 production build 후 localhost에서 실행하는 방식을 기본으로 둡니다.

```bash
npm install
npm run test:run -w apps/web
npm run build -w apps/web
npm run start -w apps/web -- --port 3000
```

UI smoke 검증은 별도 터미널에서 앱을 실행한 뒤 아래 명령으로 수행합니다.

```bash
npm run smoke:ui -w apps/web
```

개발 중 빠른 확인에는 `npm run dev -w apps/web -- --port 3000`을 사용할 수 있지만, 발표 fallback 검증은 `build`와 `start` 기준으로 기록합니다.

후순위 기능:

- Daily, Monthly, Yearly board
- kick contest 생성/운영 기능
- 댓글과 창작자 1:1 메시지
- 운영자 큐레이션 백엔드와 AI Slop 필터링
- 실제 newsletter 발송
- Fairy 스타일의 응원 결제 또는 후원 UX

## 주요 문서

- [SPEC.md](SPEC.md): 제품 요구사항과 미결정 사항
- [docs/pitch.md](docs/pitch.md): 콘테스트 피치·포지셔닝·심사 어필 전략
- [docs/pages.md](docs/pages.md): 데모 페이지 아이디어와 MVP UI 계약 연결
- [ARCHITECTURE.md](ARCHITECTURE.md): 시스템 구조와 기술 결정 후보
- [TODO.md](TODO.md): 논의와 구현 TODO
- [ROADMAP.md](ROADMAP.md): 로드맵 템플릿
- [docs/README.md](docs/README.md): 문서 구조와 갱신 규칙
- [docs/adr/README.md](docs/adr/README.md): ADR 관리 방식
- [docs/contracts/mvp-data-and-api-contract.md](docs/contracts/mvp-data-and-api-contract.md): MVP 데이터와 API 계약
- [docs/contracts/mvp-ui-contract.md](docs/contracts/mvp-ui-contract.md): MVP UI 흐름 계약
- [skills/README.md](skills/README.md): Codex/Claude 공용 Skill 관리 방식

## 개발 원칙

- 문서와 ADR로 요구사항/설계를 먼저 고정한 뒤 구현합니다.
- 구현은 TDD flow를 따릅니다.
- Codex와 Claude Code를 모두 지원하되, 충돌 시 Codex 및 [AGENTS.md](AGENTS.md)를 우선합니다.
- 모든 프로젝트 문서와 작업 요약은 한국어로 작성합니다.
