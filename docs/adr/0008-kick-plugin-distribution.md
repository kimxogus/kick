# 0008. kick GitHub repo 기반 plugin 배포

- 상태: Accepted
- 날짜: 2026-06-17
- 관련 문서: `README.md`, `DEVELOPMENT.md`, `docs/agent-harness/README.md`, `skills/README.md`, `plugins/kick/README.md`

## 맥락

`kick` Skill은 repo 내부 개발 중에는 `skills/kick/` 원본과 `.agents/skills/kick`, `.claude/skills/kick` symlink로 사용한다. 이 방식은 local authoring과 repo-local discovery에는 적합하지만, 외부 사용자가 설치하기에는 각 도구의 plugin 설치 흐름과 맞지 않는다.

GitHub repository 이름은 `kimxogus/kick`로 확정되었다. 사용자 안내와 plugin catalog는 이 repo 이름을 기준으로 유지해야 한다.

## 결정

repo-local 개발 방식은 유지한다.

```text
skills/kick/
.agents/skills/kick -> ../../skills/kick
.claude/skills/kick -> ../../skills/kick
```

외부 사용자 배포는 `plugins/kick/` 단일 dual plugin으로 제공한다.

```text
plugins/kick/
├── .codex-plugin/plugin.json
├── .claude-plugin/plugin.json
└── skills/kick/
```

Codex catalog는 `.agents/plugins/marketplace.json`, Claude Code catalog는 `.claude-plugin/marketplace.json`에 둔다. 사용자는 GitHub repo를 plugin source로 추가한 뒤 `kick` plugin을 설치한다.

```bash
codex plugin marketplace add kimxogus/kick
codex plugin add kick@kick
```

```text
/plugin marketplace add kimxogus/kick
/plugin install kick@kick
/reload-plugins
```

Claude Code catalog의 plugin source는 `./plugins/kick` repo-relative path를 사용한다. 이 방식은 GitHub repo를 marketplace로 추가하는 흐름을 전제로 하며, raw `marketplace.json` URL 배포는 지원하지 않는다.

## 고려한 선택지

- symlink만 유지: repo 내부 개발에는 충분하지만 외부 사용자의 plugin 설치 경험을 제공하지 못한다.
- Codex와 Claude Code plugin을 분리: 각 도구 구조는 명확하지만 Skill 내용 복제와 drift 관리 비용이 커진다.
- 단일 dual plugin: 두 도구의 manifest를 같은 plugin root에 두고 `skills/kick/` 복사본을 공유해 배포 구조와 유지보수 비용의 균형이 좋다.

## 결과

- `skills/kick/`은 local authoring의 단일 원본으로 유지한다.
- `plugins/kick/skills/kick/`은 배포 복사본이며 `npm run plugin:sync:kick`으로 갱신한다.
- `npm run plugin:check:kick`으로 복사본 drift와 필수 manifest/catalog 존재를 확인한다.
- plugin 설치 안내는 `kimxogus/kick` GitHub repo 기준으로만 작성한다.
- plugin 변경을 배포할 때는 Codex manifest, Claude manifest의 `version`과 `plugins/kick/CHANGELOG.md`를 함께 갱신한다.
- Claude Code catalog entry에는 별도 `version`을 두지 않고 `plugins/kick/.claude-plugin/plugin.json`의 manifest version을 단일 기준으로 사용한다.
