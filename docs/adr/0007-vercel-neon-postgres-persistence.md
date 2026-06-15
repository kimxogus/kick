# 0007. Vercel과 Neon Postgres 기반 MVP 영속화

- 상태: Accepted
- 날짜: 2026-06-15
- 관련 문서: `README.md`, `SPEC.md`, `ARCHITECTURE.md`, `TODO.md`, `docs/contracts/mvp-data-and-api-contract.md`, `docs/deployment/vercel.md`
- 대체: `docs/adr/0003-application-stack-selection.md`의 Codex Sites 우선 배포 결정, `docs/adr/0006-nextjs-mvp-application-stack.md`의 메모리 저장소 우선 데이터 결정

## 맥락

Codex Sites는 preview 기능이며 현재 팀 계정 환경에서는 접근이 막힐 수 있다. MVP는 발표용 URL과 시연 전 데이터 복원 가능성이 더 중요해졌다.

Vercel은 Next.js 앱 배포에 가장 단순한 경로를 제공한다. Neon은 Vercel Marketplace 연동 또는 수동 `DATABASE_URL` 환경 변수 방식으로 Vercel 앱에 Postgres를 붙일 수 있다. Neon serverless driver는 serverless/edge 환경에서 HTTP 기반 Postgres query를 지원한다.

시연 중 테스트 데이터가 추가될 수 있으므로 발표 직전 현재 seed 제품, board, contest 상태로 되돌리는 reset 경로가 필요하다.

## 결정

MVP 배포와 영속화 기본 경로를 Vercel + Neon Postgres로 전환한다.

1. 배포
   - Vercel Git Integration을 발표용 URL 확보의 기본 경로로 둔다.
   - Vercel 프로젝트는 Root Directory `apps/web`, Framework Preset `Next.js`, Production Branch `main`으로 설정한다.
   - `main` push production deploy와 PR preview deploy는 Vercel이 수행한다.
   - GitHub Actions는 production deploy를 하지 않고 test/lint/build와 coverage report만 담당한다.
   - 로컬 `next dev`, `next build`, `next start` 실행은 fallback으로 유지한다.
   - Codex Sites는 후속 검토 대상으로 남기되 현재 MVP 성공 조건에서는 제외한다.
2. 데이터
   - `DATABASE_URL`이 있으면 Neon Postgres를 사용한다.
   - `DATABASE_URL`이 없으면 기존 seed 기반 memory store로 로컬 개발과 테스트를 계속 지원한다.
   - 제품, board, launch, contest seed도 Postgres에 저장해 reset 시 현재 repo seed 상태로 복원한다.
3. Reset
   - `npm run db:reset -w apps/web`은 DB를 migrate한 뒤 현재 seed 상태로 복원한다.
   - `/admin` 화면은 direct URL로만 접근하며 사용자 화면에 진입점을 노출하지 않는다.
   - 사용자가 선택한 MVP 정책에 따라 `/admin` reset은 별도 토큰 없이 동작한다.

## 고려한 선택지

- Vercel + Neon Postgres: Next.js와 호환성이 좋고 `DATABASE_URL` 기반 연결이 단순하다. 영속 데이터와 reset을 빠르게 구현할 수 있다.
- Netlify + Neon Postgres: 무료 크레딧이 있고 배포가 가능하지만 현재 Next.js route handler MVP에는 Vercel 쪽 마찰이 더 적다.
- Codex Sites + D1: Codex 통합 경험은 좋지만 현재 접근 권한과 계정 제약이 MVP 일정 리스크다.
- 메모리 저장소 유지: 가장 단순하지만 Vercel serverless 재시작과 테스트 데이터 reset 요구를 만족하지 못한다.

## 결과

- 앱은 `DATABASE_URL` 존재 여부로 Postgres 저장소와 memory fallback을 선택한다.
- Postgres schema는 MVP 속도를 위해 제품의 nested 필드를 JSONB로 저장한다.
- vote는 `(launch_id, viewer_id)` unique toggle 정책을 유지한다.
- launch 표시 vote count는 seed의 `base_vote_count`와 실제 vote row 수를 합산한다.
- newsletter와 maker submission은 Postgres에 영속 저장한다.
- `/admin` reset은 MVP 편의성 때문에 보호하지 않으며, 외부 공유 시 누구나 초기화할 수 있는 리스크를 수용한다.
- GitHub Actions에는 Vercel deploy secret을 저장하지 않는다.
- GitHub Actions coverage는 PR 댓글과 job summary에 표시하되, MVP 단계에서는 threshold gate로 merge를 막지 않는다.

## 후속 작업

- [ ] Vercel 프로젝트에 `DATABASE_URL`을 설정한다.
- [ ] Vercel 프로젝트 Root Directory를 `apps/web`으로 설정한다.
- [ ] GitHub branch protection에서 `CI / verify`를 required check로 설정한다.
- [ ] 배포 전 `npm run db:reset -w apps/web`으로 seed 상태를 복원한다.
- [ ] `/admin` 보호 방식이 필요해지면 `ADMIN_RESET_TOKEN` 또는 Auth ADR을 작성한다.
- [ ] 운영자 큐레이션이 필요해지면 product/contest 관리 API와 관리자 화면을 별도 ADR로 결정한다.
