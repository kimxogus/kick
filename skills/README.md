# skills

이 디렉터리는 Codex와 Claude Code가 함께 사용하는 repo-local Skill 원본을 관리한다.

## 구조

```text
skills/
└── kick/
    ├── SKILL.md
    └── references/
        └── product-registration-workflow.md
```

Discovery 경로는 symlink로 연결한다.

```text
.agents/skills/kick -> ../../skills/kick
.claude/skills/kick -> ../../skills/kick
```

## 규칙

- `skills/` 아래 파일을 원본으로 편집한다.
- `.agents/skills/`와 `.claude/skills/` 아래 symlink 대상은 직접 편집하지 않는다.
- Skill 이름은 lowercase, 숫자, hyphen만 사용한다.
- `SKILL.md`에는 `name`과 `description`을 포함한다.
- 긴 절차와 참고자료는 `references/`에 둔다.
- 필요한 스크립트가 생기면 `scripts/`에 두고 실행 방법과 검증 방법을 `SKILL.md`에 명시한다.

## 검증

```bash
test -L .agents/skills/kick
test -f .agents/skills/kick/SKILL.md
test -L .claude/skills/kick
test -f .claude/skills/kick/SKILL.md
readlink .agents/skills/kick
readlink .claude/skills/kick
```

기대값:

```text
../../skills/kick
../../skills/kick
```

## 새 Skill 추가 절차

1. `skills/<skill-name>/SKILL.md`를 작성한다.
2. 참고자료가 필요하면 `skills/<skill-name>/references/`에 둔다.
3. `.agents/skills/<skill-name>` symlink를 만든다.
4. `.claude/skills/<skill-name>` symlink를 만든다.
5. `AGENTS.md`, `docs/agent-harness/README.md`, `TODO.md`를 필요에 따라 갱신한다.
