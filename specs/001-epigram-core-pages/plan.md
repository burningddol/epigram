# 구현 계획: Epigram 전체 페이지 핵심 기능

**브랜치**: `001-epigram-core-pages` | **작성일**: 2026-04-03 | **명세서**: [spec.md](spec.md)

---

## 요약

Epigram은 에피그램(짧은 글귀) CRUD와 커뮤니티 기능을 제공하는 Next.js 웹 애플리케이션이다.
FSD(Feature-Sliced Design) 아키텍처를 적용하고, BFF 프록시 패턴으로 JWT 토큰을 HttpOnly 쿠키로 관리하여 보안을 강화한다.
인증(일반 + 카카오 OAuth), 에피그램 CRUD, 좋아요, 댓글, 무한 스크롤 검색, 감정 기록 & 시각화(달력/파이 차트), 마이페이지를 구현한다.

---

## 기술 컨텍스트

**언어/버전**: TypeScript 5.x + Node.js 20 LTS
**프레임워크**: Next.js 14 (App Router)
**주요 의존성**:
- UI: Tailwind CSS (공용 컴포넌트 직접 구현 — 외부 컴포넌트 라이브러리 미사용)
- 서버 상태: TanStack React Query v5
- 전역 상태: Zustand v4
- 폼: React Hook Form v7 + Zod v3
- HTTP: fetch (BFF 내부) / axios (클라이언트 → BFF)
- 인증: 카카오 OAuth 2.0
- 시각화: recharts (파이 차트) + react-calendar (감정 달력)

**스토리지**: 없음 (외부 백엔드 API 전담, 로컬: localStorage - 검색어만)
**테스트**: Vitest + React Testing Library (단위), Playwright (E2E - 선택)
**배포 플랫폼**: Vercel (Next.js 최적화 환경)
**프로젝트 타입**: 웹 애플리케이션 (풀스택 Next.js, BFF 포함)
**성능 목표**: 초기 로드 3초 이내, 무한 스크롤 추가 로드 1.5초 이내, 검색 결과 2초 이내
**제약사항**: 이미지 파일명 영문만, 백엔드 `teamId` 경로 파라미터 서버 환경변수 필수
**규모/범위**: 단일 개발자, 9개 페이지, 6개 핵심 사용자 스토리

---

## 헌법 체크

*GATE: Phase 0 연구 시작 전 통과 필수. Phase 1 설계 후 재확인.*

| 원칙 | 상태 | 확인 내용 |
|------|------|-----------|
| I. 명확성 우선 | ✅ 통과 | 네이밍 규칙(isLoading, handleClick 등), guard clause, 중첩 최대 2단계 준수 계획 |
| II. 타입 안전성 | ✅ 통과 | `any` 금지, Zod로 API 응답 런타임 검증, 모든 Props interface 정의 계획 |
| III. 컴포넌트 설계 | ✅ 통과 | FSD 레이어별 역할 분리, 비즈니스 로직은 커스텀 훅/entities로 추출 |
| IV. 상태 관리 | ✅ 통과 | 서버 상태 React Query, 전역 클라이언트 Zustand, 폼 RHF, 지역 useState 명확 분리 |
| V. 에러 처리 | ✅ 통과 | ErrorBoundary 적용, BFF 프록시에서 에러 일관 처리, 사용자/내부 에러 분리 |
| VI. 성능과 사용성 | ✅ 통과 | useInfiniteQuery 무한 스크롤, Next.js Image 최적화, 조기 최적화 금지 |
| VII. 보안 | ✅ 통과 | BFF 프록시 HttpOnly 쿠키, 환경변수 관리, Zod 입력 검증, localStorage 토큰 저장 금지 |

**복잡도 추적**: 헌법 위반 없음 — Complexity Tracking 불필요.

---

## 프로젝트 구조

### 문서 (이 기능)

```text
specs/001-epigram-core-pages/
├── plan.md              # 이 파일
├── research.md          # Phase 0 산출물
├── data-model.md        # Phase 1 산출물
├── quickstart.md        # Phase 1 산출물
├── contracts/           # Phase 1 산출물 (BFF API 계약)
│   ├── bff-proxy.md
│   ├── auth.md
│   ├── epigrams.md
│   ├── comments.md
│   └── emotion-logs.md
└── tasks.md             # Phase 2 산출물 (/speckit-tasks 명령)
```

### 소스 코드 (FSD 아키텍처)

