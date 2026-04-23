"use client";

import { useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/shared/api/client";
import { matchesCommentQuery, type Comment } from "@/entities/comment";

interface UpdateCommentBody {
  content: string;
  isPrivate: boolean;
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
  setContent: (value: string) => void;
  handlePrivateToggle: () => void;
  handleSubmit: () => void;
  handleCancel: () => void;
}

export function useCommentEdit({
  commentId,
  initialContent,
  initialIsPrivate,
  onCancel,
}: UseCommentEditParams): UseCommentEditReturn {
  const queryClient = useQueryClient();
  const [content, setContent] = useState(initialContent);
  const [isPrivate, setIsPrivate] = useState(initialIsPrivate);

  const {
    mutate,
    isPending: isSubmitting,
    isError: hasError,
  } = useMutation({
    mutationFn: (body: UpdateCommentBody) =>
      apiClient.patch<Comment>(`/api/comments/${commentId}`, body).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => matchesCommentQuery(query.queryKey),
      });
      onCancel();
    },
  });

  const trimmedContent = content.trim();
  const canSubmit = trimmedContent.length > 0;

  function handlePrivateToggle(): void {
    setIsPrivate((prev) => !prev);
  }

  function handleSubmit(): void {
    if (!canSubmit) return;
    mutate({ content: trimmedContent, isPrivate });
  }

  function handleCancel(): void {
    setContent(initialContent);
    setIsPrivate(initialIsPrivate);
    onCancel();
  }

  return {
    content,
    isPrivate,
    isSubmitting,
    hasError,
    canSubmit,
    setContent,
    handlePrivateToggle,
    handleSubmit,
    handleCancel,
  };
}
