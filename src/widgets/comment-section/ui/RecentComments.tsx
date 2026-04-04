"use client";

import type { ReactElement } from "react";

import { ChevronDown } from "lucide-react";

import { UserProfileModal, WriterAvatar, useRecentComments } from "@/entities/comment";
import { useIntersectionObserver } from "@/shared/hooks/useIntersectionObserver";
import { useModal } from "@/shared/hooks/useModal";
import { formatRelativeTime } from "@/shared/lib/date";

import type { Comment } from "@/entities/comment";

const COMMENTS_PAGE_SIZE = 4;
const SKELETON_ITEMS = Array.from({ length: COMMENTS_PAGE_SIZE });

interface CommentItemProps {
  comment: Comment;
}

function CommentItem({ comment }: CommentItemProps): ReactElement {
  const { open } = useModal();

  function handleProfileClick(): void {
    open((onClose) => <UserProfileModal writer={comment.writer} onClose={onClose} />);
  }

  return (
    <li className="group flex gap-3 rounded-2xl border border-line-200 bg-white px-5 py-4 shadow-sm transition-all duration-200 hover:border-blue-200 hover:shadow-md">
      <button
        type="button"
        onClick={handleProfileClick}
        className="flex-shrink-0 rounded-full transition-transform duration-150 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
        aria-label={`${comment.writer.nickname} 프로필 보기`}
      >
        <WriterAvatar writer={comment.writer} />
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="truncate text-sm font-semibold text-black-700">
            {comment.writer.nickname}
          </span>
          <span className="flex-shrink-0 text-xs text-black-300">
            {formatRelativeTime(comment.createdAt)}
          </span>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-black-500">{comment.content}</p>
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

export function RecentComments(): ReactElement {
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useRecentComments({
    limit: COMMENTS_PAGE_SIZE,
  });

  const sentinelRef = useIntersectionObserver(
    () => {
      if (hasNextPage && !isFetchingNextPage) fetchNextPage();
    },
    { rootMargin: "200px" }
  );

  const comments = data?.pages.flatMap((page) => page.list) ?? [];

  return (
    <section aria-label="최신 댓글">
      <h2 className="mb-4 text-xl font-bold text-black-900">최신 댓글</h2>
      {isLoading && (
        <ul className="flex flex-col gap-3">
          {SKELETON_ITEMS.map((_, i) => (
            <li key={i} className="h-20 animate-pulse rounded-2xl bg-blue-200" />
          ))}
        </ul>
      )}
      {!isLoading && comments.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-line-200 py-12 text-black-300">
          <p className="text-sm">등록된 댓글이 없습니다.</p>
        </div>
      )}
      {!isLoading && comments.length > 0 && (
        <>
          <ul className="flex flex-col gap-3">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </ul>
          {hasNextPage && (
            <LoadMoreButton isFetchingNextPage={isFetchingNextPage} onClick={fetchNextPage} />
          )}
        </>
      )}
      <div ref={sentinelRef} className="h-1" />
    </section>
  );
}
