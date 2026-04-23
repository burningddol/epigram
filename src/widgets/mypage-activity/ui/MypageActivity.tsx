"use client";

import { useEffect, useState, type ReactElement } from "react";

import Image from "next/image";
import Link from "next/link";

import { Plus } from "lucide-react";

import { useMyComments } from "@/entities/comment";
import { useMonthlyEmotions } from "@/entities/emotion-log";
import { EpigramListCard, useEpigrams } from "@/entities/epigram";
import { useCommentDelete } from "@/features/comment-delete";
import { formatRelativeTime } from "@/shared/lib/date";
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import { SectionErrorFallback } from "@/shared/ui/SectionErrorFallback";

import { EmotionCalendar } from "./EmotionCalendar";
import { EmotionPieChart } from "./EmotionPieChart";

import type { Comment } from "@/entities/comment";

const PAGE_SIZE = 3;
const NOW = new Date();

type ActiveTab = "epigrams" | "comments";

interface MypageActivityProps {
  userId: number;
}

interface LoadMoreButtonProps {
  isFetchingNextPage: boolean;
  label: string;
  onLoadMore: () => void;
}

function LoadMoreButton({
  isFetchingNextPage,
  label,
  onLoadMore,
}: LoadMoreButtonProps): ReactElement {
  return (
    <div className="flex justify-center">
      <button
        type="button"
        onClick={onLoadMore}
        disabled={isFetchingNextPage}
        className="flex items-center gap-2 rounded-full border border-line-200 bg-background px-10 py-3.5 text-base font-medium text-blue-500 transition hover:bg-blue-200 disabled:opacity-60"
      >
        <Plus className="h-5 w-5" aria-hidden="true" />
        {isFetchingNextPage ? "불러오는 중..." : label}
      </button>
    </div>
  );
}

const DEFAULT_AVATAR = "/icon/035-smiling face.png";

interface MyCommentItemProps {
  comment: Comment;
  epigramId: number;
  userId: number;
}

function MyCommentItem({ comment, epigramId, userId }: MyCommentItemProps): ReactElement {
  const { handleDeleteClick, isDeleting } = useCommentDelete(comment.id, epigramId, userId);

  return (
    <li className="flex flex-col gap-2.5 border-t border-line-200 bg-background px-6 py-8 first:border-t-0">
      <div className="flex items-start gap-4">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-blue-200">
          <Image
            src={comment.writer.image ?? DEFAULT_AVATAR}
            alt={comment.writer.nickname}
            fill
            className="object-cover"
          />
        </div>

        <div className="min-w-0 flex flex-1 flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-black-300">{comment.writer.nickname}</span>
              <span className="text-sm text-black-300">
                {formatRelativeTime(comment.createdAt)}
              </span>
            </div>
            <div className="flex items-center gap-4">
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

          <Link href={`/epigrams/${epigramId}`}>
            <p className="break-all text-base leading-relaxed text-black-700 tablet:text-lg pc:text-xl">
              {comment.content}
            </p>
          </Link>
        </div>
      </div>
    </li>
  );
}

interface MyEpigramListProps {
  userId: number;
  onTotalCount: (count: number) => void;
}

function MyEpigramList({ userId, onTotalCount }: MyEpigramListProps): ReactElement {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useEpigrams({
    limit: PAGE_SIZE,
    writerId: userId,
  });

  const epigrams = data?.pages.flatMap((page) => page.list) ?? [];
  const totalCount = data?.pages[0]?.totalCount ?? 0;

  useEffect(() => {
    onTotalCount(totalCount);
  }, [totalCount, onTotalCount]);

  if (epigrams.length === 0) {
    return <p className="py-10 text-center text-sm text-gray-300">작성한 에피그램이 없어요.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-6">
        {epigrams.map((epigram) => (
          <EpigramListCard key={epigram.id} epigram={epigram} />
        ))}
      </div>

      {hasNextPage && (
        <LoadMoreButton
          isFetchingNextPage={isFetchingNextPage}
          label="에피그램 더보기"
          onLoadMore={() => void fetchNextPage()}
        />
      )}
    </div>
  );
}

interface MyCommentListProps {
  userId: number;
  onTotalCount: (count: number) => void;
}

function MyCommentList({ userId, onTotalCount }: MyCommentListProps): ReactElement {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useMyComments({
    userId,
    limit: PAGE_SIZE,
  });

  const comments = data?.pages.flatMap((page) => page.list) ?? [];
  const totalCount = data?.pages[0]?.totalCount ?? 0;

  useEffect(() => {
    onTotalCount(totalCount);
  }, [totalCount, onTotalCount]);

  if (comments.length === 0) {
    return <p className="py-10 text-center text-sm text-gray-300">작성한 댓글이 없어요.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <ul className="flex flex-col gap-6">
        {comments.map((comment) => (
          <MyCommentItem
            key={comment.id}
            comment={comment}
            epigramId={comment.epigramId}
            userId={userId}
          />
        ))}
      </ul>

      {hasNextPage && (
        <LoadMoreButton
          isFetchingNextPage={isFetchingNextPage}
          label="댓글 더보기"
          onLoadMore={() => void fetchNextPage()}
        />
      )}
    </div>
  );
}

interface TabbedSectionProps {
  userId: number;
}

function TabbedSection({ userId }: TabbedSectionProps): ReactElement {
  const [activeTab, setActiveTab] = useState<ActiveTab>("epigrams");
  const [epigramCount, setEpigramCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);

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

      {/* Tab content — both lists stay mounted so counts stay accurate after tab switch */}
      <div className={activeTab !== "epigrams" ? "hidden" : ""}>
        <MyEpigramList userId={userId} onTotalCount={setEpigramCount} />
      </div>
      <div className={activeTab !== "comments" ? "hidden" : ""}>
        <MyCommentList userId={userId} onTotalCount={setCommentCount} />
      </div>
    </div>
  );
}

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

      <div className="py-6">
        <TabbedSection userId={userId} />
      </div>
    </div>
  );
}
