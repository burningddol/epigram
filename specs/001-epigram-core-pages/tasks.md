# Tasks: Epigram 전체 페이지 핵심 기능

**입력 문서**: `specs/001-epigram-core-pages/`
**전제 조건**: plan.md ✅ / spec.md ✅ / research.md ✅ / data-model.md ✅ / contracts/ ✅

**구성 방식**: 사용자 스토리(US)별 Phase로 구성 — 각 Phase는 독립적으로 구현·검증 가능

## 형식: `[ID] [P?] [US?] 설명 (파일 경로)`

- **[P]**: 다른 파일·독립 작업 → 병렬 실행 가능
- **[US]**: 속한 사용자 스토리 (US1~US6)
- 각 태스크에 정확한 파일 경로 포함

---

## Phase 1: 프로젝트 초기 설정

**목적**: 프로젝트 초기 구조 생성 및 의존성 설치

- [x] T001 Next.js 14 App Router + TypeScript 5.x 프로젝트 FSD 디렉토리 구조 생성 (`src/app/`, `src/views/`, `src/widgets/`, `src/features/`, `src/entities/`, `src/shared/`)
- [x] T002 [P] Tailwind CSS, PostCSS 설정 (`tailwind.config.ts`, `postcss.config.js`)
- [x] T003 [P] ESLint, Prettier 설정 (`.eslintrc.json`, `.prettierrc`)
- [x] T004 [P] 핵심 패키지 설치: TanStack Query v5, Zustand v4, React Hook Form v7, Zod v3, axios (`package.json`)
- [x] T005 [P] 시각화 패키지 설치: recharts, react-calendar (`package.json`)
- [x] T006 [P] 폰트 및 전역 CSS 설정 — Pretendard 등 프로젝트 폰트 적용 (`src/app/globals.css`)

**체크포인트**: `npm run dev` 정상 실행 확인

---

## Phase 2: 공통 기반 (모든 사용자 스토리 전제 조건)

**목적**: 모든 사용자 스토리 구현 전에 반드시 완료되어야 하는 공통 인프라

**⚠️ 중요**: 이 Phase가 완료되기 전까지 어떤 사용자 스토리도 시작할 수 없음

- [x] T007 환경변수 설정 — `BACKEND_URL`, `TEAM_ID`, `KAKAO_CLIENT_ID`, `KAKAO_REDIRECT_URI` (`.env.local`, `.env.example`)
- [x] T008 BFF 프록시 catch-all 라우트 구현 — 백엔드 요청 중계, JWT → HttpOnly 쿠키 변환, 토큰 갱신 로직 (`src/app/api/[...path]/route.ts`)
- [x] T009 인증 보호 미들웨어 구현 — 비로그인 보호 경로 `/epigrams/[id]`, `/addepigram`, `/mypage` 리다이렉트 처리 (`src/middleware.ts`) — `/epigrams`, `/search`는 비회원 접근 가능
- [x] T010 [P] axios 인스턴스 생성 — BFF 클라이언트, 베이스 URL 설정, 공통 헤더 (`src/shared/api/client.ts`)
- [x] T011 [P] PaginatedResponse 공통 타입 및 Zod 스키마 정의 (`src/shared/types/pagination.ts`)
- [x] T012 [P] QueryProvider 설정 및 루트 레이아웃 구성 — React Query devtools 포함 (`src/app/layout.tsx`, `src/shared/api/QueryProvider.tsx`)
- [x] T013 [P] 공용 UI — Button 컴포넌트 (variant: primary, secondary, ghost) (`src/shared/ui/Button.tsx`)
- [x] T014 [P] 공용 UI — Input 컴포넌트 (에러 상태, label 포함) (`src/shared/ui/Input.tsx`)
- [x] T015 [P] 공용 UI — Modal 전역 제어 구현 — Zustand 모달 슬라이스로 열림/닫힘 상태 관리, `useModal()` 훅으로 사용처에서 모달 열기·닫기 (개별 컴포넌트에 모달 상태 직접 금지), ConfirmModal 기본 제공, ModalProvider 루트 레이아웃 단일 마운트, 모달 열릴 때 외부 콘텐츠에 `inert` 적용·닫힐 때 제거 및 이전 포커스 복원 (`src/shared/ui/Modal.tsx`, `src/shared/ui/ModalProvider.tsx`, `src/shared/model/modalStore.ts`, `src/shared/hooks/useModal.ts`)
- [x] T016 [P] 공용 UI — Tag 컴포넌트 (`src/shared/ui/Tag.tsx`)
- [x] T017 [P] 공용 훅 — `useScrollToTop` (스크롤 위치 감지, 최상단 이동) (`src/shared/hooks/useScrollToTop.ts`)
- [x] T018 [P] 공용 훅 — `useIntersectionObserver` (무한 스크롤 트리거용) (`src/shared/hooks/useIntersectionObserver.ts`)
- [x] T019 [P] 공용 유틸 — 날짜 포맷, 클립보드 복사 (`src/shared/lib/date.ts`, `src/shared/lib/clipboard.ts`)
- [x] T020 헤더 네비게이션 위젯 구현 — 로고(소개 페이지 이동), 검색 아이콘, 사람 아이콘 (`src/widgets/header/ui/Header.tsx`, `src/widgets/header/index.ts`)

