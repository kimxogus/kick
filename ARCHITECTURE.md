# ARCHITECTURE.md

## 아키텍처 원칙

- 1주 MVP를 위해 단순한 구조를 우선한다.
- Vercel 배포와 Neon Postgres 영속화를 1순위로 고려하되, 로컬 fallback을 반드시 유지한다.
- 무료 또는 저비용 실행/배포를 우선한다.
- 백엔드 로직은 최소화하고 UI와 제작자용 MCP/Skill 완성도를 우선한다.
- 문서와 ADR로 확정되지 않은 기술 선택은 구현하지 않는다.
- Codex와 Claude Code가 같은 문서와 Skill 원본을 참조해야 한다.
- MCP는 v1에서 계약을 먼저 문서화하고 실제 서버 구현은 별도 ADR 이후 진행한다.
- 운영자 큐레이션 백엔드는 실제 서비스 확장에 필요하지만 MVP 시연 범위에서는 제외한다.

## 후보 프로젝트 구조

```text
k-producthunt/
├── apps/
│   ├── web/          # Next.js App Router 기반 MVP 앱
│   └── mcp-server/   # 제작자 런칭 보조 MCP 서버 후보
├── packages/
│   ├── domain/       # 제품, 보드, 투표, 검색, contest 도메인 로직 후보
│   └── db/           # schema, migration, seed 후보
├── docs/
├── skills/
├── .agents/
├── .claude/
├── .openai/         # Codex Sites hosting linkage 후보
└── .codex/
```

Next.js 앱은 `apps/web/`에 생성한다. MCP 서버는 MVP 앱 구현 이후 별도 ADR로 확정하기 전까지 후보로만 둔다.

## MVP 시스템 경계

### 포함

- 탐색자용 Home 허브(`/`), Weeklyboard(`/week`), 제품 탐색/검색(`/products`), Product 소개 페이지(`/products/[slug]`), vote, newsletter UI
- 공개 contest 읽기 전용 목록(`/contest`)
- 제작자용 제품 분석, 타겟 분석, 셀링 포인트, 피드백, 홍보 산출물 생성 (Skill/MCP가 수행하며 별도 web 등록/제출 화면은 두지 않는다)
- 실제 서비스 기반 초기 콘텐츠
- 발표용 seed reset(`/admin`, direct URL 전용)
- main 샘플 HTML에서 검증한 제품/contest 콘텐츠를 사용자용 fixture로 정리한 초기 콘텐츠

### 제외

- 운영자 큐레이션 화면
- AI Slop 자동 필터링 백엔드
- 관리자 승인/검수 워크플로
- contest 생성/상금 등록/결제/운영 기능
- 실제 newsletter 발송
- 결제/후원

## 핵심 도메인 후보

- Product: 공개할 제품
- Maker: 제품 제작자 또는 팀
- Board: 제품을 기간 단위로 모아 보여주는 탐색 단위
- Launch: 특정 board 또는 contest에 제출된 제품 노출 단위
- Vote: 사용자의 투표
- Tag: 검색과 분류를 위한 태그
- Contest: 공개/비공개 행사 단위 경쟁. MVP에서는 읽기 전용 read model만 사용한다.
- PromotionDraft: AI가 생성한 소개글, 카드뉴스 문구, 홍보 카피 초안
- NewsletterSubscription: newsletter UI를 통해 수집하는 구독 의사
- SeedProduct: MVP 시연을 위해 준비한 실제 서비스 기반 초기 콘텐츠

## 데이터 모델 후보

```text
products
- id
- name
- tagline
- description
- website_url
- demo_url
- thumbnail_url
- status
- created_at
- updated_at

makers
- id
- name
- profile_url
- created_at

boards
- id
- period        # weekly 우선, daily/monthly/yearly 확장 후보
- starts_on
- ends_on
- title
- created_at

launches
- id
- product_id
- board_id
- contest_id
- created_at

votes
- id
- launch_id
- voter_id
- created_at

tags
- id
- name

product_tags
- product_id
- tag_id

contests
- id
- slug
- title
- host
- description
- status
- starts_on
- ends_on
- launch_ids
- created_at

promotion_drafts
- id
- product_id
- target_users
- selling_points
- feedback
- launch_page_copy
- card_news_copy
- channel_copy
- submission_payload
- created_at

newsletter_subscriptions
- id
- email
- source
- created_at
```

MVP 구현 계약은 [docs/contracts/mvp-data-and-api-contract.md](docs/contracts/mvp-data-and-api-contract.md)를 기준으로 한다. contest 생성/운영 범위와 장기 DB schema는 후속 ADR 전까지 고정하지 않는다.

