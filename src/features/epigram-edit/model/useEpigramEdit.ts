"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { AUTHOR_TYPE, type EpigramCreateFormValues } from "@/features/epigram-create/model/schema";
import { apiClient } from "@/shared/api/client";

import type { Epigram } from "@/entities/epigram";

interface UpdateEpigramBody {
  content?: string;
  author?: string;
  referenceTitle?: string | null;
  referenceUrl?: string | null;
  tags?: string[];
}

interface UseEpigramEditReturn {
  tagInput: string;
  isSubmitting: boolean;
  hasError: boolean;
  handleTagInputChange: (value: string) => void;
  handleAddTag: (currentTags: string[], onChange: (tags: string[]) => void) => void;
  handleRemoveTag: (tag: string, currentTags: string[], onChange: (tags: string[]) => void) => void;
  handleCancel: () => void;
  submit: (values: EpigramCreateFormValues) => void;
}

const MAX_TAG_LENGTH = 10;

function resolveAuthor(values: EpigramCreateFormValues): string {
  if (values.authorType === AUTHOR_TYPE.UNKNOWN) return "알 수 없음";
  if (values.authorType === AUTHOR_TYPE.SELF) return values.authorName ?? "본인";
  return values.authorName ?? "";
}

export function useEpigramEdit(epigramId: number): UseEpigramEditReturn {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [tagInput, setTagInput] = useState("");

  const {
    mutate,
    isPending: isSubmitting,
    isError: hasError,
  } = useMutation({
    mutationFn: (body: UpdateEpigramBody) =>
      apiClient.patch<Epigram>(`/api/epigrams/${epigramId}`, body).then((res) => res.data),
    onSuccess: (epigram) => {
      queryClient.invalidateQueries({ queryKey: ["epigrams", epigramId] });
      router.push(`/epigrams/${epigram.id}`);
    },
  });

  function handleTagInputChange(value: string): void {
    setTagInput(value.slice(0, MAX_TAG_LENGTH));
  }

  function handleAddTag(currentTags: string[], onChange: (tags: string[]) => void): void {
    const trimmed = tagInput.trim();
    if (!trimmed || currentTags.length >= 3 || currentTags.includes(trimmed)) return;
    onChange([...currentTags, trimmed]);
    setTagInput("");
  }

  function handleRemoveTag(
    tag: string,
    currentTags: string[],
    onChange: (tags: string[]) => void
  ): void {
    onChange(currentTags.filter((t) => t !== tag));
  }

  function handleCancel(): void {
    router.push(`/epigrams/${epigramId}`);
  }

  function submit(values: EpigramCreateFormValues): void {
    mutate({
      content: values.content,
      author: resolveAuthor(values),
      referenceTitle: values.referenceTitle?.trim() || null,
      referenceUrl: values.referenceUrl?.trim() || null,
      tags: values.tags,
    });
  }

  return {
    tagInput,
    isSubmitting,
    hasError,
    handleTagInputChange,
    handleAddTag,
    handleRemoveTag,
    handleCancel,
    submit,
  };
}