**체크포인트**: BFF 프록시 동작 확인 — `/api/epigrams` 요청 시 백엔드 응답 반환 확인

---

## Phase 3: 사용자 스토리 1 — 회원가입 & 로그인 (우선순위: P1) 🎯 MVP

**목표**: 이메일 회원가입, 일반 로그인, 카카오 OAuth 간편 가입/로그인 구현

**독립 테스트**: 회원가입 → 로그인 → `/epigrams` 이동 → 로그아웃 흐름으로 독립 검증

### US1 — 엔티티 & 모델

- [x] T021 [P] [US1] User 엔티티 Zod 스키마 정의 (`src/entities/user/model/schema.ts`)
- [x] T022 [P] [US1] Auth 응답 타입 정의 — SignUpResponse, SignInResponse (`src/entities/user/model/types.ts`)

### US1 — API 레이어

- [x] T023 [P] [US1] 인증 API 함수 구현 — `signUp`, `signIn`, `logout` (`src/entities/user/api/auth.ts`)
- [x] T024 [P] [US1] 카카오 OAuth API 함수 구현 — `signInKakao` (`src/entities/user/api/kakao.ts`)
- [x] T025 [P] [US1] 내 프로필 조회 API 함수 구현 — `getMe` (`src/entities/user/api/user.ts`)
- [x] T026 [US1] User 엔티티 index.ts 퍼블릭 API 정의 (`src/entities/user/index.ts`)

### US1 — Features (의존: T021~T026)

- [x] T027 [US1] 로그인 폼 feature 구현 — RHF + Zod 검증, blur 에러 처리, 로그인 API 호출 (`src/features/auth/ui/LoginForm.tsx`, `src/features/auth/model/loginSchema.ts`)
- [x] T028 [US1] 회원가입 폼 feature 구현 — 이메일·닉네임·비밀번호·비밀번호 확인 검증, 닉네임 중복(500) 에러 처리 (`src/features/auth/ui/SignUpForm.tsx`, `src/features/auth/model/signUpSchema.ts`)
- [N/A] T029 [US1] ~~카카오 OAuth 간편 가입 폼 feature 구현~~ — swagger `signIn/{provider}` 응답에 `needsSignup` 필드 없음. 별도 가입 폼 불필요. 삭제됨.
- [x] T030 [US1] 로그아웃 기능 구현 — `/api/auth/logout` 호출, 쿠키 삭제 후 홈 이동 (`src/features/auth/api/logout.ts`)

### US1 — Pages & App Routes (의존: T027~T030)

