# TODO.md

## 제품 기획

- [x] 정식 서비스명을 `kick`으로 확정한다.
- [ ] 탐색자 시연 시나리오를 작성한다.
- [ ] 제작자 MCP/Skill 시연 시나리오를 작성한다.
- [ ] MVP 사용자 여정을 화면 단위로 작성한다.
- [ ] Product Hunt, Disquiet, Fairy에서 반드시 벤치마크할 화면과 기능을 정리한다.
- [ ] 실제 서비스 기반 seed 데이터 후보를 수집한다.
- [ ] Weekly vote 정책을 결정한다.
- [ ] Search 범위를 결정한다.
- [ ] Newsletter UI 범위를 정의한다.
- [ ] kick contest를 MVP 데이터 모델에 포함할지 결정한다.
- [ ] 응원 결제/후원 UX를 MVP에 포함할지 결정한다.

## 기술 결정

- [ ] 앱 스택 ADR을 `Accepted`로 확정한다.
- [ ] DB와 migration 도구를 결정한다.
- [ ] Auth provider와 로그인 정책을 결정한다.
- [ ] 배포 환경과 preview 환경을 결정한다.
- [ ] 이미지 저장 위치를 결정한다.
- [ ] 검색 구현 방식을 결정한다.
- [ ] 운영자 큐레이션 백엔드와 AI Slop 필터링 후속 ADR을 작성한다.

## 문서

- [x] `SPEC.md`에 `kick` 서비스명과 MVP 시연 범위를 반영한다.
- [x] `ARCHITECTURE.md`에 백엔드 최소화와 제작자 런칭 보조 범위를 반영한다.
- [ ] `docs/adr/0005-agent-assisted-launch-flow.md`를 팀과 검토한다.
- [ ] `docs/adr/`에 Auth, vote, search, deployment ADR을 추가한다.
- [ ] 팀 논의 후 `ROADMAP.md`의 milestone을 채운다.

## 구현

- [ ] 실패 테스트 또는 검증 시나리오를 먼저 작성하는 TDD 흐름을 프로젝트 명령에 반영한다.
- [ ] 앱 스캐폴딩을 생성한다.
- [ ] seed 데이터 로딩 방식을 구현한다.
- [ ] Weekly board MVP를 구현한다.
- [ ] Product 소개 페이지 MVP를 구현한다.
- [ ] Vote MVP를 구현한다.
- [ ] Search MVP를 구현한다.
- [ ] Newsletter UI를 구현한다.
- [ ] 제작자 등록 MVP를 구현한다.

## Agent Harness

- [ ] `product-kick` Skill 이름을 `kick-launch-assistant`로 변경할지 결정한다.
- [ ] 제작자 런칭 보조 Skill을 실제 제품 등록 사례로 테스트한다.
- [ ] MCP tool 계약을 팀과 검토한다.
- [ ] MCP 서버 구현 여부와 범위를 ADR로 결정한다.
- [ ] Codex/Claude 설정 검증 방법을 README에 반영한다.
