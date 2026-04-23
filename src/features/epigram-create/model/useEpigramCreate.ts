import { useRouter } from "next/navigation";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createEpigram } from "@/entities/epigram/api/createEpigram";
import { useTagInput } from "@/shared/hooks/useTagInput";

import { AUTHOR_TYPE, type EpigramCreateFormValues } from "./schema";

interface UseEpigramCreateReturn {
  tagInput: string;
  handleTagInputChange: (value: string) => void;
  handleAddTag: (currentTags: string[], onChange: (tags: string[]) => void) => void;
  handleRemoveTag: (tag: string, currentTags: string[], onChange: (tags: string[]) => void) => void;
  submit: (values: EpigramCreateFormValues) => void;
  isSubmitting: boolean;
  submitError: Error | null;
}

function resolveAuthor(values: EpigramCreateFormValues, userNickname: string | undefined): string {
  if (values.authorType === AUTHOR_TYPE.UNKNOWN) return "알 수 없음";
  if (values.authorType === AUTHOR_TYPE.SELF) return userNickname ?? "본인";
  return values.authorName ?? "";
}

function trimOrUndefined(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  return trimmed;
}

export function useEpigramCreate(userNickname?: string): UseEpigramCreateReturn {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { tagInput, handleTagInputChange, handleAddTag, handleRemoveTag } = useTagInput();

  const mutation = useMutation({
    mutationFn: (values: EpigramCreateFormValues) =>
      createEpigram({
        content: values.content,
        author: resolveAuthor(values, userNickname),
        referenceTitle: trimOrUndefined(values.referenceTitle),
        referenceUrl: trimOrUndefined(values.referenceUrl),
        tags: values.tags,
      }),
    onSuccess: (epigram) => {
      queryClient.invalidateQueries({ queryKey: ["epigrams"] });
      router.push(`/epigrams/${epigram.id}`);
    },
  });

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