- [x] T031 [P] [US1] 랜딩 페이지 구현 — 시작하기 버튼 (로그인 여부에 따라 분기) (`src/views/landing/ui/LandingPage.tsx`, `src/app/page.tsx`)
- [x] T032 [P] [US1] 로그인 페이지 구현 — 이미 로그인 시 `/` 리다이렉트, 카카오 로그인 버튼 포함 (`src/views/login/ui/LoginPage.tsx`, `src/app/login/page.tsx`)
- [x] T033 [P] [US1] 일반 회원가입 페이지 구현 (`src/views/signup/ui/SignUpPage.tsx`, `src/app/signup/page.tsx`)
- [x] T034 [US1] 카카오 OAuth 콜백 처리 — 인가 코드 → BFF 전달(`/api/auth/signIn/kakao`), 성공 시 `/epigrams` 이동. needsSignup 분기 없음 (`src/app/oauth/callback/kakao/page.tsx`)
- [N/A] T035 [US1] ~~카카오 간편 회원가입 페이지 구현~~ — swagger 기준 불필요. T029 와 함께 삭제됨.

**체크포인트**: 회원가입 → accessToken/refreshToken HttpOnly 쿠키 설정 확인 → 로그인 → `/epigrams` 정상 이동 확인

---

## Phase 4: 사용자 스토리 2 — 에피그램 메인 페이지 (우선순위: P1)

**목표**: 오늘의 에피그램, 오늘의 감정 선택, 최신 에피그램 더보기, 최근 댓글 더보기, 위화살표 구현

**독립 테스트**: `/epigrams` 진입 → 오늘의 에피그램 표시 → 감정 선택 → 더보기 → 상세 이동

### US2 — 엔티티 & 모델 (의존: Phase 2)

- [x] T036 [P] [US2] Epigram 엔티티 Zod 스키마 정의 — `isLiked`는 상세 조회(`GET /epigrams/{id}`) 응답에만 존재, 목록(`GET /epigrams`) 응답에는 없음 (`src/entities/epigram/model/schema.ts`)
- [x] T037 [P] [US2] EmotionLog 엔티티 Zod 스키마 정의 — Emotion enum: `MOVED | HAPPY | WORRIED | SAD | ANGRY` (영문, swagger 기준) (`src/entities/emotion-log/model/schema.ts`)

### US2 — API 레이어

- [x] T038 [P] [US2] 에피그램 목록 API 훅 — `useEpigrams` (cursor 기반 페이지네이션) (`src/entities/epigram/api/useEpigrams.ts`)
- [x] T039 [P] [US2] 오늘의 에피그램 API 훅 — `useTodayEpigram` (`src/entities/epigram/api/useTodayEpigram.ts`)
- [x] T040 [P] [US2] 최근 댓글 목록 API 훅 — `useRecentComments` (`src/entities/comment/api/useRecentComments.ts`)
- [x] T041 [P] [US2] 오늘의 감정 조회 API 훅 — `useTodayEmotion` (`src/entities/emotion-log/api/useTodayEmotion.ts`)
- [x] T042 [P] [US2] 오늘의 감정 등록 API 함수 — `postTodayEmotion` (`src/entities/emotion-log/api/postTodayEmotion.ts`)
- [x] T043 [US2] Epigram, Comment, EmotionLog 엔티티 index.ts 퍼블릭 API 정의 (`src/entities/epigram/index.ts`, `src/entities/comment/index.ts`, `src/entities/emotion-log/index.ts`)

### US2 — Features (의존: T036~T043)

- [x] T044 [US2] 감정 선택 feature 구현 — 5가지 감정 선택 UI, 선택 후 컴포넌트 숨김, 하루 1회 제한 (`src/features/emotion-select/ui/EmotionSelector.tsx`, `src/features/emotion-select/model/useEmotionSelect.ts`)

### US2 — Widgets (의존: T044)

- [x] T045 [US2] 에피그램 피드 위젯 구현 — 오늘의 에피그램 + 에피그램 카드 + 더보기 버튼(5개씩) (`src/widgets/epigram-feed/ui/EpigramFeed.tsx`, `src/widgets/epigram-feed/index.ts`)
- [x] T046 [US2] 에피그램 카드 위젯 구현 — 내용, 저자, 태그 표시, 클릭 → 상세 이동 (`src/widgets/epigram-card/ui/EpigramCard.tsx`, `src/widgets/epigram-card/index.ts`)
- [x] T047 [US2] 최근 댓글 위젯 구현 — 댓글 목록, 더보기 버튼(4개씩), 댓글 작성자 클릭 → 유저 프로필 모달 (`src/widgets/comment-section/ui/RecentComments.tsx`)

