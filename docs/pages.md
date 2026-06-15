# 데모 페이지 명세 — kick

> 이 문서는 `main`에서 추가된 정적 데모 아이디어를 보존하되, 현재 MVP 구현 기준에 맞게 재정렬한 기획 보조 문서다.
> 실제 구현 source of truth는 [docs/contracts/mvp-ui-contract.md](contracts/mvp-ui-contract.md)이며, 제품 요구사항 단일 기준은 [SPEC.md](../SPEC.md)다.

## MVP 정보 구조

Next.js App Router 기준 화면은 아래 4개를 우선한다.

| 페이지 | route | 한 줄 역할 |
| --- | --- | --- |
| Weekly board | `/` | 이번 주 제품 탐색, 검색, 태그 필터, vote, newsletter 진입점 |
| Product 소개 | `/products/[slug]` | Skill/MCP가 만든 런칭 콘텐츠와 제품 상세 정보 |
| Maker assist | `/maker` | 제품 분석, 홍보 산출물 생성, 등록 payload 준비 |
| Submission preview | `/submissions/[id]` | 제작자가 저장한 제출 후보 preview |

Contest, 댓글, 창작자 메시지는 데모 확장 아이디어로 유지하되 MVP 필수 구현 계약에는 포함하지 않는다.

## 1. Weekly board

처음 보는 사람이 곧바로 제품을 탐색할 수 있는 첫 화면이다. 마케팅 랜딩보다 실제 제품 카드와 vote 흐름을 우선한다.

내용:

- 서비스명과 한 줄 포지셔닝.
- 이번 주 제품 목록과 rank.
- 제품명, 한 줄 소개, 썸네일, 태그, maker, comment count, vote count.
- 검색 input과 태그 필터.
- vote 버튼. MVP 정책은 `viewer_id`와 launch 조합 기준 toggle이다.
- Newsletter 구독 UI.
- 제작자 flow로 이동하는 CTA.

어필:

- **완성도**: 실제 서비스 기반 seed 데이터로 빈 화면을 피한다.
- **실용성**: 탐색자가 제품을 찾고 반응을 남기는 루프를 즉시 보여준다.

## 2. Product 소개

kick의 핵심 강점을 증명하는 페이지다. 제작자 런칭 보조가 만든 정제된 소개가 제품 상세에 반영된다.

내용:

- 제품명, 한 줄 소개, 태그, 제품 URL 또는 demo URL.
- 큰 preview 이미지 또는 썸네일.
- 제품 설명, 대상 사용자, 주요 use case.
- 런칭페이지 초안, 카드뉴스 문구, 채널별 홍보 카피는 제작자 산출물과 상세 소개 영역에서 표현한다.
- maker 정보, related products, vote 버튼.
- Newsletter 구독 UI.

어필:

- **참신성**: 사람이 처음부터 작성하지 않아도 agent가 제품을 설득력 있게 정리한다.
- **품질 강점**: 직접 홍보의 들쑥날쑥함을 줄이고 일정한 소개 포맷을 제공한다.

## 3. Maker assist

제작자가 agent에게 제품을 올려 달라고 요청했을 때 어떤 산출물이 만들어지는지 보여주는 시연 화면이다.

내용:

- 제품명, URL, 설명 초안, 대상 사용자, 해결 문제, 주요 기능 입력.
- 분석 실행 버튼.
- 핵심 어필 포인트, 타겟 분석, 셀링 포인트, 차별점, 개선 피드백과 리스크.
- 한 줄 소개, 상세 소개, 추천 태그.
- 런칭페이지 초안, 카드뉴스 문구, 채널별 홍보 카피.
- 등록 payload preview와 제출 후보 저장 버튼.

어필:

- **참신성**: 글 작성 보조를 넘어 등록 payload 준비까지 이어진다.
- **완성도**: 발표 중 실제로 agent에게 요청하는 장면 또는 녹화 백업과 연결하기 좋다.

## 4. Submission preview

MVP에서 제작자 제출 후보가 어떻게 저장되고 확인되는지 보여준다.

내용:

- 제출 상태.
- 제품명, 한 줄 소개, 상세 설명.
- 태그와 maker note.
- Weekly board 자동 반영은 MVP에서 제외한다는 안내.

## 후순위 데모 아이디어

- Contest: 개최/상금/마감 기반 등록이 가능하다는 비전을 보여준다. MVP에서는 결제와 상세 운영 흐름을 구현하지 않는다.
- 댓글: 제품 상세의 가벼운 소통과 제작자 피드백으로 확장한다.
- 창작자 1:1 메시지: 협업 요청과 업데이트 소식 채널로 확장한다.

## 공통 요소

- 글로벌 네비는 Weekly board, Maker assist, 주요 제품 상세 이동을 우선한다.
- 반응형 화면에서 텍스트와 버튼이 겹치지 않아야 한다.
- 실제 서비스 기반 seed 데이터를 사용해 콘텐츠 밀도를 확보한다.
- UI 구현은 [docs/contracts/mvp-ui-contract.md](contracts/mvp-ui-contract.md)의 필수 상태와 검증 기준을 따른다.
