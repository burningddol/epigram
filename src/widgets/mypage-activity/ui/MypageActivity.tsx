"use client";

import type { ReactElement } from "react";

import Link from "next/link";

import { ChevronDown } from "lucide-react";

import { useMyComments } from "@/entities/comment";
import { useMonthlyEmotions } from "@/entities/emotion-log";
import { useEpigrams } from "@/entities/epigram";

import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import { SectionErrorFallback } from "@/shared/ui/SectionErrorFallback";

import { EmotionCalendar } from "./EmotionCalendar";
import { EmotionPieChart } from "./EmotionPieChart";

import type { Comment } from "@/entities/comment";
import type { Epigram } from "@/entities/epigram";

const PAGE_SIZE = 3;
// Computed once at module load — date does not change during a session
const NOW = new Date();

interface MypageActivityProps {
  userId: number;
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

interface LoadMoreButtonProps {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}

function LoadMoreButton({
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: LoadMoreButtonProps): ReactElement | null {
  if (!hasNextPage) return null;

  return (
    <button
      type="button"
      onClick={onLoadMore}
      disabled={isFetchingNextPage}
      className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-line-200 py-2.5 text-sm text-black-400 transition-all duration-200 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]"
    >
      <ChevronDown
        className={["h-4 w-4 transition-transform", isFetchingNextPage ? "animate-spin" : ""].join(
          " "
        )}
        aria-hidden="true"
      />
      {isFetchingNextPage ? "불러오는 중..." : "더보기"}
    </button>
  );
}

// ─── Epigram section ──────────────────────────────────────────────────────────

interface MyEpigramItemProps {
  epigram: Epigram;
}

function MyEpigramItem({ epigram }: MyEpigramItemProps): ReactElement {
  return (
    <li>
      <Link
        href={`/epigrams/${epigram.id}`}
        className="group block rounded-xl border border-line-200 bg-white px-4 py-3.5 transition-all duration-200 hover:border-blue-400 hover:bg-blue-100/40 hover:shadow-sm active:scale-[0.99]"
      >
        <p className="line-clamp-2 text-sm font-medium leading-snug text-black-700 transition-colors group-hover:text-blue-800">
          {epigram.content}
        </p>
        <p className="mt-1.5 text-right text-xs text-black-300">— {epigram.author}</p>
      </Link>
    </li>
  );
}

interface MyEpigramListProps {
  userId: number;
}

function MyEpigramList({ userId }: MyEpigramListProps): ReactElement {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useEpigrams({
    limit: PAGE_SIZE,
    writerId: userId,
  });

  const epigrams = data?.pages.flatMap((page) => page.list) ?? [];
  const totalCount = data?.pages[0]?.totalCount ?? 0;

  return (
    <section className="rounded-2xl bg-white px-5 py-5 shadow-sm ring-1 ring-line-200">
      <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-black-700">
        내 에피그램
        {totalCount > 0 && (
          <span className="rounded-full bg-blue-200 px-2 py-0.5 text-xs font-semibold text-blue-700">
            {totalCount}
          </span>
        )}
      </h2>

      {epigrams.length === 0 ? (
        <p className="py-4 text-center text-sm text-black-300">작성한 에피그램이 없어요.</p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {epigrams.map((epigram) => (
            <MyEpigramItem key={epigram.id} epigram={epigram} />
          ))}
        </ul>
      )}

      <LoadMoreButton
        hasNextPage={hasNextPage ?? false}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={() => void fetchNextPage()}
      />
    </section>
  );
}

// ─── Comment section ──────────────────────────────────────────────────────────

interface MyCommentItemProps {
  comment: Comment;
}

function MyCommentItem({ comment }: MyCommentItemProps): ReactElement {
  return (
    <li>
      <Link
        href={`/epigrams/${comment.epigramId}`}
        className="group block rounded-xl border border-line-200 bg-white px-4 py-3.5 transition-all duration-200 hover:border-blue-400 hover:bg-blue-100/40 hover:shadow-sm active:scale-[0.99]"
      >
        <p className="line-clamp-2 text-sm leading-snug text-black-600 transition-colors group-hover:text-blue-800">
          {comment.content}
        </p>
      </Link>
    </li>
  );
}

interface MyCommentListProps {
  userId: number;
}

function MyCommentList({ userId }: MyCommentListProps): ReactElement {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useMyComments({
    userId,
    limit: PAGE_SIZE,
  });

  const comments = data?.pages.flatMap((page) => page.list) ?? [];
  const totalCount = data?.pages[0]?.totalCount ?? 0;

  return (
    <section className="rounded-2xl bg-white px-5 py-5 shadow-sm ring-1 ring-line-200">
      <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-black-700">
        내 댓글
        {totalCount > 0 && (
          <span className="rounded-full bg-blue-200 px-2 py-0.5 text-xs font-semibold text-blue-700">
            {totalCount}
          </span>
        )}
      </h2>

      {comments.length === 0 ? (
        <p className="py-4 text-center text-sm text-black-300">작성한 댓글이 없어요.</p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {comments.map((comment) => (
            <MyCommentItem key={comment.id} comment={comment} />
          ))}
        </ul>
      )}

      <LoadMoreButton
        hasNextPage={hasNextPage ?? false}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={() => void fetchNextPage()}
      />
    </section>
  );
}

// ─── MypageActivity ───────────────────────────────────────────────────────────

export function MypageActivity({ userId }: MypageActivityProps): ReactElement {
  const { data: monthlyLogs = [] } = useMonthlyEmotions({
    userId,
    year: NOW.getFullYear(),
    month: NOW.getMonth() + 1,
  });

  return (
    <div className="flex flex-col gap-4">
      <ErrorBoundary fallback={(_, reset) => <SectionErrorFallback reset={reset} />}>
        <EmotionCalendar userId={userId} />
      </ErrorBoundary>
      <ErrorBoundary fallback={(_, reset) => <SectionErrorFallback reset={reset} />}>
        <EmotionPieChart emotionLogs={monthlyLogs} />
      </ErrorBoundary>

      <div className="grid gap-4 pc:grid-cols-2">
        <MyEpigramList userId={userId} />
        <MyCommentList userId={userId} />
      </div>
    </div>
  );
}
