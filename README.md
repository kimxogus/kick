# kick

`kick`은 사내 1주 MVP 시연을 목표로 하는 AI 제품 런칭 플랫폼입니다.
AI로 제품을 만드는 사람은 빠르게 늘고 있지만, 제품의 강점과 홍보 포인트를 정리해 공개하는 일은 여전히 어렵습니다. kick은 제작자가 자신의 agent에게 "올려줘"라고 말하면 Skill/MCP가 제품 분석, 런칭 페이지 초안, 카드뉴스 문구, 홍보 카피를 만들어 등록까지 돕는 경험을 지향합니다.


## 현재 상태

- 서비스명은 `kick`으로 확정했습니다. 저장소명 `k-producthunt`는 초기 가제와 코드명으로만 남아 있습니다.
- 문서와 의사결정 기록을 먼저 세우는 초기 단계입니다.
- MVP 애플리케이션 스택은 Next.js App Router로 일원화합니다.
- MVP 실행과 배포는 Vercel Git Integration을 우선하고, GitHub Actions는 test/lint/build와 coverage report만 담당합니다.
- 로컬 `next start` 실행은 fallback으로 유지합니다.
- 데이터는 `DATABASE_URL`이 있으면 Neon Postgres를 사용하고, 없으면 Next.js route handler와 fixture/memory store로 동작합니다.
- 시연 전에는 CLI 또는 `/admin` direct route에서 현재 seed 제품, board, contest 상태로 reset할 수 있게 합니다.
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
- Vercel 발표용 배포 URL
- Neon Postgres 영속 저장과 seed reset 경로
- GitHub Actions 기반 test/lint/build와 coverage report
- fallback localhost 실행 경로

## 로컬 실행

MVP 앱은 `apps/web/`의 Next.js App Router 앱으로 구현합니다. Vercel 배포 전후에도 발표 fallback은 production build 후 localhost에서 실행하는 방식을 유지합니다.

```bash
npm install
npm run test:run -w apps/web
npm run build -w apps/web
npm run start -w apps/web -- --port 3000
```

Neon Postgres를 사용할 때는 `apps/web/.env.local` 또는 Vercel 환경 변수에 `DATABASE_URL`을 설정한 뒤 seed reset을 실행합니다.

```bash
npm run db:reset -w apps/web
```

Coverage report는 아래 명령으로 생성합니다. Coverage는 MVP 단계에서 품질 진단용으로만 사용하며 merge 차단 threshold는 두지 않습니다.

```bash
npm run test:coverage -w apps/web
```

UI smoke 검증은 별도 터미널에서 앱을 실행한 뒤 아래 명령으로 수행합니다.

```bash
npm run smoke:ui -w apps/web
```

개발 중 빠른 확인에는 `npm run dev -w apps/web -- --port 3000`을 사용할 수 있지만, 발표 fallback 검증은 `build`와 `start` 기준으로 기록합니다.

## Plugin 설치 및 제품 등록

사용자는 GitHub repo `kimxogus/kick`를 plugin source로 추가한 뒤 `kick` plugin을 설치합니다.

Codex:

```bash
codex plugin marketplace add kimxogus/kick
codex plugin add kick@kick
```

Claude Code:

```text
/plugin marketplace add kimxogus/kick
/plugin install kick@kick
/reload-plugins
```

Claude Code catalog는 repo-relative source(`./plugins/kick`)를 사용하므로 GitHub repo 방식으로 추가합니다. raw `marketplace.json` URL 방식은 plugin 파일 위치를 해석하지 못할 수 있어 지원하지 않습니다.

제품을 등록할 때는 agent에게 아래처럼 요청합니다. Claude Code에서는 `/kick:kick`로 plugin skill을 직접 실행할 수도 있습니다.

```text
kick 스킬을 참고해서 내 제품 올려줘
```

Plugin은 저장소 문서를 읽어 제품 소개, 카테고리, 카드뉴스 문구, 타겟별 메시지를 만들고 공식 서비스에 등록합니다.

repo-local 개발자는 기존처럼 `skills/kick/` 원본과 `.agents/skills/kick`, `.claude/skills/kick` symlink를 사용합니다. 배포용 plugin 복사본은 `plugins/kick/`에 있으며 아래 명령으로 동기화와 검증을 수행합니다.

```bash
npm run plugin:sync:kick
npm run plugin:check:kick
```

Plugin 변경을 배포할 때는 `plugins/kick/.codex-plugin/plugin.json`, `plugins/kick/.claude-plugin/plugin.json`의 `version`과 `plugins/kick/CHANGELOG.md`를 함께 갱신합니다. Claude Code catalog entry에는 별도 `version`을 두지 않아 manifest version과 충돌하지 않게 합니다.

```bash
curl -s -X POST https://kick-web-ebon.vercel.app/api/products \
  -H 'content-type: application/json' \
  -d '{
    "name": "DemoFlow",
    "emoji": "🚀",
    "category": "생산성",
    "tagline": "시연 준비를 한 흐름으로 정리하는 도구",
    "description": "DemoFlow는 제품 시연을 준비하는 팀이 핵심 메시지와 체크리스트를 한곳에서 정리하도록 돕습니다.",
    "kickPoint": "흩어진 시연 준비를 한 페이지로 모아 바로 공유합니다.",
    "tags": ["AI", "Productivity"],
    "targetUsers": ["초기 제품팀"],
    "useCases": ["데모 스크립트 정리"],
    "cardNewsCopy": ["시연 흐름을 한눈에", "체크리스트로 누락 없이", "팀과 바로 공유"],
    "targetMessages": [
      { "audience": "초기 제품팀", "message": "시연 전 핵심 메시지를 빠르게 맞춥니다." }
    ],
    "maker": { "name": "Demo Team" }
  }'
```

응답의 `detailUrl`이 `/products/<slug>`이면 최종 상세 페이지는 `https://kick-web-ebon.vercel.app/products/<slug>`입니다. 공식 URL에 실제 테스트 제품을 등록하면 배포 DB에 데이터가 남을 수 있으므로, 개발 검증은 자동화 테스트와 로컬 환경에서 수행합니다.

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
- [docs/deployment/vercel.md](docs/deployment/vercel.md): Vercel Git Integration, Neon 환경 변수, GitHub Actions CI 운영 방식
- [skills/README.md](skills/README.md): Codex/Claude 공용 Skill 관리 방식

## 개발 원칙

- 문서와 ADR로 요구사항/설계를 먼저 고정한 뒤 구현합니다.
- 구현은 TDD flow를 따릅니다.
- Codex와 Claude Code를 모두 지원하되, 충돌 시 Codex 및 [AGENTS.md](AGENTS.md)를 우선합니다.
- 모든 프로젝트 문서와 작업 요약은 한국어로 작성합니다.
