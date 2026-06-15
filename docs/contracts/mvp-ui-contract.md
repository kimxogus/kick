# MVP UI 계약

이 문서는 `docs/contracts/mvp-data-and-api-contract.md`의 API와 데이터 구조를 기준으로 MVP 화면과 사용자 흐름을 정의한다. UI 구현은 이 계약을 기준으로 한다.

## 정보 구조

Next.js App Router 기준 화면:

- `/`: Weekly board, 검색, 태그 필터, newsletter 진입점
- `/products/[slug]`: Product 소개 페이지
- `/maker`: 제작자 런칭 보조와 등록 후보 준비
- `/submissions/[id]`: 제작자 제출 후보 preview
- `/contest`: 공개 contest 읽기 전용 목록
- `/admin`: direct URL로만 접근하는 발표 전 seed reset 화면

## 공통 UI 원칙

- 첫 화면은 마케팅 랜딩이 아니라 Weekly board 제품 탐색 경험이다. 단, 제작자 런칭 보조의 가치를 짧게 보여주는 hero와 3단계 설명은 포함할 수 있다.
- 화면은 사내 시연자가 바로 클릭하며 흐름을 보여줄 수 있어야 한다.
- 실제 서비스 기반 초기 콘텐츠를 사용해 빈 화면을 만들지 않는다.
- 현재 실제 서비스 제품과 기존 샘플 HTML 제품을 함께 보여줘 MVP 화면의 콘텐츠 밀도를 확보한다.
- 사용자 화면에는 `seed`, `더미`, `데모 미연결`, `표시용`, 관리자/운영자 CTA 같은 내부 구현 문구를 노출하지 않는다.
- CTA는 vote, 제품 상세 보기, newsletter 구독, 제작자 등록 보조 시작에 집중한다.
- `/admin` route는 direct URL로만 접근하고 사용자 화면에는 관리자 진입 버튼이나 링크를 만들지 않는다.
- 운영자 큐레이션 화면과 결제/후원 UI는 MVP에서 제외한다.
- 정적 HTML 참고안의 warm orange 컬러, 제품 카드 hover, emoji thumbnail, pill형 vote 버튼, 랭킹 badge, 카드뉴스 시각 패턴을 Bootstrap dependency 없이 Next.js/CSS로 이식한다.

## 탐색자 플로우

### Weekly board `/`

사용 API:

- `GET /api/boards/weekly`
- `POST /api/votes`
- `POST /api/newsletter-subscriptions`

필수 UI:

- 서비스명 `kick`
- 제작자 런칭 보조 가치를 요약하는 짧은 hero
- Skill/MCP 기반 작동 방식 3단계
- Weekly board 제목과 기간
- 검색 input
- 태그 필터
- rank가 있는 제품 카드 목록
- 제품명, 한 줄 소개, category, emoji 또는 썸네일, 태그, maker, vote 수, comment 수
- vote 버튼
- 제품 상세 링크
- contest 목록으로 이동하는 사용자용 링크
- newsletter 구독 input

상태:

- loading
- empty search result
- vote pending
- newsletter submit success
- validation error

렌더링 정책:

- vote count와 메모리 API 상태가 어긋나지 않도록 `/`는 Next.js dynamic render로 유지한다.
- hydration 이후 `GET /api/boards/weekly`를 한 번 다시 호출해 route handler의 메모리 상태를 board UI에 동기화한다.

### Product 소개 페이지 `/products/[slug]`

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
- vote 버튼
- 관련 제품

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
- Weekly board와 제작자 런칭 보조로 이동하는 사용자용 링크

제외 UI:

- contest 개최 버튼
- 상금 등록 또는 결제 CTA
- 관리자/운영자 화면 진입 버튼
- 기능 미연결 안내 문구

## 제작자 플로우

### 제작자 런칭 보조 `/maker`

사용 API:

- `POST /api/maker/launch-assist`
- `POST /api/maker/submissions`

필수 UI:

- 제품명, URL, 설명 초안, 대상 사용자, 해결 문제, 주요 기능 입력
- 분석 실행 버튼
- 핵심 어필 포인트
- 타겟 분석
- 셀링 포인트
- 개선 피드백과 리스크
- 한 줄 소개
- 상세 소개
- 추천 태그
- 런칭페이지 초안
- 카드뉴스 문구
- 채널별 홍보 카피
- 추가 확인 질문
- 등록 후보 preview
- 제출 후보 저장 버튼

상태:

- validation error
- generating
- result ready
- submission success

### 제출 preview `/submissions/[id]`

사용 API:

- `GET /api/maker/submissions/:id`

클라이언트 상태:

- 제작자 제출 직후 `POST /api/maker/submissions` 응답의 `submission` snapshot을 브라우저 localStorage에 저장한다.
- MVP preview 화면은 같은 브라우저에서 localStorage snapshot을 우선 사용해 fallback 환경에서도 제출 직후 preview가 안정적으로 보이게 한다.
- `DATABASE_URL`이 있으면 detail API는 Postgres 저장소를 조회하고, 없으면 memory store를 조회한다.

필수 UI:

- 제출 상태 `received`
- 제품명
- 한 줄 소개
- 상세 설명
- 태그
- maker note
- Weekly board 자동 반영은 MVP에서 제외한다는 안내

## 브라우저 검증 기준

UI 구현 후 `@컴퓨터` 또는 브라우저 자동화로 아래를 확인한다.

- `/`에서 Weekly board 제품 카드가 보인다.
- `/`에서 Skill/MCP 작동 방식 3단계가 보인다.
- 검색어 입력 시 제품 목록이 필터링된다.
- 태그 클릭 시 제품 목록이 필터링된다.
- vote 버튼을 누르면 vote count와 선택 상태가 바뀐다.
- 제품 카드를 클릭하면 `/products/[slug]`로 이동한다.
- `/admin` direct route에서 seed reset을 실행하면 완료 상태가 보인다.
- 제품 상세에서 Kick Point, 카드뉴스, 타겟별 홍보 메시지와 vote 버튼이 보인다.
- `/contest`에서 공개 contest 목록과 대표 제품 링크가 보인다.
- `/contest`에 contest 개최, 상금 등록, 관리자 CTA가 보이지 않는다.
- newsletter에 잘못된 이메일을 입력하면 오류가 보인다.
- newsletter에 정상 이메일을 입력하면 성공 상태가 보인다.
- `/maker`에서 필수 입력 후 분석 결과가 표시된다.
- 제작자 제출 후보 저장 후 preview 화면으로 이동한다.
