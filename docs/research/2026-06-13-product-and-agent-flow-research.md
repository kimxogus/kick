# 2026-06-13 제품/에이전트 플로우 리서치

## 목적

`kick`의 MVP 설계 업데이트를 위해 제품 런칭 서비스, agent Skill, MCP tool, AI UX 가이드라인을 확인했다.

이번 리서치는 구현 스택 확정이 아니라 아래 설계 판단을 돕기 위한 것이다.

- 탐색자/제작자 2개 시연 플로우 구성
- 제작자 런칭 보조 Skill/MCP 범위
- 운영자 큐레이션을 MVP 시연에서 제외하고 후속 설계로 분리하는 판단
- newsletter UI와 contest의 MVP 범위

## 조회/참고한 자료

- Product Hunt leaderboard: https://www.producthunt.com/leaderboard/weekly/2020/23
- Product Hunt launch: https://www.producthunt.com/launch
- Disquiet: https://disquiet.io
- Fairy explore: https://fairy.hada.io/explore
- Model Context Protocol tools: https://modelcontextprotocol.io/docs/concepts/tools
- Claude Code skills: https://docs.claude.com/en/docs/claude-code/skills
- OpenAI Codex manual: https://developers.openai.com/codex/codex-manual.md
- Microsoft HAX Toolkit: https://www.microsoft.com/en-us/haxtoolkit/library/
- NIST AI Risk Management Framework: https://www.nist.gov/itl/ai-risk-management-framework

Product Hunt는 2026-06-13 curl 조회 시 Cloudflare challenge로 본문 접근이 제한되었다. 설계 반영은 사용자가 제공한 벤치마크 URL, 서비스의 공개적으로 알려진 board/launch 구조, 다른 접근 가능한 공식/공개 자료를 함께 기준으로 삼았다.

## 리서치 요약

### 제품 탐색 경험

Product Hunt의 weekly leaderboard는 기간 단위 board와 vote 중심 탐색 경험을 제공한다. `kick`도 MVP에서 Weekly board를 기본값으로 두고, Daily/Monthly/Yearly는 확장 후보로 남기는 것이 적합하다.

Disquiet는 IT 서비스 메이커들이 프로젝트를 공유하는 소셜 네트워크로 자신을 설명한다. `kick`은 커뮤니티 피드보다 제품 발견과 런칭 산출물에 집중해 중간 지점을 잡는다.

Fairy explore는 프로젝트 탐색, 검색, 추천, 응원 CTA를 한 화면에서 제공한다. `kick`은 MVP에서 결제/후원까지 구현하지 않더라도 newsletter UI와 vote를 통해 가벼운 반응 경로를 제공할 수 있다.

### 제작자 런칭 보조

Claude Code Skill 문서는 Skill이 `SKILL.md`와 supporting files를 통해 반복 작업을 확장한다고 설명한다. Codex 매뉴얼도 Skill을 반복 워크플로, references, optional scripts로 구성하고 progressive disclosure를 권장한다.

따라서 제작자 런칭 보조는 Skill에 적합하다. Skill은 제품 정보 수집, 누락 질문, 타겟 분석, 셀링 포인트 정리, 홍보 문구 생성처럼 대화형 절차가 중요한 작업을 맡는다.

MCP tool은 모델이 외부 시스템과 상호작용하는 수단이며, MCP 문서는 tool이 model-controlled임을 전제로 human-in-the-loop와 사용자 확인을 권장한다. 따라서 `submit`처럼 DB write 또는 공개 제출 성격이 있는 tool은 승인 흐름을 기본값으로 둬야 한다.

MCP tools 문서는 structured content와 output schema를 다룬다. `kick`의 분석 결과와 등록 payload는 자유 텍스트만 반환하지 말고 schema가 있는 JSON 결과로 설계하는 것이 좋다.

### AI UX와 큐레이션

Microsoft HAX Toolkit은 AI가 무엇을 할 수 있는지, 얼마나 잘하는지, 왜 그렇게 판단했는지, 사용자가 어떻게 수정하거나 피드백할 수 있는지 드러내는 가이드라인을 제공한다. 제작자 런칭 보조 결과에는 확신도보다 근거, 리스크, 추가 확인 질문을 함께 노출하는 것이 좋다.

NIST AI RMF는 AI 시스템의 위험 관리와 신뢰성을 강조한다. 운영자 큐레이션과 AI Slop 필터링은 실제 서비스화 단계에서 필요하지만, 1주 MVP에서는 백엔드 구현보다 수동 seed 보정과 명시적 후속 과제로 관리하는 것이 합리적이다.

## 설계 반영

- 서비스명은 `kick`으로 확정하고, 기능명으로 `Kick`을 사용하지 않는다.
- MVP 시연은 탐색자와 제작자 플로우를 모두 포함한다.
- 운영자 큐레이션 플로우는 MVP 시연에서 제외하고 후속 백엔드/관리자 기능으로 둔다.
- Weekly board를 MVP 기본값으로 두고 period 확장성을 남긴다.
- Newsletter는 실제 발송 없이 UI만 제공한다.
- kick contest는 후순위 확장 기능으로 둔다.
- 제작자 런칭 보조 Skill/MCP는 제품 분석, 타겟 분석, 셀링 포인트, 피드백, 홍보 산출물, 등록 payload 초안을 다룬다.
- 공개 제출 또는 DB write 성격의 MCP tool은 승인 흐름을 필수로 둔다.

## 후속 리서치 필요

- 앱 스택 후보별 무료 플랜, preview 배포, DB/Storage 제한 비교
- 실제 서비스 seed 데이터 수집 기준
- vote abuse 방지와 익명/로그인 정책
- newsletter 실제 발송을 할 경우 사용할 provider
- 운영자 큐레이션 백엔드와 AI Slop 필터링 기준
