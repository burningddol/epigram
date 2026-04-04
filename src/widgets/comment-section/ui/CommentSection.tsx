"use client";

import { useState } from "react";
import type { ReactElement } from "react";

import { useQuery } from "@tanstack/react-query";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

import { WriterAvatar, useEpigramComments } from "@/entities/comment";
import { getMe } from "@/entities/user";
import { CommentForm } from "@/features/comment-create";
import { useCommentDelete } from "@/features/comment-delete";
import { CommentEditForm } from "@/features/comment-edit";
import { useIntersectionObserver } from "@/shared/hooks/useIntersectionObserver";
import { formatRelativeTime } from "@/shared/lib/date";

import type { Comment } from "@/entities/comment";

const COMMENTS_PAGE_SIZE = 5;
const SKELETON_COUNT = 3;

interface CommentSectionProps {
  epigramId: number;
}

interface CommentItemProps {
  comment: Comment;
  epigramId: number;
  currentUserId: number | undefined;
}

function CommentItem({ comment, epigramId, currentUserId }: CommentItemProps): ReactElement {
  const [isEditing, setIsEditing] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { handleDeleteClick } = useCommentDelete(comment.id, epigramId);

  const isOwnComment = currentUserId !== undefined && comment.writer.id === currentUserId;

  if (isEditing) {
    return (
      <li>
        <CommentEditForm
          commentId={comment.id}
          epigramId={epigramId}
          initialContent={comment.content}
          initialIsPrivate={comment.isPrivate}
          onCancel={() => setIsEditing(false)}
        />
      </li>
    );
  }

  return (
    <li className="flex gap-3 rounded-2xl border border-line-200 bg-white px-5 py-4 shadow-sm transition-all duration-200 hover:border-blue-200 hover:shadow-md">
      <div className="flex-shrink-0">
        <WriterAvatar writer={comment.writer} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="truncate text-sm font-semibold text-black-700">
              {comment.writer.nickname}
            </span>
            <span className="flex-shrink-0 text-xs text-black-300">
              {formatRelativeTime(comment.createdAt)}
            </span>
          </div>

          {isOwnComment && (
            <div className="relative flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                onBlur={() => setTimeout(() => setIsMenuOpen(false), 150)}
                className="rounded-full p-1 text-black-300 transition-colors hover:bg-blue-100 hover:text-black-700"
                aria-label="댓글 옵션"
              >
                <MoreVertical size={14} />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 top-7 z-10 flex flex-col rounded-xl border border-line-200 bg-white py-1 shadow-lg">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsEditing(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-black-500 transition-colors hover:bg-blue-50 hover:text-black-900"
                  >
                    <Pencil size={12} />
                    수정
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleDeleteClick();
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-error transition-colors hover:bg-red-50"
                  >
                    <Trash2 size={12} />
                    삭제
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <p className="mt-1 text-sm leading-relaxed text-black-500">{comment.content}</p>
      </div>
    </li>
  );
}

function CommentSkeleton(): ReactElement {
  return (
    <li className="flex gap-3 rounded-2xl border border-line-200 bg-white px-5 py-4">
      <div className="h-9 w-9 flex-shrink-0 animate-pulse rounded-full bg-blue-200" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-24 animate-pulse rounded bg-blue-200" />
        <div className="h-3 w-full animate-pulse rounded bg-blue-100" />
      </div>
    </li>
  );
}

export function CommentSection({ epigramId }: CommentSectionProps): ReactElement {
  const { data: me } = useQuery({ queryKey: ["me"], queryFn: getMe });
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useEpigramComments({
    epigramId,
    limit: COMMENTS_PAGE_SIZE,
  });

  const sentinelRef = useIntersectionObserver(
    () => {
      if (hasNextPage && !isFetchingNextPage) fetchNextPage();
    },
    { rootMargin: "200px" }
  );

  const comments = data?.pages.flatMap((page) => page.list) ?? [];
  const totalCount = data?.pages[0]?.totalCount;

  return (
    <section aria-label="댓글">
      <h2 className="mb-4 text-xl font-bold text-black-900">
        댓글{totalCount !== undefined && <span className="ml-1 text-blue-400">{totalCount}</span>}
      </h2>

      <div className="mb-6">
        <CommentForm epigramId={epigramId} userImage={me?.image ?? null} />
      </div>

      {isLoading && (
        <ul className="flex flex-col gap-3">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <CommentSkeleton key={i} />
          ))}
        </ul>
      )}

      {!isLoading && comments.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-line-200 py-12 text-black-300">
          <p className="text-sm">첫 번째 댓글을 남겨보세요.</p>
        </div>
      )}

      {!isLoading && comments.length > 0 && (
        <ul className="flex flex-col gap-3">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              epigramId={epigramId}
              currentUserId={me?.id}
            />
          ))}
        </ul>
      )}

      <div ref={sentinelRef} className="h-1" />

      {isFetchingNextPage && (
        <div className="mt-3 flex justify-center">
          <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
        </div>
      )}
    </section>
  );
}
