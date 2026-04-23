import {
  useInfiniteQuery,
  type UseInfiniteQueryResult,
  type InfiniteData,
} from "@tanstack/react-query";

import { apiClient } from "@/shared/api/client";

import { buildCursorParams } from "./buildCursorParams";

import { commentQueryKeys } from "../model/queryKeys";
import { commentListResponseSchema, type CommentListResponse } from "../model/schema";

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
    queryKey: commentQueryKeys.recent({ limit }),
    queryFn: async ({ pageParam }) => {
      const params = buildCursorParams(limit, pageParam);
      const response = await apiClient.get<unknown>(`/api/comments?${params}`);
      return commentListResponseSchema.parse(response.data);
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}
