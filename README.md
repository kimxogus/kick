# kick

kick은 agent에게 말 한마디로 제품 소개를 정리하고 공식 kick 서비스에 등록하도록 돕는 제품 런칭 도구입니다.

이 문서는 kick 메인 페이지의 plugin 설치 안내에서 들어온 사용자를 위한 빠른 시작 가이드입니다. 개발자용 로컬 실행과 검증 절차는 [DEVELOPMENT.md](DEVELOPMENT.md)를 봅니다.

공식 서비스: <https://kick-web-ebon.vercel.app/>

## 1. Plugin 설치

GitHub repo `kimxogus/kick`를 plugin source로 추가한 뒤 `kick` plugin을 설치합니다.

Codex:

```bash
codex plugin marketplace add kimxogus/kick
codex plugin add kick@kick
```

Claude Code:

```text
/plugin marketplace add kimxogus/kick
/plugin install kick@kick
/reload-plugins
```

Claude Code catalog는 repo-relative source(`./plugins/kick`)를 사용하므로 GitHub repo 방식으로 추가합니다. raw `marketplace.json` URL 방식은 plugin 파일 위치를 해석하지 못할 수 있어 지원하지 않습니다.

## 2. 제품 등록 요청

제품을 등록하려는 저장소에서 agent에게 아래처럼 요청합니다.

```text
kick 스킬을 참고해서 내 제품 올려줘
```

Claude Code에서는 plugin skill을 직접 실행할 수도 있습니다.

```text
/kick:kick
```

kick plugin은 저장소의 `README.md`, `SPEC.md`, `ARCHITECTURE.md`, `docs/**`, `package.json` 등을 읽어 제품명, 소개, 카테고리, 카드뉴스 문구, 타겟별 메시지를 만들고 공식 kick 서비스에 등록합니다.

## 3. 등록 결과 확인

등록이 성공하면 agent가 상세 페이지 URL을 안내합니다.

```text
https://kick-web-ebon.vercel.app/products/<slug>
```

브라우저에서 안내받은 URL을 열어 제품명, 한 줄 소개, Kick Point, 대상 사용자, 카드뉴스 문구가 의도와 맞는지 확인합니다.

공식 URL에 테스트 제품을 등록하면 배포 DB에 데이터가 남을 수 있습니다. 실제로 공개해도 되는 제품만 등록 요청하세요.

## 문제 해결

- 설치 후 skill이 보이지 않으면 새 Codex thread를 열거나 Claude Code에서 `/reload-plugins`를 실행합니다.
- Claude Code에서 설치가 실패하면 raw `marketplace.json` URL이 아니라 `kimxogus/kick` GitHub repo를 marketplace로 추가했는지 확인합니다.
- 등록 문구가 부정확하면 제품 저장소의 README나 문서에 제품명, 대상 사용자, 핵심 가치, 사용 사례를 먼저 보강한 뒤 다시 요청합니다.
- 등록은 `POST https://kick-web-ebon.vercel.app/api/products`로 전송됩니다. agent가 안내한 상세 페이지가 열리지 않으면 잠시 뒤 다시 시도합니다.
