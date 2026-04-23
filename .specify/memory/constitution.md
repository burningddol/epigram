<!--
  SYNC IMPACT REPORT
  ==================
  Version Change: 1.0.0 → 1.1.0
  Modified Principles:
    - I. 명확성 우선 — 주석 규칙 실질적 확장
      · "왜" 주석을 최후 수단으로 격상
      · 주석 작성 전 코드 개선 가능성 검토 메타 체크 추가
      · 기존 "왜" 주석이 현상 정당화로 변질되었는지 리팩토링 중 재검토 의무

  Added Sections: 없음 (기존 섹션 확장)
  Removed Sections: 없음

  Rationale: 2026-04-23 Phase 4 entities 리팩토링에서 스키마 nullable 미반영 상태를
    "왜" 주석으로 정당화한 사례(emotion-log/api/useTodayEmotion.ts) 발견 → 규칙 강화.

  Templates Requiring Updates:
    ✅ .specify/memory/constitution.md — 이 파일 (개정 완료)
    ✅ ~/.claude/CLAUDE.md — 글로벌 개인 설정에 동일 규칙 동기화 완료

  Deferred TODOs: 없음
-->

# Epigram Constitution

## 핵심 원칙 (Core Principles)

### I. 명확성 우선

읽기 쉬운 코드를 짧은 코드보다 우선한다.

- 중첩 삼항 연산자를 사용하지 않는다. 조건이 2개 이상이면 `if/else` 또는 `switch`를 사용한다.
- 변수명과 함수명은 목적을 명확히 드러내야 한다.
- 명백한 코드를 설명하는 주석은 작성하지 않는다. "무엇"이 아닌 "왜"를 설명하는 주석만 허용하되, **주석은 최후 수단**이다.
- "왜" 주석을 쓰고 싶어지면 먼저 코드를 바꿔서 주석 없이 의도가 드러나게 만들 수 있는지 확인한다 (타입·함수명·구조로 표현 가능하면 주석 불필요).
- 기존 "왜" 주석을 리팩토링 중 만나면 유지 결정 전에 **"이 주석이 설명하는 제약이 코드 개선으로 제거 가능한가?"**를 반드시 검토한다. 현상을 정당화하는 주석(예: 런타임 검증과 스키마 정의의 중복을 해설)은 코드부터 고친다.
- 최대 중첩 깊이: 2단계. 그 이상이면 헬퍼 함수로 추출한다.
- 함수 상단에서 null/undefined를 처리하는 guard clause(early return)를 사용한다.
- 불필요한 지역 변수를 만들지 않는다.
- 네이밍 규칙:
  - 불리언: `is`, `has`, `can` 접두사 (`isLoading`, `hasError`, `canSubmit`)
  - 이벤트 핸들러: `handle` 접두사 (`handleClick`, `handleSubmit`)
  - 데이터를 반환하는 함수: 명사형 (`getUser`, `fetchOrders`)
  - 동작을 수행하는 함수: 동사형 (`updateUser`, `deleteOrder`)

**근거**: 코드는 작성 횟수보다 읽히는 횟수가 훨씬 많다.
미래의 기여자(본인 포함)가 코드를 빠르게 파악할 수 있도록 명확성을 최우선으로 한다.

---

### II. 타입 안전성 (NON-NEGOTIABLE)

TypeScript의 타입 시스템을 완전히 활용하며, 타입 안전성을 절대 포기하지 않는다.

- `any` 금지 — 정확한 타입 또는 `unknown`을 사용한다.
- 최상위 함수에는 명시적 반환 타입을 선언한다.
- 타입 단언(`as`)은 최후 수단으로만 사용하며, 사용 시 이유를 주석으로 명시한다.
- API 응답, 외부 데이터, 폼 데이터는 반드시 Zod로 런타임 검증 후 사용한다.
- Props 타입은 `interface`로 명시적으로 정의한다.
- 임포트 순서: React/Next.js → 외부 라이브러리 → 내부 모듈 → 타입 임포트

