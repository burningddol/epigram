"use client";

import type { ReactElement } from "react";

import Link from "next/link";

import { ChevronDown } from "lucide-react";

import { useMyComments } from "@/entities/comment";
import { useEpigrams } from "@/entities/epigram";
import { useMonthlyEmotions } from "@/entities/emotion-log";
import type { Comment } from "@/entities/comment";
import type { Epigram } from "@/entities/epigram";

import { EmotionCalendar } from "./EmotionCalendar";
import { EmotionPieChart } from "./EmotionPieChart";

const PAGE_SIZE = 3;

interface MypageActivityProps {
  userId: number;
}

// ─── Epigram section ───────────────────────────────────────────────────────

interface MyEpigramItemProps {
  epigram: Epigram;
}

function MyEpigramItem({ epigram }: MyEpigramItemProps): ReactElement {
  return (
    <li>
      <Link
        href={`/epigrams/${epigram.id}`}
        className="block rounded-xl border border-line-200 bg-white px-4 py-3 text-sm text-black-700 transition-colors hover:border-blue-300 hover:bg-blue-50"
      >
        <p className="line-clamp-2 font-medium leading-snug">{epigram.content}</p>
        <p className="mt-1 text-right text-xs text-black-300">— {epigram.author}</p>
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

  return (
    <section className="rounded-2xl bg-white px-6 py-5">
      <h2 className="mb-4 text-base font-semibold text-black-700">내 에피그램</h2>

      {epigrams.length === 0 ? (
        <p className="text-center text-sm text-black-300">작성한 에피그램이 없어요.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {epigrams.map((epigram) => (
            <MyEpigramItem key={epigram.id} epigram={epigram} />
          ))}
        </ul>
      )}

      {hasNextPage && (
        <button
          type="button"
          onClick={() => void fetchNextPage()}
          disabled={isFetchingNextPage}
          className="mt-4 flex w-full items-center justify-center gap-1 rounded-xl border border-line-200 py-2 text-sm text-black-400 transition-colors hover:border-blue-300 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
          {isFetchingNextPage ? "불러오는 중..." : "더보기"}
        </button>
      )}
    </section>
  );
}

// ─── Comment section ────────────────────────────────────────────────────────

interface MyCommentItemProps {
  comment: Comment;
}

function MyCommentItem({ comment }: MyCommentItemProps): ReactElement {
  return (
    <li>
      <Link
        href={`/epigrams/${comment.epigramId}`}
        className="block rounded-xl border border-line-200 bg-white px-4 py-3 text-sm text-black-700 transition-colors hover:border-blue-300 hover:bg-blue-50"
      >
        <p className="line-clamp-2 leading-snug">{comment.content}</p>
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
    <section className="rounded-2xl bg-white px-6 py-5">
      <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-black-700">
        내 댓글
        {totalCount > 0 && (
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-600">
            {totalCount}
          </span>
        )}
      </h2>

      {comments.length === 0 ? (
        <p className="text-center text-sm text-black-300">작성한 댓글이 없어요.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {comments.map((comment) => (
            <MyCommentItem key={comment.id} comment={comment} />
          ))}
        </ul>
      )}

      {hasNextPage && (
        <button
          type="button"
          onClick={() => void fetchNextPage()}
          disabled={isFetchingNextPage}
          className="mt-4 flex w-full items-center justify-center gap-1 rounded-xl border border-line-200 py-2 text-sm text-black-400 transition-colors hover:border-blue-300 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
          {isFetchingNextPage ? "불러오는 중..." : "더보기"}
        </button>
      )}
    </section>
  );
}

// ─── MypageActivity ─────────────────────────────────────────────────────────

const NOW = new Date();

export function MypageActivity({ userId }: MypageActivityProps): ReactElement {
  const { data: monthlyLogs = [] } = useMonthlyEmotions({
    userId,
    year: NOW.getFullYear(),
    month: NOW.getMonth() + 1,
  });

  return (
    <div className="flex flex-col gap-4">
      <EmotionCalendar userId={userId} />
      <EmotionPieChart emotionLogs={monthlyLogs} />
      <MyEpigramList userId={userId} />
      <MyCommentList userId={userId} />
    </div>
  );
}
