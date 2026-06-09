# k-producthunt

`k-producthunt`는 사내 1주 MVP 시연을 목표로 시작한 가제 프로젝트입니다.
AI로 제품을 만드는 사람은 빠르게 늘고 있지만, 제품의 강점과 홍보 포인트를 정리해 공개하는 일은 여전히 어렵습니다. 이 프로젝트는 제품 제작자가 자신의 제품을 쉽게 등록하고, 사용자에게 설득력 있게 소개하며, 주간 투표를 통해 초기 반응을 얻을 수 있는 가벼운 런칭 플랫폼을 지향합니다.

## 현재 상태

- 프로젝트명은 확정되지 않았고 `k-producthunt`는 임시 이름입니다.
- 문서와 의사결정 기록을 먼저 세우는 초기 단계입니다.
- backend, frontend, DB, 배포 스택은 아직 확정하지 않았습니다.
- 모든 문서는 팀 논의를 통해 계속 갱신되는 draft입니다.

## MVP 방향

선순위 기능:

- Weekly vote
- Search
- 제품 등록과 소개글 작성 지원

후순위 기능:

- Ranking
- 공개 contest
- 기업/단체/해커톤 전용 contest
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
