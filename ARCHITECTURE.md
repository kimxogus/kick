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
│   ├── web/          # frontend/backend 통합 웹 앱 후보
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

이 구조는 후보이며 실제 앱 프레임워크와 Sites 호환 빌드 방식이 정해지기 전까지 생성하지 않는다.

## MVP 시스템 경계

### 포함

- 탐색자용 Weekly board, 검색/필터, Product 소개 페이지, vote, newsletter UI
- 제작자용 제품 분석, 타겟 분석, 셀링 포인트, 피드백, 홍보 산출물 생성
- kick 등록 payload 준비 또는 제출 후보
- 실제 서비스 기반 seed 데이터

### 제외

- 운영자 큐레이션 화면
- AI Slop 자동 필터링 백엔드
- 관리자 승인/검수 워크플로
- 실제 newsletter 발송
- 결제/후원

## 핵심 도메인 후보

- Product: 공개할 제품
- Maker: 제품 제작자 또는 팀
- Board: 제품을 기간 단위로 모아 보여주는 탐색 단위
- Launch: 특정 board 또는 contest에 제출된 제품 노출 단위
- Vote: 사용자의 투표
- Tag: 검색과 분류를 위한 태그
- Contest: 공개/비공개 행사 단위 경쟁, 제품 표현은 kick contest
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

인증 정책, 투표 정책, contest 범위, 앱 프레임워크가 확정되기 전까지 실제 schema로 고정하지 않는다.

## MVP 실행 및 배포 전략

MVP 실행과 배포는 [docs/adr/0003-application-stack-selection.md](docs/adr/0003-application-stack-selection.md)에서 확정한 대로 2-track으로 관리한다.

1. OpenAI Codex Sites 우선
   - Sites saved version을 먼저 만들고 검토한다.
   - 가능하면 승인된 saved version을 발표용 URL로 deploy한다.
   - 앱 구현은 Sites가 요구하는 Cloudflare Worker-compatible ES module output을 만들 수 있는 구조를 우선 고려한다.
   - 간단한 backend/API는 Worker-compatible 범위로 제한하고, 상시 실행 Node 서버를 전제로 설계하지 않는다.
2. 로컬 fallback 필수
   - Sites 접근, 권한, plugin, preview 정책, deploy 실패가 발생하면 정적 파일 로컬 실행 또는 localhost 실행으로 시연한다.
   - fallback 실행 명령은 앱 구현 단계에서 README 또는 별도 실행 문서에 기록한다.

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

- seed 데이터와 임시 presentation state에는 D1/R2를 요청하지 않는다.
- 제품 데이터가 방문 사이에 유지되어야 하면 D1을 검토한다.
- 이미지, 문서, 영상 업로드가 필요하면 R2를 검토한다.
- 업로드 파일과 검색 가능한 metadata가 모두 필요하면 D1과 R2를 함께 검토한다.

### 앱 프레임워크 평가 기준

- 1주 내 앱 스캐폴딩과 Sites 호환 빌드가 가능한가
- Sites 실패 시 정적 파일 또는 localhost로 시연 가능한가
- Product 소개 페이지와 Weekly board UI를 빠르게 만들 수 있는가
- seed 데이터 기반 콘텐츠 노출이 쉬운가
- 제작자용 MCP/Skill 데모와 충돌하지 않는가
- 백엔드 로직을 최소화하고 필요한 API만 둘 수 있는가
- 발표 전 시간이 남으면 Skill 출력 payload를 backend 입력으로 재사용할 수 있는가

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
- [ ] 앱 프레임워크와 Sites 호환 빌드 방식 결정
- [ ] Codex Sites plugin 접근과 workspace 권한 확인
- [ ] fallback 정적 파일 또는 localhost 실행 명령 문서화
- [ ] Auth 정책 ADR 작성
- [ ] Weekly vote 정책 ADR 작성
- [ ] Search 구현 방식 ADR 작성
- [ ] 제작자 런칭 보조 MCP 범위 ADR 확정
- [ ] Skill 이름 변경 여부 결정
- [ ] kick contest 데이터 모델 포함 여부 결정
- [ ] 운영자 큐레이션 백엔드와 AI Slop 필터링 ADR 작성
- [ ] 결제/후원 포함 여부 ADR 작성
