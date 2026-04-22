"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { apiClient } from "@/shared/api/client";
import { useModal } from "@/shared/hooks/useModal";
import { ConfirmModal } from "@/shared/ui/Modal";

interface UseEpigramDeleteReturn {
  handleDeleteClick: () => void;
  isDeleting: boolean;
}

export function useEpigramDelete(epigramId: number, userId?: number): UseEpigramDeleteReturn {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { open } = useModal();

  const { mutate, isPending: isDeleting } = useMutation({
    mutationFn: () => apiClient.delete(`/api/epigrams/${epigramId}`).then((res) => res.data),
    onSuccess: () => {
      // fire-and-forget: await 시 ["epigrams", epigramId] active 쿼리가 refetch되어 404가 나면서 navigation이 막힌다.
      // 에피그램 삭제 시 백엔드에서 댓글도 함께 삭제되므로 작성자의 댓글 캐시도 함께 무효화한다.
      queryClient.invalidateQueries({ queryKey: ["epigrams"] });
      if (userId !== undefined) {
        queryClient.invalidateQueries({ queryKey: ["users", userId, "comments"] });
      }
      router.push("/epigrams");
    },
  });

  function handleDeleteClick(): void {
    open((onClose) =>
      ConfirmModal({
        title: "에피그램을 삭제할까요?",
        confirmLabel: "삭제",
        cancelLabel: "취소",
        onConfirm: mutate,
        onClose,
      })
    );
  }

  return { handleDeleteClick, isDeleting };
}
