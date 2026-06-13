# kick

`kick`은 사내 1주 MVP 시연을 목표로 시작한 제품 런칭 플랫폼입니다.
AI로 제품을 만드는 사람은 빠르게 늘고 있지만, 제품의 강점과 홍보 포인트를 정리해 공개하는 일은 여전히 어렵습니다. kick은 제품 제작자가 자신의 제품을 쉽게 등록하고, 사용자에게 설득력 있게 소개하며, 주간 투표를 통해 초기 반응을 얻을 수 있게 돕습니다.

## 현재 상태

- 서비스명은 `kick`으로 확정했습니다.
- 저장소명 `k-producthunt`는 초기 가제와 코드명으로만 남아 있습니다.
- 문서와 의사결정 기록을 먼저 세우는 초기 단계입니다.
- backend, frontend, DB, 배포 스택은 아직 확정하지 않았습니다.
- 백엔드 로직은 최소화하고, UI 완성도와 제작자용 MCP/Skill 데모 완성도를 우선합니다.
- 모든 문서는 팀 논의를 통해 계속 갱신되는 draft입니다.

## MVP 방향

시연 플로우:

- 탐색자: Weekly board, 검색/필터, 제품 상세, vote, newsletter UI를 통해 정제된 제품을 발견합니다.
- 제작자: MCP/Skill을 통해 제품 분석, 타겟 분석, 셀링 포인트, 피드백, 런칭페이지/카드뉴스/홍보 카피 초안을 만들고 kick 등록까지 이어갑니다.

MVP 우선 기능:

- Product 소개 페이지
- Weekly board와 vote
- Search
- 제작자 런칭 보조 Skill/MCP
- Newsletter UI
- 실제 서비스 기반 seed 데이터

후순위 기능:

- Daily, Monthly, Yearly board
- kick contest
- 운영자 큐레이션 백엔드와 AI Slop 필터링
- 실제 newsletter 발송
- Fairy 스타일의 응원 결제 또는 후원 UX

## 주요 문서

- [SPEC.md](SPEC.md): 제품 요구사항과 미결정 사항
- [ARCHITECTURE.md](ARCHITECTURE.md): 시스템 구조와 기술 결정 후보
- [TODO.md](TODO.md): 논의와 구현 TODO
- [ROADMAP.md](ROADMAP.md): 로드맵 템플릿
- [docs/README.md](docs/README.md): 문서 구조와 갱신 규칙
- [docs/adr/README.md](docs/adr/README.md): ADR 관리 방식
- [skills/README.md](skills/README.md): Codex/Claude 공용 Skill 관리 방식

## 개발 원칙

- 문서와 ADR로 요구사항/설계를 먼저 고정한 뒤 구현합니다.
- 구현은 TDD flow를 따릅니다.
- Codex와 Claude Code를 모두 지원하되, 충돌 시 Codex 및 [AGENTS.md](AGENTS.md)를 우선합니다.
- 모든 프로젝트 문서와 작업 요약은 한국어로 작성합니다.
