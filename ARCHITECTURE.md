# ARCHITECTURE.md

## 아키텍처 원칙

- 1주 MVP를 위해 단순한 구조를 우선한다.
- OpenAI Codex Sites 배포를 1순위로 고려하되, 로컬 fallback을 반드시 유지한다.
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

- 탐색자용 Weekly board, 검색/필터, Product 소개 페이지, vote, newsletter UI
- 공개 contest 읽기 전용 목록
- 제작자용 제품 분석, 타겟 분석, 셀링 포인트, 피드백, 홍보 산출물 생성
- kick 등록 후보 저장과 preview
- 실제 서비스 기반 초기 콘텐츠
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

MVP 실행과 배포는 [docs/adr/0003-application-stack-selection.md](docs/adr/0003-application-stack-selection.md)에서 확정한 대로 2-track으로 관리한다.

1. OpenAI Codex Sites 우선
   - Sites saved version을 먼저 만들고 검토한다.
   - 가능하면 승인된 saved version을 발표용 URL로 deploy한다.
   - 앱 구현은 Sites가 요구하는 Cloudflare Worker-compatible ES module output을 만들 수 있는 구조를 우선 고려한다.
   - 간단한 backend/API는 Worker-compatible 범위로 제한하고, 상시 실행 Node 서버를 전제로 설계하지 않는다.
2. 로컬 fallback 필수
   - Sites 접근, 권한, plugin, preview 정책, deploy 실패가 발생하면 정적 파일 로컬 실행 또는 localhost 실행으로 시연한다.
   - fallback 실행 명령은 `README.md`의 로컬 실행 섹션에 기록한다.

### Codex Sites 운영 원칙

- `.openai/hosting.json`은 Sites project linkage와 D1/R2 binding 이름만 저장한다.
- secret 값은 `.openai/hosting.json`에 저장하지 않는다.
- hosted environment value와 secret은 Sites panel에서 관리한다.
- local 개발에 필요한 key 이름은 `.env.example`에 기록하되 secret 값은 커밋하지 않는다.
- 새 Sites 배포는 기본적으로 `admins_only` 또는 제한된 접근으로 검토한다.
- 발표 공유가 필요할 때만 `workspace_all` 또는 필요한 `custom` 접근으로 전환한다.
- deploy 전에는 source changes, build 결과, saved version, 접근 권한, secret 관리 상태를 확인한다.
- deploy 후에는 deployment status와 production URL을 확인한다.

### Storage 선택 원칙

- 초기 콘텐츠와 임시 presentation state에는 D1/R2를 요청하지 않는다.
- 제품 데이터가 방문 사이에 유지되어야 하면 D1을 검토한다.
- 이미지, 문서, 영상 업로드가 필요하면 R2를 검토한다.
- 업로드 파일과 검색 가능한 metadata가 모두 필요하면 D1과 R2를 함께 검토한다.
- MVP의 vote와 제출 후보는 메모리 상태를 사용하므로, board 화면은 static prerender가 아니라 dynamic render로 유지한다.
- Next.js production에서는 page와 API route의 메모리 인스턴스가 항상 같은 상태라고 전제하지 않는다. 따라서 board UI는 hydration 이후 `GET /api/boards/weekly`를 한 번 다시 읽어 route handler 상태와 맞춘다.

### MVP 앱 구조

- `apps/web/src/app/`: Next.js App Router 화면과 API route
- `apps/web/src/app/api/`: route handler 기반 MVP backend/API
- `apps/web/src/server/`: fixture, 메모리 저장소, 제품/board/vote/newsletter/제작자 등록/contest 서비스 로직
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
- [ ] Codex Sites plugin 접근과 workspace 권한 확인
- [x] fallback localhost 실행 명령 문서화
- [x] MVP Auth 정책: local `viewer_id`
- [x] MVP Weekly vote 정책: viewer/launch toggle
- [x] MVP Search 구현 방식: 초기 콘텐츠 필터링
- [x] MVP contest 범위: 읽기 전용 read model과 사용자 화면
- [ ] 제작자 런칭 보조 MCP 범위 ADR 확정
- [ ] Skill 이름 변경 여부 결정
- [ ] 운영자 큐레이션 백엔드와 AI Slop 필터링 ADR 작성
- [ ] 결제/후원 포함 여부 ADR 작성
