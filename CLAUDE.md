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
<!-- MANUAL ADDITIONS END -->
