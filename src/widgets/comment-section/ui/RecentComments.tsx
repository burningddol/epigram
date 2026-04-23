"use client";

import type { ReactElement } from "react";

import { ChevronDown } from "lucide-react";

import { UserProfileModal, WriterAvatar, useRecentComments } from "@/entities/comment";
import { useIntersectionObserver } from "@/shared/hooks/useIntersectionObserver";
import { useModal } from "@/shared/hooks/useModal";
import { formatRelativeTime } from "@/shared/lib/date";

import type { Comment } from "@/entities/comment";

export const COMMENTS_PAGE_SIZE = 4;

interface CommentItemProps {
  comment: Comment;
}

function CommentItem({ comment }: CommentItemProps): ReactElement {
  const { open } = useModal();

  function handleProfileClick(): void {
    open((onClose) => <UserProfileModal writer={comment.writer} onClose={onClose} />);
  }

  return (
    <li className="flex flex-col gap-2.5 border-t border-line-200 bg-background px-6 py-8 first:border-t-0">
      <div className="flex items-start gap-4">
        <button
          type="button"
          onClick={handleProfileClick}
          className="shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
          aria-label={`${comment.writer.nickname} 프로필 보기`}
        >
          <WriterAvatar writer={comment.writer} size={48} />
        </button>

        <div className="min-w-0 flex flex-1 flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-black-300">{comment.writer.nickname}</span>
            <span className="text-sm text-black-300">{formatRelativeTime(comment.createdAt)}</span>
          </div>
          <p className="break-all text-base leading-relaxed text-black-700 tablet:text-lg pc:text-xl">
            {comment.content}
          </p>
        </div>
      </div>
    </li>
  );
}

interface LoadMoreButtonProps {
  isFetchingNextPage: boolean;
  onClick: () => void;
}

function LoadMoreButton({ isFetchingNextPage, onClick }: LoadMoreButtonProps): ReactElement {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isFetchingNextPage}
      className="group mx-auto mt-4 flex items-center gap-2 rounded-full border border-line-200 bg-white px-6 py-2.5 text-sm font-medium text-black-400 shadow-sm transition-all duration-200 hover:border-blue-400 hover:text-blue-700 hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isFetchingNextPage ? (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <ChevronDown
          className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5"
          aria-hidden="true"
        />
      )}
      {isFetchingNextPage ? "불러오는 중..." : "최신 댓글 더보기"}
    </button>
  );
}

function RecentCommentSkeleton(): ReactElement {
  return (
    <li className="border-t border-line-200 px-6 py-8 first:border-t-0">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 animate-pulse rounded-full bg-blue-200" />
        <div className="min-w-0 flex flex-1 flex-col gap-3">
          <div className="h-3 w-24 animate-pulse rounded bg-blue-200" />
          <div className="h-4 w-full animate-pulse rounded bg-blue-100" />
        </div>
      </div>
    </li>
  );
}

export function RecentComments(): ReactElement {
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useRecentComments({
    limit: COMMENTS_PAGE_SIZE,
  });

  function handleSentinelIntersect(): void {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }

  function handleLoadMoreClick(): void {
    fetchNextPage();
  }

  const sentinelRef = useIntersectionObserver(handleSentinelIntersect, { rootMargin: "200px" });

  const comments = data?.pages.flatMap((page) => page.list) ?? [];
  const hasComments = comments.length > 0;

  return (
    <section aria-label="최신 댓글">
      <h2 className="mb-4 text-xl font-bold text-black-900">최신 댓글</h2>
      {isLoading && (
        <ul className="flex flex-col">
          {Array.from({ length: COMMENTS_PAGE_SIZE }).map((_, i) => (
            <RecentCommentSkeleton key={`recent-comment-skeleton-${i}`} />
          ))}
        </ul>
      )}
      {!isLoading && !hasComments && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-line-200 py-12 text-black-300">
          <p className="text-sm">등록된 댓글이 없습니다.</p>
        </div>
      )}
      {!isLoading && hasComments && (
        <>
          <ul className="flex flex-col">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </ul>
          {hasNextPage && (
            <LoadMoreButton isFetchingNextPage={isFetchingNextPage} onClick={handleLoadMoreClick} />
          )}
        </>
      )}
      <div ref={sentinelRef} className="h-1" />
    </section>
  );
}
