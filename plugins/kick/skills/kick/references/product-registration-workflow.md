# Product Registration Workflow

저장소 문서를 근거로 kick 제품 상세 페이지 필드를 채워 `POST https://kick-web-ebon.vercel.app/api/products`로 등록한다.

## 문서에서 수집

아래를 저장소에서 찾아 근거로 삼는다. 사람에게 묻지 않는다.

- 제품명: `package.json` name, README 제목, 문서의 서비스명
- 문제/목적: README, `SPEC.md`(목적·제공 가치), pitch 문서
- 대상 사용자: SPEC의 사용자 정의, README 사용 대상
- 주요 기능/사용 사례: README 기능 목록, `ARCHITECTURE.md`, 소스 구조
- 메이커/팀: git author, README, `package.json` author

근거가 없으면 추측으로 채우지 말고 보수적으로 쓰거나 비운다. 제품명만은 끝까지 못 찾으면 마지막에 한 번 질문한다.

## 추출·정제 순서

1. 제품이 해결하는 문제를 한 문장으로 정의한다.
2. 대상 사용자를 좁고 구체적으로 정한다(`targetUsers`).
3. 제품이 주는 변화를 사용자 언어로 다시 쓴다 → `tagline`, `kickPoint`.
4. 기능을 사용자 이득 중심 사용 사례로 바꾼다 → `useCases`.
5. 카테고리를 고정 택소노미에서 1개 고른다.
6. 제품 성격에 맞는 emoji 1개를 고른다.
7. 대상별 가치 메시지를 만든다 → `targetMessages`.
8. 카드뉴스 문구 2~3개를 만든다 → `cardNewsCopy`.
9. 검증되지 않은 수치·과장·비방을 제거한다.

## 필드 → 상세 페이지 매핑

| payload 필드 | 상세 페이지 위치 |
| --- | --- |
| `emoji` | hero 비주얼 |
| `tags` | hero eyebrow |
| `category` | hero 카테고리 칩 |
| `name` | hero 제목 |
| `tagline` | hero 한 줄 |
| `kickPoint` | Kick Point |
| `cardNewsCopy` | 카드뉴스 |
| `description` | 소개 |
| `targetUsers` | 대상 사용자 |
| `useCases` | Use case |
| `maker.name` | Maker |
| `targetMessages` | 타겟별 홍보 메시지 |

좋아요 수·관련 제품·등록일은 시스템이 채운다.
응답의 `detailUrl`이 `/products/<slug>`이면 사용자에게 `https://kick-web-ebon.vercel.app/products/<slug>`로 안내한다.

## 작성 원칙

- 제작자 관점보다 사용자 관점으로 쓴다.
- "혁신적", "최고", "완벽한" 같은 검증 어려운 표현은 피한다.
- 첫 문장에서 대상 사용자와 해결 문제를 드러낸다.
- 기술 구현보다 사용자가 얻는 결과를 앞에 둔다.
- 한국어로 쓰되 제품명·URL·외부 고유명사는 원문을 유지한다.
- `maker.profileUrl`은 메이커 프로필 URL일 때만 사용하고, 제품 홈페이지 URL 대체값으로 쓰지 않는다.
