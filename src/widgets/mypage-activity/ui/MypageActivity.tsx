"use client";

import { useState, type ReactElement } from "react";

import Link from "next/link";

import { ChevronDown } from "lucide-react";

import { useMyComments } from "@/entities/comment";
import { useMonthlyEmotions } from "@/entities/emotion-log";
import { useEpigrams } from "@/entities/epigram";
import { cn } from "@/shared/lib/cn";
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
      className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-line-200 bg-background py-3.5 text-xl font-medium text-blue-500 transition-all duration-200 hover:bg-[#edf1f8] disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]"
    >
      <ChevronDown
        className={cn("h-6 w-6 transition-transform", isFetchingNextPage && "animate-spin")}
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
    <li className="flex flex-col gap-2">
      <Link
        href={`/epigrams/${epigram.id}`}
        className="group block rounded-2xl border border-line-100 bg-white p-6 shadow-[0px_3px_12px_0_rgba(0,0,0,0.04)] transition-all duration-200 hover:shadow-md active:scale-[0.99]"
      >
        <p className="line-clamp-2 text-2xl font-medium leading-snug text-black-600 transition-colors group-hover:text-blue-700">
          {epigram.content}
        </p>
        <p className="mt-5 text-right text-2xl font-medium text-blue-400">- {epigram.author} -</p>
      </Link>
      {epigram.tags.length > 0 && (
        <div className="flex flex-wrap gap-4 px-1">
          {epigram.tags.map((tag) => (
            <span key={tag.id} className="text-2xl font-medium text-blue-400">
              #{tag.name}
            </span>
          ))}
        </div>
      )}
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
    <div>
      {epigrams.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-300">작성한 에피그램이 없어요.</p>
      ) : (
        <ul className="flex flex-col gap-4">
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
    </div>
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
        className="group block rounded-2xl border border-line-100 bg-white p-6 shadow-[0px_3px_12px_0_rgba(0,0,0,0.04)] transition-all duration-200 hover:shadow-md active:scale-[0.99]"
      >
        <p className="line-clamp-2 text-2xl font-medium leading-snug text-black-600 transition-colors group-hover:text-blue-700">
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

  return (
    <div>
      {comments.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-300">작성한 댓글이 없어요.</p>
      ) : (
        <ul className="flex flex-col gap-4">
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
    </div>
  );
}

// ─── Tab navigation ───────────────────────────────────────────────────────────

type ActivityTab = "epigram" | "comment";

const TAB_DEFINITIONS = [
  { tab: "epigram" as const, label: "내 에피그램" },
  { tab: "comment" as const, label: "내 댓글" },
];

interface TabNavProps {
  activeTab: ActivityTab;
  epigramCount: number;
  commentCount: number;
  onTabChange: (tab: ActivityTab) => void;
}

function TabNav({ activeTab, epigramCount, commentCount, onTabChange }: TabNavProps): ReactElement {
  const counts: Record<ActivityTab, number> = { epigram: epigramCount, comment: commentCount };

  return (
    <div className="mb-6 flex gap-6">
      {TAB_DEFINITIONS.map(({ tab, label }) => {
        const count = counts[tab];
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
            className={cn(
              "text-2xl font-semibold transition-colors",
              activeTab === tab ? "text-black-600" : "text-gray-300 hover:text-[#888]"
            )}
          >
            {label}({count})
          </button>
        );
      })}
    </div>
  );
}

// ─── MypageActivity ───────────────────────────────────────────────────────────

export function MypageActivity({ userId }: MypageActivityProps): ReactElement {
  const [activeTab, setActiveTab] = useState<ActivityTab>("epigram");

  const { data: monthlyLogs = [] } = useMonthlyEmotions({
    userId,
    year: NOW.getFullYear(),
    month: NOW.getMonth() + 1,
  });

  const { data: epigramData } = useEpigrams({ limit: PAGE_SIZE, writerId: userId });
  const { data: commentData } = useMyComments({ userId, limit: PAGE_SIZE });

  const epigramCount = epigramData?.pages[0]?.totalCount ?? 0;
  const commentCount = commentData?.pages[0]?.totalCount ?? 0;

  return (
    <div className="flex flex-col gap-10">
      <ErrorBoundary fallback={(_, reset) => <SectionErrorFallback reset={reset} />}>
        <EmotionCalendar userId={userId} />
      </ErrorBoundary>

      <ErrorBoundary fallback={(_, reset) => <SectionErrorFallback reset={reset} />}>
        <EmotionPieChart emotionLogs={monthlyLogs} />
      </ErrorBoundary>

      <section>
        <TabNav
          activeTab={activeTab}
          epigramCount={epigramCount}
          commentCount={commentCount}
          onTabChange={setActiveTab}
        />
        {activeTab === "epigram" ? (
          <MyEpigramList userId={userId} />
        ) : (
          <MyCommentList userId={userId} />
        )}
      </section>
    </div>
  );
}
