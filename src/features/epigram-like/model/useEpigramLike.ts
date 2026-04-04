"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/shared/api/client";
import type { EpigramDetail } from "@/entities/epigram";

interface UseEpigramLikeReturn {
  toggle: () => void;
  isPending: boolean;
}

export function useEpigramLike(epigramId: number): UseEpigramLikeReturn {
  const queryClient = useQueryClient();
  const queryKey = ["epigrams", epigramId];

  const { mutate, isPending } = useMutation({
    mutationFn: async (isCurrentlyLiked: boolean) => {
      if (isCurrentlyLiked) {
        const res = await apiClient.delete<EpigramDetail>(`/api/epigrams/${epigramId}/like`);
        return res.data;
      }
      const res = await apiClient.post<EpigramDetail>(`/api/epigrams/${epigramId}/like`);
      return res.data;
    },
    onMutate: async (isCurrentlyLiked) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<EpigramDetail>(queryKey);

      queryClient.setQueryData<EpigramDetail>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          isLiked: !isCurrentlyLiked,
          likeCount: isCurrentlyLiked ? old.likeCount - 1 : old.likeCount + 1,
        };
      });

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  function toggle(): void {
    const current = queryClient.getQueryData<EpigramDetail>(queryKey);
    if (!current) return;
    mutate(current.isLiked);
  }

  return { toggle, isPending };
}
