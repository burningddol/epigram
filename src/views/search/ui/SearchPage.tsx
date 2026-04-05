"use client";

import { type ReactElement } from "react";

import { ArrowUp, Loader2, SearchX } from "lucide-react";

import { useSearchEpigrams } from "@/entities/epigram";
import { SearchBar, SearchResultItem, useSearch } from "@/features/epigram-search";
import { useIntersectionObserver } from "@/shared/hooks/useIntersectionObserver";
import { useScrollToTop } from "@/shared/hooks/useScrollToTop";
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import { SectionErrorFallback } from "@/shared/ui/SectionErrorFallback";

const SEARCH_LIMIT = 10;

// ─── Skeleton ────────────────────────────────────────────────────────────────

function SearchResultSkeletonItem(): ReactElement {
  return (
    <div className="animate-pulse space-y-3 border-b border-line-100 py-7 last:border-0 pc:py-9">
      <div className="h-3.5 w-4/5 rounded-md bg-blue-200/40 pc:h-4" />
      <div className="h-3.5 w-1/2 rounded-md bg-blue-200/40 pc:h-4" />
      <div className="flex gap-2 pt-1">
        <div className="h-5 w-14 rounded-full bg-blue-200/30" />
        <div className="h-5 w-20 rounded-full bg-blue-200/30" />
      </div>
    </div>
  );
}

function SearchResultSkeleton(): ReactElement {
  return (
    <div>
      {Array.from({ length: 4 }).map((_, i) => (
        <SearchResultSkeletonItem key={i} />
      ))}
    </div>
  );
}

// ─── Empty / Initial states ───────────────────────────────────────────────────

interface SearchNoResultsProps {
  keyword: string;
}

function SearchNoResults({ keyword }: SearchNoResultsProps): ReactElement {
  return (
    <div className="flex flex-col items-center gap-5 py-24 text-center pc:gap-6 pc:py-32">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-200/40 pc:h-20 pc:w-20">
        <SearchX className="h-7 w-7 text-blue-500 pc:h-9 pc:w-9" strokeWidth={1.5} />
      </div>
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-black-600 pc:text-base">
          <span className="font-semibold text-blue-700">&ldquo;{keyword}&rdquo;</span>에 대한 결과가
          없어요
        </p>
        <p className="text-xs text-black-300 pc:text-sm">
          철자를 확인하거나 다른 검색어를 입력해 보세요
        </p>
      </div>
    </div>
  );
}

function InitialState(): ReactElement {
  return (
    <div className="flex flex-col items-center gap-2 py-24 text-center pc:py-36">
      <p className="text-sm text-black-300 pc:text-base">검색어를 입력해 에피그램을 찾아보세요</p>
    </div>
  );
}

// ─── Scroll-to-top ────────────────────────────────────────────────────────────

interface ScrollToTopButtonProps {
  isVisible: boolean;
  onScrollToTop: () => void;
}

function ScrollToTopButton({
  isVisible,
  onScrollToTop,
}: ScrollToTopButtonProps): ReactElement | null {
  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={onScrollToTop}
      aria-label="페이지 상단으로 이동"
      className="fixed bottom-8 right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-line-200 bg-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-lg active:scale-95 tablet:right-8 pc:right-12 pc:h-12 pc:w-12"
    >
      <ArrowUp className="h-5 w-5 text-black-500" aria-hidden="true" />
    </button>
  );
}

// ─── Search results list (infinite scroll) ────────────────────────────────────

interface SearchResultsProps {
  keyword: string;
}

function SearchResults({ keyword }: SearchResultsProps): ReactElement {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useSearchEpigrams({
    keyword,
    limit: SEARCH_LIMIT,
  });

  // useIntersectionObserver stores the callback in a ref internally — useCallback not needed
  const sentinelRef = useIntersectionObserver(
    () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    { rootMargin: "300px" }
  );

  const epigrams = data?.pages.flatMap((page) => page.list) ?? [];

  if (isLoading) return <SearchResultSkeleton />;

  if (epigrams.length === 0) return <SearchNoResults keyword={keyword} />;

  return (
    <div>
      <p className="mb-5 text-xs font-medium text-black-300 pc:mb-7 pc:text-sm">
        검색 결과{" "}
        <span className="font-semibold text-blue-700">
          {epigrams.length}
          {hasNextPage ? "+" : ""}
        </span>
      </p>

      <ul className="divide-y divide-line-200" aria-label="검색 결과 목록">
        {epigrams.map((epigram, index) => (
          <li
            key={epigram.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${Math.min(index, 5) * 40}ms` }}
          >
            <SearchResultItem epigram={epigram} keyword={keyword} />
          </li>
        ))}
      </ul>

      {hasNextPage && (
        <div ref={sentinelRef} className="flex justify-center py-10" aria-live="polite">
          {isFetchingNextPage && (
            <Loader2 className="h-5 w-5 animate-spin text-blue-400" aria-label="더 불러오는 중" />
          )}
        </div>
      )}

      {!hasNextPage && epigrams.length > 0 && (
        <p className="py-10 text-center text-xs text-black-300 pc:py-14 pc:text-sm">
          모든 결과를 불러왔습니다
        </p>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function SearchPage(): ReactElement {
  const {
    inputValue,
    activeKeyword,
    recentSearches,
    handleInputChange,
    handleSearch,
    removeRecentSearch,
    clearAllRecentSearches,
  } = useSearch();

  const { isVisible, scrollToTop } = useScrollToTop();

  return (
    <main
      id="main-content"
      className="relative mx-auto min-h-screen w-full max-w-xl px-5 pb-20 pt-10
        tablet:max-w-2xl tablet:px-10 tablet:pt-14
        pc:max-w-4xl pc:px-16 pc:pt-20
        desktop:max-w-5xl desktop:px-20"
    >
      <div className="flex flex-col gap-10 tablet:gap-12 pc:gap-14">
        <SearchBar
          inputValue={inputValue}
          recentSearches={recentSearches}
          onInputChange={handleInputChange}
          onSearch={handleSearch}
          onRemoveRecent={removeRecentSearch}
          onClearAllRecent={clearAllRecentSearches}
        />

        <section aria-label="검색 결과">
          {activeKeyword ? (
            <ErrorBoundary
              key={activeKeyword}
              fallback={(_, reset) => <SectionErrorFallback reset={reset} />}
            >
              <SearchResults keyword={activeKeyword} />
            </ErrorBoundary>
          ) : (
            <InitialState />
          )}
        </section>
      </div>

      <ScrollToTopButton isVisible={isVisible} onScrollToTop={scrollToTop} />
    </main>
  );
}
