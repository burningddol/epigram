"use client";

import { useCallback, useMemo } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/shared/api/client";

import type { EpigramDetail } from "@/entities/epigram";

interface UseEpigramLikeReturn {
  toggle: () => void;
  isPending: boolean;
}

export function useEpigramLike(epigramId: number): UseEpigramLikeReturn {
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => ["epigrams", epigramId], [epigramId]);

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
          isLiked: !old.isLiked,
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
    onSuccess: (data) => {
      // 서버 응답으로 캐시 직접 갱신 — 불필요한 재요청 방지
      queryClient.setQueryData(queryKey, data);
    },
  });

  const toggle = useCallback(() => {
    const current = queryClient.getQueryData<EpigramDetail>(queryKey);
    if (!current) return;
    mutate(current.isLiked);
  }, [queryClient, queryKey, mutate]);

  return { toggle, isPending };
}
