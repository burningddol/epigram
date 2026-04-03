# 빠른 시작 가이드: Epigram

**작성일**: 2026-04-03

---

## 환경 설정

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일 생성:

```env
# 백엔드 API (서버 전용 — NEXT_PUBLIC 불필요)
BACKEND_URL=https://fe-project-epigram-api.vercel.app
TEAM_ID={팀 아이디 입력}

# 카카오 OAuth
KAKAO_CLIENT_ID={카카오 REST API 키}
KAKAO_REDIRECT_URI=http://localhost:3000/oauth/callback/kakao
```

> **주의**: `TEAM_ID`는 서버에서만 사용하므로 `NEXT_PUBLIC_` prefix 불필요.

### 3. 개발 서버 실행

```bash
npm run dev
```

`http://localhost:3000` 에서 확인.

---

## 핵심 구현 체크포인트

### BFF 프록시 동작 확인

1. 회원가입 후 브라우저 개발자 도구 → Application → Cookies 확인
2. `accessToken`, `refreshToken` 쿠키가 **HttpOnly** 체크된 상태로 존재해야 한다.
3. JavaScript 콘솔에서 `document.cookie`로 토큰이 보이지 않아야 한다. ✅

### 인증 보호 페이지 확인

1. 로그아웃 상태에서 `/epigrams` 직접 접근 → `/login`으로 리다이렉트
2. 로그인 상태에서 `/login` 접근 → `/`으로 리다이렉트

### 무한 스크롤 확인

1. `/epigrams` 메인에서 더보기 버튼 클릭 → 5개 추가 로드
2. `/search?keyword=테스트` 에서 스크롤 하단 → 자동 로드

### 감정 선택 확인

1. 오늘 감정 미선택 상태에서 `/epigrams` 접근 → 감정 선택 UI 표시
2. 감정 선택 후 → UI 사라짐
3. 페이지 새로고침 후 재접근 → UI 표시 안됨 (오늘 이미 선택됨)

---

## FSD 레이어별 개발 순서

새 기능을 추가할 때 아래 순서를 따른다:

```
1. entities/     → Zod 스키마, API 함수, React Query 훅 정의
2. features/     → 사용자 인터랙션 로직 (폼, 상태 변경)
3. widgets/      → 여러 feature를 조합한 복합 UI 블록
4. pages/        → 페이지 레벨 조합
5. app/          → page.tsx에서 pages 레이어 컴포넌트 렌더링
```

**레이어 import 규칙**:
- ✅ `pages/epigrams` → `widgets/epigram-feed` import 가능
- ✅ `widgets/epigram-feed` → `features/epigram-like` import 가능
- ✅ `features/epigram-like` → `entities/epigram` import 가능
- ❌ `entities/epigram` → `features/epigram-like` import 불가 (역방향)
- ❌ `features/epigram-like` → `features/comment-create` import 불가 (같은 레이어)

---

## 주요 파일 위치

| 역할 | 경로 |
|------|------|
| BFF 프록시 | `app/api/[...path]/route.ts` |
| 라우트 보호 미들웨어 | `app/middleware.ts` |
| axios 인스턴스 (클라이언트→BFF) | `shared/api/client.ts` |
| 공용 UI 컴포넌트 | `shared/ui/` |
| 에피그램 API 훅 | `entities/epigram/api/` |
| 댓글 API 훅 | `entities/comment/api/` |
| 인증 feature | `features/auth/` |
| 메인 피드 widget | `widgets/epigram-feed/` |

---

## 자주 발생하는 문제

| 문제 | 원인 | 해결 |
|------|------|------|
| 이미지 업로드 실패 | 파일명에 한글 포함 | 영문 파일명으로 변경 |
| 로그인 후 페이지 이동 안됨 | 미들웨어 쿠키 인식 지연 | `router.refresh()` 추가 |
| 무한 스크롤 중복 요청 | `hasNextPage` 확인 누락 | `hasNextPage && !isFetchingNextPage` 조건 추가 |
| 타입 에러 `any` | Zod 스키마 미적용 | `entities/*/model/` 스키마로 파싱 |