**근거**: 런타임 에러를 컴파일 타임에 잡아 디버깅 비용을 최소화하고,
코드베이스 전체의 신뢰성을 유지한다.

---

### III. 컴포넌트 설계 원칙

React 컴포넌트는 UI에 집중하고, 비즈니스 로직과 명확히 분리한다.

- 컴포넌트는 `function` 키워드로 선언한다 (화살표 함수 사용 금지).
- 컴포넌트 파일은 불필요하게 분리하지 않는다 (관련 헬퍼 컴포넌트는 같은 파일에 둘 수 있다).
- 컴포넌트 내부에 비즈니스 로직을 과도하게 넣지 않는다. 복잡한 로직은 커스텀 훅이나 유틸 함수로 추출한다.
- 각 함수(컴포넌트 포함)는 하나의 역할만 수행한다.
- UI, 비즈니스 로직, 데이터 접근을 분리한다.
- 서버 상태와 클라이언트 상태를 구분한다: 서버 상태는 React Query, 클라이언트 UI 상태는 Zustand 또는 Context API로 관리한다.
- 세 줄의 비슷한 코드가 추상화보다 낫다. 불필요한 추상화를 만들지 않는다.

**근거**: 관심사 분리가 명확한 컴포넌트는 테스트, 재사용, 유지보수가 용이하다.

---

### IV. 상태 관리 전략

상태는 최소한으로 유지하고, 파생 가능한 값은 상태로 만들지 않는다.

- **서버 상태**: React Query (`@tanstack/react-query`) — 글 목록, 댓글, 사용자 정보 등 API 데이터
- **전역 클라이언트 상태**: Zustand — 인증 상태, 전역 UI 상태 등 여러 컴포넌트에서 공유하는 상태
- **지역 UI 상태**: React `useState` / `useReducer` — 모달 열림/닫힘, 탭 선택 등 컴포넌트 내부 상태
- **폼 상태**: React Hook Form — 모든 폼 입력/검증은 React Hook Form + Zod를 사용한다.
- 단일 진실 공급원(Single Source of Truth): 같은 데이터를 여러 곳에 두지 않는다.
- 상태는 필요한 가장 가까운 곳에 위치시킨다 (props drilling이 발생하면 컨텍스트 또는 Zustand를 고려한다).
- 비동기 상태는 `isLoading`, `isSuccess`, `isError`로 명확히 분리한다.

**근거**: 상태 관리 전략이 명확하지 않으면 동기화 오류, 불필요한 리렌더링,
디버깅 지옥이 발생한다.

---

### V. 에러 처리

에러는 상위 레벨에서 일관되게 처리하며, 선언적 에러 처리를 우선한다.

- 불필요한 `try/catch` 남용을 피한다. 컴포넌트 렌더링 에러는 `ErrorBoundary`로 선언적으로 처리한다.
- 사용자에게 보여줄 에러(토스트, 인라인 메시지)와 내부 에러(콘솔, 로깅)를 구분한다.
- API 에러는 React Query의 `onError` 콜백 또는 `error` 상태를 통해 처리한다.
- 폼 검증 에러는 Zod + React Hook Form을 통해 인라인으로 표시한다.
- 에러 처리는 발생 위치에서 바로 처리하지 않고 가능한 한 상위 레벨로 전파한다.
- 불필요한 에러 처리, 폴백, 검증을 발생하지 않을 시나리오에 추가하지 않는다.

**근거**: 일관된 에러 처리 패턴이 없으면 UX가 깨지고 디버깅이 어려워진다.

---

### VI. 성능과 사용성

성능 최적화는 실제 문제가 있을 때만 적용하며, 사용자 경험을 최우선으로 한다.