### US2 — Pages & App Routes (의존: T045~T047)

- [x] T048 [US2] 메인 페이지 구현 — 위화살표 버튼 포함 (`src/views/epigrams/ui/EpigramsPage.tsx`, `src/app/epigrams/page.tsx`)

**체크포인트**: 감정 선택 후 컴포넌트 사라짐 → 새로고침 시 미표시 → 더보기 5개 추가 → 에피그램 클릭 → 상세 이동

---

## Phase 5: 사용자 스토리 3 — 에피그램 작성 (우선순위: P1)

**목표**: 에피그램 작성 폼 구현 — 내용(500자 제한), 저자(라디오), 출처, 태그(최대 3개, 각 10자)

**독립 테스트**: 작성 폼 입력 → 유효성 검사 → 저장 → 상세 페이지 이동

### US3 — Features (의존: T036, T026)

- [x] T049 [US3] 에피그램 작성 API 함수 구현 — `createEpigram` (`src/entities/epigram/api/createEpigram.ts`)
- [x] T050 [US3] 에피그램 작성 폼 Zod 스키마 정의 — content(최대 500자), author, tags(최대 3개, 각 10자), referenceTitle, referenceUrl. 전송 시 tags는 `string[]`, 응답의 tags는 `{ id: number; name: string }[]` (`src/features/epigram-create/model/schema.ts`)
- [x] T051 [US3] 에피그램 작성 feature 구현 — 저자 라디오 버튼(직접입력/알 수 없음/본인), 태그 입력·삭제, URL 형식 검증 (`src/features/epigram-create/ui/EpigramCreateForm.tsx`, `src/features/epigram-create/model/useEpigramCreate.ts`)

### US3 — Pages & App Routes (의존: T049~T051)

- [x] T052 [US3] 에피그램 작성 페이지 구현 (`src/views/add-epigram/ui/AddEpigramPage.tsx`, `src/app/addepigram/page.tsx`)

**체크포인트**: 내용 501자 입력 시 경고 표시 → 태그 3개 후 추가 불가 → 저장 → 상세 페이지 이동

---

## Phase 6: 사용자 스토리 4 — 에피그램 상세 조회 및 반응 (우선순위: P2)

**목표**: 상세 페이지 — 좋아요 토글, URL 공유, 수정·삭제, 댓글 무한 스크롤, 인라인 댓글 수정, 작성자 프로필 모달

**독립 테스트**: 상세 URL 직접 진입 → 좋아요 토글 → 댓글 작성 → 무한 스크롤 → 인라인 수정

### US4 — 엔티티 & 모델

- [x] T053 [P] [US4] Comment 엔티티 Zod 스키마 정의 (`src/entities/comment/model/schema.ts`)
- [x] T054 [P] [US4] 에피그램 상세 조회 API 훅 — `useEpigramDetail` (`src/entities/epigram/api/useEpigramDetail.ts`)
- [x] T055 [P] [US4] 에피그램 댓글 목록 API 훅 — `useEpigramComments` (무한 스크롤, cursor 기반) (`src/entities/comment/api/useEpigramComments.ts`)

### US4 — Features (의존: T053~T055)

- [x] T056 [P] [US4] 좋아요 feature 구현 — 토글(추가/취소), 낙관적 업데이트 (`src/features/epigram-like/ui/LikeButton.tsx`, `src/features/epigram-like/model/useEpigramLike.ts`)
- [x] T057 [P] [US4] 댓글 작성 feature 구현 — 내용 입력, 공개/비공개 토글, 저장 API 호출 (`src/features/comment-create/ui/CommentForm.tsx`, `src/features/comment-create/model/useCommentCreate.ts`)
- [x] T058 [P] [US4] 댓글 인라인 수정 feature 구현 — textarea 활성화, 저장/취소 버튼, API 호출 (`src/features/comment-edit/ui/CommentEditForm.tsx`, `src/features/comment-edit/model/useCommentEdit.ts`)
- [x] T059 [P] [US4] 댓글 삭제 feature 구현 — 삭제 확인 모달, API 호출 (`src/features/comment-delete/model/useCommentDelete.ts`)
- [x] T060 [P] [US4] 에피그램 수정 feature 구현 — 기존 데이터 프리필, 수정 API 호출, 취소 시 상세 페이지 이동 (`src/features/epigram-edit/ui/EpigramEditForm.tsx`, `src/features/epigram-edit/model/useEpigramEdit.ts`)
- [x] T061 [P] [US4] 에피그램 삭제 feature 구현 — 확인 모달, 삭제 후 `/epigrams` 이동 (`src/features/epigram-delete/model/useEpigramDelete.ts`)

