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

## ISR 캐싱 최적화 원칙 (예외 없음)

**이 프로젝트는 가능한 모든 페이지에 ISR(Incremental Static Regeneration)을 적용한다.**

### ISR 적용 기준

| 페이지 / 데이터                    | 전략                           | 이유                               |
| ---------------------------------- | ------------------------------ | ---------------------------------- |
| 에피그램 상세 (`/epigrams/[id]`)   | ISR (`revalidate: 60`)         | 공개 데이터, 변경 빈도 낮음        |
| 에피그램 목록 (`/epigrams`)        | ISR (`revalidate: 30`)         | 공개 데이터, 새 에피그램 추가 가능 |
| 랜딩 (`/`)                         | `force-static`                 | 완전 정적, 데이터 없음             |
| 마이페이지 (`/mypage`)             | **ISR 금지** — 클라이언트 전용 | 인증 필요, 개인화 데이터           |
| 감정 로그 (`/mypage` 등 인증 영역) | **ISR 금지** — 클라이언트 전용 | 사용자별 데이터                    |

**규칙:**

- 공개(비인증) 데이터 → ISR 우선
- 인증 필요 / 개인화 데이터 → React Query(클라이언트) 유지, ISR 금지
- 검색 결과 (`/search`) → `dynamic = 'force-dynamic'` (쿼리 파라미터 기반)

---

### ISR 구현 패턴 (Next.js App Router)

#### 1. 페이지 레벨 revalidate (기본)

```tsx
// src/app/epigrams/page.tsx
export const revalidate = 30; // 30초마다 백그라운드 재생성

export default async function EpigramsPage() {
  // 서버 컴포넌트에서 직접 fetch — proxy(/api/...) 경유 금지
  const data = await fetchEpigramsServer();
  return <EpigramsView initialData={data} />;
}
```

#### 2. 동적 라우트 ISR + generateStaticParams

```tsx
// src/app/epigrams/[id]/page.tsx
export const revalidate = 60;

export async function generateStaticParams() {
  // 빌드 시 자주 조회되는 에피그램 ID를 미리 생성
  const epigrams = await fetchRecentEpigramsServer({ limit: 20 });
  return epigrams.list.map((e) => ({ id: String(e.id) }));
}

export default async function EpigramDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const epigram = await fetchEpigramByIdServer(id);
  return <EpigramDetailView epigram={epigram} />;
}
```

#### 3. fetch 레벨 캐싱 (세밀한 제어)

```ts
// src/entities/epigram/api/server.ts  ← 서버 전용 fetch 함수
const BACKEND_BASE = `${process.env.BACKEND_URL}/${process.env.TEAM_ID}`;

export async function fetchEpigramsServer(params?: {
  limit?: number;
  cursor?: number;
}): Promise<EpigramListResponse> {
  const query = new URLSearchParams();
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.cursor) query.set("cursor", String(params.cursor));

  const res = await fetch(`${BACKEND_BASE}/epigrams?${query}`, {
    next: {
      revalidate: 30,
      tags: ["epigrams"], // On-demand revalidation 태그
    },
  });

  if (!res.ok) throw new Error(`Failed to fetch epigrams: ${res.status}`);
  return res.json() as Promise<EpigramListResponse>;
}

export async function fetchEpigramByIdServer(id: string): Promise<Epigram> {
  const res = await fetch(`${BACKEND_BASE}/epigrams/${id}`, {
    next: {
      revalidate: 60,
      tags: ["epigrams", `epigram-${id}`],
    },
  });

  if (!res.ok) throw new Error(`Failed to fetch epigram ${id}: ${res.status}`);
  return res.json() as Promise<Epigram>;
}
```

#### 4. On-demand Revalidation (에피그램 생성/수정/삭제 시)

```ts
// src/app/api/revalidate/route.ts
import { revalidateTag, revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { tag, path } = (await request.json()) as { tag?: string; path?: string };

  if (tag) revalidateTag(tag);
  if (path) revalidatePath(path);

  return NextResponse.json({ revalidated: true });
}
```

```ts
// 에피그램 생성 후 캐시 무효화 (Server Action 또는 API 호출 후)
import { revalidateTag, revalidatePath } from "next/cache";

export async function createEpigramAction(data: CreateEpigramRequest) {
  // ... 에피그램 생성 로직
  revalidateTag("epigrams"); // 목록 캐시 무효화
  revalidatePath("/epigrams"); // 목록 페이지 재생성
}
```

---

### 서버 전용 fetch vs 클라이언트 axios 구분

**⚠️ ISR 서버 컴포넌트에서 `/api/[...path]` 프록시 경유를 금지한다.**
프록시 route handler는 `cache: "no-store"`로 고정되어 있으므로 ISR 캐싱이 불가하다.

| 컨텍스트                          | 사용할 fetch 방식                               | 위치                           |
| --------------------------------- | ----------------------------------------------- | ------------------------------ |
| 서버 컴포넌트 (ISR)               | `fetch(BACKEND_URL/...)` with `next.revalidate` | `src/entities/*/api/server.ts` |
| 클라이언트 컴포넌트 (React Query) | `apiClient` (axios, `/api/...` 경유)            | `src/entities/*/api/client.ts` |

- 서버 전용 함수 파일명: `server.ts`
- 클라이언트 전용 함수 파일명: `client.ts` (기존 유지)
- 서버 전용 파일 최상단에 반드시 `// Server-only: DO NOT import in client components` 주석 추가

---

### Hydration 전략 (서버 → 클라이언트 상태 전달)

React Query와 ISR을 함께 쓸 때 초기 데이터를 클라이언트에 전달하여 중복 요청을 방지한다.

```tsx
// src/app/epigrams/page.tsx
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

export const revalidate = 30;

export default async function EpigramsPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["epigrams"],
    queryFn: () => fetchEpigramsServer({ limit: 10 }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EpigramsView />
    </HydrationBoundary>
  );
}
```

이렇게 하면:

1. 서버에서 ISR 캐시로 빠르게 HTML 생성
2. 클라이언트에서 React Query가 초기 데이터를 재사용 (중복 fetch 없음)
3. 이후 갱신은 React Query의 `staleTime` / `refetchOnWindowFocus` 로직 따름

---

### ISR 구현 체크리스트

새로운 페이지를 만들 때마다 아래를 확인한다:

- [ ] 공개 데이터인가? → `export const revalidate = N` 추가
- [ ] 동적 라우트인가? → `generateStaticParams` 구현
- [ ] 서버 fetch 함수가 `next: { revalidate, tags }` 옵션을 사용하는가?
- [ ] 데이터 변경 로직에 `revalidateTag` / `revalidatePath` 호출이 있는가?
- [ ] 서버 컴포넌트가 axios/프록시 경유 대신 직접 fetch를 사용하는가?
- [ ] 인증 필요 데이터에 ISR을 잘못 적용하지 않았는가?

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