- `useMemo`, `useCallback`, `React.memo`는 실제 성능 문제가 있을 때만 사용한다. 조기 최적화를 금지한다.
- 무한 스크롤은 `IntersectionObserver`와 React Query의 `useInfiniteQuery`를 함께 사용하여 구현한다.
- 이미지는 Next.js의 `Image` 컴포넌트를 사용하여 최적화한다.
- 큰 목록(에피그램 피드)은 무한 스크롤로 처리하며, 불필요한 전체 페이지 로드를 피한다.
- 로딩 상태는 스켈레톤 UI 또는 스피너로 시각적으로 표시한다.
- 사용자 입력에 대한 즉각적인 피드백을 제공한다 (낙관적 업데이트 고려).

**근거**: 먼저 올바르게 동작하게 만들고, 그 다음 성능을 개선한다.
실제 측정 없는 최적화는 복잡도만 높인다.

---

### VII. 보안

OAuth 인증, 사용자 데이터, API 통신에서 보안을 철저히 유지한다.

- OAuth(카카오 로그인) 토큰은 HttpOnly 쿠키에 저장하며, localStorage에 절대 저장하지 않는다.
- API 요청에는 항상 인증 토큰을 포함하며, 인증이 필요한 페이지는 미들웨어로 보호한다.
- 사용자 입력은 항상 Zod로 검증한 후 사용한다 (XSS, 인젝션 방지).
- 민감한 정보(API 키, 시크릿)는 반드시 환경 변수로 관리하며, 클라이언트 번들에 포함하지 않는다.
- CORS 정책을 올바르게 설정하고, Next.js API Routes에서 적절한 검증을 수행한다.

**근거**: 커뮤니티 플랫폼은 다수의 사용자 데이터를 다루므로, 보안 취약점은
치명적인 결과를 초래할 수 있다.

---

## 기술 스택 및 아키텍처

### 핵심 기술 스택

| 분류 | 기술 | 용도 |
|------|------|------|
| 프레임워크 | Next.js (App Router) | 라우팅, SSR/SSG, API Routes |
| 언어 | TypeScript | 전체 코드베이스 |
| 서버 상태 관리 | TanStack React Query | API 데이터 패칭, 캐싱, 무한 스크롤 |
| 스타일링 | Tailwind CSS | 유틸리티 기반 스타일링 |
| 전역 클라이언트 상태 | Zustand | 인증 상태, 전역 UI 상태 |
| 지역/공유 상태 | React Context API | 테마, 지역 범위 공유 상태 |
| 폼 관리 | React Hook Form + Zod | 폼 입력, 검증, 타입 추론 |
| HTTP 클라이언트 | fetch (기본) / axios | API 통신 |
| 인증 | OAuth (카카오 로그인) | 소셜 로그인 |
| 데이터 시각화 | 외부 라이브러리 탐색 후 결정 | 마이페이지 달력, 차트 |
| 배포 | Vercel | 프로덕션 배포 |
| 버전 관리 | Git & GitHub | 코드 버전 관리, 협업 |

### 디렉토리 구조 원칙 (FSD 아키텍처)

Feature-Sliced Design(FSD) 아키텍처를 적용한다.
레이어는 위에서 아래 방향으로만 의존한다 (`app` → `pages` → `widgets` → `features` → `entities` → `shared`).
같은 레이어 내 슬라이스끼리는 서로 import하지 않는다.
각 슬라이스는 `index.ts`를 통해 퍼블릭 API만 외부에 노출한다.

