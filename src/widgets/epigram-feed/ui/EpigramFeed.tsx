"use client";

import type { ReactElement, ReactNode } from "react";

import { BookOpenText, ChevronDown } from "lucide-react";
import Link from "next/link";

import { EpigramListCard, useEpigrams, useTodayEpigram } from "@/entities/epigram";
import { EmptyState } from "@/shared/ui/EmptyState";
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import { SectionErrorFallback } from "@/shared/ui/SectionErrorFallback";

const FEED_PAGE_SIZE = 5;
const FEED_SKELETON_COUNT = 3;

interface FeedSectionProps {
  title: string;
  children: ReactNode;
}

function FeedSection({ title, children }: FeedSectionProps): ReactElement {
  return (
    <section aria-label={title}>
      <h2 className="mb-4 text-xl font-bold text-black-900">{title}</h2>
      {children}
    </section>
  );
}

function TodayEpigramEmpty(): ReactElement {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-line-200 bg-white px-8 py-10 shadow-sm">
      {/* 장식용 여는 따옴표 */}
      <span
        className="pointer-events-none absolute -top-4 left-4 select-none font-serif text-[96px] leading-none text-blue-100"
        aria-hidden="true"
      >
        {"\u201C"}
      </span>

      <div className="relative flex flex-col items-center gap-3 text-center">
        <p className="font-serif text-base leading-relaxed text-black-400">
          오늘의 에피그램이 아직 작성되지 않았습니다
        </p>
        <p className="font-serif text-xs text-blue-300">— 좋은 글귀가 곧 채워질 거예요</p>
      </div>

      {/* 장식용 닫는 따옴표 */}
      <span
        className="pointer-events-none absolute -bottom-6 right-4 select-none font-serif text-[96px] leading-none text-blue-100"
        aria-hidden="true"
      >
        {"\u201D"}
      </span>
    </div>
  );
}

function TodayEpigramBody(): ReactElement {
  const { data: todayEpigram, isLoading } = useTodayEpigram();

  if (isLoading) {
    return <div className="h-32 animate-pulse rounded-2xl bg-blue-200" />;
  }

  if (!todayEpigram) {
    return <TodayEpigramEmpty />;
  }

  return <EpigramListCard epigram={todayEpigram} />;
}

function TodayEpigramSection(): ReactElement {
  return (
    <FeedSection title="오늘의 에피그램">
      <TodayEpigramBody />
    </FeedSection>
  );
}

function FeedListSkeleton(): ReactElement {
  return (
    <div className="flex flex-col gap-6">
      {Array.from({ length: FEED_SKELETON_COUNT }).map((_, index) => (
        <div key={index} className="h-28 animate-pulse rounded-2xl bg-blue-200" />
      ))}
    </div>
  );
}

function EmptyFeedState(): ReactElement {
  return (
    <div className="rounded-2xl border border-dashed border-line-200">
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
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className="group mx-auto mt-2 flex items-center gap-2 rounded-full border border-line-200 bg-white px-6 py-2.5 text-sm font-medium text-black-400 shadow-sm transition-all duration-200 hover:border-blue-400 hover:text-blue-700 hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoading ? (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <ChevronDown
          className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5"
          aria-hidden="true"
        />
      )}
      {isLoading ? "불러오는 중..." : "에피그램 더보기"}
    </button>
  );
}

function EpigramFeedList(): ReactElement {
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useEpigrams({
    limit: FEED_PAGE_SIZE,
  });

  if (isLoading) {
    return <FeedListSkeleton />;
  }

  const epigrams = data?.pages.flatMap((page) => page.list) ?? [];

  if (epigrams.length === 0) {
    return <EmptyFeedState />;
  }

  const handleLoadMore = (): void => {
    fetchNextPage();
  };

  return (
    <div className="flex flex-col gap-6">
      {epigrams.map((epigram) => (
        <EpigramListCard key={epigram.id} epigram={epigram} />
      ))}
      {hasNextPage && <LoadMoreButton isLoading={isFetchingNextPage} onClick={handleLoadMore} />}
    </div>
  );
}

export function EpigramFeed(): ReactElement {
  return (
    <div className="flex flex-col gap-10">
      <ErrorBoundary fallback={(_, reset) => <SectionErrorFallback reset={reset} />}>
        <TodayEpigramSection />
      </ErrorBoundary>
      <FeedSection title="최신 에피그램">
        <ErrorBoundary fallback={(_, reset) => <SectionErrorFallback reset={reset} />}>
          <EpigramFeedList />
        </ErrorBoundary>
      </FeedSection>
    </div>
  );
}
