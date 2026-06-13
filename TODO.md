# TODO.md

## 제품 기획

- [x] 정식 서비스명 확정 — **킥(Kick)**.
- [x] 투표 정책 확정 — 좋아요 무제한 → 주간 랭킹.
- [x] v1 등록 범위 확정 — Skill만, local data, 백엔드 없음.
- [x] Contest 결제 범위 확정 — MVP는 페이지/플로우만.
- [ ] 콘테스트 데모 시연 시나리오를 확정한다. (pitch.md 7번 기반)
- [ ] MVP 사용자 여정을 작성한다.
- [ ] Product Hunt, Disquiet, Fairy에서 벤치마크할 화면과 기능을 정리한다.
- [ ] Search 범위를 결정한다.
- [ ] 등록 Skill이 보장할 품질 기준을 정의한다 (런칭 페이지/카드뉴스/카피 최소 충족 요소).

## 기술 결정

- [ ] 프론트 스택 ADR을 `Accepted`로 확정한다.
- [ ] local data 포맷/위치와 시드 데이터 스키마를 결정한다.
- [ ] Auth 범위(익명 좋아요 허용/어뷰징 방지)를 결정한다.
- [ ] 배포 환경과 preview 환경을 결정한다.
- [ ] 이미지/카드뉴스 생성·저장 방식을 결정한다.
- [ ] 검색 구현 방식을 결정한다.
- [ ] Skill→MCP 전환 시 서버 API 스펙을 정의한다. (후순위)

## 문서

- [ ] `SPEC.md`에 MVP 성공 기준을 구체화한다.
- [ ] `ARCHITECTURE.md`에 확정 스택 기반 구조를 반영한다.
- [ ] `docs/adr/`에 Auth, vote, search, deployment ADR을 추가한다.
- [ ] 팀 논의 후 `ROADMAP.md`의 milestone을 채운다.

## 구현

- [ ] 실패 테스트 또는 검증 시나리오를 먼저 작성하는 TDD 흐름을 프로젝트 명령에 반영한다.
- [ ] 앱 스캐폴딩을 생성한다.
- [ ] 등록 Skill을 구현한다 (정보 수집 → 런칭 페이지·카드뉴스·카피 생성 → local data 기록).
- [ ] 제품 목록/상세 MVP를 구현한다.
- [ ] Weeklyboard + 좋아요 + 주간 랭킹 MVP를 구현한다.
- [ ] 댓글 MVP를 구현한다.
- [ ] Search MVP를 구현한다.
- [ ] 시드 제품 데이터를 준비한다.

## Agent Harness

- [ ] `product-kick` Skill을 킥 등록 흐름(런칭 페이지·카드뉴스·카피 생성)에 맞게 확장/테스트한다.
- [ ] local data 스키마를 Skill 출력과 프론트 입력 양쪽에서 검증한다.
- [ ] (후순위) MCP tool 계약과 서버 구현 범위를 ADR로 결정한다.
- [ ] Codex/Claude 설정 검증 방법을 README에 반영한다.