### US4 — Widgets & UI (의존: T056~T061)

- [x] T062 [US4] 댓글 섹션 위젯 구현 — 댓글 목록, 무한 스크롤(IntersectionObserver), 프로필 클릭 → 유저 모달 (`src/widgets/comment-section/ui/CommentSection.tsx`, `src/widgets/comment-section/index.ts`)
- [x] T063 [US4] 사용자 프로필 모달 구현 — 특정 사용자 프로필 조회, 모달 표시 (`src/shared/ui/UserProfileModal.tsx`)
- [x] T064 [US4] 에피그램 수정 페이지 구현 (`src/views/epigram-edit/ui/EpigramEditPage.tsx`, `src/app/epigrams/[id]/edit/page.tsx`)

### US4 — Pages & App Routes (의존: T062~T064)

- [x] T065 [US4] 에피그램 상세 페이지 구현 — 공유 버튼(URL 복사), 새창 버튼, 본인 글 "…" 메뉴, 태그 클릭 → 검색 이동 (`src/views/epigram-detail/ui/EpigramDetailPage.tsx`, `src/app/epigrams/[id]/page.tsx`)

**체크포인트**: 좋아요 토글 → 카운트 즉시 반영 → 댓글 작성 → 목록 갱신 → 스크롤 무한 로드 → 인라인 수정 → 삭제 후 `/epigrams` 이동

---

## Phase 7: 사용자 스토리 5 — 에피그램 검색 (우선순위: P2)

**목표**: 키워드 검색, 무한 스크롤, URL 동기화, 검색어 하이라이팅, 로컬스토리지 최근 검색어

**독립 테스트**: `/search?keyword=테스트` 직접 진입 → 결과 표시 → 스크롤 무한 로드 → 클릭 → 상세 이동

### US5 — API 레이어

- [x] T066 [P] [US5] 검색 API 훅 — `useSearchEpigrams` (keyword + cursor 기반 무한 스크롤) (`src/entities/epigram/api/useSearchEpigrams.ts`)

### US5 — Features (의존: T066)

- [x] T067 [US5] 검색 feature 구현 — 검색어 입력, URL 쿼리 파라미터 동기화(`?keyword=`), 로컬스토리지 최근 검색어 저장·삭제·모두 지우기 (`src/features/epigram-search/ui/SearchBar.tsx`, `src/features/epigram-search/model/useSearch.ts`, `src/features/epigram-search/model/useRecentSearches.ts`)
- [x] T068 [US5] 검색 결과 아이템 구현 — 키워드 하이라이팅(태그·에피그램 내용), 클릭 → 상세 이동 (`src/features/epigram-search/ui/SearchResultItem.tsx`)

### US5 — Pages & App Routes (의존: T067~T068)

- [x] T069 [US5] 검색 페이지 구현 — 무한 스크롤(IntersectionObserver), 최근 검색어 섹션 표시, 새로고침 시 URL에서 keyword 복원 (`src/views/search/ui/SearchPage.tsx`, `src/app/search/page.tsx`)

**체크포인트**: 검색어 입력 → URL `?keyword=` 반영 → 새로고침 시 결과 유지 → 스크롤 무한 로드 → 최근 검색어 로컬스토리지 저장 → 모두 지우기

---

## Phase 8: 사용자 스토리 6 — 마이페이지 (우선순위: P3)

**목표**: 프로필 수정(이미지 업로드), 오늘의 감정 달력, 파이 차트, 내 에피그램·댓글 목록 더보기

**독립 테스트**: `/mypage` 진입 → 프로필 이미지 변경 → 감정 달력 월 이동 → 파이 차트 표시 → 내 에피그램 더보기

### US6 — API 레이어

