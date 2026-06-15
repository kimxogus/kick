# 0003. MVP 실행 및 배포 전략 선택

- 상태: Accepted
- 날짜: 2026-06-09
- 갱신: 2026-06-13
- 관련 문서: `README.md`, `SPEC.md`, `ARCHITECTURE.md`, `TODO.md`, `ROADMAP.md`, `docs/research/2026-06-13-product-and-agent-flow-research.md`

## 맥락

MVP는 1주 안에 사내 행사에서 시연되어야 한다. 핵심 목표는 완전한 production 시스템이 아니라 탐색자와 제작자 2개 플로우를 안정적으로 보여주는 것이다.

2026-06-13 제품 방향 업데이트로 서비스명은 `kick`으로 확정되었고, MVP 시연은 탐색자와 제작자 2개 플로우에 집중한다. 백엔드 로직은 최소화하고, UI 완성도와 제작자용 MCP/Skill 데모 완성도를 최우선으로 둔다.

초기에는 웹 앱, 데이터 저장소, 원격 인프라를 모두 별도로 결정해야 한다고 보았지만, 현재 MVP 목적에서는 빠른 시연 가능성과 낮은 비용이 더 중요하다.

OpenAI Codex Sites는 Codex에서 웹사이트와 웹 앱을 저장, 배포, 점검할 수 있는 preview 기능이다. Sites는 saved version과 deploy 단계를 분리하고, Cloudflare Worker-compatible ES module output을 요구한다. 지속 데이터가 필요하면 D1, 업로드 파일이 필요하면 R2를 선택할 수 있다. Codex pricing 문서는 Sites가 preview 기간 무료이며 가격 정보는 추후 제공될 예정이라고 설명한다.

다만 Sites plugin 접근, workspace 권한, Enterprise RBAC, preview 정책 변화로 발표 직전에 막힐 수 있다. 따라서 Sites를 우선하되, 정적 파일 로컬 실행 또는 localhost 실행 fallback을 반드시 유지해야 한다.

## 결정

MVP 실행과 배포 전략은 아래 2-track으로 확정한다.

1. 1순위는 OpenAI Codex Sites다.
   - Codex Sites로 saved version을 만들고, 발표 전 검토한다.
   - 발표용 공유가 가능하면 승인된 saved version을 deploy한다.
   - 배포 직후에는 deployment status와 production URL을 확인한다.
2. 필수 fallback은 정적 파일 로컬 실행 또는 localhost 실행이다.
   - Sites 접근, 권한, preview 정책, plugin 설치, 배포 실패가 발생해도 MVP 시연이 가능해야 한다.
   - fallback 실행 명령은 앱 구현 단계에서 README 또는 별도 실행 문서에 기록한다.
3. D1/R2는 MVP 필수 요구사항이 아니다.
   - seed 데이터와 UI 시연은 우선 정적 데이터 또는 앱 내부 데이터로 처리한다.
   - 지속 데이터, 사용자 기록, 업로드 파일이 실제로 필요해질 때만 D1/R2를 요청한다.
4. 로컬 Skill 분석/등록 로직의 backend mirror는 선택 과제다.
   - 발표 전 시간이 남을 때만 backend로 일부 옮긴다.
   - 이 경우에도 Skill 출력 payload와 backend 입력 계약을 먼저 문서화한다.

## 고려한 선택지

- Codex Sites 우선 + 로컬 fallback: Codex 기반 개발/배포 흐름을 시연에 활용할 수 있고 비용 부담이 낮다. 다만 preview 기능과 workspace 권한에 의존한다.
- 로컬/localhost 전용: 가장 단순하고 발표 리스크가 낮다. 다만 팀이 보여주고 싶은 Codex 기반 배포 경험과 외부 공유 가능성이 약해진다.
- Vercel + Supabase: 빠른 웹 배포, Auth/DB/Storage 통합이 쉽다. MVP 1주 범위에서는 별도 계정/프로젝트/권한 설정과 Supabase 의존도가 부담이다.
- Vercel + Neon: Postgres 중심으로 단순하게 시작하기 좋다. Auth/Storage는 별도 선택이 필요하고, MVP 시연에는 과한 결정이 될 수 있다.
- Cloudflare Pages/Workers + D1: Sites와 런타임 방향이 가깝고 저비용 edge 배포에 강하다. 다만 Sites가 제공하는 Codex 통합 경험을 직접 쓰지 못한다.

## 평가 기준

- 1주 내 앱 스캐폴딩과 시연 실행이 가능한가
- 무료 또는 저비용으로 발표용 URL을 확보할 수 있는가
- Sites가 막혀도 로컬 fallback으로 시연 가능한가
- Weekly board, Product 소개 페이지, vote, newsletter UI를 빠르게 만들 수 있는가
- 실제 서비스 기반 seed 데이터를 쉽게 노출할 수 있는가
- 제작자용 MCP/Skill 데모와 충돌하지 않는가
- 백엔드 로직을 최소화하고 필요한 API만 둘 수 있는가
- 발표 전 시간이 남을 경우 Skill 로직을 backend로 옮길 여지를 남기는가

## 결과

- 앱 구현은 Sites 호환 빌드 산출물을 만들 수 있는 구조를 우선 고려한다.
- Sites에서 구현할 수 있는 backend는 임의의 상시 실행 서버가 아니라 Cloudflare Worker-compatible app/API 범위로 제한해 해석한다.
- `.openai/hosting.json`은 Sites linkage와 D1/R2 binding 이름만 저장한다. secret 값은 저장하지 않는다.
- Sites 배포는 saved version 검토 후 승인된 version만 deploy한다.
- 새 Sites 배포는 기본적으로 `admins_only` 또는 제한된 접근으로 검토하고, 발표 공유가 필요할 때 `workspace_all` 또는 `custom` 접근으로 전환한다.
- Sites 실패 시 로컬 정적 파일 실행 또는 localhost dev server로 시연해도 MVP 완료 조건을 충족한다.
- 원격 DB, Auth, Storage는 MVP 핵심 시연의 필수 조건이 아니다.
- 운영자 큐레이션 백엔드와 AI Slop 필터링은 MVP 시연 범위에서 제외하므로 스택 선택의 필수 조건으로 두지 않는다.

## 후속 작업

- [ ] Codex Sites plugin 접근 가능 여부를 확인한다.
- [ ] Business/Enterprise workspace 권한과 RBAC 필요 여부를 확인한다.
- [ ] Sites saved version 생성과 deploy 절차를 앱 구현 후 검증한다.
- [ ] fallback 정적 파일 실행 또는 localhost 실행 명령을 문서화한다.
- [ ] Auth 요구사항을 확정한다.
- [ ] 이미지 저장과 검색 요구사항을 확정한다.
- [ ] seed 데이터 로딩 방식을 확정한다.
- [ ] Skill 출력 payload와 backend mirror 입력 계약을 문서화할지 결정한다.
