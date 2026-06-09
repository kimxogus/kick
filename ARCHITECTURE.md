# ARCHITECTURE.md

## 아키텍처 원칙

- 1주 MVP를 위해 단순한 구조를 우선한다.
- 무료 또는 저비용 배포를 우선한다.
- 문서와 ADR로 확정되지 않은 기술 선택은 구현하지 않는다.
- Codex와 Claude Code가 같은 문서와 Skill 원본을 참조해야 한다.
- MCP는 v1에서 계약을 먼저 문서화하고 실제 서버 구현은 별도 ADR 이후 진행한다.

## 후보 프로젝트 구조

```text
k-producthunt/
├── apps/
│   ├── web/          # frontend/backend 통합 웹 앱 후보
│   └── mcp-server/   # 제품 등록 보조 MCP 서버 후보
├── packages/
│   ├── domain/       # 제품, 투표, 검색, contest 도메인 로직 후보
│   └── db/           # schema, migration, seed 후보
├── docs/
├── skills/
├── .agents/
├── .claude/
└── .codex/
```

이 구조는 후보이며 실제 앱 스택 ADR이 `Accepted`가 되기 전까지 생성하지 않는다.

## 핵심 도메인 후보

- Product: 공개할 제품
- Maker: 제품 제작자 또는 팀
- Launch: 특정 주차 또는 contest에 제출된 제품
- Vote: 사용자의 주간 투표
- Tag: 검색과 분류를 위한 태그
- Contest: 공개/비공개 행사 단위 경쟁
- KickDraft: AI가 생성한 홍보 문구 초안

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

launches
- id
- product_id
- week_start_date
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
```

인증 정책과 contest 범위가 확정되기 전까지 실제 schema로 고정하지 않는다.

## 기술 스택 후보

- Vercel + Supabase
- Vercel + Neon
- Cloudflare Pages/Workers + D1

스택 선택은 [docs/adr/0003-application-stack-selection.md](docs/adr/0003-application-stack-selection.md)에서 관리한다.

## Agent Harness 구조

- `AGENTS.md`: Codex 우선 repo instructions
- `CLAUDE.md`: Claude Code가 `AGENTS.md`를 import하는 진입점
- `skills/`: Codex/Claude 공용 Skill 원본
- `.agents/skills/`: Codex discovery symlink
- `.claude/skills/`: Claude Code discovery symlink
- `.codex/config.toml`: Codex project config 후보
- `.mcp.json`: Claude project MCP config 후보

## 주요 미결정

- [ ] 앱 스택 ADR 확정
- [ ] Auth 정책 ADR 작성
- [ ] Weekly vote 정책 ADR 작성
- [ ] Search 구현 방식 ADR 작성
- [ ] MCP 서버 공개 범위 ADR 작성
- [ ] 결제/후원 포함 여부 ADR 작성
