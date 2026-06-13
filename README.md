# 킥 (Kick)

**킥(Kick)**은 콘테스트 제출과 1주 MVP 시연을 목표로 하는 AI 제품 런칭 플랫폼입니다. (저장소 가제: `k-producthunt`)
AI로 제품을 만드는 사람은 빠르게 늘지만, 제품의 강점과 홍보 포인트를 정리해 공개하는 일은 여전히 어렵습니다. 킥은 제작자가 자신의 agent에게 "올려줘"라고 말하면 **Skill이 정보를 수집하고 런칭 페이지·카드뉴스·홍보 카피를 자동 생성**해 바로 등록하는, 마찰 없는 런칭 경험을 지향합니다.

## 현재 상태

- 서비스명은 **킥(Kick)**으로 확정. 저장소명 `k-producthunt`는 가제.
- 문서와 의사결정 기록을 먼저 세우는 초기 단계입니다.
- v1(콘테스트 데모): **Skill + local data**로 동작하며 백엔드/DB는 구현하지 않습니다.
- frontend, 배포 스택은 아직 확정하지 않았습니다.
- 모든 문서는 팀 논의를 통해 계속 갱신되는 draft입니다.

## MVP 방향

선순위 기능:

- 등록 (Skill로 product 업로드, 보장된 품질의 런칭 콘텐츠 생성)
- Weeklyboard (날짜별 노출 + 좋아요 무제한 → 주간 랭킹)
- 제품 목록/상세/검색, 댓글

후순위 기능:

- 서버 API + MCP 등록 경로
- Kick Newsletter (제작자 피드백 / 유저 큐레이션)
- 창작자 1:1 메시지, AI 큐레이션 필터링
- Kick Contest 결제/상금 송금 연동

## 주요 문서

- [SPEC.md](SPEC.md): 제품 요구사항과 미결정 사항
- [docs/pitch.md](docs/pitch.md): 콘테스트 피치·포지셔닝·심사 어필 전략
- [docs/pages.md](docs/pages.md): 데모 웹사이트 페이지 명세 (5페이지)
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