```text
src/
│
├── app/                              # Next.js App Router (라우팅 전담)
│   ├── page.tsx                      # / 랜딩 페이지
│   ├── login/page.tsx                # /login
│   ├── signup/page.tsx               # /signup
│   ├── oauth/callback/
│   │   └── kakao/page.tsx            # /oauth/callback/kakao (인가 코드 처리 → /epigrams)
│   ├── epigrams/
│   │   ├── page.tsx                  # /epigrams 메인 홈
│   │   └── [id]/
│   │       ├── page.tsx              # /epigrams/:id 상세
│   │       └── edit/page.tsx         # /epigrams/:id/edit 수정
│   ├── addepigram/page.tsx           # /addepigram 작성
│   ├── search/page.tsx               # /search 검색
│   ├── mypage/page.tsx               # /mypage 마이페이지
│   ├── api/
│   │   └── [...path]/route.ts        # BFF 프록시 catch-all
│   ├── layout.tsx                    # 루트 레이아웃 (QueryProvider, 네비게이션바)
│   └── middleware.ts                 # 인증 보호 미들웨어
│
├── views/                            # FSD Pages 레이어 (Next.js pages/ 충돌 방지)
│   ├── landing/
│   ├── login/
│   ├── signup/
│   ├── epigrams/
│   ├── epigram-detail/
│   ├── epigram-edit/
│   ├── add-epigram/
│   ├── search/
│   └── mypage/
│
├── widgets/                          # FSD Widgets 레이어
│   ├── header/
│   ├── epigram-feed/
│   ├── epigram-card/
│   ├── comment-section/
│   └── mypage-activity/
│
├── features/                         # FSD Features 레이어
│   ├── auth/
│   ├── epigram-create/
│   ├── epigram-edit/
│   ├── epigram-delete/
│   ├── epigram-like/
│   ├── comment-create/
│   ├── comment-edit/
│   ├── comment-delete/
│   └── epigram-search/
│
├── entities/                         # FSD Entities 레이어
│   ├── epigram/
│   │   ├── api/
│   │   ├── model/
│   │   └── index.ts
│   ├── user/
│   │   ├── api/
│   │   ├── model/
│   │   └── index.ts
│   ├── comment/
│   │   ├── api/
│   │   ├── model/
│   │   └── index.ts
│   └── emotion-log/
│       ├── api/
│       ├── model/
│       └── index.ts
│
└── shared/                           # FSD Shared 레이어
    ├── api/                          # axios 인스턴스, BFF 클라이언트
    ├── ui/                           # Button, Input, Modal, Tag 등
    ├── hooks/                        # useScrollToTop, useIntersectionObserver 등
    ├── lib/                          # 날짜 포맷, 클립보드 등 유틸
    ├── config/                       # 환경변수, 상수
    └── types/                        # 공통 타입
```

**구조 결정**: FSD(Feature-Sliced Design) 단일 Next.js 프로젝트.
`app/` 디렉토리는 순수 라우팅만 담당하고, 실제 UI는 `pages/` 레이어 컴포넌트에 위임한다.
BFF 프록시는 `app/api/[...path]/route.ts` catch-all 라우트로 구현한다.

### 공통 컴포넌트 구현 원칙

외부 컴포넌트 라이브러리(shadcn/ui 등)를 사용하지 않고 직접 구현한다. 구현 범위는 이 프로젝트에서 실제로 사용하는 것으로만 제한한다.

**Modal — 전역 제어 방식**
- Zustand store에 모달 상태(열림/닫힘, 표시할 컴포넌트)를 관리하는 슬라이스를 둔다.
- 루트 레이아웃에 `<ModalProvider />`를 단 하나 마운트하고, store 상태에 따라 모달을 렌더링한다.
- 각 사용처에서 `useModal()` 훅으로 모달을 열고 닫는다. 개별 컴포넌트에 모달 상태를 직접 두지 않는다.
- 확인/취소 패턴의 단순 확인 모달(`ConfirmModal`)을 기본 제공한다.
- 접근성: 모달이 열릴 때 모달 외부 콘텐츠에 `inert` 속성을 적용하여 포커스·키보드·스크린리더 접근을 차단한다. 모달이 닫히면 `inert`를 제거하고 이전 포커스 위치로 복원한다.

**그 외 공통 컴포넌트 (Button, Input, Tag 등)**
- 이 프로젝트의 피그마 시안에 존재하는 variant와 상태만 구현한다. 범용 라이브러리처럼 모든 경우를 대비한 과도한 prop 설계를 금지한다.
- 추상화 없이 단순하게 유지한다 — 세 줄의 비슷한 코드가 조기 추상화보다 낫다.
