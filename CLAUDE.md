# epigram Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-04-03

## Active Technologies

## Project Structure

```text
src/
tests/
```

## Commands

# Add commands for

## Code Style

General: Follow standard conventions

## Recent Changes

<!-- MANUAL ADDITIONS START -->

## 필수 초기화

**세션 시작 시 반드시 먼저 읽어야 할 파일:**

- @.specify/memory/constitution.md — 이 프로젝트의 모든 코드 작성 원칙. 코드를 작성하기 전에 반드시 읽는다.
- @specs/001-epigram-core-pages/plan.md — 태스크 컨텍스트 및 설계 의도 파악.
- `specs/001-epigram-core-pages/` 하위의 관련 문서 — `spec.md`, `research.md`, `data-model.md`, `contracts/` 디렉토리 내 파일 등 태스크와 관련된 문서는 모두 읽는다.

**⚠️ 위 파일들을 읽기 전까지 코드를 한 줄도 작성하지 않는다. 예외 없음.**

## 필수 워크플로우 (매 태스크마다 반드시 준수)

**태스크 구현 시작 전 아래 순서를 반드시 지킨다. 예외 없음.**

```
1. GitHub 이슈 생성 (burningddol/epigram)
2. `git checkout main && git pull origin main` 으로 최신 상태 동기화
3. 브랜치 생성: feat/#이슈번호-설명 / chore/#이슈번호-설명 / fix/#이슈번호-설명
4. 작업 수행
5. 커밋 메시지: "type: 설명 (#이슈번호)"
6. 작업한 내용을 simplify 스킬을 사용하여 리팩토링 후 커밋 및 푸쉬(필수)
7. PR 생성 — 본문에 반드시 `Closes #이슈번호` 포함 → PR의 CI통과하면 머지 (불통과시 해결 후 머지)
```

코드를 한 줄이라도 작성하기 전에 이슈와 브랜치가 먼저 존재해야 한다.

## 피그마 시안 우선 원칙 (UI 작업 시 예외 없음)

**UI/스타일 관련 작업(컴포넌트, 페이지, 레이아웃, 색상, 타이포그래피 등)을 시작하기 전에 반드시 피그마 시안을 먼저 확인한다.**

피그마 파일 키: `tk2V6CQ7SYVsFfdIPF1EW8`

**Figma MCP 대신 REST API를 사용한다.** 토큰과 파일 키는 `.env.local`에 저장되어 있다.

**확인 순서:**

```bash
# 1. 토큰·파일 키 읽기
FIGMA_TOKEN=$(grep FIGMA_TOKEN .env.local | cut -d= -f2)
FIGMA_FILE_KEY=$(grep FIGMA_FILE_KEY .env.local | cut -d= -f2)

# 2. 섹션 ID 파악 (memory/reference_figma_api.md의 섹션 ID 목록 먼저 확인)
curl -s -H "X-Figma-Token: $FIGMA_TOKEN" \
  "https://api.figma.com/v1/files/$FIGMA_FILE_KEY/nodes?ids=PAGE_OR_SECTION_ID" | \
  python3 -c "..."   # 색상·타이포·간격·레이아웃 추출

# 3. 추출한 값을 globals.css 디자인 토큰에 매핑하여 구현
```

섹션 ID 전체 목록: `C:\Users\j\.claude\projects\c--Users-j-Desktop-----epigram\memory\reference_figma_api.md`

**⚠️ 피그마 시안 확인 없이 임의로 스타일을 작성하지 않는다. 예외 없음.**

## 아이콘 사용 원칙

**모든 아이콘은 `lucide-react`를 사용한다. 예외 없음.**

- SVG 인라인 작성 금지
- 이미지 파일(png, svg 파일) 아이콘 사용 금지
- Figma MCP 에셋 URL로 아이콘 사용 금지
- 커스텀 아이콘이 꼭 필요한 경우에만 별도 SVG 컴포넌트로 분리

## API 작업 원칙 (예외 없음)

**API 함수·타입·훅을 구현하기 전에 반드시 백엔드 swagger를 먼저 확인한다.**

백엔드 Swagger URL: `https://fe-project-epigram-api.vercel.app/docs/#/`
(spec.md 상단에도 기재되어 있음)

**확인 순서:**

```
1. swagger-ui-init.js 에서 실제 스펙 파싱
   curl https://fe-project-epigram-api.vercel.app/docs/swagger-ui-init.js
2. 엔드포인트 경로, request body 필드, response 스키마 확인
3. contracts/ 문서와 불일치 시 → swagger 우선
4. 확인 후 구현
```

**⚠️ contracts/ 나 spec.md 기술 내용이 실제 swagger와 다를 수 있다. 반드시 swagger를 정답으로 삼는다. 예외 없음.**

## 렌더링 전략 원칙

**API 요청의 인증 필요 여부에 따라 렌더링 전략을 결정한다.**

- **인증이 필요한 API 요청** → CSR (클라이언트 컴포넌트 + React Query)
- **인증이 불필요한 공개 API 요청** → ISR/SSG (서버 컴포넌트 + `next.revalidate`)
- 하나의 페이지 안에서 두 전략을 혼용할 수 있다.

### 페이지별 전략

