# 0005. 제작자 런칭 보조 흐름

- 상태: Proposed
- 날짜: 2026-06-13
- 관련 문서: `SPEC.md`, `ARCHITECTURE.md`, `docs/agent-harness/mcp-contract.md`, `skills/README.md`

## 맥락

`kick`의 차별점은 제품 제작자가 홍보 문구를 직접 처음부터 쓰지 않아도 되도록 돕는 것이다. 제작자는 제품 URL, 설명 초안, 대상 사용자, 주요 기능을 제공하고, agent는 타겟 분석, 셀링 포인트, 피드백, 런칭페이지 초안, 카드뉴스 문구, 홍보 카피, 등록 payload를 생성한다.

Codex와 Claude Code 모두 Skill을 사용할 수 있어야 하며, MCP는 tool 호출을 통해 구조화된 산출물과 제출 흐름을 제공할 수 있다.

## 결정 후보

제작자 런칭 보조는 Skill과 MCP를 함께 사용 가능한 구조로 설계한다.

Skill은 아래 작업을 담당한다.

- 제품 정보 수집과 누락 질문 정리
- 타겟 사용자 분석
- 셀링 포인트와 차별점 정리
- 과장 표현, 검증되지 않은 수치, 리스크 피드백
- 한 줄 소개, 상세 소개, 태그, 런칭페이지 초안, 카드뉴스 문구, 홍보 카피 생성

MCP tool은 아래 작업을 담당한다.

- 구조화된 제품 분석 결과 생성
- kick 등록 payload 초안 생성
- 승인된 payload 제출 후보 제공

실제 DB write, 공개 제출, 외부 전송이 있는 tool은 승인 흐름을 기본값으로 둔다.

## 고려한 선택지

- Skill만 제공: 구현이 빠르고 시연 안정성이 높다. 다만 MCP 기반 참신성이 약해진다.
- MCP만 제공: 구조화된 데모는 강하지만 제작자 문구 생성 워크플로가 도구 호출에 과하게 묶인다.
- Skill과 MCP를 함께 제공: 시연 범위는 넓지만 제작자 관점에서 자연스럽고 참신성을 보여주기 좋다.

## 결과

- MVP 시연에서는 Skill 중심 흐름을 우선 만들고, MCP는 구조화된 분석과 payload 준비 흐름을 보여주는 방향으로 설계한다.
- MCP tool 이름, 입력, 출력, 승인 정책은 `docs/agent-harness/mcp-contract.md`에서 관리한다.
- 현재 `product-kick` Skill 이름은 유지하되, 서비스명 확정 이후 `kick-launch-assistant`로 변경할지 팀 결정이 필요하다.

## 후속 작업

- [ ] Skill 이름을 `product-kick`으로 유지할지 `kick-launch-assistant`로 변경할지 결정한다.
- [ ] MCP tool schema를 확정한다.
- [ ] 제출/write tool의 승인 정책을 확정한다.
- [ ] 실제 제품 등록 사례로 Skill을 테스트한다.
