# skills

이 디렉터리는 Codex와 Claude Code가 함께 사용하는 repo-local Skill 원본을 관리한다. 외부 사용자 배포용 plugin은 `plugins/`에서 관리한다.

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

## Plugin 배포

`kick` Skill의 배포용 plugin 복사본은 `plugins/kick/skills/kick/`에 둔다. 사용자는 GitHub repo `kimxogus/kick`를 plugin source로 추가해 설치한다.

```bash
codex plugin marketplace add kimxogus/kick
codex plugin add kick@kick
```

```text
/plugin marketplace add kimxogus/kick
/plugin install kick@kick
/reload-plugins
```

Claude Code catalog는 repo-relative source(`./plugins/kick`)를 사용하므로 GitHub repo 방식으로 추가한다. raw `marketplace.json` URL 방식은 지원하지 않는다.

원본을 수정한 뒤에는 배포 복사본 drift를 방지하기 위해 아래 명령을 실행한다.

```bash
npm run plugin:sync:kick
npm run plugin:check:kick
```

## 새 Skill 추가 절차

1. `skills/<skill-name>/SKILL.md`를 작성한다.
2. 참고자료가 필요하면 `skills/<skill-name>/references/`에 둔다.
3. `.agents/skills/<skill-name>` symlink를 만든다.
4. `.claude/skills/<skill-name>` symlink를 만든다.
5. `AGENTS.md`, `docs/agent-harness/README.md`, `TODO.md`를 필요에 따라 갱신한다.
