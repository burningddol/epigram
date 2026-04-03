# 계약: 댓글 API (BFF 경유)

---

## POST /api/comments — 댓글 작성

**요청 body**:
```json
{
  "epigramId": 1,
  "content": "댓글 내용",
  "isPrivate": false
}
```

**검증**:
- epigramId: 필수, 양수 정수
- content: 필수, 1자 이상
- isPrivate: 기본값 false (공개)

**응답 (201)**:
```json
{
  "id": 10,
  "content": "댓글 내용",
  "isPrivate": false,
  "epigramId": 1,
  "writer": { "id": 5, "nickname": "닉네임", "image": null },
  "createdAt": "2026-04-03T00:00:00Z",
  "updatedAt": "2026-04-03T00:00:00Z"
}
```

---

## PATCH /api/comments/:id — 댓글 수정 (인라인)

**요청 body**:
```json
{ "content": "수정된 내용", "isPrivate": false }
```

**응답 (200)**: 수정된 Comment 객체
**에러**: 403 작성자 본인이 아닌 경우

---

## DELETE /api/comments/:id — 댓글 삭제

**응답 (200)**: `{ "id": 10 }`
**에러**: 403 작성자 본인이 아닌 경우

---

## GET /api/comments — 최근 댓글 목록 (메인 페이지용)

**쿼리 파라미터**: `?limit=N&cursor=N`
**응답 (200)**: `PaginatedResponse<Comment>`
