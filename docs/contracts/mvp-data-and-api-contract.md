# MVP 데이터 및 API 계약

이 문서는 `kick` MVP의 데이터 구조와 Next.js route handler API 계약을 정의한다. 구현은 이 문서를 기준으로 하며, 계약 변경이 필요하면 구현 전에 이 문서를 먼저 갱신한다.

## 범위

포함:

- Weekly board 제품 목록 조회
- 제품 상세 조회
- 제품 검색과 태그 필터
- 제품 vote
- 공개 contest 읽기 전용 목록 조회
- Newsletter 구독 의사 저장
- 제작자 등록 후보 준비와 제출 후보 저장
- 제작자 런칭 보조 분석 결과 표현

제외:

- 실제 Auth
- 원격 DB 영속화
- 파일 업로드
- 실제 newsletter 발송
- 운영자 큐레이션 백엔드
- 실제 공개 제출 승인 워크플로
- contest 생성, 상금 등록, 결제, 운영 기능

## 공통 규칙

- 모든 API 응답은 JSON이다.
- 날짜는 ISO 8601 문자열을 사용한다.
- ID는 사람이 읽을 수 있는 slug 또는 `kind_number` 형식 문자열을 사용한다.
- MVP의 write 동작은 서버 메모리 저장소를 사용할 수 있다.
- API 실패 응답은 아래 형식을 따른다.

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "필수 입력이 누락되었습니다.",
    "fields": ["email"]
  }
}
```

## 데이터 타입

### Product

```ts
type Product = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: string;
  emoji?: string;
  description: string;
  websiteUrl: string;
  demoUrl?: string;
  thumbnailUrl: string;
  gallery: string[];
  makers: Maker[];
  tags: string[];
  targetUsers: string[];
  useCases: string[];
  kickPoint: string;
  cardNewsCopy: string[];
  targetMessages: TargetMessage[];
  pricing?: string;
  status: "featured" | "published" | "draft";
  createdAt: string;
};
```

### TargetMessage

```ts
type TargetMessage = {
  audience: string;
  message: string;
};
```

### Maker

```ts
type Maker = {
  id: string;
  name: string;
  role?: string;
  profileUrl?: string;
};
```

### Board

```ts
type Board = {
  id: string;
  period: "weekly" | "daily" | "monthly" | "yearly";
  title: string;
  startsOn: string;
  endsOn: string;
  launches: Launch[];
};
```

### Launch

```ts
type Launch = {
  id: string;
  rank: number;
  product: Product;
  voteCount: number;
  commentCount: number;
  isVotedByViewer: boolean;
  featuredReason: string;
  launchedAt: string;
};
```

### Contest

```ts
type Contest = {
  id: string;
  slug: string;
  title: string;
  host: string;
  description: string;
  status: "open" | "upcoming" | "closed";
  startsOn: string;
  endsOn: string;
  productCount: number;
  featuredLaunches: Launch[];
};
```

### NewsletterSubscription

```ts
type NewsletterSubscription = {
  id: string;
  email: string;
  source: "board" | "product" | "maker";
  createdAt: string;
};
```

### MakerSubmissionDraft

```ts
type MakerSubmissionDraft = {
  productName: string;
  websiteUrl?: string;
  descriptionDraft: string;
  targetUsers: string[];
  problem: string;
  features: string[];
  competitors?: string[];
};
```

### LaunchAssistResult

```ts
type LaunchAssistResult = {
  appealPoints: string[];
  targetAnalysis: string[];
  sellingPoints: string[];
  differentiators: string[];
  risksOrUnknowns: string[];
  tagline: string;
  description: string;
  tags: string[];
  launchPageCopy: string;
  cardNewsCopy: string[];
  channelCopy: {
    productHunt: string;
    disquiet: string;
    internalDemo: string;
  };
  submissionPayload: KickSubmissionPayload;
  followUpQuestions: string[];
};
```

### KickSubmissionPayload

```ts
type KickSubmissionPayload = {
  productName: string;
  tagline: string;
  description: string;
  websiteUrl?: string;
  tags: string[];
  makerNote: string;
};
```

### MakerSubmission

```ts
type MakerSubmission = {
  id: string;
  payload: KickSubmissionPayload;
  viewerId: string;
  status: "received";
  createdAt: string;
};
```

## API 계약

### `GET /api/boards/weekly`

현재 Weekly board를 반환한다.

Query:

- `q`: 선택 검색어
- `tag`: 선택 태그
- `viewer_id`: 선택 로컬 viewer 식별자

성공 응답:

```ts
type WeeklyBoardResponse = {
  board: Board;
  filters: {
    q: string;
    tag: string | null;
    availableTags: string[];
  };
};
```

### `GET /api/products/:slug`

제품 상세를 반환한다.

성공 응답:

```ts
type ProductDetailResponse = {
  product: Product;
  launch: Launch;
  relatedLaunches: Launch[];
};
```

### `GET /api/contests`

공개 contest 목록을 읽기 전용으로 반환한다.

성공 응답:

```ts
type ContestListResponse = {
  contests: Contest[];
};
```

정책:

- MVP에서는 생성, 수정, 상금 등록, 결제, 관리자 운영 API를 제공하지 않는다.
- 사용자 화면은 contest의 목적, 기간, 참여 제품 수, 대표 제품만 보여준다.

### `POST /api/votes`

제품 launch에 vote를 토글한다.

요청:

```ts
type VoteRequest = {
  launchId: string;
  viewerId: string;
};
```

성공 응답:

```ts
type VoteResponse = {
  launchId: string;
  voteCount: number;
  isVotedByViewer: boolean;
};
```

정책:

- `viewerId`는 MVP에서 브라우저 localStorage가 만든 익명 ID다.
- 같은 `viewerId`가 같은 `launchId`에 다시 요청하면 vote를 취소한다.
- 실제 abuse 방지는 후속 ADR에서 다룬다.

### `POST /api/newsletter-subscriptions`

Newsletter 구독 의사를 저장한다.

요청:

```ts
type NewsletterRequest = {
  email: string;
  source: "board" | "product" | "maker";
};
```

성공 응답:

```ts
type NewsletterResponse = {
  subscription: NewsletterSubscription;
};
```

정책:

- 이메일 형식만 검증한다.
- 실제 발송 provider 연동은 하지 않는다.

### `POST /api/maker/launch-assist`

제작자 입력을 받아 런칭 보조 결과를 생성한다.

요청:

```ts
type LaunchAssistRequest = MakerSubmissionDraft;
```

성공 응답:

```ts
type LaunchAssistResponse = {
  result: LaunchAssistResult;
};
```

정책:

- MVP에서는 규칙 기반 생성과 예시 데이터를 사용해 데모 안정성을 우선한다.
- 외부 URL 본문 수집은 하지 않는다.
- 입력이 부족하면 `followUpQuestions`에 남긴다.

### `POST /api/maker/submissions`

제작자 등록 후보를 저장한다.

요청:

```ts
type MakerSubmissionRequest = {
  payload: KickSubmissionPayload;
  viewerId: string;
};
```

성공 응답:

```ts
type MakerSubmissionResponse = {
  submission: MakerSubmission;
  status: "received";
  previewUrl: string;
};
```

정책:

- MVP에서는 공개 board에 자동 반영하지 않는다.
- 제출 성공 화면과 preview만 제공한다.
- UI는 제출 직후 preview 안정성을 위해 `submission` snapshot을 브라우저 localStorage에도 저장할 수 있다.

### `GET /api/maker/submissions/:id`

제작자 제출 후보 preview를 반환한다.

성공 응답:

```ts
type MakerSubmissionDetailResponse = {
  submission: MakerSubmission;
};
```

정책:

- 서버 메모리 저장소에 없는 ID는 `NOT_FOUND`를 반환한다.
- MVP에서는 제출 후보가 서버 재시작 후 사라질 수 있다.
- `/submissions/[id]` 화면은 서버 메모리 저장소가 비어 있는 경우에도 제출 직후 같은 브라우저에서 preview를 볼 수 있도록 localStorage snapshot을 우선 사용할 수 있다.

## API 테스트 기준

- Weekly board는 launch를 rank 순서로 반환해야 한다.
- Weekly board는 현재 실제 서비스 기반 제품과 기존 샘플 HTML 제품을 병합해 최소 10개 launch를 반환해야 한다.
- 검색어는 제품명, 한 줄 소개, 설명, 태그, 대상 사용자에 매칭되어야 한다.
- 검색어는 제품 category에도 매칭되어야 한다.
- 태그 필터는 해당 태그가 있는 launch만 반환해야 한다.
- 제품 상세는 Kick Point, 카드뉴스 문구, 타겟별 메시지를 포함해야 한다.
- contest 목록은 현재 contest와 기존 샘플 HTML contest를 병합한 읽기 전용 데이터와 대표 launch를 반환해야 한다.
- vote는 같은 viewer/launch 조합에서 toggle 되어야 한다.
- newsletter는 잘못된 이메일을 거부해야 한다.
- launch assist는 필수 입력 누락 시 follow-up question을 반환해야 한다.
- maker submission은 필수 payload 누락 시 validation error를 반환해야 한다.
- maker submission detail은 저장된 제출 후보를 ID로 조회해야 한다.
