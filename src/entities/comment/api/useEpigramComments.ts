import {
  useInfiniteQuery,
  type UseInfiniteQueryResult,
  type InfiniteData,
} from "@tanstack/react-query";

import { apiClient } from "@/shared/api/client";

import { buildCursorParams } from "./buildCursorParams";

import { commentQueryKeys } from "../model/queryKeys";
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
    queryKey: commentQueryKeys.byEpigramWithParams(epigramId, { limit }),
    enabled: epigramId > 0,
    queryFn: async ({ pageParam }) => {
      const params = buildCursorParams(limit, pageParam);
      const response = await apiClient.get<unknown>(
        `/api/epigrams/${epigramId}/comments?${params}`
      );
      return commentListResponseSchema.parse(response.data);
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}
