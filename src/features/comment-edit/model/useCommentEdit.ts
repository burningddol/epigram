"use client";

import { useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/shared/api/client";

import type { Comment } from "@/entities/comment";

interface UpdateCommentBody {
  isPrivate?: boolean;
  content?: string;
}

interface UseCommentEditParams {
  commentId: number;
  epigramId: number;
  initialContent: string;
  initialIsPrivate: boolean;
  onCancel: () => void;
}

interface UseCommentEditReturn {
  content: string;
  isPrivate: boolean;
  isSubmitting: boolean;
  hasError: boolean;
  canSubmit: boolean;
  handleContentChange: (value: string) => void;
  handlePrivateToggle: () => void;
  handleSubmit: () => void;
  handleCancel: () => void;
}

export function useCommentEdit({
  commentId,
  epigramId,
  initialContent,
  initialIsPrivate,
  onCancel,
}: UseCommentEditParams): UseCommentEditReturn {
  const queryClient = useQueryClient();
  const [content, setContent] = useState(initialContent);
  const [isPrivate, setIsPrivate] = useState(initialIsPrivate);
  const [hasSubmitError, setHasSubmitError] = useState(false);

  const { mutate, isPending: isSubmitting } = useMutation({
    mutationFn: (body: UpdateCommentBody) =>
      apiClient.patch<Comment>(`/api/comments/${commentId}`, body).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["epigrams", epigramId, "comments"] });
      setHasSubmitError(false);
      onCancel();
    },
    onError: () => {
      setHasSubmitError(true);
    },
  });

  const canSubmit = content.trim().length > 0;

  function handleContentChange(value: string): void {
    setContent(value);
    if (hasSubmitError) setHasSubmitError(false);
  }

  function handlePrivateToggle(): void {
    setIsPrivate((prev) => !prev);
  }

  function handleSubmit(): void {
    const trimmed = content.trim();
    if (!trimmed) return;
    mutate({ content: trimmed, isPrivate });
  }

  function handleCancel(): void {
    setContent(initialContent);
    setIsPrivate(initialIsPrivate);
    setHasSubmitError(false);
    onCancel();
  }

  return {
    content,
    isPrivate,
    isSubmitting,
    hasError: hasSubmitError,
    canSubmit,
    handleContentChange,
    handlePrivateToggle,
    handleSubmit,
    handleCancel,
  };
}
