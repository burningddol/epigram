"use client";

import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";

import { apiClient } from "@/shared/api/client";

import type { EpigramDetail } from "@/entities/epigram";

interface UseEpigramLikeReturn {
  toggle: () => void;
  isPending: boolean;
}

interface MutationContext {
  previous: EpigramDetail | undefined;
}

function buildQueryKey(epigramId: number): QueryKey {
  return ["epigrams", epigramId];
}

async function toggleLikeRequest(
  epigramId: number,
  isCurrentlyLiked: boolean
): Promise<EpigramDetail> {
  const url = `/api/epigrams/${epigramId}/like`;
  if (isCurrentlyLiked) {
    const res = await apiClient.delete<EpigramDetail>(url);
    return res.data;
  }
  const res = await apiClient.post<EpigramDetail>(url);
  return res.data;
}

function getOptimisticDetail(current: EpigramDetail): EpigramDetail {
  const delta = current.isLiked ? -1 : 1;
  return {
    ...current,
    isLiked: !current.isLiked,
    likeCount: current.likeCount + delta,
  };
}

export function useEpigramLike(epigramId: number): UseEpigramLikeReturn {
  const queryClient = useQueryClient();
  const queryKey = buildQueryKey(epigramId);

  const { mutate, isPending } = useMutation<EpigramDetail, Error, boolean, MutationContext>({
    mutationFn: (isCurrentlyLiked) => toggleLikeRequest(epigramId, isCurrentlyLiked),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<EpigramDetail>(queryKey);

      if (previous) {
        queryClient.setQueryData<EpigramDetail>(queryKey, getOptimisticDetail(previous));
      }

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (!context?.previous) return;
      queryClient.setQueryData(queryKey, context.previous);
    },
    onSuccess: (data) => {
      // 서버 응답으로 캐시 직접 갱신 — 불필요한 재요청 방지
      queryClient.setQueryData(queryKey, data);
    },
  });

  function toggle(): void {
    const current = queryClient.getQueryData<EpigramDetail>(queryKey);
    if (!current) return;
    mutate(current.isLiked);
  }

  return { toggle, isPending };
}
