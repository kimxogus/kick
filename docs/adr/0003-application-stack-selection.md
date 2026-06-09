# 0003. 애플리케이션 스택 선택

- 상태: Proposed
- 날짜: 2026-06-09
- 관련 문서: `ARCHITECTURE.md`, `TODO.md`

## 맥락

MVP는 1주 안에 사내 행사에서 시연되어야 한다. backend, frontend, DB, 배포가 모두 필요하지만 비용 부담은 낮아야 한다.

현재는 제품/기술 요구사항이 확정되지 않았으므로 앱 스택을 바로 고정하지 않는다.

## 결정

아직 결정하지 않는다. 아래 후보를 팀 논의 후 하나로 확정한다.

## 고려한 선택지

- Vercel + Supabase: 빠른 웹 배포, Auth/DB/Storage 통합이 쉽다. Supabase 의존도가 커진다.
- Vercel + Neon: Postgres 중심으로 단순하게 시작하기 좋다. Auth/Storage는 별도 선택이 필요하다.
- Cloudflare Pages/Workers + D1: 저비용 edge 배포에 강하다. 로컬 개발과 DB 생태계 선택지가 제한될 수 있다.

## 결과

- 앱 디렉터리와 패키지 구조는 후보로만 문서화한다.
- 실제 `apps/`, `packages/`, schema, migration은 이 ADR이 `Accepted`가 된 뒤 생성한다.
- 스택 확정 전 구현은 문서와 agent harness 스캐폴딩에 한정한다.

## 후속 작업

- [ ] 팀의 배포 계정과 선호 플랫폼을 확인한다.
- [ ] Auth 요구사항을 확정한다.
- [ ] 이미지 저장과 검색 요구사항을 확정한다.
- [ ] 선택한 스택의 초기 검증 명령을 문서화한다.
