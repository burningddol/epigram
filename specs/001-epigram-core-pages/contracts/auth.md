# 계약: 인증 API (BFF 경유)

모든 경로는 클라이언트 → BFF(`/api/...`) 기준. BFF가 백엔드(`/{teamId}/auth/...`)로 중계.

---

## POST /api/auth/signUp — 일반 회원가입

**요청 body**:
```json
{
  "email": "user@example.com",
  "nickname": "닉네임",
  "password": "Password1!",
  "passwordConfirmation": "Password1!"
}
```

**검증**:
- email: 필수, 이메일 형식
- nickname: 필수, 1~20자
- password: 필수, 최소 8자, 숫자·영문·특수문자 포함
- passwordConfirmation: password와 일치

**응답 (201)**:
```json
{ "id": 1, "nickname": "닉네임", "email": "user@example.com", "image": null }
```
+ `Set-Cookie: accessToken=...; refreshToken=...`

**에러**:
- 400: 입력값 검증 실패
- 500: 닉네임 중복 → "이미 사용 중인 닉네임입니다." 표시

---

## POST /api/auth/signIn — 일반 로그인

**요청 body**:
```json
{ "email": "user@example.com", "password": "Password1!" }
```

**응답 (200)**:
```json
{ "id": 1, "nickname": "닉네임", "email": "user@example.com", "image": null }
```
+ `Set-Cookie: accessToken=...; refreshToken=...`

**에러**:
- 400: 이메일 또는 비밀번호 불일치 → "이메일 혹은 비밀번호를 확인해주세요." 표시

---

## POST /api/auth/signIn/kakao — 카카오 OAuth 로그인

**요청 body**:
```json
{ "token": "{카카오 인가 코드}", "redirectUri": "{콜백 URI}" }
```

**응답 (200, 가입된 사용자)**:
```json
{ "id": 1, "nickname": "닉네임", "image": null }
```
+ `Set-Cookie: accessToken=...; refreshToken=...`

**응답 (미가입 사용자)**:
- BFF가 미가입 에러 감지 → `{ "needsSignup": true, "tempToken": "..." }` 반환
- 클라이언트: `/oauth/signup/kakao`로 이동

---

## POST /api/auth/refresh-token — 토큰 갱신 (BFF 내부 전용)

클라이언트가 직접 호출하지 않는다. BFF가 401 처리 중 내부적으로 호출.

---

## POST /api/auth/logout — 로그아웃 (BFF 전용)

백엔드 호출 없이 BFF에서 쿠키만 삭제.

**응답 (200)**: `{ "success": true }`
+ `Set-Cookie: accessToken=; Max-Age=0` (삭제)
+ `Set-Cookie: refreshToken=; Max-Age=0` (삭제)
