# MCP Contract 초안

이 문서는 제품 등록을 돕는 MCP 서버를 만들 경우 필요한 tool 후보와 계약을 정리한다. 실제 구현 전에는 ADR로 범위와 보안 정책을 확정해야 한다.

## 원칙

- v1은 3~5개의 명확한 tool에서 시작한다.
- 사용자 제공 제품 정보와 외부 URL은 신뢰하지 않는다.
- 쓰기 작업이나 공개 제출 작업은 승인 흐름을 기본값으로 둔다.
- tool output은 UI와 agent가 재사용할 수 있도록 구조화한다.

## Tool 후보

### `extract_product_kick_points`

제품 설명, URL, 대상 사용자, 기능 목록을 받아 핵심 홍보 포인트 후보를 추출한다.

입력 후보:

- `product_name`
- `description`
- `website_url`
- `target_users`
- `features`

출력 후보:

- `kick_points`
- `differentiators`
- `risks_or_unknowns`

### `draft_product_listing`

제품 등록 페이지에 사용할 한 줄 소개와 상세 소개 초안을 만든다.

입력 후보:

- `product_name`
- `kick_points`
- `target_users`
- `tone`

출력 후보:

- `tagline`
- `description`
- `tags`

### `suggest_launch_copy`

Product Hunt, Disquiet, 사내 행사 시연에 맞는 홍보 문구 변형을 만든다.

입력 후보:

- `listing`
- `audience`
- `channel`

출력 후보:

- `headline`
- `short_copy`
- `long_copy`
- `call_to_action`

### `prepare_submission`

제품 제출 전 누락된 정보를 점검하고 제출 가능한 payload 초안을 만든다.

입력 후보:

- `listing`
- `assets`
- `links`

출력 후보:

- `missing_fields`
- `warnings`
- `submission_payload`

### `submit_product_candidate`

검토된 제품 후보를 플랫폼에 제출한다.

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
