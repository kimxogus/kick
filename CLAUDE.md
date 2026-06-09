# CLAUDE.md

@AGENTS.md

## Claude Code 보충 규칙

- 이 프로젝트의 공통 규칙은 `AGENTS.md`가 단일 기준이다.
- Claude Code 전용 설정은 `.claude/settings.json`에 둔다.
- Claude Code project skill은 `.claude/skills/`에서 발견되지만, 실제 원본은 `skills/`에 두고 symlink로 연결한다.
- 로컬 개인 지침은 `CLAUDE.local.md`에만 작성하고 git에는 포함하지 않는다.
- 충돌이 있으면 `AGENTS.md`와 Codex 기준을 우선한다.
