# 0002. Codex 우선, Claude 호환 agent harness 채택

- 상태: Accepted
- 날짜: 2026-06-09
- 관련 문서: `AGENTS.md`, `CLAUDE.md`, `docs/agent-harness/README.md`, `skills/README.md`

## 맥락

이 프로젝트는 Codex와 Claude Code를 모두 개발환경으로 지원해야 한다. 두 도구는 지침 파일, Skill discovery 경로, MCP 설정 경로가 다르다.

같은 내용을 각 도구별 파일에 복제하면 빠르게 불일치가 생긴다. 반대로 한 도구만 지원하면 팀원의 사용 환경이 제한된다.

## 결정

공통 지침은 `AGENTS.md`를 기준으로 삼고, `CLAUDE.md`는 `@AGENTS.md`를 import하는 얇은 보충 파일로 둔다.

Skill 원본은 repo root의 `skills/`에만 작성한다. Codex와 Claude Code discovery 경로에는 symlink를 둔다.

```text
skills/product-kick/                 # 원본
.agents/skills/product-kick -> ../../skills/product-kick
.claude/skills/product-kick -> ../../skills/product-kick
```

Codex/Claude 충돌 시 Codex와 `AGENTS.md`를 우선한다.

## 고려한 선택지

- Codex만 지원: 단순하지만 팀 목표와 맞지 않는다.
- `.agents/skills`와 `.claude/skills`에 Skill을 각각 복제: discovery는 확실하지만 SSOT가 깨진다.
- `docs/` 아래에 Skill 원본을 둠: 문서와 실행성 자산의 경계가 흐려진다.
- root `skills/`를 SSOT로 두고 symlink 사용: 원본 관리가 명확하고 양쪽 discovery를 지원한다.

## 결과

- 공통 지침과 Skill 원본의 중복을 줄인다.
- `skills/`는 문서가 아닌 에이전트 확장 자산으로 관리한다.
- `.agents/skills`와 `.claude/skills`는 discovery 호환 경로로만 사용한다.
- symlink를 지원하지 않는 환경이 발견되면 해당 환경에는 얇은 wrapper 파일을 두는 후속 ADR을 작성한다.

## 후속 작업

- [ ] `product-kick` Skill을 실제 제품 등록 시나리오로 테스트한다.
- [ ] 새 Skill 추가 절차를 `skills/README.md`에 유지한다.
- [ ] MCP 서버 구현 전 tool 계약을 확정한다.
