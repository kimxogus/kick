# MCP Contract 초안

이 문서는 제작자 런칭 보조 MCP 서버를 만들 경우 필요한 tool 후보와 계약을 정리한다. 실제 구현 전에는 ADR로 범위와 보안 정책을 확정해야 한다.

## 원칙

- v1은 3~5개의 명확한 tool에서 시작한다.
- 사용자 제공 제품 정보와 외부 URL은 신뢰하지 않는다.
- tool output은 UI와 agent가 재사용할 수 있도록 구조화한다.
- 분석과 초안 생성은 자동 실행 가능하지만, DB write, 공개 제출, 외부 전송은 승인 흐름을 기본값으로 둔다.
- tool 이름은 서비스명 `kick`과 기능명이 혼동되지 않도록 역할 중심으로 짓는다.
- 실제 MCP 서버가 생기기 전까지 `.codex/config.toml`과 `.mcp.json`은 inert 상태로 둔다.

## Tool 후보

### `analyze_product_positioning`

제품 설명, URL, 대상 사용자, 기능 목록을 받아 타겟과 셀링 포인트 후보를 추출한다.

입력 후보:

- `product_name`
- `description`
- `website_url`
- `target_users`
- `features`
- `competitors`

출력 후보:

- `target_segments`
- `selling_points`
- `differentiators`
- `risks_or_unknowns`
- `follow_up_questions`

### `draft_launch_assets`

제품 등록과 시연에 사용할 홍보 산출물 초안을 만든다.

입력 후보:

- `product_name`
- `positioning`
- `target_segments`
- `tone`
- `channels`

출력 후보:

- `tagline`
- `description`
- `tags`
- `launch_page_copy`
- `card_news_copy`
- `channel_copy`

### `review_launch_copy`

생성된 홍보 문구에서 과장, 검증되지 않은 주장, 불명확한 타겟, 누락 정보를 점검한다.

입력 후보:

- `product_name`
- `draft_assets`
- `source_facts`

출력 후보:

- `warnings`
- `suggested_edits`
- `missing_fields`
- `approval_readiness`

### `prepare_kick_submission`

제품 제출 전 누락된 정보를 점검하고 kick 등록 payload 초안을 만든다.

입력 후보:

- `product`
- `draft_assets`
- `links`
- `assets`

출력 후보:

- `missing_fields`
- `warnings`
- `submission_payload`

### `submit_kick_candidate`

검토된 제품 후보를 kick에 제출한다.

입력 후보:

- `submission_payload`
- `approval_token`

출력 후보:

- `submission_id`
- `status`
- `review_url`

보안 메모:

- 실제 공개 또는 DB write가 발생하므로 승인 흐름이 필수다.
- MVP에서 제외할 수 있다.

## 후속 결정

- [ ] v1에서 실제 구현할 tool 목록
- [ ] 각 tool의 JSON schema
- [ ] 승인 흐름이 필요한 tool 목록
- [ ] Codex와 Claude Code의 MCP 설정 방식
- [ ] 제출 payload와 앱 DB schema의 매핑
