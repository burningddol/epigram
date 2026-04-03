import {
  useInfiniteQuery,
  type UseInfiniteQueryResult,
  type InfiniteData,
} from "@tanstack/react-query";

import { apiClient } from "@/shared/api/client";

import type { EpigramListResponse } from "../model/schema";

interface UseEpigramsParams {
  limit: number;
  keyword?: string;
  writerId?: number;
}

export function useEpigrams({
  limit,
  keyword,
  writerId,
}: UseEpigramsParams): UseInfiniteQueryResult<
  InfiniteData<EpigramListResponse, number | undefined>,
  Error
> {
  return useInfiniteQuery({
    queryKey: ["epigrams", { limit, keyword, writerId }],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams({ limit: String(limit) });
      if (pageParam !== undefined) params.set("cursor", String(pageParam));
      if (keyword) params.set("keyword", keyword);
      if (writerId !== undefined) params.set("writerId", String(writerId));

      const response = await apiClient.get<EpigramListResponse>(`/api/epigrams?${params}`);
      return response.data;
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}
