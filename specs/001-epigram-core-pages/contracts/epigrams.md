# 계약: 에피그램 API (BFF 경유)

모든 경로는 클라이언트 → BFF(`/api/...`) 기준.

---

## GET /api/epigrams — 에피그램 목록 조회

**쿼리 파라미터**:
| 파라미터 | 타입 | 기본값 | 설명 |
|---------|------|--------|------|
| limit | number | 10 | 한 번에 가져올 개수 |
| cursor | number \| undefined | undefined | 커서 (이전 응답의 nextCursor) |
| keyword | string \| undefined | - | 검색 키워드 |
| writerId | number \| undefined | - | 특정 사용자 작성 글 필터 |

**사용 케이스별 파라미터**:
- 메인 최신 에피그램 초기: `?limit=3`
- 메인 더보기: `?limit=5&cursor={nextCursor}`
- 검색: `?keyword={검색어}&limit=10&cursor={nextCursor}`
- 내 에피그램(마이페이지): `?writerId={userId}&limit=10&cursor={nextCursor}`

**응답 (200)**:
```json
{
  "totalCount": 100,
  "nextCursor": 42,
  "list": [
    {
      "id": 1,
      "content": "에피그램 내용",
      "author": "저자명",
      "referenceTitle": "책 제목",
      "referenceUrl": "https://example.com",
      "tags": [{ "id": 1, "name": "태그1" }],
      "writerId": 5,
      "likeCount": 10,
      "isLiked": false
    }
  ]
}
```

---

## GET /api/epigrams/today — 오늘의 에피그램

**응답 (200)**: 단일 Epigram 객체 (isLiked 포함)

---

## GET /api/epigrams/:id — 에피그램 상세

**응답 (200)**: 단일 Epigram 객체 (isLiked 포함)
**에러**: 404 존재하지 않는 에피그램

---

## POST /api/epigrams — 에피그램 작성

**요청 body**:
```json
{
  "content": "에피그램 내용 (최대 500자)",
  "author": "저자명",
  "referenceTitle": "출처 제목",
  "referenceUrl": "https://example.com",
  "tags": [{ "name": "태그1" }, { "name": "태그2" }]
}
```

**검증**:
- content: 필수, 최대 500자
- author: 필수
- tags: 최대 3개, 각 name 최대 10자
- referenceUrl: URL 형식 (있는 경우)

**응답 (201)**: 생성된 Epigram 객체

---

## PATCH /api/epigrams/:id — 에피그램 수정

요청 body: POST와 동일 구조 (부분 수정 가능)
**응답 (200)**: 수정된 Epigram 객체
**에러**: 403 작성자 본인이 아닌 경우

---

## DELETE /api/epigrams/:id — 에피그램 삭제

**응답 (200)**: `{ "id": 1 }`
**에러**: 403 작성자 본인이 아닌 경우

삭제 완료 후 클라이언트는 `/epigrams`로 이동한다.

---

## POST /api/epigrams/:id/like — 좋아요 추가

**응답 (201)**: `{ "epigramId": 1, "userId": 5 }`

---

## DELETE /api/epigrams/:id/like — 좋아요 취소

**응답 (200)**: `{ "epigramId": 1, "userId": 5 }`

---

## GET /api/epigrams/:id/comments — 에피그램 댓글 목록

**쿼리 파라미터**: `?limit=N&cursor=N`
**응답 (200)**: `PaginatedResponse<Comment>` (최신순 정렬)
