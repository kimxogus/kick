# Vercel 배포 운영 가이드

## 목적

kick MVP는 Vercel Git Integration으로 배포한다. GitHub Actions는 production deploy를 수행하지 않고, PR과 `main` push에서 test, coverage, typecheck, build 결과를 제공한다.

## Vercel 프로젝트 설정

- Git Provider: GitHub
- Repository: `kimxogus/kick`
- Root Directory: `apps/web`
- Framework Preset: `Next.js`
- Production Branch: `main`
- Build Command: Vercel 기본 Next.js build 설정을 사용한다.
- Install Command: Vercel 기본 npm install 설정을 사용한다.

Vercel은 PR마다 preview deployment를 만들고, `main` push 이후 production deployment를 만든다. GitHub Actions에서 `vercel deploy`를 실행하지 않는다.

## 환경 변수

Vercel Dashboard에서 아래 값을 설정한다.

- `DATABASE_URL`: Neon Postgres connection string

비밀 값은 GitHub Actions secret이나 repo 파일에 저장하지 않는다. `.env.local`, `.vercel/project.json`, 실제 database URL은 커밋하지 않는다.

## Neon 운영

- Neon은 Vercel Marketplace integration 또는 수동 `DATABASE_URL` 등록 중 하나로 연결한다.
- 배포 전 또는 발표 직전 seed 복원이 필요하면 로컬에서 `DATABASE_URL`을 설정한 뒤 `npm run db:reset -w apps/web`을 실행한다.
- 배포된 앱에서는 `/admin` direct route에서 seed reset을 실행할 수 있다.
- `/admin`은 MVP 편의성 때문에 무보호 direct URL로 유지한다. 외부 공유 URL에서는 누구나 reset할 수 있는 리스크를 수용한다.

## GitHub Actions 역할

- `CI / verify`: coverage 포함 테스트, typecheck/lint, production build를 실행한다.
- Coverage는 job summary와 PR 댓글에 기록한다.
- Coverage threshold gate는 MVP 단계에서 설정하지 않는다.
- PR 댓글 작성 job만 `pull-requests: write` 권한을 사용한다.
- Deploy secret은 GitHub Actions에 등록하지 않는다.

## Branch Protection 권장값

GitHub `main` branch protection에서 아래를 설정한다.

- Require status checks before merging: 켬
- Required status check: `CI / verify`
- Vercel preview deployment check는 참고 신호로 사용한다.
- Vercel production deploy는 merge 후 `main` push에 의해 실행된다.

## 로컬 fallback

Vercel 또는 Neon 설정이 막히면 production build 후 localhost에서 시연한다.

```bash
npm install
npm run test:run -w apps/web
npm run build -w apps/web
npm run start -w apps/web -- --port 3000
```

Coverage 확인은 아래 명령을 사용한다.

```bash
npm run test:coverage -w apps/web
```
