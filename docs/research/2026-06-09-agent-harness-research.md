# 2026-06-09 Agent Harness 리서치

## 목적

Codex와 Claude Code를 함께 지원하는 프로젝트 구조, 지침 파일, Skill, MCP 설정 방식을 확인했다.

## 확인한 공식 문서

- OpenAI Codex best practices: `AGENTS.md`, MCP, Skill을 반복 작업과 durable guidance에 사용하도록 권장한다.
- Codex AGENTS.md: Codex는 repo root부터 현재 작업 디렉터리까지 `AGENTS.md`를 읽는다.
- Codex Skills: repo skill은 `.agents/skills`에서 발견되며, symlink된 skill folder를 지원한다.
- Codex MCP: project `.codex/config.toml`에서 MCP 서버 설정을 둘 수 있다.
- Claude Code memory: Claude Code는 `CLAUDE.md`를 사용하며 `@path` import를 지원한다.
- Claude Code skills: project skill은 `.claude/skills/<skill-name>/SKILL.md`에서 발견된다.
- Claude Code MCP: project MCP는 `.mcp.json` 또는 설정 명령을 통해 관리할 수 있다.
- Agent Skills spec: `SKILL.md` frontmatter와 progressive disclosure 구조를 따른다.

## 구조 결정 근거

- 공통 지침은 `AGENTS.md`가 가장 적합하다.
- Claude Code는 `CLAUDE.md`에서 `@AGENTS.md`를 import해 중복을 줄인다.
- 실제 Skill은 문서가 아니라 실행 가능한 에이전트 확장 자산이므로 root `skills/`에 둔다.
- Codex와 Claude Code discovery 경로는 symlink로 연결해 SSOT를 유지한다.
- MCP 서버 구현 전에는 설정 파일을 inert 상태로 유지하고 tool 계약만 문서화한다.

## 후속 검증

- `product-kick` Skill이 Codex와 Claude Code 양쪽에서 표시되는지 확인한다.
- 실제 MCP 서버를 만들기 전 `docs/agent-harness/mcp-contract.md`를 팀과 검토한다.
