# 계약: 감정 기록 & 사용자 API (BFF 경유)

---

## POST /api/emotionLogs/today — 오늘의 감정 등록

**요청 body**:
```json
{ "emotion": "기쁨" }
```

**검증**: emotion은 `감동 | 기쁨 | 고민 | 슬픔 | 분노` 중 하나

**응답 (201)**:
```json
{ "id": 1, "emotion": "기쁨", "userId": 5, "createdAt": "2026-04-03T00:00:00Z" }
```

**에러**: 이미 오늘 감정을 등록한 경우 409 또는 400

---

## GET /api/emotionLogs/today — 오늘의 감정 조회

**쿼리 파라미터**: `?userId={userId}`

**응답 (200, 등록됨)**:
```json
{ "id": 1, "emotion": "기쁨", "userId": 5, "createdAt": "2026-04-03T00:00:00Z" }
```

**응답 (등록 안됨)**: 404 또는 빈 응답 → 감정 선택 UI 표시

---

## GET /api/emotionLogs/monthly — 월별 감정 조회

**쿼리 파라미터**: `?userId={userId}&year={year}&month={month}`

**응답 (200)**:
```json
[
  { "id": 1, "emotion": "기쁨", "userId": 5, "createdAt": "2026-04-01T00:00:00Z" },
  { "id": 2, "emotion": "고민", "userId": 5, "createdAt": "2026-04-02T00:00:00Z" }
]
```

달력 컴포넌트는 `createdAt`에서 날짜를 추출하여 해당 날 감정 이모지를 표시한다.
파이 차트는 응답 배열을 감정별로 집계하여 비율을 계산한다.

---

## GET /api/users/me — 내 프로필 조회

**응답 (200)**:
```json
{ "id": 5, "nickname": "닉네임", "email": "user@example.com", "image": null, "teamId": "team01" }
```

---

## PATCH /api/users/me — 내 프로필 수정

**요청 body**:
```json
{ "nickname": "새 닉네임", "image": "https://cdn.example.com/profile.jpg" }
```

**응답 (200)**: 수정된 User 객체

---

## GET /api/users/:id — 특정 사용자 프로필 조회 (댓글 작성자 모달용)

**응답 (200)**: User 객체 (email 제외 가능)

---

## GET /api/users/:id/comments — 특정 사용자 댓글 목록 (마이페이지용)

**쿼리 파라미터**: `?limit=N&cursor=N`
**응답 (200)**: `PaginatedResponse<Comment>`

---

## POST /api/images/upload — 이미지 업로드

**요청**: `multipart/form-data`, 필드명 `image`

**주의사항**: 파일명은 반드시 영문이어야 한다. 한글 파일명은 API 오류를 발생시킨다.

**응답 (201)**:
```json
{ "url": "https://cdn.example.com/uploaded-image.jpg" }
```
