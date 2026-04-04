import { useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { createEpigram } from "@/entities/epigram/api/createEpigram";

import { AUTHOR_TYPE, type EpigramCreateFormValues } from "./schema";

const MAX_TAG_LENGTH = 10;

function resolveAuthor(values: EpigramCreateFormValues, userNickname: string | undefined): string {
  if (values.authorType === AUTHOR_TYPE.UNKNOWN) return "알 수 없음";
  if (values.authorType === AUTHOR_TYPE.SELF) return userNickname ?? "본인";
  return values.authorName ?? "";
}

export function useEpigramCreate(userNickname?: string) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [tagInput, setTagInput] = useState("");

  const mutation = useMutation({
    mutationFn: (values: EpigramCreateFormValues) =>
      createEpigram({
        content: values.content,
        author: resolveAuthor(values, userNickname),
        referenceTitle: values.referenceTitle?.trim() || undefined,
        referenceUrl: values.referenceUrl?.trim() || undefined,
        tags: values.tags,
      }),
    onSuccess: (epigram) => {
      queryClient.invalidateQueries({ queryKey: ["epigrams"] });
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

  return {
    tagInput,
    handleTagInputChange,
    handleAddTag,
    handleRemoveTag,
    submit: mutation.mutate,
    isSubmitting: mutation.isPending,
    submitError: mutation.error,
  };
}
