"use client";

import { useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query";

import { apiClient } from "@/shared/api/client";
import { useModal } from "@/shared/hooks/useModal";
import { ConfirmModal } from "@/shared/ui/Modal";

interface UseCommentDeleteReturn {
  handleDeleteClick: () => void;
  isDeleting: boolean;
}

export function useCommentDelete(
  commentId: number,
  epigramId: number,
  userId?: number
): UseCommentDeleteReturn {
  const queryClient = useQueryClient();
  const { open } = useModal();

  const { mutate, isPending: isDeleting } = useMutation({
    mutationFn: async (): Promise<void> => {
      await apiClient.delete(`/api/comments/${commentId}`);
    },
    onSuccess: () => invalidateCommentCaches(queryClient, epigramId, userId),
  });

  function handleDeleteClick(): void {
    open((onClose) => (
      <ConfirmModal
        title="댓글을 삭제할까요?"
        confirmLabel="삭제"
        cancelLabel="취소"
        onConfirm={() => mutate()}
        onClose={onClose}
      />
    ));
  }

  return { handleDeleteClick, isDeleting };
}

async function invalidateCommentCaches(
  queryClient: QueryClient,
  epigramId: number,
  userId?: number
): Promise<void> {
  const tasks: Array<Promise<void>> = [
    queryClient.invalidateQueries({ queryKey: ["epigrams", epigramId, "comments"] }),
  ];

  if (userId !== undefined) {
    tasks.push(queryClient.invalidateQueries({ queryKey: ["users", userId, "comments"] }));
  }

  await Promise.all(tasks);
}
