import {
  useInfiniteQuery,
  type UseInfiniteQueryResult,
  type InfiniteData,
} from "@tanstack/react-query";

import { apiClient } from "@/shared/api/client";

import { commentListResponseSchema, type CommentListResponse } from "../model/schema";

interface UseEpigramCommentsParams {
  epigramId: number;
  limit: number;
}

export function useEpigramComments({
  epigramId,
  limit,
}: UseEpigramCommentsParams): UseInfiniteQueryResult<
  InfiniteData<CommentListResponse, number | undefined>,
  Error
> {
  return useInfiniteQuery({
    queryKey: ["epigrams", epigramId, "comments", { limit }],
    enabled: epigramId > 0,
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams({ limit: String(limit) });
      if (pageParam !== undefined) params.set("cursor", String(pageParam));

      const response = await apiClient.get<unknown>(
        `/api/epigrams/${epigramId}/comments?${params}`
      );
      return commentListResponseSchema.parse(response.data);
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}