- [x] T070 [P] [US6] 월별 감정 조회 API 훅 — `useMonthlyEmotions` (userId 필수, year, month 파라미터 — swagger `GET /emotion-logs?userId=&year=&month=`) (`src/entities/emotion-log/api/useMonthlyEmotions.ts`)
- [x] T071 [P] [US6] 내 에피그램 목록 API 훅 — `useMyEpigrams` (writerId 필터, cursor 기반) (`src/entities/epigram/api/useMyEpigrams.ts`)
- [x] T072 [P] [US6] 내 댓글 목록 API 훅 — `useMyComments` (cursor 기반, swagger `GET /users/{id}/comments`) (`src/entities/comment/api/useMyComments.ts`)
- [x] T073 [P] [US6] 프로필 수정 API 함수 — `updateMe` (닉네임, 이미지 URL) (`src/entities/user/api/user.ts` 에 통합)
- [x] T074 [P] [US6] 이미지 업로드 API 함수 — `uploadImage` (multipart/form-data, 영문 파일명 검증) (`src/shared/api/uploadImage.ts`)

### US6 — Features (의존: T070~T074)

- [x] T075 [P] [US6] 프로필 이미지 변경 feature 구현 — 파일 선택 → 업로드 → 프로필 수정 API 호출, 한글 파일명 경고 (`src/features/auth/ui/ProfileImageUpload.tsx`)
- [x] T076 [P] [US6] 감정 달력 컴포넌트 구현 — react-calendar 활용, 월별 날짜에 감정 이모지 표시, 월 이동 (`src/widgets/mypage-activity/ui/EmotionCalendar.tsx`)
- [x] T077 [P] [US6] 감정 파이 차트 컴포넌트 구현 — recharts 활용, 5가지 감정 비율 집계 및 시각화 (`src/widgets/mypage-activity/ui/EmotionPieChart.tsx`)

### US6 — Widgets & Pages (의존: T075~T077)

- [x] T078 [US6] 마이페이지 활동 위젯 구현 — 감정 달력 + 파이 차트 + 내 에피그램(더보기 버튼) + 내 댓글(더보기 버튼, 댓글 수 표시) (`src/widgets/mypage-activity/ui/MypageActivity.tsx`, `src/widgets/mypage-activity/index.ts`)
- [x] T079 [US6] 마이페이지 구현 — 로그아웃 버튼, 프로필 이미지 클릭 업로드, 댓글 클릭 → 해당 에피그램 상세 이동 (`src/views/mypage/ui/MypagePage.tsx`, `src/app/mypage/page.tsx`)

**체크포인트**: 이미지 업로드(영문 파일) → 프로필 갱신 → 감정 달력 월 이동 → 파이 차트 정상 표시 → 내 에피그램 더보기 → 클릭 → 상세 이동

---

## Phase 9: 마무리 및 공통 관심사

**목적**: 전체 사용자 스토리에 걸친 품질 개선

- [x] T080 [P] 반응형 스타일 전체 점검 — 모바일(360px), 태블릿(744px), 데스크탑(1920px) 브레이크포인트 검증
- [ ] T081 [P] 에러 상태 UI — 네트워크 에러, 404, 빈 목록 EmptyState 컴포넌트 (`src/shared/ui/EmptyState.tsx`, `src/app/not-found.tsx`)
- [ ] T082 [P] ErrorBoundary 적용 — 페이지 레벨 렌더링 에러 선언적 처리 (`src/shared/ui/ErrorBoundary.tsx`, 각 `src/app/*/error.tsx`)
- [ ] T083 quickstart.md 체크포인트 전체 수동 검증 실행

---

## 의존성 및 실행 순서

### Phase 의존 관계

- **Phase 1 (초기 설정)**: 의존 없음 — 즉시 시작 가능
- **Phase 2 (공통 기반)**: Phase 1 완료 후 — **모든 사용자 스토리 차단**
- **Phase 3~8 (사용자 스토리)**: Phase 2 완료 후 시작 가능
  - 단일 개발자: P1(US1→US2→US3) → P2(US4→US5) → P3(US6) 순서 권장
- **Phase 9 (마무리)**: Phase 3~8 완료 후

### 사용자 스토리 의존 관계

