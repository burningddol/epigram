"use client";

import { ChevronDown, BookOpenText } from "lucide-react";
import Link from "next/link";
import React from "react";

import { useTodayEpigram, useEpigrams } from "@/entities/epigram";
import type { Epigram } from "@/entities/epigram";

const FEED_PAGE_SIZE = 5;

function EpigramTagList({ tags }: { tags: Epigram["tags"] }): React.ReactElement {
  return (
    <ul className="mt-3 flex flex-wrap gap-2" aria-label="태그 목록">
      {tags.map((tag) => (
        <li key={tag.id}>
          <span className="rounded-full bg-blue-200 px-3 py-1 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-300">
            #{tag.name}
          </span>
        </li>
      ))}
    </ul>
  );
}

function EpigramCard({ epigram }: { epigram: Epigram }): React.ReactElement {
  return (
    <Link
      href={`/epigrams/${epigram.id}`}
      className="group block rounded-2xl border border-line-200 bg-white px-6 py-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
    >
      <blockquote>
        <p className="font-serif text-base leading-relaxed text-black-700 transition-colors group-hover:text-black-900">
          {epigram.content}
        </p>
        <footer className="mt-3 text-right text-sm text-black-300">
          — {epigram.author}
          {epigram.referenceTitle ? ` 《${epigram.referenceTitle}》` : ""}
        </footer>
      </blockquote>
      {epigram.tags.length > 0 && <EpigramTagList tags={epigram.tags} />}
    </Link>
  );
}

function TodayEpigramSection(): React.ReactElement {
  const { data: todayEpigram, isLoading } = useTodayEpigram();

  if (isLoading) {
    return (
      <section aria-label="오늘의 에피그램">
        <h2 className="mb-4 text-xl font-bold text-black-900">오늘의 에피그램</h2>
        <div className="h-32 animate-pulse rounded-2xl bg-blue-200" />
      </section>
    );
  }

  if (!todayEpigram) {
    return (
      <section aria-label="오늘의 에피그램">
        <h2 className="mb-4 text-xl font-bold text-black-900">오늘의 에피그램</h2>
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-line-200 py-10 text-black-300">
          <BookOpenText className="h-8 w-8 opacity-40" aria-hidden="true" />
          <p className="text-sm">오늘의 에피그램이 아직 없습니다.</p>
        </div>
      </section>
    );
  }

  return (
    <section aria-label="오늘의 에피그램">
      <h2 className="mb-4 text-xl font-bold text-black-900">오늘의 에피그램</h2>
      <EpigramCard epigram={todayEpigram} />
    </section>
  );
}

function EpigramFeedList(): React.ReactElement {
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useEpigrams({
    limit: FEED_PAGE_SIZE,
  });

  const epigrams = data?.pages.flatMap((page) => page.list) ?? [];

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-blue-200" />
        ))}
      </div>
    );
  }

  if (epigrams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-line-200 py-16 text-black-300">
        <BookOpenText className="h-8 w-8 opacity-40" aria-hidden="true" />
        <p className="text-sm">등록된 에피그램이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {epigrams.map((epigram) => (
        <EpigramCard key={epigram.id} epigram={epigram} />
      ))}
      {hasNextPage && (
        <button
          type="button"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="group mx-auto mt-2 flex items-center gap-2 rounded-full border border-line-200 bg-white px-6 py-2.5 text-sm font-medium text-black-400 shadow-sm transition-all duration-200 hover:border-blue-400 hover:text-blue-700 hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isFetchingNextPage ? (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <ChevronDown
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5"
              aria-hidden="true"
            />
          )}
          {isFetchingNextPage ? "불러오는 중..." : "에피그램 더보기"}
        </button>
      )}
    </div>
  );
}

export function EpigramFeed(): React.ReactElement {
  return (
    <div className="flex flex-col gap-10">
      <TodayEpigramSection />
      <section aria-label="최신 에피그램">
        <h2 className="mb-4 text-xl font-bold text-black-900">최신 에피그램</h2>
        <EpigramFeedList />
      </section>
    </div>
  );
}
