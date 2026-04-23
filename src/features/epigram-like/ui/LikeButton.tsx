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

const BASE_CLASS = cn(
  "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold",
  "transition-all duration-200 active:scale-95",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
);

const LIKED_CLASS = "bg-black-500 text-white hover:bg-black-600";
const UNLIKED_CLASS =
  "border border-blue-300 text-blue-600 hover:border-blue-500 hover:text-blue-700";

export function LikeButton({ epigramId, likeCount, isLiked }: LikeButtonProps): ReactElement {
  const { toggle, isPending } = useEpigramLike(epigramId);

  const label = isLiked ? "좋아요 취소" : "좋아요";
  const stateClass = isLiked ? LIKED_CLASS : UNLIKED_CLASS;
  const pendingClass = isPending ? "opacity-60 cursor-not-allowed" : "cursor-pointer";
  const heartFillClass = isLiked ? "fill-white" : "fill-none";

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      aria-label={label}
      className={cn(BASE_CLASS, stateClass, pendingClass)}
    >
      <Heart
        size={16}
        strokeWidth={2}
        className={cn("transition-all duration-200", heartFillClass)}
      />
      <span>{likeCount}</span>
    </button>
  );
}