| 스토리 | 선행 조건 | 비고 |
|--------|-----------|------|
| US1 (회원가입·로그인) | Phase 2 완료 | 인증 진입점, 가장 먼저 |
| US2 (메인 페이지) | Phase 2 완료, US1 권장 | 로그인 필요 페이지 |
| US3 (에피그램 작성) | Phase 2 완료, US2 권장 | 에피그램 엔티티 재사용 |
| US4 (상세 & 반응) | US2, US3 완료 권장 | 에피그램 필요 |
| US5 (검색) | Phase 2 완료 | 에피그램 엔티티 재사용 |
| US6 (마이페이지) | US1, US4 완료 권장 | 인증 + 에피그램 + 댓글 |

### 스토리 내 순서

```
Zod 스키마 / 타입 → API 함수·훅 → entities index.ts → features → widgets → pages/app
```

### 병렬 실행 가능 태스크

```
# Phase 2 병렬 실행 예시 (T010~T020)
Task: "axios 인스턴스 생성 (src/shared/api/client.ts)"           [P]
Task: "공통 타입 정의 (src/shared/types/pagination.ts)"          [P]
Task: "Button 컴포넌트 (src/shared/ui/Button.tsx)"               [P]
Task: "Input 컴포넌트 (src/shared/ui/Input.tsx)"                 [P]
Task: "Modal 컴포넌트 (src/shared/ui/Modal.tsx)"                 [P]
Task: "useScrollToTop 훅 (src/shared/hooks/useScrollToTop.ts)"   [P]
Task: "useIntersectionObserver 훅"                               [P]

# Phase 3 (US1) 병렬 실행 예시
Task: "User Zod 스키마 (src/entities/user/model/schema.ts)"      [P]
Task: "인증 API 함수 (src/entities/user/api/auth.ts)"            [P]
Task: "카카오 OAuth API (src/entities/user/api/kakao.ts)"        [P]

# Phase 4 (US2) 병렬 실행 예시
Task: "Epigram Zod 스키마"                                        [P]
Task: "EmotionLog Zod 스키마"                                     [P]
Task: "useEpigrams 훅"                                           [P]
Task: "useTodayEpigram 훅"                                       [P]
Task: "useTodayEmotion 훅"                                       [P]
```

---

## 구현 전략

### MVP 우선 (US1~US3만)

1. Phase 1: 초기 설정 완료
2. Phase 2: 공통 기반 완료 (필수)
3. Phase 3: US1 회원가입·로그인 완료 → 검증
4. Phase 4: US2 메인 페이지 완료 → 검증
5. Phase 5: US3 에피그램 작성 완료 → 검증
6. **MVP 배포 가능 상태**

### 단계별 증분 배포

```
Setup + Foundational → US1 (인증) → US2 (탐색) → US3 (작성) → MVP ✅
US4 (상세·반응) → US5 (검색) → US6 (마이페이지) → Full ✅
```

---

## 태스크 요약

| Phase | 범위 | 태스크 수 | 병렬 가능 |
|-------|------|-----------|-----------|
| Phase 1 | 초기 설정 | 6 | 5 |
| Phase 2 | 공통 기반 | 14 | 12 |
| Phase 3 | US1 회원가입·로그인 (P1) | 15 | 7 |
| Phase 4 | US2 메인 페이지 (P1) | 13 | 8 |
| Phase 5 | US3 에피그램 작성 (P1) | 4 | 0 |
| Phase 6 | US4 상세·반응 (P2) | 13 | 9 |
| Phase 7 | US5 검색 (P2) | 4 | 1 |
| Phase 8 | US6 마이페이지 (P3) | 10 | 7 |
| Phase 9 | 마무리 | 4 | 3 |
| **합계** | | **83** | **52** |

---

## 참고

- [P] 태스크 = 다른 파일, 의존 없음 → 동시 작업 가능
- [US] 레이블 = 사용자 스토리 추적성
- 각 Phase 체크포인트에서 독립 검증 후 다음 Phase 진행
- 커밋은 태스크 단위 또는 논리적 그룹 단위로 수행
- 이미지 업로드 시 **반드시 영문 파일명** 사용 (한글 파일명 → API 오류)