| 페이지 | ISR/SSG 부분 | CSR 부분 |
| --- | --- | --- |
| `/` (랜딩) | 전체 (`force-static`) | 없음 |
| `/epigrams` | 에피그램 목록 (`revalidate: 30`) | 없음 |
| `/epigrams/[id]` | 에피그램 본문 (`revalidate: 60`) | 좋아요 상태, 댓글 목록·작성 |
| `/search` | 없음 (`force-dynamic`) | 검색 결과 |
| `/addepigram` | 없음 | 전체 (폼, 인증 필요) |
| `/epigrams/[id]/edit` | 없음 | 전체 (폼, 인증 필요) |
| `/mypage` | 없음 | 전체 (인증 필요, 개인화 데이터) |
| `/login`, `/signup` | 전체 (`force-static`) | 없음 |

---

### ISR/SSG 구현 패턴 (서버 컴포넌트)

**⚠️ 서버 컴포넌트에서 `/api/[...path]` BFF 프록시 경유 금지.**
프록시는 `cache: "no-store"` 고정이므로 ISR 캐싱이 불가하다. 백엔드에 직접 fetch한다.

#### 기본 패턴

```tsx
// src/app/epigrams/page.tsx
export const revalidate = 30;

export default async function EpigramsPage() {
  const data = await fetchEpigramsServer();
  return <EpigramsView initialData={data} />;
}
```

#### 동적 라우트 ISR + generateStaticParams

```tsx
// src/app/epigrams/[id]/page.tsx
export const revalidate = 60;

export async function generateStaticParams() {
  const epigrams = await fetchRecentEpigramsServer({ limit: 20 });
  return epigrams.list.map((e) => ({ id: String(e.id) }));
}

export default async function EpigramDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const epigram = await fetchEpigramByIdServer(id);
  // 공개 데이터(본문)는 서버에서, 인증 데이터(좋아요·댓글)는 클라이언트 컴포넌트에서
  return <EpigramDetailView epigram={epigram} />;
}
```

#### 서버 전용 fetch 함수 (`server.ts`)

```ts
// src/entities/epigram/api/server.ts
// Server-only: DO NOT import in client components
const BACKEND_BASE = `${process.env.BACKEND_URL}/${process.env.TEAM_ID}`;

export async function fetchEpigramByIdServer(id: string): Promise<Epigram> {
  const res = await fetch(`${BACKEND_BASE}/epigrams/${id}`, {
    next: { revalidate: 60, tags: ["epigrams", `epigram-${id}`] },
  });
  if (!res.ok) throw new Error(`Failed to fetch epigram ${id}: ${res.status}`);
  return res.json() as Promise<Epigram>;
}
```

#### On-demand Revalidation (생성/수정/삭제 후 캐시 무효화)

```ts
// 에피그램 mutate 후 캐시 즉시 무효화
import { revalidateTag, revalidatePath } from "next/cache";

revalidateTag("epigrams");       // 관련 캐시 전체 무효화
revalidatePath("/epigrams");     // 목록 페이지 재생성
```

---

### CSR 구현 패턴 (인증 필요 데이터)

인증이 필요한 데이터는 `"use client"` 컴포넌트에서 React Query로 처리한다.
BFF 프록시(`/api/...`)를 경유하며, accessToken은 HttpOnly 쿠키에서 BFF가 자동으로 주입한다.

```tsx
// 좋아요 상태 — 인증 필요 → CSR
"use client";

export function LikeButton({ epigramId }: { epigramId: number }) {
  const { data } = useEpigramLikeStatus(epigramId); // React Query, /api/... 경유
  // ...
}
```

---

### fetch 위치 구분

| 컨텍스트 | fetch 방식 | 파일 위치 |
| --- | --- | --- |
| 서버 컴포넌트 (ISR/SSG) | `fetch(BACKEND_URL/...)` + `next.revalidate` | `entities/*/api/server.ts` |
| 클라이언트 컴포넌트 (CSR) | `apiClient` (axios, `/api/...` BFF 경유) | `entities/*/api/client.ts` |

- 서버 전용 파일 최상단: `// Server-only: DO NOT import in client components`

---

### 페이지 구현 체크리스트

새 페이지를 만들 때 각 데이터 항목마다 확인한다:

- [ ] 이 데이터는 인증이 필요한가?
  - Yes → 클라이언트 컴포넌트 + React Query (BFF 경유)
  - No → 서버 컴포넌트 + `next.revalidate` (백엔드 직접 fetch)
- [ ] ISR 적용 시: `export const revalidate = N` 선언했는가?
- [ ] 동적 라우트 ISR 시: `generateStaticParams` 구현했는가?
- [ ] 데이터 변경(CUD) 후 `revalidateTag` / `revalidatePath` 호출했는가?
- [ ] 서버 컴포넌트가 BFF 프록시 대신 백엔드에 직접 fetch하는가?

---

## 커밋 전 필수 체크

```
1. 파일 구현
2. npm run format     (prettier --write .)
3. npm run lint       (ESLint 에러 0개 확인 — 에러 있으면 수정 후 재확인)
4. npm run build      (TypeScript 타입 에러 + 빌드 에러 확인)
5. git add <files>
6. git commit
7. git push
8. PR 생성
```

<!-- MANUAL ADDITIONS END -->
