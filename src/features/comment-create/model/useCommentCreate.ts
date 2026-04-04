"use client";

import { useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/shared/api/client";

import type { Comment } from "@/entities/comment";

interface CreateCommentBody {
  epigramId: number;
  isPrivate: boolean;
  content: string;
}

interface UseCommentCreateReturn {
  content: string;
  isPrivate: boolean;
  isSubmitting: boolean;
  hasError: boolean;
  canSubmit: boolean;
  setContent: (value: string) => void;
  handlePrivateToggle: () => void;
  handleSubmit: () => void;
}

export function useCommentCreate(epigramId: number): UseCommentCreateReturn {
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  const {
    mutate,
    isPending: isSubmitting,
    isError: hasError,
  } = useMutation({
    mutationFn: (body: CreateCommentBody) =>
      apiClient.post<Comment>("/api/comments", body).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["epigrams", epigramId, "comments"] });
      setContent("");
      setIsPrivate(false);
    },
  });

  const canSubmit = content.trim().length > 0;

  function handlePrivateToggle(): void {
    setIsPrivate((prev) => !prev);
  }

  function handleSubmit(): void {
    const trimmed = content.trim();
    if (!trimmed) return;
    mutate({ epigramId, isPrivate, content: trimmed });
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
  };
}
