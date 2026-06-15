# 0006. Next.js 기반 MVP 애플리케이션 스택

- 상태: Accepted
- 날짜: 2026-06-14
- 갱신: 2026-06-15
- 관련 문서: `README.md`, `SPEC.md`, `ARCHITECTURE.md`, `TODO.md`, `docs/contracts/mvp-data-and-api-contract.md`, `docs/contracts/mvp-ui-contract.md`

## 맥락

MVP는 탐색자와 제작자 2개 플로우를 1주 안에 구현하고 시연해야 한다. 이전 ADR에서는 OpenAI Codex Sites 우선, 로컬 fallback 필수, 원격 DB/Auth/Storage 비필수를 결정했다.

사용자는 구현이 간편한 순서로 진행하며 Next.js로 일원화하는 방향을 선택했다. 이 결정은 UI, API route, 테스트, 로컬 실행 명령, Codex Sites 호환 빌드 검증 방식에 영향을 준다.

Next.js App Router는 `app/**/page.tsx`로 화면을 구성하고 `app/api/**/route.ts`로 Web Request/Response 기반 route handler를 둘 수 있다. 따라서 MVP에서는 별도 백엔드 서버를 두지 않고 Next.js 애플리케이션 안에서 백엔드 계약을 구현한다.

## 결정

MVP 앱 스택은 Next.js App Router, TypeScript, Vitest, React Testing Library, Playwright 기반으로 일원화한다.

1. 앱 구조
   - 앱 코드는 `apps/web/`에 둔다.
   - Next.js `src/app/` 구조를 사용한다.
   - 화면은 `src/app/**/page.tsx`와 컴포넌트로 구성한다.
   - API는 `src/app/api/**/route.ts`에 둔다.
2. 백엔드
   - MVP 백엔드는 별도 서버가 아니라 Next.js route handler로 구현한다.
   - route handler는 `Response.json()`과 Web `Request` API를 기본으로 사용한다.
   - 도메인 로직은 route handler와 분리해 `src/server/` 또는 `src/domain/`에서 테스트한다.
3. 데이터
   - 최초 구현은 seed fixture와 메모리 저장소로 시작했다.
   - 2026-06-15 이후 MVP 영속화와 reset 기준은 `docs/adr/0007-vercel-neon-postgres-persistence.md`가 우선한다.
   - 데이터 구조와 API 응답 계약은 `docs/contracts/mvp-data-and-api-contract.md`를 기준으로 한다.
4. 테스트
   - 백엔드 도메인 로직과 API 계약은 Vitest로 TDD 구현한다.
   - UI 컴포넌트와 사용자 흐름은 React Testing Library와 Playwright로 검증한다.
   - 구현은 실패 테스트 작성, 실패 확인, 최소 구현, 통과 확인 순서를 따른다.
5. 배포와 fallback
   - Codex Sites 우선을 유지하되, Next.js build 결과가 Sites와 충돌할 경우 로컬 `next dev` 시연을 fallback으로 사용한다.
   - 로컬 실행 명령은 앱 스캐폴딩 후 README에 기록한다.

## 고려한 선택지

- Next.js 일원화: UI와 API route를 한 프레임워크에서 구현할 수 있어 MVP 속도가 빠르다. Sites 호환성은 별도 검증이 필요하지만 로컬 fallback이 있어 발표 리스크를 관리할 수 있다.
- Vite + React + Hono: Worker-compatible API에 더 직접적으로 맞지만 UI/API 프로젝트 구성이 분리되어 초기 구현 단계가 늘어난다.
- React Router/Remix 계열: 데이터 로딩 모델이 강하지만 1주 MVP에서는 학습과 설정 비용이 더 크다.

## 결과

- `ARCHITECTURE.md`의 후보 구조는 Next.js 앱 중심 구조로 갱신한다.
- 앱 스캐폴딩 이후 `apps/web`에서 모든 MVP UI와 API route를 구현한다.
- 백엔드 계약과 UI 계약은 구현 전 `docs/contracts/`에 고정한다.
- route handler의 응답은 UI와 테스트가 공유할 수 있도록 타입과 fixture를 분리한다.
- MVP에서는 Auth를 구현하지 않고, `viewer_id`를 클라이언트 로컬 식별자로 대체한다.
- `DATABASE_URL`이 없을 때는 투표와 제출 후보를 데모 목적의 메모리 상태로 처리하며 새로고침 또는 서버 재시작 시 초기화될 수 있다.
- 검색은 제품명, 한 줄 소개, 상세 설명, 태그, 타겟 사용자에 대한 클라이언트/API 필터링으로 시작한다.

## 후속 작업

- [ ] Next.js 앱 스캐폴딩을 생성한다.
- [ ] Vitest와 React Testing Library를 설정한다.
- [ ] API 계약 테스트를 먼저 작성한다.
- [ ] Codex Sites saved version 생성 가능 여부를 앱 구현 후 검증한다.
- [ ] 로컬 fallback 실행 명령을 README에 기록한다.