```text
src/
│
├── app/                              # [레이어] Next.js App Router (라우팅 전담)
│   │                                 # page.tsx는 FSD pages 레이어 컴포넌트를 얇게 렌더링만 함
│   ├── page.tsx                      # / 랜딩 페이지
│   ├── login/
│   │   └── page.tsx                  # /login
│   ├── signup/
│   │   └── page.tsx                  # /signup
│   ├── oauth/
│   │   └── signup/
│   │       ├── kakao/page.tsx        # /oauth/signup/kakao
│   │       ├── google/page.tsx       # /oauth/signup/google (확장 대비)
│   │       └── naver/page.tsx        # /oauth/signup/naver (확장 대비)
│   ├── epigrams/
│   │   ├── page.tsx                  # /epigrams 메인 홈
│   │   └── [id]/
│   │       ├── page.tsx              # /epigrams/:id 상세
│   │       └── edit/page.tsx         # /epigrams/:id/edit 수정
│   ├── addepigram/
│   │   └── page.tsx                  # /addepigram 작성
│   ├── search/
│   │   └── page.tsx                  # /search 검색
│   └── mypage/
│       └── page.tsx                  # /mypage 마이페이지
│
├── pages/                            # [레이어] 페이지 단위 UI 조합
│   ├── landing/                      # 랜딩 페이지
│   ├── login/                        # 로그인 페이지
│   ├── signup/                       # 회원가입 페이지
│   ├── oauth-signup/                 # OAuth 간편 회원가입 페이지
│   ├── epigrams/                     # 에피그램 메인(홈) 페이지
│   ├── epigram-detail/               # 에피그램 상세 페이지
│   ├── epigram-edit/                 # 에피그램 수정 페이지
│   ├── add-epigram/                  # 에피그램 작성 페이지
│   ├── search/                       # 검색 페이지
│   └── mypage/                       # 마이페이지
│
├── widgets/                          # [레이어] 복합 UI 블록 (여러 feature 조합)
│   ├── header/                       # 전역 헤더 (네비게이션 포함)
│   ├── epigram-feed/                 # 에피그램 목록 피드 (무한 스크롤)
│   ├── epigram-card/                 # 에피그램 카드 (좋아요, 태그 포함)
│   ├── comment-section/              # 댓글 섹션 (목록 + 입력 폼)
│   └── mypage-activity/              # 마이페이지 활동 (달력, 차트)
│
├── features/                         # [레이어] 사용자 인터랙션 단위
│   ├── auth/                         # 로그인 · 회원가입 · OAuth 처리
│   ├── epigram-create/               # 에피그램 작성
│   ├── epigram-edit/                 # 에피그램 수정
│   ├── epigram-delete/               # 에피그램 삭제
│   ├── epigram-like/                 # 에피그램 좋아요 토글
│   ├── comment-create/               # 댓글 작성
│   ├── comment-delete/               # 댓글 삭제
│   └── epigram-search/               # 에피그램 검색
│
├── entities/                         # [레이어] 비즈니스 엔티티 (모델, API, 타입)
│   ├── epigram/                      # 에피그램 엔티티
│   │   ├── api/                      # API 호출 함수
│   │   ├── model/                    # 타입, Zod 스키마, Zustand 슬라이스
│   │   └── index.ts
│   ├── user/                         # 사용자 엔티티
│   │   ├── api/
│   │   ├── model/
│   │   └── index.ts
│   └── comment/                      # 댓글 엔티티
│       ├── api/
│       ├── model/
│       └── index.ts
│
└── shared/                           # [레이어] 프로젝트 전역 공통 모듈
    ├── api/                          # axios 인스턴스, 인터셉터 설정
    ├── ui/                           # 기본 UI 컴포넌트 (Button, Input, Modal 등)
    ├── hooks/                        # 공통 커스텀 훅
    ├── lib/                          # 유틸리티 함수
    ├── config/                       # 환경 변수, 상수
    └── types/                        # 공통 타입 정의
```

**FSD 슬라이스 내부 구조** (각 feature, entity, widget 슬라이스 공통):

```text
[slice]/
├── ui/          # UI 컴포넌트
├── model/       # 상태(Zustand), 타입, Zod 스키마
├── api/         # React Query 훅, API 호출 함수
├── lib/         # 슬라이스 전용 유틸리티
└── index.ts     # 퍼블릭 API (외부에 노출할 것만 export)
```

**FSD 핵심 규칙**:
- 하위 레이어는 상위 레이어를 import할 수 없다 (`entities`가 `features`를 import하는 것 금지).
- 같은 레이어의 다른 슬라이스를 직접 import하지 않는다 (cross-import 금지).
- 외부에서는 반드시 `index.ts`를 통해 접근한다 (내부 경로 직접 import 금지).

---

## 개발 워크플로우

