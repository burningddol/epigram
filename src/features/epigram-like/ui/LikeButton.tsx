"use client";

import type { ReactElement } from "react";

import { Heart } from "lucide-react";

import { cn } from "@/shared/lib/cn";

import { useEpigramLike } from "../model/useEpigramLike";

interface LikeButtonProps {
  epigramId: number;
  likeCount: number;
  isLiked: boolean;
}

export function LikeButton({ epigramId, likeCount, isLiked }: LikeButtonProps): ReactElement {
  const { toggle, isPending } = useEpigramLike(epigramId);

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      aria-label={isLiked ? "좋아요 취소" : "좋아요"}
      className={cn(
        "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold",
        "transition-all duration-200 active:scale-95",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        isLiked
          ? "bg-black-500 text-white hover:bg-black-600"
          : "border border-blue-300 text-blue-600 hover:border-blue-500 hover:text-blue-700",
        isPending ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
      )}
    >
      <Heart
        size={16}
        strokeWidth={2}
        className={cn("transition-all duration-200", isLiked ? "fill-white" : "fill-none")}
      />
      <span>{likeCount}</span>
    </button>
  );
}
