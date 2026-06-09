# ADR

ADR은 Architecture Decision Record의 약자이며, 프로젝트의 주요 기술/제품 결정을 기록한다.

## 파일명

```text
NNNN-kebab-case-title.md
```

예:

```text
0001-project-documentation-system.md
```

## 상태

- `Proposed`: 제안되었으나 확정 전
- `Accepted`: 채택되어 현재 기준
- `Superseded`: 다른 ADR로 대체됨
- `Rejected`: 채택하지 않음

## 작성 규칙

- 새 결정은 `docs/adr/0000-template.md`를 복사해 작성한다.
- 결정 배경, 고려한 선택지, 결과, 후속 작업을 반드시 적는다.
- 구현 전에 관련 ADR을 먼저 `Accepted` 또는 명확한 `Proposed` 상태로 둔다.
- 대체 결정이 생기면 기존 ADR을 지우지 말고 `Superseded`로 갱신한다.
