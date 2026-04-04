"use client";

import type { ReactElement, KeyboardEvent } from "react";

import { Lock, Unlock } from "lucide-react";

import { Button } from "@/shared/ui/Button";

import { useCommentCreate } from "../model/useCommentCreate";

interface CommentFormProps {
  epigramId: number;
  userImage?: string | null;
}

export function CommentForm({ epigramId, userImage }: CommentFormProps): ReactElement {
  const {
    content,
    isPrivate,
    isSubmitting,
    handleContentChange,
    handlePrivateToggle,
    handleSubmit,
  } = useCommentCreate(epigramId);

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>): void {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSubmit();
    }
  }

  return (
    <div className="flex gap-3">
      <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-blue-200">
        {userImage ? (
          <img src={userImage} alt="내 프로필" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-blue-400">
            ?
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 rounded-2xl border border-blue-200 bg-white p-3 transition-shadow focus-within:shadow-sm focus-within:border-blue-400">
        <textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="100자 이내로 입력해주세요."
          maxLength={100}
          rows={2}
          className="w-full resize-none text-sm text-black-700 outline-none placeholder:text-blue-300"
        />

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrivateToggle}
            className="flex items-center gap-1 text-xs text-blue-400 transition-colors hover:text-blue-700"
            aria-label={isPrivate ? "비공개 (공개로 전환)" : "공개 (비공개로 전환)"}
          >
            {isPrivate ? <Lock size={12} /> : <Unlock size={12} />}
            <span>{isPrivate ? "비공개" : "공개"}</span>
          </button>

          <Button
            onClick={handleSubmit}
            isLoading={isSubmitting}
            disabled={!content.trim()}
            className="h-7 px-3 text-xs"
          >
            저장
          </Button>
        </div>
      </div>
    </div>
  );
}
