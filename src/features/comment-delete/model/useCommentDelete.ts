"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/shared/api/client";
import { useModal } from "@/shared/hooks/useModal";
import { ConfirmModal } from "@/shared/ui/Modal";

interface UseCommentDeleteReturn {
  handleDeleteClick: () => void;
  isDeleting: boolean;
}

export function useCommentDelete(commentId: number, epigramId: number): UseCommentDeleteReturn {
  const queryClient = useQueryClient();
  const { open } = useModal();

  const { mutate, isPending: isDeleting } = useMutation({
    mutationFn: () => apiClient.delete(`/api/comments/${commentId}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["epigrams", epigramId, "comments"] });
    },
  });

  function handleDeleteClick(): void {
    open((onClose) =>
      ConfirmModal({
        title: "댓글을 삭제할까요?",
        confirmLabel: "삭제",
        cancelLabel: "취소",
        onConfirm: mutate,
        onClose,
      })
    );
  }

  return { handleDeleteClick, isDeleting };
}
