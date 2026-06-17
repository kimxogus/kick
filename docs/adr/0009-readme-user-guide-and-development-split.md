# 0009. README 사용자 가이드와 DEVELOPMENT 개발 가이드 분리

- 상태: Accepted
- 날짜: 2026-06-17
- 관련 문서: `README.md`, `DEVELOPMENT.md`, `AGENTS.md`, `docs/README.md`

## 맥락

kick 메인 페이지는 GitHub README로 plugin 설치 안내를 연결한다. 기존 `README.md`는 프로젝트 현황, 로컬 실행, 테스트, 문서 맵, plugin 설치 안내가 섞여 있어 메인 페이지에서 들어온 사용자가 설치와 제품 등록 절차를 빠르게 찾기 어렵다.

반대로 개발자와 agent에게는 로컬 실행, DB reset, test/build, plugin sync/check, 문서 운영 규칙이 계속 필요하다.

## 결정

`README.md`는 사용자용 빠른 온보딩 문서로 전환한다.

- kick 소개와 공식 서비스 URL
- Codex와 Claude Code의 GitHub repo 기반 plugin 설치 명령
- 제품 등록 요청 문구
- 등록 결과 상세 페이지 확인 방법
- 공식 URL에 테스트 제품을 등록하지 말라는 주의
- 간단한 troubleshooting

개발자용 내용은 `DEVELOPMENT.md`에서 관리한다.

- 로컬 실행과 검증 명령
- Neon Postgres와 seed reset
- coverage와 UI smoke
- 문서와 ADR 운영 규칙
- repo-local Skill과 배포용 plugin sync/check

## 고려한 선택지

- `README.md`에 모든 내용을 유지: 한 파일에서 찾을 수 있지만 사용자 설치 안내가 묻힌다.
- `CONTRIBUTING.md`로 이동: GitHub 표준 기여 문서명이나 현재 내용은 PR/이슈 규칙보다 개발 절차에 가깝다.
- `DEVELOPMENT.md`로 이동: 로컬 개발과 검증 절차라는 실제 내용과 가장 잘 맞는다.

## 결과

- 메인 페이지의 README 링크는 사용자 설치 가이드로 바로 연결된다.
- 개발자와 agent는 `DEVELOPMENT.md`를 로컬 실행과 검증의 진입점으로 사용한다.
- 문서 구조 참조에서 `README.md`는 사용자 문서, `DEVELOPMENT.md`는 개발자 문서로 구분한다.
