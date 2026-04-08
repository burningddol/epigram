# Epigram

> 짧은 글귀로 감정을 기록하고 나누는 커뮤니티 웹 애플리케이션

**배포**: [epigram.vercel.app](https://epigram.vercel.app) &nbsp;|&nbsp; **기간**: 2026.03 – 2026.04

---

## 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [기술 스택](#기술-스택)
3. [주요 기능](#주요-기능)
4. [아키텍처 설계](#아키텍처-설계)
5. [SDD + AI 개발 프로세스](#sdd--ai-개발-프로세스)
6. [보안 설계: BFF 프록시 패턴](#보안-설계-bff-프록시-패턴)
7. [하이브리드 렌더링 전략](#하이브리드-렌더링-전략)
8. [스크린샷](#스크린샷)

---

## 프로젝트 개요

에피그램은 글귀(Epigram)를 등록·검색·좋아요하고, 오늘의 감정을 기록해 월별 감정 흐름을 시각화하는 커뮤니티 플랫폼입니다.

이 프로젝트에서 특히 집중한 것은 **기능 구현 자체**보다 **어떻게 개발할 것인가**입니다. SDD(Spec-Driven Development) 방법론으로 설계를 문서화하고, Claude AI를 개발 파이프라인에 통합해 단독 개발자가 팀 수준의 품질 게이트를 유지하는 체계를 만들었습니다.

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | Next.js 15 (App Router), React 19 |
| 언어 | TypeScript 5 |
| 서버 상태 | TanStack React Query v5 |
| 전역 상태 | Zustand v4 |
| 폼 & 검증 | React Hook Form v7 + Zod v3 |
| 스타일링 | Tailwind CSS v4 |
| HTTP | Axios (CSR) / fetch (SSR) |
| 인증 | 카카오 OAuth 2.0 + HttpOnly 쿠키 |
| 시각화 | Recharts (파이 차트), react-calendar (감정 달력) |
| 아이콘 | Lucide React |
| 배포 | Vercel |

---

## 주요 기능

### 에피그램 CRUD
- 글귀 작성, 수정, 삭제 (인증 필요)
- 태그 기반 분류, 출처·작가 입력
- 좋아요 토글 (낙관적 업데이트)

### 무한 스크롤 피드
- `useInfiniteQuery` + `IntersectionObserver` 조합
- 페이지 단위 API 호출, 스크롤 하단 도달 시 자동 페이지네이션
- 스켈레톤 UI로 로딩 상태 표시

### 실시간 검색
- 키워드 검색 + 무한 스크롤
- 최근 검색어 localStorage 저장

### 감정 기록 & 시각화
- 5가지 감정(감동·행복·고민·슬픔·분노) 일별 기록
- 월간 감정 달력 + 감정 비율 파이 차트
- KST 시간대 기반 날짜 처리 (`Intl.DateTimeFormat` 싱글톤 캐싱)

### 카카오 OAuth 로그인
- 인가 코드 → BFF → 백엔드 토큰 교환 흐름
- 토큰을 HttpOnly 쿠키에만 저장, 클라이언트 JS 접근 불가

### 전역 모달 시스템
- Zustand `modalStore`로 모달 상태 중앙화
- 루트 레이아웃 `<ModalProvider />` 단일 마운트
- 접근성: 모달 외부 콘텐츠 `inert` 처리, 포커스 자동 복원

---

## 아키텍처 설계

### Feature-Sliced Design (FSD)

레이어 간 단방향 의존성을 강제하는 FSD 아키텍처를 적용했습니다. 상위 레이어만 하위 레이어를 참조할 수 있으며, 같은 레이어의 슬라이스끼리는 직접 import가 금지됩니다.

```
app (라우팅)
 └── views (페이지 단위 UI 조합)
      └── widgets (복합 UI 블록)
           └── features (사용자 인터랙션)
                └── entities (비즈니스 모델)
                     └── shared (전역 공통)
```

```
src/
├── app/                    # Next.js 라우팅 전담 (page.tsx는 views 위임만)
├── views/                  # 페이지 컴포넌트 (landing, login, mypage 등)
├── widgets/                # header, epigram-feed, comment-section, mypage-activity
├── features/               # auth, epigram-like, epigram-search, emotion-select 등
├── entities/               # epigram, user, comment, emotion-log
└── shared/                 # api, ui, hooks, lib, types, config
```

각 슬라이스 내부는 `ui/`, `model/`, `api/` 로 관심사를 분리하고 `index.ts`로만 외부 노출합니다.

### 상태 관리 계층 분리

같은 '상태'라도 성격에 따라 담당 도구를 엄격히 구분했습니다.

| 상태 유형 | 도구 | 예시 |
|-----------|------|------|
| 서버 상태 (API 데이터) | React Query | 에피그램 목록, 댓글, 사용자 정보 |
| 전역 클라이언트 상태 | Zustand | 인증, 모달 제어 |
| 지역 UI 상태 | useState | 탭 선택, 토글 |
| 폼 상태 | React Hook Form + Zod | 글귀 작성, 로그인 폼 |

---

## SDD + AI 개발 프로세스

이 프로젝트의 가장 큰 특징은 **Spec-Driven Development(SDD)** 방법론과 **Claude AI**를 결합한 반자동화 개발 파이프라인입니다.

### 1단계: 명세 설계 (speckit)

코드를 한 줄 작성하기 전에 [speckit](https://speckit.ai)으로 전체 기능 명세를 문서화했습니다.

```
specs/001-epigram-core-pages/
├── spec.md          # 6개 사용자 스토리 + 55개 인수 시나리오 (Given-When-Then)
├── plan.md          # 아키텍처 결정, 기술 스택 선택 근거, 렌더링 전략 표
├── data-model.md    # 엔티티 정의, 관계, Zod 스키마 설계
├── research.md      # 외부 API 조사, 라이브러리 비교
├── tasks.md         # Phase 1~6 태스크 분해 (T001~T090+)
└── contracts/
    ├── bff-proxy.md    # BFF 프록시 API 계약
    ├── auth.md         # 인증 엔드포인트 request/response 스키마
    ├── epigrams.md     # 에피그램 CRUD 계약
    ├── comments.md     # 댓글 계약
    └── emotion-logs.md # 감정 기록 계약
```

명세가 실제 구현의 기준이 됩니다. 백엔드 Swagger와 명세가 충돌하면 Swagger를 우선합니다. 계획과 실제 사이의 간극을 코드가 아닌 문서에서 먼저 발견하는 것이 목표입니다.

**인수 시나리오 예시 (spec.md):**
```
시나리오: 로그인한 사용자가 에피그램에 좋아요를 누른다
  Given 사용자가 로그인되어 있다
  And /epigrams/:id 페이지에 접속했다
  When 좋아요 버튼을 클릭한다
  Then 좋아요 수가 1 증가한다
  And 버튼 상태가 '좋아요 취소'로 바뀐다
  And 새로고침 후에도 좋아요 상태가 유지된다
```

### 2단계: 개발 헌법 (Constitution v1.0.0)

`.specify/memory/constitution.md`에 프로젝트 전반에 걸쳐 지켜야 할 원칙을 선언했습니다. 단순한 코딩 스타일 가이드가 아니라, **헌법처럼 다른 모든 관행보다 우선하는 최상위 규칙**입니다.

```
I.   명확성 우선     — guard clause, 중첩 2단계 제한, 명확한 네이밍
II.  타입 안전성     — any 금지 (NON-NEGOTIABLE), Zod 런타임 검증
III. 컴포넌트 설계   — 관심사 분리, function 키워드, 세 줄의 코드 > 추상화
IV.  상태 관리       — 서버/전역/지역/폼 상태 도구를 명확히 구분
V.   에러 처리       — ErrorBoundary 선언적 처리, 상위 전파 원칙
VI.  성능과 사용성   — 조기 최적화 금지, 실제 문제 있을 때만 최적화
VII. 보안            — HttpOnly 쿠키, localStorage 토큰 저장 금지
```

### 3단계: Claude AI 에이전트 설정

`CLAUDE.md`는 Claude AI에게 이 프로젝트에서 어떻게 작동해야 하는지 지시하는 에이전트 컨텍스트 파일입니다. 단순한 설명서가 아니라, AI가 세션마다 읽어 일관된 방식으로 작동하도록 하는 **런타임 프롬프트**입니다.

```markdown
# CLAUDE.md 핵심 지시 내용

## 필수 초기화 (코드 작성 전 반드시 읽어야 할 파일)
- constitution.md — 모든 코드 작성 원칙
- plan.md         — 태스크 컨텍스트 및 설계 의도
- 관련 spec, contracts 문서

⚠️ 위 파일들을 읽기 전까지 코드를 한 줄도 작성하지 않는다. 예외 없음.

## 필수 워크플로우 (매 태스크마다)
1. GitHub 이슈 생성
2. git pull origin main (브랜치 생성 전 반드시)
3. 브랜치 생성: feat/#이슈번호-설명
4. 구현
5. simplify 스킬로 리팩토링
6. format → lint → build 통과 확인
7. PR 생성 (본문에 Closes #이슈번호 포함)
8. CI 통과 후 머지
```

Claude AI는 이 지시를 받아 매 태스크마다 자동으로 이슈를 생성하고, 올바른 브랜치를 만들고, 백엔드 Swagger를 확인한 뒤 구현합니다.

### 4단계: 반자동화 실행 흐름

실제 개발 사이클은 다음과 같이 진행됩니다.

```
개발자: "T053 에피그램 상세 페이지 좋아요 기능 구현해줘"

Claude AI:
  1. constitution.md + spec.md + contracts/epigrams.md 읽기
  2. GitHub 이슈 #253 생성 → 브랜치 feat/#253-epigram-like 생성
  3. Swagger에서 PATCH /epigrams/:id/like 스펙 확인
  4. entities/epigram/api/ 에 useEpigramLike 훅 구현
  5. features/epigram-like/ui/ 에 LikeButton 컴포넌트 구현
  6. /simplify 스킬 실행 → 코드 품질 자동 리뷰 및 리팩토링
  7. npm run format && npm run lint && npm run build 통과 확인
  8. git commit → git push → PR 생성 (Closes #253 포함)

개발자: PR 내용 검토 → 머지
```

**단독 개발자가 유지하는 품질 게이트:**
- 모든 태스크에 이슈·PR 연결 → 추적 가능한 변경 이력
- CI(lint + build)를 통과하지 않으면 머지 불가
- 구현 직후 `simplify` 리팩토링으로 코드 냄새 즉시 제거
- Figma REST API로 시안 값 추출 → 임의 스타일 작성 방지

### 성과

이 프로세스로 **90개 이상의 태스크**를 약 1개월 만에 완료했습니다. 각 태스크는 독립적인 GitHub 이슈와 PR로 관리되며, 모든 변경은 문서화된 명세에 근거합니다.

커밋 메시지의 일관성이 이를 보여줍니다:

```
feat: 에피그램 좋아요 토글 구현 (#253)
fix: 마이페이지 감정 캘린더 KST 시간대 적용 (#273)
refactor: Intl.DateTimeFormat 싱글톤 캐싱 및 날짜 추출 간소화 (#273)
fix: QueryClient 싱글톤 패턴 적용 (#269)
```

---

## 보안 설계: BFF 프록시 패턴

JWT 토큰을 클라이언트 JavaScript에 노출하지 않기 위해 **Backend For Frontend(BFF)** 패턴을 적용했습니다.

```
클라이언트 (브라우저)
    │ axios 요청 (쿠키 자동 포함)
    ▼
BFF 프록시 (Next.js API Routes /api/[...path])
    │ 1. 쿠키에서 accessToken 추출 → Authorization 헤더 주입
    │ 2. 백엔드로 실제 요청 전달
    │ 3. 응답의 accessToken/refreshToken → HttpOnly 쿠키로 변환
    │ 4. 토큰 제거 후 클라이언트에 응답 반환
    ▼
외부 백엔드 API
```

**핵심 구현 포인트:**

1. **토큰 은닉**: 백엔드 응답 body의 토큰을 HttpOnly 쿠키로 교체해 JS `document.cookie` 접근 차단

2. **자동 토큰 갱신**: 401 응답 수신 시 refreshToken으로 새 accessToken 발급 → 원래 요청 재시도 → 실패 시 쿠키 삭제

3. **ISR 캐시 분리**: BFF는 `cache: "no-store"` 고정이므로, 공개 데이터는 서버 컴포넌트에서 백엔드를 **직접 fetch**해 ISR 캐싱을 활용

4. **BFF 전용 로그아웃**: `POST /api/auth/logout`은 백엔드 호출 없이 쿠키만 삭제 (토큰 revoke 엔드포인트 미제공 대응)

---

## 하이브리드 렌더링 전략

**"인증 필요 여부"** 를 렌더링 전략 결정의 유일한 기준으로 삼았습니다.

| 페이지 | ISR/SSG (서버 컴포넌트) | CSR (React Query) |
|--------|------------------------|-------------------|
| `/epigrams` | 에피그램 목록 (`revalidate: 30`) | — |
| `/epigrams/[id]` | 에피그램 본문 (`revalidate: 60`) | 좋아요 상태, 댓글 |
| `/search` | — | 검색 결과 전체 |
| `/addepigram` | — | 폼 전체 |
| `/mypage` | — | 감정 달력, 차트, 프로필 |
| `/login`, `/signup` | 전체 (`force-static`) | — |

서버 컴포넌트는 `BACKEND_URL`에 직접 fetch하고, 클라이언트 컴포넌트는 axios로 BFF(`/api/...`)를 통해 요청합니다. 두 경로가 명확히 분리되어 있어 캐싱 전략과 보안 정책이 충돌하지 않습니다.

동적 라우트(`/epigrams/[id]`)는 `generateStaticParams`로 최근 20개 에피그램을 빌드 시 정적 생성하고, 나머지는 요청 시 ISR로 처리합니다.

---

## 스크린샷

> 추후 추가 예정

---

## 로컬 실행

```bash
# 의존성 설치
npm install

# 환경변수 설정 (.env.local)
BACKEND_URL=https://fe-project-epigram-api.vercel.app
TEAM_ID=your-team-id
KAKAO_CLIENT_ID=your-kakao-client-id
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# 개발 서버 실행
npm run dev
```
