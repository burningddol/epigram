"use client";

import { useEffect, useState, type ReactElement } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useQuery } from "@tanstack/react-query";
import { ExternalLink, MoreVertical, Share2 } from "lucide-react";

import { useEpigramDetail } from "@/entities/epigram";
import { getMe } from "@/entities/user";
import { useEpigramDelete } from "@/features/epigram-delete";
import { LikeButton } from "@/features/epigram-like";
import { copyToClipboard } from "@/shared/lib/clipboard";
import { CommentSection } from "@/widgets/comment-section";

interface EpigramDetailPageProps {
  epigramId: number;
}

interface ActionMenuProps {
  epigramId: number;
  onDelete: () => void;
}

function ActionMenu({ epigramId, onDelete }: ActionMenuProps): ReactElement {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  function handleEdit(): void {
    router.push(`/epigrams/${epigramId}/edit`);
  }

  function handleDelete(): void {
    setIsOpen(false);
    onDelete();
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="더보기 메뉴"
        className="rounded-full p-1.5 text-black-400 transition-colors hover:bg-blue-50 hover:text-black-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
      >
        <MoreVertical size={20} />
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-8 z-20 min-w-[100px] rounded-xl border border-line-200 bg-white py-1 shadow-lg">
            <button
              type="button"
              onClick={handleEdit}
              className="w-full px-4 py-2 text-left text-sm text-black-700 hover:bg-blue-50"
            >
              수정
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50"
            >
              삭제
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function SkeletonLoader(): ReactElement {
  return (
    <div className="mx-auto w-full max-w-2xl animate-pulse px-4 py-10 tablet:max-w-3xl tablet:px-6 pc:max-w-screen-xl pc:px-16 pc:py-16">
      <div className="mb-6 h-8 w-32 rounded-lg bg-blue-200" />
      <div className="mb-4 h-32 rounded-2xl bg-blue-100" />
      <div className="mb-8 flex gap-2">
        <div className="h-6 w-16 rounded-full bg-blue-200" />
        <div className="h-6 w-16 rounded-full bg-blue-200" />
      </div>
      <div className="h-64 rounded-2xl bg-blue-100" />
    </div>
  );
}

export function EpigramDetailPage({ epigramId }: EpigramDetailPageProps): ReactElement {
  const [isCopied, setIsCopied] = useState(false);

  const { data: epigram, isLoading: isEpigramLoading } = useEpigramDetail(epigramId);
  const { data: me, isLoading: isMeLoading } = useQuery({ queryKey: ["me"], queryFn: getMe });
  const { handleDeleteClick } = useEpigramDelete(epigramId);

  const isLoading = isEpigramLoading || isMeLoading;
  const isOwner =
    !isLoading && epigram !== undefined && me !== undefined && epigram.writerId === me.id;

  useEffect(() => {
    if (!isCopied) return;
    const timer = setTimeout(() => setIsCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [isCopied]);

  async function handleShare(): Promise<void> {
    await copyToClipboard(window.location.href);
    setIsCopied(true);
  }

  if (isLoading || !epigram) {
    return <SkeletonLoader />;
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 tablet:max-w-3xl tablet:px-6 pc:max-w-screen-xl pc:px-16 pc:py-16">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-black-950 tablet:text-3xl pc:text-4xl">에피그램</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={handleShare}
              aria-label="공유"
              className="rounded-full p-1.5 text-black-400 transition-colors hover:bg-blue-50 hover:text-black-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <Share2 size={20} />
            </button>
            {isCopied && (
              <div className="absolute right-0 top-9 z-10 whitespace-nowrap rounded-lg bg-black-950 px-3 py-1.5 text-xs text-white shadow-md">
                링크가 복사되었습니다
              </div>
            )}
          </div>
          {isOwner && <ActionMenu epigramId={epigramId} onDelete={handleDeleteClick} />}
        </div>
      </div>

      <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-blue-200 tablet:p-8 pc:p-10">
        <blockquote className="mb-6 text-lg leading-relaxed text-black-800 tablet:text-xl pc:text-2xl">
          {epigram.content}
        </blockquote>

        <p className="mb-4 text-right text-sm font-medium text-black-500">— {epigram.author}</p>

        {epigram.referenceTitle && (
          <div className="mb-4 flex items-center justify-end gap-1.5">
            {epigram.referenceUrl ? (
              <a
                href={epigram.referenceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-blue-500 underline underline-offset-2 hover:text-blue-700"
              >
                {epigram.referenceTitle}
                <ExternalLink size={12} />
              </a>
            ) : (
              <span className="text-xs text-black-400">{epigram.referenceTitle}</span>
            )}
          </div>
        )}

        {epigram.tags.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {epigram.tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/search?keyword=${encodeURIComponent(tag.name)}`}
                className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100 hover:text-blue-800"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}

        <div className="flex justify-center">
          <LikeButton
            epigramId={epigramId}
            likeCount={epigram.likeCount}
            isLiked={epigram.isLiked}
          />
        </div>
      </div>

      <CommentSection epigramId={epigramId} />
    </div>
  );
}
