# docs

이 디렉터리는 프로젝트 요구사항, 설계, 의사결정, 리서치 근거를 관리한다.

## 문서 맵

- `../SPEC.md`: 제품 요구사항과 미결정 사항
- `../ARCHITECTURE.md`: 시스템 구조와 기술 후보
- `../TODO.md`: 실행 TODO
- `../ROADMAP.md`: 로드맵 템플릿
- `adr/`: 주요 의사결정 기록
- `research/`: 공식 문서와 외부 리서치 요약
- `agent-harness/`: Codex, Claude Code, MCP 운영 문서

## 갱신 규칙

- 요구사항이 바뀌면 `SPEC.md`를 먼저 갱신한다.
- 시스템 구조, 데이터 모델, 배포, Auth, MCP 설계가 바뀌면 `ARCHITECTURE.md`와 관련 ADR을 먼저 갱신한다.
- 구현 TODO가 생기거나 완료되면 `TODO.md`를 갱신한다.
- 주요 결정의 배경과 트레이드오프는 `docs/adr/`에 기록한다.
- 공식 문서 리서치 결과는 `docs/research/`에 날짜별로 보존한다.

## 구현 전 체크

- [ ] 변경할 요구사항이 `SPEC.md`에 반영되어 있는가?
- [ ] 변경할 설계가 `ARCHITECTURE.md`에 반영되어 있는가?
- [ ] ADR이 필요한 결정인가?
- [ ] 구현 순서가 TDD flow를 따르는가?
- [ ] 관련 TODO가 생성 또는 갱신되었는가?
