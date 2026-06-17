# AGENTS.md

## 기본 언어

- 기본 대화, 작업 요약, 리뷰 코멘트, PR 제목, PR 본문은 한국어로 작성한다.
- Markdown 문서, 신규 코드 주석, docstring은 한국어로 작성한다.
- 코드 식별자, API 필드명, CLI 옵션, 파일 경로, 로그, 에러 메시지, 외부 고유명사는 원문을 유지한다.
- 기존 파일 또는 외부 도구 관례가 특정 언어를 요구하면 그 관례를 따른다.

## 우선순위

- Codex와 Claude Code 규칙이 충돌하면 Codex와 이 파일을 우선한다.
- Claude Code는 `CLAUDE.md`에서 이 파일을 import한다.
- 프로젝트 문서가 구현보다 우선한다. 요구사항이나 설계가 바뀌면 먼저 문서를 갱신한다.

## 문서 구조

- `README.md`: 사용자용 plugin 설치와 제품 등록 빠른 시작
- `DEVELOPMENT.md`: 개발자용 로컬 실행, 검증, 문서 운영 가이드
- `SPEC.md`: 제품 요구사항, 성공 기준, 미결정 사항
- `ARCHITECTURE.md`: 시스템 구조, 기술 후보, 데이터 모델 후보
- `TODO.md`: 기획/기술/문서/구현 TODO
- `ROADMAP.md`: Now/Next/Later 로드맵 템플릿
- `docs/README.md`: 문서 맵과 갱신 규칙
- `docs/adr/`: 주요 의사결정 기록
- `docs/research/`: 외부 문서 리서치와 근거
- `docs/agent-harness/`: Codex/Claude/MCP 운영 문서
- `skills/`: Codex/Claude 공용 Skill 원본

## 문서 우선 개발

- 주요 요구사항, 아키텍처, API, DB, 배포, 인증, 권한, 결제, agent harness 변경은 구현 전에 관련 문서를 갱신한다.
- 고영향 결정은 `docs/adr/`에 ADR로 기록한다.
- ADR이 필요한데 없는 경우 구현보다 ADR 초안을 먼저 작성한다.
- 문서 변경과 구현 변경이 같은 작업에 포함되면 문서 변경을 먼저 커밋 가능한 단위로 만든다.

## TDD flow

구현 작업은 아래 순서를 따른다.

1. 실패하는 테스트 또는 명시적 검증 시나리오를 먼저 작성한다.
2. 최소 구현으로 테스트를 통과시킨다.
3. 회귀 테스트, lint, typecheck, build 등 관련 검증을 실행한다.
4. 문서와 구현이 일치하는지 확인한다.

문서 스캐폴딩처럼 자동 테스트가 없는 작업은 검증 명령과 체크리스트를 명시하고 실행한다.

## ADR 규칙

- ADR 파일명은 `docs/adr/NNNN-kebab-case-title.md` 형식을 사용한다.
- 상태값은 `Proposed`, `Accepted`, `Superseded`, `Rejected` 중 하나를 사용한다.
- 앱 스택, DB, 인증, 투표 정책, 결제, MCP 공개 방식, agent harness 구조는 ADR 대상이다.

## Skill 운영 규칙

- 실제 Skill 원본은 `skills/<skill-name>/`에 둔다.
- Codex discovery 경로는 `.agents/skills/<skill-name>` symlink를 사용한다.
- Claude Code discovery 경로는 `.claude/skills/<skill-name>` symlink를 사용한다.
- `.agent/skills`는 사용하지 않는다.
- Skill 본문은 간결하게 유지하고, 긴 절차나 참고자료는 `references/`에 둔다.
- Skill 변경 시 `skills/README.md`의 검증 명령을 실행한다.

## MCP 운영 규칙

- 실제 MCP 서버 구현 전에는 `.codex/config.toml`, `.mcp.json`을 inert 상태로 유지한다.
- MCP tool 이름, 입출력, 권한, 승인 정책은 구현 전에 `docs/agent-harness/mcp-contract.md`와 ADR로 고정한다.
- 민감한 쓰기 작업이나 외부 전송이 있는 tool은 승인 흐름을 기본값으로 둔다.

## 검색과 리서치

- 코드 의미 검색은 우선 `semble search`를 사용한다.
- 정확한 문자열 확인이나 검증에는 `rg`를 사용한다.
- OpenAI/Codex 관련 최신 정보는 공식 OpenAI 문서 또는 Codex 매뉴얼을 우선한다.
- Claude Code 관련 최신 정보는 공식 Claude Code 문서를 우선한다.

## 완료 기준

- 요청된 파일이 생성 또는 갱신되어야 한다.
- 관련 ADR/TODO가 누락되지 않아야 한다.
- 검증 명령을 실행하고 결과를 확인해야 한다.
- 실패하거나 실행하지 못한 검증은 최종 응답에 명시해야 한다.
