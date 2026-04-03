import {
  useInfiniteQuery,
  type UseInfiniteQueryResult,
  type InfiniteData,
} from "@tanstack/react-query";

import { apiClient } from "@/shared/api/client";

import type { CommentListResponse } from "../model/schema";

interface UseRecentCommentsParams {
  limit: number;
}

export function useRecentComments({
  limit,
}: UseRecentCommentsParams): UseInfiniteQueryResult<
  InfiniteData<CommentListResponse, number | undefined>,
  Error
> {
  return useInfiniteQuery({
    queryKey: ["comments", { limit }],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams({ limit: String(limit) });
      if (pageParam !== undefined) params.set("cursor", String(pageParam));

      const response = await apiClient.get<CommentListResponse>(`/api/comments?${params}`);
      return response.data;
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}
