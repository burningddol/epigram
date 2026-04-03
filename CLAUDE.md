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

- `.specify/memory/constitution.md` — 이 프로젝트의 모든 코드 작성 원칙. 코드를 작성하기 전에 반드시 읽는다.
- `specs/001-epigram-core-pages/plan.md` — 태스크 컨텍스트 및 설계 의도 파악.
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
6. PR 생성 — 본문에 반드시 `Closes #이슈번호` 포함 → 사용자가 merge
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

## 캐싱 전략 원칙 (Next.js ISR 우선)

**데이터를 fetch하는 페이지·컴포넌트를 구현할 때는 반드시 ISR(Incremental Static Regeneration)을 먼저 고려한다.**

### 기본 원칙

- **정적 생성 가능한 데이터는 ISR로** — 에피그램 목록, 에피그램 상세, 검색 결과 등 서버에서 fetch하는 모든 데이터가 대상
- **`revalidate`는 데이터 변경 빈도에 맞게** — 자주 바뀌지 않는 데이터는 길게, 실시간성이 중요한 데이터는 짧게
- **`dynamic = "force-dynamic"`은 최후 수단** — 쿠키·헤더·searchParams에 의존하거나 사용자별로 완전히 달라지는 페이지에만 사용

### 구현 패턴

```ts
// 1. 페이지 단위 revalidate (page.tsx 또는 layout.tsx 상단에 선언)
export const revalidate = 60; // 60초마다 백그라운드 재생성

// 2. fetch 단위 revalidate
const data = await fetch(url, { next: { revalidate: 60 } });

// 3. 태그 기반 on-demand revalidation (데이터 변경 시 즉시 무효화)
const data = await fetch(url, { next: { tags: ["epigrams"] } });
// 변경 발생 시: revalidateTag("epigrams")

// 4. 완전 정적 (변경이 거의 없는 데이터)
export const revalidate = false; // 빌드 시 생성 후 영구 캐시
```

### 페이지별 권장 전략

| 페이지 | 전략 | 이유 |
|--------|------|------|
| `/` 랜딩 | `revalidate = false` (정적) | 하드코딩 데이터, 변경 없음 |
| `/epigrams` 목록 | `revalidate = 60` | 새 에피그램이 자주 추가됨 |
| `/epigrams/[id]` 상세 | `revalidate = 60` | 좋아요·댓글 수 변동 |
| `/search` | `dynamic = "force-dynamic"` | searchParams 의존 |
| `/mypage` | `dynamic = "force-dynamic"` | 사용자 인증 쿠키 의존 |

### 금지 사항

- 아무 이유 없이 `dynamic = "force-dynamic"` 선언 금지
- ISR 적용 가능한 페이지에 `cache: "no-store"` fetch 금지
- `revalidate = 0` 은 `force-dynamic` 과 동일 — 남용 금지

**⚠️ 새 페이지나 데이터 fetch를 구현할 때마다 위 표를 참고해 캐싱 전략을 명시적으로 결정한다. 기본값(Next.js 자동 판단)에 의존하지 않는다.**

## 커밋 전 필수 체크

```
1. 파일 구현
2. npm run format     (prettier --write .)
3. npm run build      (TypeScript 타입 에러 + 빌드 에러 확인)
4. git add <files>
5. git commit
6. git push
7. PR 생성
```

<!-- MANUAL ADDITIONS END -->