### GitHub 이슈 기반 작업 흐름

모든 기능 개발 및 버그 수정은 반드시 다음 순서를 따른다:

```
1. GitHub 이슈 생성
   → 작업 내용, 목적, 완료 기준을 이슈에 명확히 기록한다.
   → 이슈 번호를 브랜치명과 커밋 메시지에 참조한다.

2. 브랜치 생성 및 작업
   → 브랜치명 형식: feat/#이슈번호-간단한-설명 (예: feat/#12-infinite-scroll)
   → 작업 중 커밋은 작고 자주 하며, 의미 있는 커밋 메시지를 작성한다.
   → 작업이 완료되면 simplify 스킬을 사용하여 리팩토링을 진행한다.

3. Pull Request 생성
   → 로컬의 pr템플릿을 이용하여 pr을 상세하게 작성한다.
   → 코드 리뷰 전 자기 검토(Self Review)를 먼저 수행한다.

4. 코드 리뷰 및 main 브랜치 머지
   → 리뷰어의 피드백을 반영한 후 머지한다.
   → Squash Merge 또는 Rebase Merge를 사용하여 main 브랜치 히스토리를 깔끔하게 유지한다.
```

### 브랜치 전략

- `main`: 배포 가능한 안정 브랜치. 직접 푸시 금지. PR을 통해서만 머지한다.
- `feat/#이슈번호-기능명`: 새 기능 개발
- `fix/#이슈번호-버그명`: 버그 수정
- `refactor/#이슈번호-내용`: 리팩토링
- `chore/#이슈번호-내용`: 설정, 의존성 등 비즈니스 로직 외 작업

### 커밋 메시지 규칙

```
<type>: <description> (#이슈번호)

예시:
feat: 카카오 OAuth 로그인 구현 (#5)
fix: 무한 스크롤 중복 요청 버그 수정 (#18)
refactor: EpigramCard 컴포넌트 로직 분리 (#22)
chore: Tailwind 설정 업데이트 (#3)
```

타입: `feat`, `fix`, `refactor`, `chore`, `docs`, `style`, `test`

### 코드 품질 게이트

PR 머지 전 다음 항목을 반드시 확인한다:

- [ ] `any` 타입 없음
- [ ] 중첩 삼항 연산자 없음
- [ ] 각 함수가 단일 책임을 가짐
- [ ] Props 타입이 `interface`로 명시적으로 정의됨
- [ ] 반복 코드가 추출됨
- [ ] Guard clause로 early return 처리됨
- [ ] 민감한 정보가 환경 변수로 관리됨
- [ ] 빌드 에러 없음 (`next build` 성공)
- [ ] 원래 기능이 보존됨

---

## Governance (거버넌스)

이 헌법은 Epigram 프로젝트의 모든 코드 작성, 수정, 리뷰에 우선한다.
헌법의 원칙과 충돌하는 다른 관행이 있다면 헌법을 따른다.

### 개정 절차

1. 헌법 개정이 필요하다고 판단되면 GitHub 이슈를 열어 논의한다.
2. 개정 내용을 이 파일에 반영하고, 버전을 아래 규칙에 따라 업데이트한다.
3. Sync Impact Report를 이 파일 상단에 업데이트한다.

### 버전 관리 정책

- **MAJOR**: 기존 원칙의 삭제 또는 하위 호환되지 않는 재정의
- **MINOR**: 새 원칙 또는 섹션 추가, 기존 원칙의 실질적 확장
- **PATCH**: 문구 명확화, 오탈자 수정, 비의미적 개선

### 준수 검토

- 모든 PR 리뷰 시 헌법 원칙 준수 여부를 확인한다.
- 원칙 위반이 불가피한 경우, PR 본문에 사유를 명시하고 팀의 동의를 받는다.
- 복잡도가 정당화되어야 하는 경우, `plan.md`의 Complexity Tracking 섹션에 기록한다.

**Version**: 1.1.0 | **Ratified**: 2026-04-03 | **Last Amended**: 2026-04-23
