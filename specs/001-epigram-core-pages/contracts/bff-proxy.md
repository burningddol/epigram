# 계약: BFF 프록시

**파일**: `app/api/[...path]/route.ts`
**역할**: 클라이언트와 외부 백엔드 사이의 중계 레이어. 토큰 관리 및 보안 처리 전담.

---

## 규칙

1. 클라이언트의 모든 API 요청은 `/api/*` 경로를 통해 이 프록시를 거쳐야 한다.
2. 외부 백엔드 URL과 teamId는 서버 환경변수에서만 읽는다.
3. accessToken은 HttpOnly 쿠키에서만 읽고 쓴다. 응답 body에 포함하지 않는다.

---

## 인증 엔드포인트 처리 (토큰 → 쿠키 변환)

| 트리거 경로 | 처리 |
|------------|------|
| `POST /api/auth/signUp` | 백엔드 응답 body의 토큰을 HttpOnly 쿠키로 설정 후 user 정보만 반환 |
| `POST /api/auth/signIn` | 동일 |
| `POST /api/auth/signIn/kakao` | 동일 |

**응답 변환 예시**:
```
백엔드 응답: { accessToken, refreshToken, user }
클라이언트 응답: { user }  +  Set-Cookie: accessToken=...; refreshToken=...
```

---

## 토큰 자동 첨부 (인증 필요 요청)

```
요청: GET /api/epigrams/123
프록시: 쿠키에서 accessToken 읽기 → Authorization: Bearer {token} 헤더 추가 → 백엔드로 전달
```

---

## 토큰 갱신 흐름

```
1. 백엔드 → 401 응답
2. 프록시: refreshToken 쿠키로 POST /auth/refresh-token 호출
3. 성공: 새 accessToken 쿠키 설정 → 원래 요청 재시도
4. 실패(refreshToken 만료): accessToken + refreshToken 쿠키 삭제 → 클라이언트에 401 반환
```

---

## 로그아웃

```
POST /api/auth/logout  (BFF 전용 엔드포인트 - 백엔드 호출 없이 쿠키만 삭제)
→ accessToken 쿠키 삭제
→ refreshToken 쿠키 삭제
→ 200 OK
```

---

## 쿠키 설정 명세

| 쿠키명 | HttpOnly | Secure | SameSite | Path | Max-Age |
|--------|----------|--------|----------|------|---------|
| accessToken | ✅ | ✅ | Strict | / | 3600 (1시간) |
| refreshToken | ✅ | ✅ | Strict | /api/auth/refresh-token | 604800 (7일) |

---

## 에러 처리

| 백엔드 상태코드 | 프록시 동작 |
|---------------|------------|
| 400 | 그대로 클라이언트에 전달 |
| 401 (accessToken 만료) | 토큰 갱신 후 재시도 |
| 401 (refreshToken 만료) | 쿠키 삭제 후 401 반환 |
| 404 | 그대로 전달 |
| 500 | 그대로 전달 |
| 네트워크 오류 | 503 반환 |