## MVP 실행 및 배포 전략

MVP 실행과 배포는 [docs/adr/0007-vercel-neon-postgres-persistence.md](docs/adr/0007-vercel-neon-postgres-persistence.md)에서 확정한 대로 Vercel + Neon Postgres를 기본 경로로 관리한다. 구체적인 Dashboard 설정과 CI 운영 방식은 [docs/deployment/vercel.md](docs/deployment/vercel.md)를 따른다.

1. Vercel 우선
   - Next.js App Router 앱을 Vercel Git Integration으로 배포해 발표용 URL을 확보한다.
   - Vercel 프로젝트 Root Directory는 `apps/web`, Framework Preset은 `Next.js`, Production Branch는 `main`으로 둔다.
   - `DATABASE_URL`은 Vercel 환경 변수로 관리하고 secret 값은 커밋하지 않는다.
   - Vercel Marketplace Neon integration 또는 수동 환경 변수 연결 중 하나를 사용할 수 있다.
   - GitHub Actions는 production deploy를 수행하지 않고 test/lint/build와 coverage report만 담당한다.
2. Neon Postgres 우선
   - 제품, board, launch, contest seed와 vote, newsletter, 제작자 제출 후보를 Postgres에 저장한다.
   - `npm run db:reset -w apps/web` 또는 `/admin` direct route로 현재 seed 상태를 복원한다.
   - `DATABASE_URL`이 없으면 memory store로 동작해 로컬 개발과 테스트를 유지한다.
3. 로컬 fallback 필수
   - Vercel 또는 Neon 설정이 막히면 localhost 실행으로 시연한다.
   - fallback 실행 명령은 `README.md`의 로컬 실행 섹션에 기록한다.

### Storage 선택 원칙

- 제품과 contest의 초기 콘텐츠는 repo seed를 source of truth로 두고 reset 시 DB에 반영한다.
- 이미지 파일은 현재 `public/seed` 정적 자산을 사용하며 업로드 저장소는 도입하지 않는다.
- 업로드 파일, 생성 이미지, 영상 저장이 필요해지면 별도 Storage ADR을 작성한다.
- `/admin`은 사용자 화면에 링크하지 않고 direct URL로만 접근한다.
- `/admin` reset은 MVP 편의성 때문에 보호하지 않으며, 외부 공유 시 누구나 초기화할 수 있는 리스크를 수용한다.

### MVP 앱 구조

- `apps/web/src/app/`: Next.js App Router 화면과 API route
- `apps/web/src/app/api/`: route handler 기반 MVP backend/API
- `apps/web/src/server/`: seed fixture, memory/Postgres 저장소, 제품/board/vote/newsletter/제작자 등록/contest 서비스 로직
- `apps/web/src/components/`: UI 컴포넌트
- `apps/web/src/lib/`: local viewer ID와 제출 preview 저장 등 클라이언트 유틸리티
- `apps/web/src/test/`: Vitest 테스트 setup
- `apps/web/tests/`: Playwright 기반 UI smoke 검증

UI 구현 계약은 [docs/contracts/mvp-ui-contract.md](docs/contracts/mvp-ui-contract.md)를 기준으로 한다.

## Agent Harness 구조

- `AGENTS.md`: Codex 우선 repo instructions
- `CLAUDE.md`: Claude Code가 `AGENTS.md`를 import하는 진입점
- `skills/`: Codex/Claude 공용 Skill 원본
- `.agents/skills/`: Codex discovery symlink
- `.claude/skills/`: Claude Code discovery symlink
- `.codex/config.toml`: Codex project config 후보
- `.mcp.json`: Claude project MCP config 후보

## 주요 미결정

- [x] MVP 실행/배포 전략 ADR 확정
- [x] 앱 프레임워크 결정: Next.js App Router
- [x] Codex Sites plugin 접근과 workspace 권한 확인
- [x] Vercel + Neon Postgres 영속화 결정
- [x] fallback localhost 실행 명령 문서화
- [x] Vercel Git Integration과 GitHub Actions CI 역할 분리 결정
- [x] MVP Auth 정책: local `viewer_id`
- [x] MVP Weekly vote 정책: viewer/launch toggle
- [x] MVP Search 구현 방식: 초기 콘텐츠 필터링
- [x] MVP contest 범위: 읽기 전용 read model과 사용자 화면
- [ ] 제작자 런칭 보조 MCP 범위 ADR 확정
- [ ] Skill 이름 변경 여부 결정
- [ ] 운영자 큐레이션 백엔드와 AI Slop 필터링 ADR 작성
- [ ] 결제/후원 포함 여부 ADR 작성
