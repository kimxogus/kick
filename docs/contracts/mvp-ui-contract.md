# MVP UI 계약

이 문서는 [docs/pages.md](../pages.md)의 페이지 구성과 `docs/contracts/mvp-data-and-api-contract.md`의 API·데이터 구조를 기준으로 MVP 화면과 사용자 흐름을 정의한다.

- 페이지 구성(어떤 블록이 들어가는지): [docs/pages.md](../pages.md)
- 시각 스타일(컬러·타이포·컴포넌트 토큰): [UIUX.md](../../UIUX.md)
- 요소·상태·검증 계약: 이 문서
- 동일 기능이 이미 구현돼 있으면(vote toggle, Postgres 영속화, API 형태 등) 현재 구현을 기준으로 한다.

## 정보 구조

pages.md 5페이지 + 발표용 admin:

- `/`: Home — 서비스 소개 허브(hero, 작동 방식, 이번주 하이라이트, contest 요약, newsletter)
- `/week`: Weeklyboard — 날짜별 제품 + 좋아요 + 주간 랭킹
- `/products`: Products — 전체 제품 탐색/검색 카탈로그
- `/products/[slug]`: Product 상세 — Skill 런칭 콘텐츠
- `/contest`: Contest — 공개 contest 읽기 전용 목록
- `/admin`: direct URL 전용 seed reset (사용자 화면에 링크 없음)

> 제작자 등록은 별도 페이지 없이 Skill이 수행한다. 기존 `/maker`·`/submissions/[id]` 화면은 재구성에서 제거한다.

## 공통 UI 원칙

- 첫 화면(`/`)은 서비스 소개 허브다. 과장 없이 가치(agent 런칭)와 진입 동선을 보여준다.
- 시연자가 바로 클릭하며 흐름(홈 → 위클리보드/탐색 → 상세)을 보여줄 수 있어야 한다.
- 실제 서비스 기반 초기 콘텐츠로 빈 화면을 만들지 않는다. 실제 제품과 기존 샘플 제품을 병합해 밀도를 확보한다.
- 사용자 화면에 `seed`, `더미`, `데모 미연결`, `표시용`, 관리자/운영자 CTA 같은 내부 구현 문구를 노출하지 않는다.
- CTA는 좋아요, 제품 상세 보기, 탐색(위클리보드/Products), newsletter 구독에 집중한다.
- `/admin`은 direct URL로만 접근하고 사용자 화면에 진입 버튼/링크를 두지 않는다.
- 운영자 큐레이션·결제/후원 UI는 MVP에서 제외한다.
- 제품 카드 hover, emoji 또는 썸네일, pill형 좋아요(♥) 버튼, 랭킹 badge, 카드뉴스 시각 패턴을 Bootstrap dependency 없이 Next.js/CSS로 구현한다. 컬러·타이포 등 시각 스타일은 [UIUX.md](../../UIUX.md)를 따른다.
- 좋아요는 화면 표기상 `♥`이며, 백엔드는 `viewer_id`+launch 기준 vote toggle을 유지한다.

## 탐색자 플로우

### Home `/`

사용 API:

- `GET /api/boards/weekly` (이번주 하이라이트 상위 제품)
- `GET /api/contests` (contest 요약 수)
- `POST /api/newsletter-subscriptions`

필수 UI:

- 서비스명 `kick`과 한 줄 정의 hero, CTA(이번주 보기 → `/week`, 탐색하기 → `/products`). 제작자 런칭 보조 CTA는 두지 않는다.
- Skill 기반 작동 방식 3단계. 1번 스텝 보조 문구는 "한마디면 충분해요".
- 작동 방식 카드 하단: `kick 스킬을 참고해서 내 제품 올려줘` 문구 + 우측 복사 버튼(클릭 시 클립보드에 해당 문구 복사).
- 이번주 하이라이트: Weeklyboard 상위 제품 미리보기 카드(제품명·한 줄 소개·category·썸네일·좋아요 수). 클릭 시 상세로 이동. 미리보기는 좋아요 수 표시까지이고, 좋아요 토글은 Weeklyboard/Products/상세에서 한다.
- 콘테스트 요약 섹션(이번주 하이라이트 아래): 예정/진행중/종료 콘테스트 수 + Contest 목록 이동 링크.
- newsletter 2단 카드
  - 탐색하는 분께: 주간 큐레이션 구독 폼(이메일 입력).
  - 제품을 올린 분께: 피드백 리포트(좋아요·댓글·주간 랭킹 요약) 표시만. 이메일 입력 폼은 두지 않는다.
- 푸터: 서비스 소개와 Contest 링크.

상태:

- newsletter submit success
- validation error

렌더링 정책:

