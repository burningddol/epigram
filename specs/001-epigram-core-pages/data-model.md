# 데이터 모델: Epigram 전체 페이지 핵심 기능

**작성일**: 2026-04-03 | **브랜치**: `001-epigram-core-pages`

---

## 엔티티 정의

### User

| 필드 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | number | PK, 양수 정수 | 사용자 고유 식별자 |
| nickname | string | 1~30자 | 서비스 내 표시 이름 |
| email | string | 이메일 형식 | 로그인 식별자 (OAuth 유저는 없을 수 있음) |
| image | string \| null | URL 형식 | 프로필 이미지 URL |
| teamId | string | - | 팀 식별자 |
| createdAt | string | ISO 8601 datetime | 생성 시각 |
| updatedAt | string | ISO 8601 datetime | 수정 시각 |

**검증 규칙**:
- 일반 가입 닉네임: 1~20자
- OAuth 가입 닉네임: 1~10자
- 이미지 파일명: 영문만 허용 (한글 파일명 업로드 시 API 오류)

---

### Epigram

| 필드 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | number | PK, 양수 정수 | 에피그램 고유 식별자 |
| content | string | 1~500자 | 에피그램 본문 |
| author | string | 필수 | 저자명 ('직접입력' / '알 수 없음' / '본인') |
| referenceTitle | string \| null | 선택 | 출처 제목 (책명, 블로그명 등) |
| referenceUrl | string \| null | URL 형식, 선택 | 출처 URL |
| tags | Tag[] | 최대 3개 | 태그 목록 |
| writerId | number | FK → User.id | 작성자 ID |
| likeCount | number | 0 이상 | 좋아요 수 |
| isLiked | boolean | - | 현재 사용자의 좋아요 여부 (조회 시 포함) |

**검증 규칙**:
- `content`: 500자 초과 시 저장 불가
- `tags`: 최대 3개, 각 태그 최대 10자
- `author`: 필수 입력 (빈 문자열 불가)

**상태 전이**:
```
작성(Create) → 공개 노출 → 수정(Update) → 공개 노출
                         ↓
                       삭제(Delete) → 소멸
```

---

### Tag

| 필드 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | number | PK | 태그 고유 식별자 |
| name | string | 1~10자 | 태그 텍스트 |

---

### Comment

| 필드 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | number | PK | 댓글 고유 식별자 |
| content | string | 1자 이상 | 댓글 본문 |
| isPrivate | boolean | 기본값: false | 비공개 여부 (true: 작성자만 조회 가능) |
| epigramId | number | FK → Epigram.id | 소속 에피그램 |
| writer | UserSummary | - | 작성자 정보 (id, nickname, image) |
| createdAt | string | ISO 8601 datetime | 생성 시각 |
| updatedAt | string | ISO 8601 datetime | 수정 시각 |

**UserSummary** (댓글 내 작성자 축약 정보):
```typescript
interface UserSummary {
  id: number;
  nickname: string;
  image: string | null;
}
```

**상태 전이**:
```
작성(Create, isPrivate: false) → 공개 노출
작성(Create, isPrivate: true)  → 작성자만 노출
수정(Update) → isPrivate 변경 가능
삭제(Delete) → 소멸
```

---

### EmotionLog

| 필드 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | number | PK | 감정 기록 고유 식별자 |
| emotion | EmotionType | 필수 | 선택한 감정 |
| userId | number | FK → User.id | 기록 사용자 |
| createdAt | string | ISO 8601 datetime | 기록 시각 |

**EmotionType**:
```typescript
type EmotionType = '감동' | '기쁨' | '고민' | '슬픔' | '분노';
```

**제약사항**: 사용자당 하루 1개만 등록 가능. 이미 등록된 경우 재등록 불가.

---

### AuthToken (클라이언트 비노출 — BFF 내부 관리)

| 필드 | 타입 | 설명 |
|------|------|------|
| accessToken | string | JWT, 단기 (약 1시간) |
| refreshToken | string | JWT, 장기 (약 7일) |
| user | User | 로그인한 사용자 정보 |

**저장 위치**: HttpOnly 쿠키 (BFF 설정) — 클라이언트 JS 접근 불가

---

## 공통 응답 타입

### PaginatedResponse\<T\>

```typescript
interface PaginatedResponse<T> {
  totalCount: number;
  nextCursor: number | null;  // null이면 마지막 페이지
  list: T[];
}
```

**페이지네이션 방식**: cursor 기반 (offset 방식 아님)
- 요청: `?limit=N&cursor=N`
- 응답의 `nextCursor`를 다음 요청의 `cursor`로 사용
- `nextCursor === null` → 더 이상 데이터 없음

---

## Zod 스키마 위치

각 엔티티의 Zod 스키마는 해당 entity slice의 `model/` 디렉토리에 위치한다:

```
entities/epigram/model/epigram.schema.ts
entities/user/model/user.schema.ts
entities/comment/model/comment.schema.ts
entities/emotion-log/model/emotion-log.schema.ts
```

폼 검증 스키마는 해당 feature slice의 `model/` 디렉토리에 위치한다:

```
features/auth/model/signup.schema.ts       # 회원가입 폼
features/auth/model/login.schema.ts        # 로그인 폼
features/epigram-create/model/epigram-form.schema.ts  # 에피그램 작성/수정 폼
```

---

## 엔티티 관계도

```
User (1) ──────────── (*) Epigram
  │                        │
  │                        ├── (*) Tag
  │                        │
  │ (1)                    │ (1)
  │                        │
  └── (*) Comment ─────────┘
  │
  └── (*) EmotionLog (하루 1개 제한)
```
