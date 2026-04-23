"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { matchesCommentQuery } from "@/entities/comment";
import { apiClient } from "@/shared/api/client";
import { useModal } from "@/shared/hooks/useModal";
import { ConfirmModal } from "@/shared/ui/Modal";

interface UseCommentDeleteReturn {
  handleDeleteClick: () => void;
  isDeleting: boolean;
}

export function useCommentDelete(
  commentId: number,
  _epigramId: number,
  _userId?: number
): UseCommentDeleteReturn {
  const queryClient = useQueryClient();
  const { open } = useModal();

  const { mutate, isPending: isDeleting } = useMutation({
    mutationFn: async (): Promise<void> => {
      await apiClient.delete(`/api/comments/${commentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => matchesCommentQuery(query.queryKey),
      });
    },
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
