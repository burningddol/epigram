"use client";

import { useCallback, useEffect, useState, type ReactElement } from "react";

import Link from "next/link";

import { Plus } from "lucide-react";

import Image from "next/image";

import { useMyComments } from "@/entities/comment";
import { useMonthlyEmotions } from "@/entities/emotion-log";
import { useEpigrams } from "@/entities/epigram";

import { useCommentDelete } from "@/features/comment-delete";

import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import { SectionErrorFallback } from "@/shared/ui/SectionErrorFallback";
import { formatRelativeTime } from "@/shared/lib/date";

import { EmotionCalendar } from "./EmotionCalendar";
import { EmotionPieChart } from "./EmotionPieChart";

import type { Comment } from "@/entities/comment";
import type { Epigram } from "@/entities/epigram";

const PAGE_SIZE = 3;
const NOW = new Date();

type ActiveTab = "epigrams" | "comments";

interface MypageActivityProps {
  userId: number;
}

// ─── Epigram Card ─────────────────────────────────────────────────────────────

interface MyEpigramItemProps {
  epigram: Epigram;
}

function MyEpigramItem({ epigram }: MyEpigramItemProps): ReactElement {
  return (
    <li className="flex flex-col items-end gap-2">
      <Link
        href={`/epigrams/${epigram.id}`}
        className="group relative w-full overflow-hidden rounded-2xl border border-line-100 bg-white p-6 transition-shadow duration-200 hover:shadow-md"
        style={{ boxShadow: "0px 3px 12px 0 rgba(0,0,0,0.04)" }}
      >
        {/* Decorative ruled lines */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(180deg, transparent 0px, transparent 24px, #f2f2f2 24px, #f2f2f2 25px)",
            backgroundPositionY: "1px",
          }}
        />

        {/* Content */}
        <div className="font-serif relative flex flex-col gap-5">
          <p className=" text-base font-medium leading-relaxed text-black-600 tablet:text-lg pc:text-xl">
            {epigram.content}
          </p>
          <p className="text-right text-base font-medium text-blue-400 tablet:text-lg pc:text-xl">
            - {epigram.author} -
          </p>
        </div>
      </Link>

      {/* Tags */}
      {epigram.tags.length > 0 && (
        <div className="flex flex-wrap justify-end gap-3">
          {epigram.tags.map((tag) => (
            <span
              key={tag.id}
              className="font-serif text-sm font-medium text-blue-400 tablet:text-base pc:text-lg"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      )}
    </li>
  );
}

// ─── Comment Card ─────────────────────────────────────────────────────────────

const DEFAULT_AVATAR = "/icon/035-smiling face.png";

interface MyCommentItemProps {
  comment: Comment;
  epigramId: number;
}

function MyCommentItem({ comment, epigramId }: MyCommentItemProps): ReactElement {
  const { handleDeleteClick, isDeleting } = useCommentDelete(comment.id, epigramId);

  return (
    <li className="flex flex-col gap-2.5 border-t border-line-200 bg-background px-6 py-8 first:border-t-0">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-blue-200">
          <Image
            src={comment.writer.image ?? DEFAULT_AVATAR}
            alt={comment.writer.nickname}
            fill
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-3">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-black-300">{comment.writer.nickname}</span>
              <span className="text-sm text-black-300">
                {formatRelativeTime(comment.createdAt)}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href={`/epigrams/${epigramId}/edit?commentId=${comment.id}`}
                className="text-sm text-black-600 transition hover:text-black-800"
              >
                수정
              </Link>
              <button
                type="button"
                onClick={handleDeleteClick}
                disabled={isDeleting}
                className="text-sm text-error transition hover:opacity-70 disabled:opacity-40"
              >
                삭제
              </button>
            </div>
          </div>

          {/* Comment text */}
          <Link href={`/epigrams/${epigramId}`}>
            <p className="text-base leading-relaxed text-black-700 tablet:text-lg pc:text-xl">
              {comment.content}
            </p>
          </Link>
        </div>
      </div>
    </li>
  );
}

// ─── Epigram List ─────────────────────────────────────────────────────────────

interface MyEpigramListProps {
  userId: number;
  totalCountRef: (count: number) => void;
}

function MyEpigramList({ userId, totalCountRef }: MyEpigramListProps): ReactElement {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useEpigrams({
    limit: PAGE_SIZE,
    writerId: userId,
  });

  const epigrams = data?.pages.flatMap((page) => page.list) ?? [];
  const totalCount = data?.pages[0]?.totalCount ?? 0;

  useEffect(() => {
    totalCountRef(totalCount);
  }, [totalCount, totalCountRef]);

  if (epigrams.length === 0) {
    return <p className="py-10 text-center text-sm text-gray-300">작성한 에피그램이 없어요.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <ul className="flex flex-col gap-6">
        {epigrams.map((epigram) => (
          <MyEpigramItem key={epigram.id} epigram={epigram} />
        ))}
      </ul>

      {hasNextPage && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => void fetchNextPage()}
            disabled={isFetchingNextPage}
            className="flex items-center gap-2 rounded-full border border-line-200 bg-background px-10 py-3.5 text-base font-medium text-blue-500 transition hover:bg-blue-200 disabled:opacity-60"
          >
            <Plus className="h-5 w-5" aria-hidden="true" />
            {isFetchingNextPage ? "불러오는 중..." : "에피그램 더보기"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Comment List ─────────────────────────────────────────────────────────────

interface MyCommentListProps {
  userId: number;
  totalCountRef: (count: number) => void;
}

function MyCommentList({ userId, totalCountRef }: MyCommentListProps): ReactElement {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useMyComments({
    userId,
    limit: PAGE_SIZE,
  });

  const comments = data?.pages.flatMap((page) => page.list) ?? [];
  const totalCount = data?.pages[0]?.totalCount ?? 0;

  useEffect(() => {
    totalCountRef(totalCount);
  }, [totalCount, totalCountRef]);

  if (comments.length === 0) {
    return <p className="py-10 text-center text-sm text-gray-300">작성한 댓글이 없어요.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <ul className="flex flex-col gap-6">
        {comments.map((comment) => (
          <MyCommentItem key={comment.id} comment={comment} epigramId={comment.epigramId} />
        ))}
      </ul>

      {hasNextPage && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => void fetchNextPage()}
            disabled={isFetchingNextPage}
            className="flex items-center gap-2 rounded-full border border-line-200 bg-background px-10 py-3.5 text-base font-medium text-blue-500 transition hover:bg-blue-200 disabled:opacity-60"
          >
            <Plus className="h-5 w-5" aria-hidden="true" />
            {isFetchingNextPage ? "불러오는 중..." : "댓글 더보기"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Tabbed Section ───────────────────────────────────────────────────────────

interface TabbedSectionProps {
  userId: number;
}

function TabbedSection({ userId }: TabbedSectionProps): ReactElement {
  const [activeTab, setActiveTab] = useState<ActiveTab>("epigrams");
  const [epigramCount, setEpigramCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);

  const handleEpigramCount = useCallback((count: number) => setEpigramCount(count), []);
  const handleCommentCount = useCallback((count: number) => setCommentCount(count), []);

  return (
    <div className="flex flex-col gap-8">
      {/* Tab header */}
      <div className="flex items-center gap-6">
        <button
          type="button"
          onClick={() => setActiveTab("epigrams")}
          className={[
            "text-lg font-semibold transition-colors tablet:text-xl pc:text-2xl",
            activeTab === "epigrams" ? "text-black-600" : "text-gray-300",
          ].join(" ")}
        >
          내 에피그램({epigramCount})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("comments")}
          className={[
            "text-lg font-semibold transition-colors tablet:text-xl pc:text-2xl",
            activeTab === "comments" ? "text-black-600" : "text-gray-300",
          ].join(" ")}
        >
          내 댓글({commentCount})
        </button>
      </div>

      {/* Tab content */}
      {activeTab === "epigrams" ? (
        <MyEpigramList userId={userId} totalCountRef={handleEpigramCount} />
      ) : (
        <MyCommentList userId={userId} totalCountRef={handleCommentCount} />
      )}
    </div>
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

      <div className=" --color-background  py-6  ">
        <TabbedSection userId={userId} />
      </div>
    </div>
  );
}
