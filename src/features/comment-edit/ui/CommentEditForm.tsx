"use client";

import type { ReactElement, KeyboardEvent } from "react";

import { Lock, Unlock } from "lucide-react";

import { Button } from "@/shared/ui/Button";

import { useCommentEdit } from "../model/useCommentEdit";

interface CommentEditFormProps {
  commentId: number;
  epigramId: number;
  initialContent: string;
  initialIsPrivate: boolean;
  onCancel: () => void;
}

export function CommentEditForm({
  commentId,
  epigramId,
  initialContent,
  initialIsPrivate,
  onCancel,
}: CommentEditFormProps): ReactElement {
  const {
    content,
    isPrivate,
    isSubmitting,
    hasError,
    canSubmit,
    handleContentChange,
    handlePrivateToggle,
    handleSubmit,
    handleCancel,
  } = useCommentEdit({ commentId, epigramId, initialContent, initialIsPrivate, onCancel });

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>): void {
    if (e.key === "Escape") handleCancel();
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSubmit();
  }

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-blue-400 bg-white p-3 shadow-sm">
      <textarea
        value={content}
        onChange={(e) => handleContentChange(e.target.value)}
        onKeyDown={handleKeyDown}
        maxLength={100}
        rows={2}
        autoFocus
        className="w-full resize-none text-sm text-black-700 outline-none"
      />

      {hasError && <p className="text-xs text-error">수정에 실패했습니다. 다시 시도해주세요.</p>}

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

        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleCancel} className="h-7 px-3 text-xs">
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            isLoading={isSubmitting}
            disabled={!canSubmit}
            className="h-7 px-3 text-xs"
          >
            저장
          </Button>
        </div>
      </div>
    </div>
  );
}
