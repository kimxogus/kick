# kick plugin

이 plugin은 저장소 문서를 읽어 제품 소개, 카테고리, 카드뉴스 문구, 타겟별 메시지를 만들고 공식 kick 서비스에 제품을 등록하는 `kick` Skill을 배포한다.

## Codex 설치

```bash
codex plugin marketplace add kimxogus/kick
codex plugin add kick@kick
```

설치 후 새 thread에서 아래처럼 요청한다.

```text
kick 스킬을 참고해서 내 제품 올려줘
```

## Claude Code 설치

```text
/plugin marketplace add kimxogus/kick
/plugin install kick@kick
/reload-plugins
```

이 catalog는 repo-relative source(`./plugins/kick`)를 사용하므로 GitHub repo 방식으로 추가한다. raw `marketplace.json` URL로 추가하면 plugin 파일 위치를 해석하지 못할 수 있다.

설치 후 아래처럼 요청하거나 plugin skill을 직접 실행한다.

```text
kick 스킬을 참고해서 내 제품 올려줘
/kick:kick
```

## 등록 대상

제품 등록 요청은 공식 서비스로 전송한다.

```text
POST https://kick-web-ebon.vercel.app/api/products
```

응답의 `detailUrl`이 `/products/<slug>`이면 최종 상세 페이지는 `https://kick-web-ebon.vercel.app/products/<slug>`이다.

## 개발자 참고

repo-local 원본 Skill은 `skills/kick/`에 있다. 배포용 복사본을 갱신할 때는 repo root에서 아래 명령을 실행한다.

```bash
npm run plugin:sync:kick
npm run plugin:check:kick
```

Plugin 변경을 배포할 때는 `.codex-plugin/plugin.json`, `.claude-plugin/plugin.json`의 `version`과 `CHANGELOG.md`를 함께 갱신한다. Claude Code catalog entry에는 별도 `version`을 두지 않아 manifest version과 충돌하지 않게 한다.
