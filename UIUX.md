# UIUX.md

> 페이지 구성(정보구조·페이지별 역할·콘텐츠 블록)의 기준은 [docs/pages.md](docs/pages.md), 요소·상태 계약은 [docs/contracts/mvp-ui-contract.md](docs/contracts/mvp-ui-contract.md)다. 이 문서는 그 위에 입히는 **시각 스타일**(컬러·타이포·컴포넌트 토큰·비주얼 패턴)만 다룬다. 어떤 블록이 들어가는지는 pages.md/contract를, 그 블록을 어떻게 보이게 할지는 이 문서를 따른다.

kick 웹앱의 시각 스타일은 에디토리얼 타입 + ink-black 액센트 기조다. 굵은 두톤 타이포, 절제된 그레이 라인, pill 형태 인터랙션을 쓴다.

## 비주얼 기조

- ink-black(`#111`) 액센트 기반. 기존 kick-orange(`#ff5c39`) 브랜드 컬러는 제거했다.
- 폰트는 Pretendard (CDN, `layout.tsx`에서 `<link>` 주입), fallback은 system 폰트.
- 장식용 이모지는 쓰지 않는다. 단 `♥`(좋아요 글리프)와 제품 데이터가 가진 emoji 썸네일은 허용한다.

## 디자인 토큰 (`apps/web/src/app/globals.css` `:root`)

| 토큰 | 값 | 용도 |
| --- | --- | --- |
| `--ink` | `#111111` | 기본 잉크/액센트 |
| `--ink-2` | `#6b6b6b` | 보조 텍스트 |
| `--ink-3` | `#a4a29b` | 뮤트 텍스트(헤드라인 2번째 톤) |
| `--line` | `#e8e7e2` | 기본 구분선 |
| `--line-2` | `#d4d2cb` | 입력/버튼 경계 |
| `--bg` | `#ffffff` | 배경 |
| `--bg-soft` | `#f3f2ee` | 소프트 배경/pill |
| `--danger` | `#ff3b5c` | 좋아요 활성 |
| `--ok` | `#2f7d4f` | 진행중 상태 |
| `--radius` / `--radius-lg` | `16px` / `22px` | 카드 라운드 |
| `--maxw` | `1240px` | 컨테이너 폭 |
| `--nav-h` | `64px` | sticky 네비 높이 |

## 타이포그래피

- 헤드라인: `font-weight: 800`, `letter-spacing: -0.035em`, `line-height: 1.05`.
- 본문: `letter-spacing: -0.015em`, `line-height: 1.5`.
- hero h1: `clamp(40px, 6vw, 72px)`, 2번째 줄(`.muted`)은 `--ink-3` 톤.
- eyebrow/섹션 라벨: 12~13px, `font-weight: 700`, `letter-spacing: 0.14~0.16em`, 대문자.

## 핵심 컴포넌트 스타일

- **버튼**: `.primary-link`(ink 배경) / `.secondary-link`(ink 보더) — pill, hover 시 반전.
- **좋아요 버튼** `.vote-button`: 보더 pill, `♥` + count. hover 시 `--danger`, `.active`는 채워짐. 화면 표기는 좋아요지만 `aria-label`은 `${name} vote`(백엔드 vote 모델과 회귀 테스트 호환).
- **pill** `.category-pill` / `.chip`(태그 필터, `.active` 시 ink).
- **카드**: `.step-card`, `.contest-card`, `.product-card`, `.news-card`(`--user` 파스텔 / `--maker` ink) — `--line` 보더 + 라운드, hover 시 `translateY` + 보더 강조.
- **네비/푸터**: sticky 글래스 헤더(`.site-header`, blur), 소프트 배경 푸터(`.site-footer`).
- **상태 배지**: `.status-pill.open`(ok) / `.upcoming`(파스텔) / `.closed`(mute).
- **스킬 안내 복사 줄** `.skill-callout`: 소프트 배경 pill에 코드 문구 + ink 복사 버튼.
- **위클리보드**: `.week-layout`(리스트 + sticky `.rank-panel`), `.row-card`, `.rank-item`(top 3 ink 배지).

## 제품 비주얼 (`product-media.tsx`)

- `ProductMedia`는 `--bg-soft` 표면 + `--line` 보더의 사각 박스다.
- `product.emoji`가 있으면 emoji 썸네일(`.product-emoji-visual`, 컨테이너 크기별 font-size), 없으면 `thumbnailUrl` 이미지(`object-fit: cover`).
- 크기는 컨텍스트 클래스로: `.row-thumb`(위클리보드), `.product-card__media`(그리드), `.product-visual`(상세), `.related-thumb`, `.mini-product-thumb`.

## 로컬 미리보기

```bash
cd ~/Documents/Dev/Github/k-producthunt
npm run dev -w apps/web      # http://localhost:3000
```

DB 없이도 시드 데이터로 렌더된다. 좋아요/뉴스레터 등 쓰기 동작에 Postgres가 필요하면:

```bash
# apps/web/.env.local 에 DATABASE_URL 설정 후
npm run db:reset -w apps/web
```

## 검증

```bash
npm run test:coverage -w apps/web   # 마크업/문구 회귀
npm run lint -w apps/web            # typecheck
npm run build -w apps/web           # 프로덕션 빌드
```
