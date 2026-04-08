# Epigram

짧은 글귀로 감정을 기록하고 나누는 커뮤니티 웹 애플리케이션

**배포** [epigram.vercel.app](https://epigram-flax.vercel.app/) · **기간** 2026.04.03 – 04.09 · **개발** 1인 (SDD + Claude AI 파이프라인)

---

## 핵심 요약

> **이 프로젝트의 초점은 "무엇을 만들었는가"가 아니라 "어떻게 만들었는가"입니다.**
>
> Spec-Driven Development로 설계를 문서화하고, Claude AI를 개발 파이프라인에 통합하여
> 1인 개발에서도 팀 수준의 품질 게이트(이슈 추적 → CI → 코드 리뷰 → 머지)를 유지했습니다.

---

## SDD + AI 개발 파이프라인

### 전체 흐름

```
명세 설계 (speckit) → 프로젝트 헌법 수립 → Claude AI 에이전트 설정 → 반자동화 실행
```

### Step 1. 명세 설계

코드 한 줄 작성 전에 [speckit](https://speckit.ai)으로 전체 기능 명세를 문서화했습니다.

```
specs/001-epigram-core-pages/
├── spec.md             # 6개 사용자 스토리 · 55개 인수 시나리오 (Given-When-Then)
├── plan.md             # 아키텍처 결정 · 렌더링 전략
├── data-model.md       # 엔티티 정의 · Zod 스키마
├── tasks.md            # Phase 1~6 태스크 분해 (T001~T090+)
└── contracts/          # BFF 프록시 · 인증 · CRUD · 감정 기록 API 계약
```

명세와 백엔드 Swagger가 충돌하면 **Swagger 우선** — 계획과 현실의 간극을 코드가 아닌 문서에서 먼저 발견하는 것이 목표입니다.

### Step 2. 프로젝트 헌법

`.specify/memory/constitution.md`에 모든 관행보다 우선하는 최상위 규칙을 선언했습니다.

| 원칙        | 핵심 규칙                                     |
| ----------- | --------------------------------------------- |
| 타입 안전성 | `any` 금지 (NON-NEGOTIABLE) · Zod 런타임 검증 |
| 명확성      | guard clause · 중첩 2단계 제한                |
| 보안        | HttpOnly 쿠키 · localStorage 토큰 저장 금지   |
| 컴포넌트    | 관심사 분리 · 세 줄의 코드 > 추상화           |
| 성능        | 조기 최적화 금지 · 실제 문제 있을 때만 최적화 |

### Step 3. Claude AI 에이전트

`CLAUDE.md`로 AI가 세션마다 읽어 일관되게 작동하도록 런타임 프롬프트를 설정했습니다.

```
필수 초기화: constitution.md → plan.md → 관련 spec/contracts 읽기
            ⚠️ 위 파일을 읽기 전까지 코드 작성 금지. 예외 없음.

필수 워크플로우:
  이슈 생성 → git pull → 브랜치 생성 → 구현 → simplify 리팩토링
  → format/lint/build 통과 → PR 생성 (Closes #이슈) → CI 통과 후 머지
```

### Step 4. 실제 실행 사이클

```
개발자: "T053 에피그램 상세 페이지 좋아요 기능 구현해줘"

Claude AI:
  ① constitution.md + spec.md + contracts/epigrams.md 읽기
  ② GitHub 이슈 #253 생성 → feat/#253-epigram-like 브랜치
  ③ Swagger에서 PATCH /epigrams/:id/like 확인
  ④ useEpigramLike 훅 + LikeButton 컴포넌트 구현
  ⑤ /simplify → 코드 품질 리뷰 · 리팩토링
  ⑥ format → lint → build 통과
  ⑦ PR 생성 (Closes #253) → 개발자 검토 → 머지
```

**품질 게이트**: 모든 태스크에 이슈·PR 연결 / CI 미통과 시 머지 불가 / simplify 리팩토링 즉시 적용 / Figma REST API로 디자인 값 추출

---

## 기술 스택

| 분류              | 선택                                              |
| ----------------- | ------------------------------------------------- |
| Framework         | Next.js 15 (App Router) · React 19 · TypeScript 5 |
| Server State      | TanStack React Query v5                           |
| Client State      | Zustand v4                                        |
| Form & Validation | React Hook Form v7 + Zod v3                       |
| Styling           | Tailwind CSS v4                                   |
| Auth              | 카카오 OAuth 2.0 · HttpOnly 쿠키 (BFF 프록시)     |
| Deploy            | Vercel (ISR + force-static 하이브리드)            |

---

## 아키텍처

### Feature-Sliced Design

레이어 간 **단방향 의존성**을 강제합니다. 같은 레이어의 슬라이스끼리는 직접 import 금지.

```
app → views → widgets → features → entities → shared
```

```
src/
├── app/          # 라우팅 전담 (page.tsx는 views에 위임)
├── views/        # 페이지 컴포넌트
├── widgets/      # header, epigram-feed, comment-section
├── features/     # auth, epigram-like, epigram-search, emotion-select
├── entities/     # epigram, user, comment, emotion-log
└── shared/       # api, ui, hooks, lib, types, config
```

### 상태 관리 계층

| 상태 유형       | 도구                  | 예시                             |
| --------------- | --------------------- | -------------------------------- |
| 서버 상태       | React Query           | 에피그램 목록, 댓글, 사용자 정보 |
| 전역 클라이언트 | Zustand               | 인증, 모달 제어                  |
| 지역 UI         | useState              | 탭 선택, 토글                    |
| 폼              | React Hook Form + Zod | 글귀 작성, 로그인                |

---

## 보안: BFF 프록시 패턴

JWT를 클라이언트 JavaScript에 **절대 노출하지 않는** 구조입니다.

```
Browser (axios, 쿠키 자동 포함)
  → BFF (Next.js API Routes /api/[...path])
      ① 쿠키에서 accessToken 추출 → Authorization 헤더 주입
      ② 백엔드로 요청 전달
      ③ 응답 토큰 → HttpOnly 쿠키로 변환
      ④ 토큰 제거 후 클라이언트에 반환
  → 외부 백엔드 API
```

| 구현 포인트       | 설명                                                                                |
| ----------------- | ----------------------------------------------------------------------------------- |
| 토큰 은닉         | 백엔드 응답 body의 토큰을 HttpOnly 쿠키로 교체, `document.cookie` 접근 차단         |
| 자동 갱신         | 401 → refreshToken으로 재발급 → 원래 요청 재시도 → 실패 시 쿠키 삭제                |
| ISR 캐시 분리     | BFF는 `no-store` 고정, 공개 데이터는 서버 컴포넌트에서 백엔드 직접 fetch로 ISR 활용 |
| BFF 전용 로그아웃 | 토큰 revoke 엔드포인트 미제공 → 쿠키만 삭제하는 독립 엔드포인트 설계                |

---

## 하이브리드 렌더링 전략

**판단 기준은 단 하나: 인증 필요 여부**

| 페이지              | 서버 렌더링 (ISR/SSG)   | 클라이언트 렌더링 (React Query) |
| ------------------- | ----------------------- | ------------------------------- |
| `/epigrams`         | 목록 (`revalidate: 30`) | —                               |
| `/epigrams/[id]`    | 본문 (`revalidate: 60`) | 좋아요, 댓글                    |
| `/search`           | —                       | 검색 결과 전체                  |
| `/mypage`           | —                       | 감정 달력, 차트, 프로필         |
| `/login`, `/signup` | 전체 (`force-static`)   | —                               |

동적 라우트는 `generateStaticParams`로 최근 20개를 빌드 시 정적 생성, 나머지는 요청 시 ISR로 처리합니다. 서버 컴포넌트는 `BACKEND_URL` 직접 fetch, 클라이언트 컴포넌트는 BFF(`/api/...`) 경유 — 두 경로가 명확히 분리되어 캐싱과 보안이 충돌하지 않습니다.

---

## 로컬 실행

```bash
npm install

# .env.local
BACKEND_URL=https://fe-project-epigram-api.vercel.app
TEAM_ID=your-team-id
KAKAO_CLIENT_ID=your-kakao-client-id
NEXT_PUBLIC_BASE_URL=http://localhost:3000

npm run dev
```
