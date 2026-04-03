# 리서치: Epigram 전체 페이지 핵심 기능

**작성일**: 2026-04-03 | **브랜치**: `001-epigram-core-pages`

---

## 1. BFF 프록시 패턴 (Next.js App Router)

### 결정
`app/api/[...path]/route.ts` catch-all API Route를 BFF 프록시로 사용한다.
클라이언트는 `/api/*` 경로로 요청하며, 프록시가 외부 백엔드로 중계한다.

### 구현 전략

```typescript
// app/api/[...path]/route.ts 핵심 흐름
export async function handler(request: NextRequest, { params }) {
  const path = params.path.join('/');
  const backendUrl = `${process.env.BACKEND_URL}/${process.env.TEAM_ID}/${path}`;

  // 쿠키에서 accessToken 읽기
  const accessToken = request.cookies.get('accessToken')?.value;

  // 백엔드 요청 전달
  const response = await fetch(backendUrl, {
    method: request.method,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
    body: request.method !== 'GET' ? await request.text() : undefined,
  });

  // 401 → 토큰 갱신 후 재시도
  if (response.status === 401) {
    return handleTokenRefresh(request, backendUrl);
  }

  // 로그인/가입 응답: 토큰을 쿠키로 변환
  if (isAuthEndpoint(path)) {
    return setTokenCookies(response);
  }

  return response;
}
```

### 토큰 갱신 흐름
1. 원래 요청 → 백엔드 401 응답
2. 프록시: `refreshToken` 쿠키로 `/auth/refresh-token` 호출
3. 새 `accessToken` 발급 → 쿠키 갱신
4. 원래 요청 재시도
5. `refreshToken`도 만료 시: 두 쿠키 삭제 → 클라이언트에 401 반환

### 쿠키 설정
```
Set-Cookie: accessToken=<value>; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600
Set-Cookie: refreshToken=<value>; HttpOnly; Secure; SameSite=Strict; Path=/api/auth/refresh-token; Max-Age=604800
```
- `refreshToken`은 갱신 엔드포인트 경로에만 제한하여 노출 최소화
- `Secure` 플래그: HTTPS에서만 전송 (Vercel 기본 HTTPS)

### 환경변수 (서버 전용 — NEXT_PUBLIC 불필요)
```
BACKEND_URL=https://fe-project-epigram-api.vercel.app
TEAM_ID={팀 아이디}
KAKAO_CLIENT_ID={카카오 앱 키}
KAKAO_REDIRECT_URI={콜백 URI}
```

### 대안 검토
- **next-auth**: OAuth 처리에 편리하지만, 커스텀 백엔드 JWT와의 통합 복잡도가 높음 → 직접 구현 선택
- **localStorage 토큰**: XSS 취약 → HttpOnly 쿠키로 대체

---

## 2. FSD 아키텍처 in Next.js App Router

### 결정
App Router의 `app/` 디렉토리는 라우팅만 담당하고, FSD 레이어(`pages/`, `widgets/`, `features/`, `entities/`, `shared/`)를 `src/` 루트에 별도 배치한다.

### 레이어 의존 규칙
```
app → pages → widgets → features → entities → shared
```
- 상위 레이어만 하위 레이어를 import할 수 있다.
- 같은 레이어의 다른 슬라이스끼리 cross-import 금지.
- 외부에서는 반드시 `index.ts` 퍼블릭 API만 사용한다.

### 슬라이스 내부 구조 (표준)
```
[slice]/
├── ui/          # React 컴포넌트
├── model/       # Zod 스키마, 타입, Zustand 슬라이스
├── api/         # React Query 훅, fetch 함수
├── lib/         # 슬라이스 전용 유틸
└── index.ts     # 퍼블릭 API
```

### 대안 검토
- **일반 `components/` 구조**: 규모가 커질수록 의존성 파악이 어려움 → FSD 선택
- **Turborepo 모노레포**: 단일 개발자 프로젝트에 오버엔지니어링 → 단일 Next.js 프로젝트 선택

---

