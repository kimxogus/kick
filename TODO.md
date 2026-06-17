# TODO.md

## 제품 기획

- [x] 정식 서비스명을 `kick`으로 확정한다.
- [x] Product Hunt weekly leaderboard와 Launch Guide를 `컴퓨터` 도구로 재수집한다.
- [x] Weekly vote MVP 정책을 결정한다.
- [x] Search MVP 범위를 결정한다.
- [x] 공개 contest는 MVP에서 읽기 전용 목록으로만 제공한다.
- [ ] 탐색자 시연 시나리오를 작성한다.
- [ ] 제작자 MCP/Skill 시연 시나리오를 작성한다.
- [ ] MVP 사용자 여정을 화면 단위로 작성한다.
- [ ] Disquiet, Fairy에서 반드시 벤치마크할 화면과 기능을 정리한다.
- [x] main 샘플 HTML 제품과 실제 서비스 기반 초기 콘텐츠를 병합한다.
- [ ] Newsletter UI 범위를 정의한다.
- [ ] 등록 Skill이 보장할 품질 기준을 정의한다.
- [ ] 응원 결제/후원 UX를 MVP에 포함할지 결정한다.

## 기술 결정

- [x] MVP 실행/배포 전략 ADR을 `Accepted`로 확정한다.
- [x] 앱 프레임워크를 Next.js App Router로 결정한다.
- [x] MVP DB는 Neon Postgres 우선, `DATABASE_URL` 없는 환경은 fixture/memory fallback으로 결정한다.
- [x] MVP Auth는 로그인 없이 local `viewer_id`로 결정한다.
- [x] fallback localhost 실행 명령을 문서화한다.
- [x] Codex Sites plugin 접근 가능 여부를 확인한다.
- [x] Vercel + Neon Postgres 영속화 ADR을 작성한다.
- [x] Vercel Git Integration과 GitHub Actions CI 역할을 분리한다.
- [ ] Vercel 프로젝트에 `DATABASE_URL`을 설정한다.
- [ ] Vercel 프로젝트 Root Directory를 `apps/web`으로 설정한다.
- [ ] GitHub branch protection에 `CI / verify` required check를 설정한다.
- [ ] 발표 전 `npm run db:reset -w apps/web` 또는 `/admin`으로 seed 상태를 복원한다.
- [ ] 이미지/카드뉴스 생성·저장 방식을 결정한다.
- [ ] Skill→MCP 전환 시 서버 API 스펙을 정의한다.
- [ ] 공개 제품 등록 API의 인증, 승인, rate limit 정책을 결정한다.
- [ ] 중복 제품 제출 방지와 idempotency key 도입 여부를 결정한다.
- [ ] 잘못 등록된 제품의 관리자 삭제/수정 경로를 설계한다.
- [ ] 제품 등록 감사 로그와 운영 모니터링 범위를 정의한다.
- [ ] 운영자 큐레이션 백엔드와 AI Slop 필터링 후속 ADR을 작성한다.
- [ ] 발표 전 여유가 있을 경우 로컬 Skill 분석/등록 로직의 backend mirror 범위를 검토한다.

## 문서

- [x] `SPEC.md`에 `kick` 서비스명과 MVP 시연 범위를 반영한다.
- [x] `ARCHITECTURE.md`에 백엔드 최소화와 제작자 런칭 보조 범위를 반영한다.
- [x] `docs/adr/0003-application-stack-selection.md`를 MVP 실행/배포 전략으로 갱신한다.
- [x] `docs/research/2026-06-13-product-and-agent-flow-research.md`에 Product Hunt 재수집과 Codex Sites 근거를 반영한다.
- [x] `docs/adr/0006-nextjs-mvp-application-stack.md`에 Next.js 앱 스택 결정을 기록한다.
- [x] `docs/adr/0007-vercel-neon-postgres-persistence.md`에 Vercel + Neon Postgres 영속화 결정을 기록한다.
- [x] `docs/deployment/vercel.md`에 Vercel Git Integration과 CI 운영 방식을 기록한다.
- [x] `docs/contracts/mvp-data-and-api-contract.md`에 MVP 데이터/API 계약을 작성한다.
- [x] `docs/contracts/mvp-ui-contract.md`에 MVP UI 계약을 작성한다.
- [x] `docs/pitch.md`에 콘테스트 피치와 심사 어필 전략을 정리한다.
- [x] `docs/pages.md`에 데모 페이지 아이디어와 MVP UI 계약 연결을 정리한다.
- [x] MVP contest 읽기 전용 화면 계약을 문서화한다.
- [ ] `docs/adr/0005-agent-assisted-launch-flow.md`를 팀과 검토한다.
- [ ] `docs/adr/`에 Auth, vote, search ADR을 추가한다.
- [ ] 팀 논의 후 `ROADMAP.md`의 milestone을 채운다.

## 구현

- [x] 실패 테스트 또는 검증 시나리오를 먼저 작성하는 TDD 흐름을 프로젝트 명령에 반영한다.
- [x] 앱 스캐폴딩을 생성한다.
- [x] 초기 콘텐츠 로딩 방식을 구현한다.
- [x] Weekly board MVP를 구현한다.
- [x] Product 소개 페이지 MVP를 구현한다.
- [x] Vote MVP를 구현한다.
- [x] Search MVP를 구현한다.
- [x] Newsletter UI를 구현한다.
- [x] 제작자 등록 MVP를 구현한다.
- [x] 공개 contest 읽기 전용 화면을 구현한다.
- [x] Neon Postgres schema와 seed reset 스크립트를 구현한다.
- [x] `/admin` direct reset 화면을 구현한다.
- [x] GitHub Actions test/lint/build와 coverage report workflow를 구성한다.
- [ ] 라이브 데모와 녹화 백업을 준비한다.

## Agent Harness

- [ ] `product-kick` Skill 이름을 `kick-launch-assistant`로 변경할지 결정한다.
- [ ] 제작자 런칭 보조 Skill을 실제 제품 등록 사례로 테스트한다.
- [ ] 등록 Skill을 런칭 페이지·카드뉴스·카피 생성 흐름에 맞게 확장한다.
- [ ] `kick` plugin release 시 manifest version bump와 CHANGELOG 갱신을 자동 검증에 포함할지 결정한다.
- [ ] GitHub repo `kimxogus/kick` 기준 Codex plugin 설치를 실제 사용자 환경에서 검증한다.
- [ ] Claude CLI가 설치된 환경에서 `claude plugin validate ./plugins/kick`와 `claude --plugin-dir ./plugins/kick`를 검증한다.
- [ ] MCP tool 계약을 팀과 검토한다.
- [ ] MCP 서버 구현 여부와 범위를 ADR로 결정한다.
- [ ] Codex/Claude 설정 검증 방법을 README에 반영한다.
