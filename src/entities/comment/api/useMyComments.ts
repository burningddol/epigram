import {
  useInfiniteQuery,
  type UseInfiniteQueryResult,
  type InfiniteData,
} from "@tanstack/react-query";

import { apiClient } from "@/shared/api/client";

import type { CommentListResponse } from "../model/schema";

interface UseMyCommentsParams {
  userId: number;
  limit: number;
}

export function useMyComments({
  userId,
  limit,
}: UseMyCommentsParams): UseInfiniteQueryResult<
  InfiniteData<CommentListResponse, number | undefined>,
  Error
> {
  return useInfiniteQuery({
    queryKey: ["users", userId, "comments", { limit }],
    enabled: userId > 0,
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams({ limit: String(limit) });
      if (pageParam !== undefined) params.set("cursor", String(pageParam));

      const response = await apiClient.get<CommentListResponse>(
        `/api/users/${userId}/comments?${params}`
      );
      return response.data;
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}