## 3. 카카오 OAuth 흐름

### 결정
카카오 OAuth 2.0 인가 코드 방식을 사용한다. 콜백 처리는 Next.js API Route에서 수행한다.

### 흐름
```
1. 클라이언트 → 카카오 인가 페이지 리다이렉트
   https://kauth.kakao.com/oauth/authorize?client_id=...&redirect_uri=...&response_type=code

2. 카카오 → /oauth/callback/kakao?code={인가코드} 콜백

3. BFF: 인가코드로 카카오 토큰 교환 (서버 사이드)

4. BFF: 백엔드 POST /{teamId}/auth/signIn/kakao 호출
   body: { token: kakaoAccessToken, redirectUri }

5. 백엔드 응답:
   - 가입된 사용자: { accessToken, refreshToken, user } → 쿠키 설정 → /epigrams 이동
   - 미가입 사용자: 특정 에러 코드 → /oauth/signup/kakao 이동

6. /oauth/signup/kakao: 닉네임 입력 후 가입 완료
```

### 미가입 판별
백엔드 응답에서 미가입 상태를 나타내는 에러 코드를 BFF에서 감지하여 `/oauth/signup/kakao`로 리다이렉트한다. 카카오 임시 토큰은 세션 쿠키에 보관한다.

---

## 4. React Query 무한 스크롤 패턴

### 결정
`useInfiniteQuery`와 `IntersectionObserver`를 조합하여 cursor 기반 무한 스크롤을 구현한다.

### 구현 패턴
```typescript
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
  queryKey: ['epigrams', keyword],
  queryFn: ({ pageParam }) =>
    fetchEpigrams({ cursor: pageParam, limit: 5, keyword }),
  getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  initialPageParam: undefined,
});
```

### IntersectionObserver 훅
```typescript
// shared/hooks/useIntersectionObserver.ts
function useIntersectionObserver(callback: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) callback();
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [callback]);
  return ref;
}
```

### 더보기 버튼 패턴 (메인 페이지, 마이페이지)
무한 스크롤 대신 명시적 버튼을 사용하는 경우 `fetchNextPage()`를 버튼 onClick에 연결한다.

---

## 5. 데이터 시각화 라이브러리 선정

### 결정
- **감정 파이 차트**: `recharts` — React 전용, 번들 크기 적당, 커스터마이징 용이
- **감정 달력**: `react-calendar` — 경량, 날짜별 커스텀 타일 지원

### 대안 검토
- **chart.js + react-chartjs-2**: 더 많은 차트 타입 지원하지만 번들 크기 더 큼
- **D3.js**: 최대 유연성이지만 러닝커브 높음, 파이 차트 하나에 과도함

---

## 6. 미들웨어 기반 라우트 보호

### 결정
Next.js `middleware.ts`에서 쿠키의 `accessToken` 존재 여부로 인증 상태를 판별한다.

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken');
  const { pathname } = request.nextUrl;

  const protectedRoutes = ['/epigrams', '/addepigram', '/search', '/mypage'];
  const authRoutes = ['/login', '/signup', '/oauth/signup/kakao'];

  if (protectedRoutes.some(r => pathname.startsWith(r)) && !accessToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (authRoutes.includes(pathname) && accessToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }
}
```

### 주의사항
미들웨어는 Edge Runtime에서 실행되므로 `accessToken` 존재 여부만 확인한다.
실제 토큰 유효성 검증은 BFF 프록시에서 백엔드 401 응답으로 처리한다.

---

## 7. 검색어 URL 동기화

### 결정
`useSearchParams`와 `useRouter`를 사용하여 검색어를 URL 쿼리 파라미터(`?keyword=...`)로 유지한다.

```typescript
const searchParams = useSearchParams();
const router = useRouter();
const keyword = searchParams.get('keyword') ?? '';

function handleSearch(value: string) {
  router.push(`/search?keyword=${encodeURIComponent(value)}`);
}
```

React Query의 `queryKey`에 `keyword`를 포함하여 URL 변경 시 자동 재패칭한다.
