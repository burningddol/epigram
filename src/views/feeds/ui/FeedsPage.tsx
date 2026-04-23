"use client";

import type { ReactElement } from "react";

import { BookOpenText, ChevronDown, ChevronUp, Plus } from "lucide-react";
import Link from "next/link";

import { EpigramListCard, useEpigrams } from "@/entities/epigram";
import { useScrollToTop } from "@/shared/hooks/useScrollToTop";
import { EmptyState } from "@/shared/ui/EmptyState";
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import { SectionErrorFallback } from "@/shared/ui/SectionErrorFallback";

export const FEEDS_PAGE_SIZE = 10;

function FeedsSkeleton(): ReactElement {
  return (
    <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2">
      {Array.from({ length: FEEDS_PAGE_SIZE }).map((_, index) => (
        <div key={index} className="h-40 animate-pulse rounded-2xl bg-blue-100" />
      ))}
    </div>
  );
}

function FeedsEmptyState(): ReactElement {
  return (
    <div className="rounded-2xl border border-dashed border-line-200 bg-white">
      <EmptyState
        icon={
          <BookOpenText className="h-7 w-7 text-blue-400" strokeWidth={1.5} aria-hidden="true" />
        }
        title="등록된 에피그램이 없습니다"
        description="첫 번째 에피그램을 작성해 보세요."
        action={
          <Link
            href="/addepigram"
            className="inline-flex h-9 items-center justify-center rounded-xl border border-black-400 px-5 text-xs font-semibold text-black-500 transition-all duration-200 hover:bg-black-500 hover:text-white active:scale-95"
          >
            에피그램 만들기
          </Link>
        }
      />
    </div>
  );
}

interface LoadMoreButtonProps {
  isLoading: boolean;
  onClick: () => void;
}

function LoadMoreButton({ isLoading, onClick }: LoadMoreButtonProps): ReactElement {
  return (
    <div className="flex justify-center pt-2">
      <button
        type="button"
        onClick={onClick}
        disabled={isLoading}
        className="group flex items-center gap-2 rounded-full border border-line-200 bg-white px-6 py-2.5 text-sm font-medium text-black-400 shadow-sm transition-all duration-200 hover:border-blue-400 hover:text-blue-700 hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? (
          <>
            <span
              className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
              aria-hidden="true"
            />
            불러오는 중...
          </>
        ) : (
          <>
            <ChevronDown
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5"
              aria-hidden="true"
            />
            + 에피그램 더보기
          </>
        )}
      </button>
    </div>
  );
}

function FeedsGrid(): ReactElement {
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useEpigrams({
    limit: FEEDS_PAGE_SIZE,
  });

  if (isLoading) {
    return <FeedsSkeleton />;
  }

  const epigrams = data?.pages.flatMap((page) => page.list) ?? [];

  if (epigrams.length === 0) {
    return <FeedsEmptyState />;
  }

  const handleLoadMore = (): void => {
    fetchNextPage();
  };

  return (
    <div className="flex flex-col gap-6">
      <ul className="grid min-w-0 grid-cols-1 gap-4 tablet:grid-cols-2">
        {epigrams.map((epigram) => (
          <li key={epigram.id} className="min-w-0">
            <EpigramListCard epigram={epigram} />
          </li>
        ))}
      </ul>
      {hasNextPage && <LoadMoreButton isLoading={isFetchingNextPage} onClick={handleLoadMore} />}
    </div>
  );
}

export function FeedsPage(): ReactElement {
  const { isVisible, scrollToTop } = useScrollToTop();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full max-w-5xl px-6 py-10 tablet:px-[72px] desktop:px-[120px]">
        <h1 className="mb-8 text-2xl font-bold text-black-900">피드</h1>

        <ErrorBoundary fallback={(_, reset) => <SectionErrorFallback reset={reset} />}>
          <FeedsGrid />
        </ErrorBoundary>
      </div>

      <Link
        href="/addepigram"
        aria-label="에피그램 만들기"
        className="fixed bottom-8 right-6 flex items-center gap-2 rounded-full bg-blue-950 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:bg-blue-800 active:scale-95 tablet:right-[72px]"
      >
        <Plus size={16} aria-hidden="true" />
        에피그램 만들기
      </Link>

      {isVisible && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="맨 위로 이동"
          className="fixed bottom-24 right-6 flex h-11 w-11 items-center justify-center rounded-full bg-white text-black-500 shadow-md transition-all duration-200 hover:bg-gray-100 active:scale-95 tablet:right-[72px]"
        >
          <ChevronUp size={20} aria-hidden="true" />
        </button>
      )}
    </main>
  );
}
