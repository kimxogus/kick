# Agent Harness

이 디렉터리는 Codex, Claude Code, MCP를 함께 운영하기 위한 설명 문서를 둔다. 실제 Skill 원본은 root `skills/`에서 관리한다.

## 파일 위치 매트릭스

| 목적 | Codex | Claude Code | SSOT |
| --- | --- | --- | --- |
| 공통 지침 | `AGENTS.md` | `CLAUDE.md`가 `@AGENTS.md` import | `AGENTS.md` |
| Skill 원본 | `.agents/skills/*` symlink | `.claude/skills/*` symlink | `skills/*` |
| MCP 설정 | `.codex/config.toml` | `.mcp.json` | 실제 서버 구현 ADR 이후 결정 |
| 로컬 개인 설정 | 사용자 로컬 config | `CLAUDE.local.md`, `.claude/settings.local.json` | git 제외 |

## 운영 원칙

- `skills/`를 원본으로 관리한다.
- `.agents/skills`와 `.claude/skills`는 discovery 경로이며 직접 편집하지 않는다.
- 실제 MCP 서버가 생기기 전까지 `.codex/config.toml`과 `.mcp.json`은 빈 설정 또는 주석만 유지한다.
- MCP tool은 구현 전에 `mcp-contract.md`와 ADR로 입출력, 권한, 실패 모드를 정한다.

## 새 Skill 추가 절차

1. `skills/<skill-name>/SKILL.md`를 작성한다.
2. 필요한 참고자료는 `skills/<skill-name>/references/`에 둔다.
3. `.agents/skills/<skill-name>` symlink를 만든다.
4. `.claude/skills/<skill-name>` symlink를 만든다.
5. `skills/README.md`의 검증 명령을 실행한다.
6. Skill이 제품/기술 결정에 영향을 주면 ADR 또는 TODO를 갱신한다.