- 좋아요·콘테스트 수가 메모리/DB 상태와 어긋나지 않도록 `/`는 Next.js dynamic render로 유지한다. 하이라이트와 요약은 서버에서 로드한다.

### Weeklyboard `/week`

사용 API:

- `GET /api/boards/weekly`
- `POST /api/votes`

필수 UI:

- 주차 표시(이번 주 기간)와 지난주 이동(데모 범위 — 동작이 없으면 비활성 표시)
- 날짜별 제품 리스트: 썸네일·이름·한 줄 소개·category·좋아요 버튼(무제한)·현재 좋아요 수
- 주간 랭킹: 좋아요 누적 상위 제품, 같은 페이지 사이드/상단에 배치(별도 랭킹 페이지 없음)
- 좋아요 토글 시 즉시 count·순위 반영
- 제품 상세 링크

상태:

- loading
- vote pending

렌더링 정책:

- `/week`는 dynamic render로 유지하고, hydration 이후 `GET /api/boards/weekly`를 한 번 다시 호출해 route handler 메모리 상태를 동기화한다.

### Products `/products`

사용 API:

- 제품 목록 데이터: 현재 전용 list API가 없으므로 weekly board launches 재사용 또는 `GET /api/products` 신설은 구현 시 확정한다.
- `POST /api/votes`

필수 UI:

- 제품 검색 input(제품명·한 줄 소개·태그 매칭)
- 카테고리 필터(칩/탭)
- 정렬(최신순 / 좋아요순)
- 제품 그리드 카드: 썸네일·이름·한 줄 소개·category·좋아요 수. 클릭 시 상세로 이동.

상태:

- empty search result
- vote pending

### Product 상세 `/products/[slug]`

(현행 구현 유지)

사용 API:

- `GET /api/products/:slug`
- `POST /api/votes`
- `POST /api/newsletter-subscriptions`

필수 UI:

- 제품명과 한 줄 소개
- 큰 preview 이미지 또는 썸네일
- Kick Point
- 카드뉴스 문구
- 제품 설명
- 대상 사용자
- 타겟별 홍보 메시지
- 주요 use case
- 태그
- maker 정보
- website/demo 링크
- 좋아요(♥) 버튼 (백엔드는 vote toggle 유지)
- 관련 제품
- newsletter 단일 구독 영역

상태:

- not found
- vote pending
- newsletter submit success

### Contest 목록 `/contest`

사용 API:

- `GET /api/contests`

필수 UI:

- 공개 contest 목록
- contest 제목, 주최, 설명, 기간, 상태, 참여 제품 수
- 대표 제품 링크
- Weeklyboard와 Products로 이동하는 사용자용 링크

제외 UI:

- contest 개최 버튼
- 상금 등록 또는 결제 CTA
- 관리자/운영자 화면 진입 버튼
- 기능 미연결 안내 문구

> pages.md §5는 v1 비전상 "개최하기" 자리만 언급하지만, 현재 구현과 SPEC 결정에 따라 contest는 읽기 전용을 유지한다.

### Seed reset `/admin`

사용 API:

- `POST /api/admin/reset`

- direct URL 전용. 사용자 화면에 진입 버튼/링크를 두지 않는다.
- reset 실행 후 복원된 제품·런치·콘테스트 수를 완료 상태로 표시한다.

## 브라우저 검증 기준

UI 구현 후 `@컴퓨터` 또는 브라우저 자동화로 아래를 확인한다.

- `/` Home에 hero, 작동 방식 3단계, 이번주 하이라이트, 콘테스트 요약, newsletter 2단 카드가 보인다.
- `/` 작동 방식 카드 하단 복사 버튼을 누르면 `kick 스킬을 참고해서 내 제품 올려줘`가 클립보드에 복사된다.
- `/` 콘테스트 요약에 예정/진행중/종료 수가 보인다.
- `/` 하이라이트 카드를 클릭하면 `/products/[slug]`로 이동한다.
- `/week`에 날짜별 제품과 주간 랭킹이 보이고, 좋아요를 누르면 count와 순위가 바뀐다.
- `/products`에서 검색·카테고리·정렬로 제품 목록이 필터/정렬된다.
- 제품 상세에서 Kick Point, 카드뉴스, 타겟별 홍보 메시지, 좋아요 버튼이 보인다.
- `/contest`에서 공개 contest 목록과 대표 제품 링크가 보인다.
- `/contest`에 contest 개최, 상금 등록, 관리자 CTA가 보이지 않는다.
- newsletter에 잘못된 이메일을 입력하면 오류가 보인다.
- newsletter에 정상 이메일을 입력하면 성공 상태가 보인다.
- `/admin` direct route에서 seed reset을 실행하면 완료 상태가 보인다.
