# MVP UI 계약

이 문서는 `docs/contracts/mvp-data-and-api-contract.md`의 API와 데이터 구조를 기준으로 MVP 화면과 사용자 흐름을 정의한다. UI 구현은 이 계약을 기준으로 한다.

## 정보 구조

Next.js App Router 기준 화면:

- `/`: Weekly board, 검색, 태그 필터, newsletter 진입점
- `/products/[slug]`: Product 소개 페이지
- `/maker`: 제작자 런칭 보조와 등록 payload 준비
- `/submissions/[id]`: 제작자 제출 후보 preview

## 공통 UI 원칙

- 첫 화면은 마케팅 랜딩이 아니라 Weekly board 제품 탐색 경험이다.
- 화면은 사내 시연자가 바로 클릭하며 흐름을 보여줄 수 있어야 한다.
- 실제 서비스 기반 seed 데이터를 사용해 빈 화면을 만들지 않는다.
- CTA는 vote, 제품 상세 보기, newsletter 구독, 제작자 등록 보조 시작에 집중한다.
- 운영자 큐레이션 화면과 결제/후원 UI는 MVP에서 제외한다.

## 탐색자 플로우

### Weekly board `/`

사용 API:

- `GET /api/boards/weekly`
- `POST /api/votes`
- `POST /api/newsletter-subscriptions`

필수 UI:

- 서비스명 `kick`
- Weekly board 제목과 기간
- 검색 input
- 태그 필터
- rank가 있는 제품 카드 목록
- 제품명, 한 줄 소개, 썸네일, 태그, maker, vote 수, comment 수
- vote 버튼
- 제품 상세 링크
- newsletter 구독 input

상태:

- loading
- empty search result
- vote pending
- newsletter submit success
- validation error

### Product 소개 페이지 `/products/[slug]`

사용 API:

- `GET /api/products/:slug`
- `POST /api/votes`
- `POST /api/newsletter-subscriptions`

필수 UI:

- 제품명과 한 줄 소개
- 큰 preview 이미지 또는 썸네일
- 제품 설명
- 대상 사용자
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
- 등록 payload preview
- 제출 후보 저장 버튼

상태:

- validation error
- generating
- result ready
- submission success

### 제출 preview `/submissions/[id]`

사용 API:

- `GET /api/maker/submissions/:id`

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
- 검색어 입력 시 제품 목록이 필터링된다.
- 태그 클릭 시 제품 목록이 필터링된다.
- vote 버튼을 누르면 vote count와 선택 상태가 바뀐다.
- 제품 카드를 클릭하면 `/products/[slug]`로 이동한다.
- 제품 상세에서 핵심 정보와 vote 버튼이 보인다.
- newsletter에 잘못된 이메일을 입력하면 오류가 보인다.
- newsletter에 정상 이메일을 입력하면 성공 상태가 보인다.
- `/maker`에서 필수 입력 후 분석 결과가 표시된다.
- 제작자 제출 후보 저장 후 preview 화면으로 이동한다.
