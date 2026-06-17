---
name: kick
description: kick 등록과 제품 상세 페이지 생성을 돕는다. 사용자가 "kick 스킬을 참고해서 내 제품 올려줘"처럼 요청하면 저장소 문서를 읽어 제품 핵심을 추출·정제·분류하고, 메모리 store에 등록한 뒤 상세 페이지 URL을 알려준다.
---

# 제품 런칭 보조 (kick 등록)

사용자가 제품을 kick에 올려달라고 하면, 저장소 문서를 근거로 제품 상세 페이지에 필요한 내용을 자동으로 채워 등록하고 상세 URL을 안내한다. Skill 이름과 서비스명이 모두 `kick`이다.

## 사용할 때

- "kick에 (이) 제품 올려줘", "kick 스킬로 등록해줘" 같은 요청을 받을 때
- 저장소의 제품을 kick 상세 페이지로 만들고 싶을 때

## 사람에게 받는 입력

- 거의 없음. 제품명조차 문서에서 먼저 찾는다.
- **제품명**: `package.json`의 `name`, README 제목, 문서의 서비스명 등에서 찾는다. 어디에서도 못 찾으면 **마지막 단계에서 한 번만** 사용자에게 묻는다.
- URL은 받지 않는다.

## 절차

1. 저장소 문서를 폭넓게 읽는다: `README.md`, `SPEC.md`, `ARCHITECTURE.md`, `docs/**`, `package.json`, 주요 소스의 상단 주석 등.
2. 제품의 핵심(무엇을, 누구를 위해, 어떤 문제를, 어떻게 해결)을 추출한다.
3. 제품명을 결정한다(문서 우선, 없으면 마지막에 질문).
4. 카테고리를 아래 고정 택소노미에서 **정확히 1개** 고른다.
5. 제품 성격에 가장 가까운 emoji **1개**를 추천한다.
6. 상세 페이지 필드를 사용자 이득 중심으로 생성한다(아래 페이로드).
7. 과장 표현, 검증되지 않은 수치, 경쟁사 비방을 제거한다. 한국어로 쓰되 제품명·고유명사는 원문 유지.
8. 실행 중인 dev 서버(`http://localhost:3000`)의 `POST /api/products`에 페이로드를 보낸다.
9. 응답의 `detailUrl`을 사용자에게 안내한다. 사용자가 그 URL로 들어가 확인하는 것으로 끝낸다.

자세한 추출·작성 기준은 `references/product-registration-workflow.md`를 따른다.

## 카테고리 택소노미 (이 중 1개)

`생산성`, `개발 도구`, `리서치`, `업무 자동화`, `노코드`, `엔터테인먼트`, `교육`, `마케팅`, `여행`

적합한 것이 없으면 가장 가까운 항목을 고른다.

## 등록 페이로드 (`POST /api/products`)

```json
{
  "name": "제품명",
  "emoji": "🧭",
  "category": "생산성",
  "tagline": "한 줄 소개",
  "description": "상세 소개(2~4문장)",
  "kickPoint": "이 제품의 핵심 한 줄",
  "tags": ["AI", "Productivity"],
  "targetUsers": ["대상 사용자1", "대상 사용자2"],
  "useCases": ["대표 사용 사례1", "사용 사례2"],
  "cardNewsCopy": ["카드뉴스 1", "카드뉴스 2", "카드뉴스 3"],
  "targetMessages": [
    { "audience": "대상1", "message": "그 대상에게 주는 가치" }
  ],
  "maker": { "name": "메이커/팀 이름" }
}
```

- `name`, `category`, `tagline`, `description`, `kickPoint`는 필수.
- `maker.name`은 git author, README, `package.json`의 author 등에서 추론한다. 없으면 생략 가능.
- 나머지 배열은 비어도 되지만 가능한 채운다.

호출 예:

```bash
curl -s -X POST http://localhost:3000/api/products \
  -H 'content-type: application/json' \
  -d '<위 JSON>'
# 응답: { "product": {...}, "launch": {...}, "detailUrl": "/products/<slug>" }
```

## 제약

- 등록은 메모리(파일 백업) store에만 반영되며 **서버를 재시작하면 사라진다**. 영속 저장/DB 아님.
- dev 서버가 실행 중이어야 한다(`npm run dev -w apps/web`).
- 상세 페이지의 "관련 제품"은 시스템이 고정으로 채우므로 생성하지 않는다.
- 좋아요 수·댓글 수 등은 시스템이 0에서 시작한다.
