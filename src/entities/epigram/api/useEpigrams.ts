import {
  useInfiniteQuery,
  type UseInfiniteQueryResult,
  type InfiniteData,
} from "@tanstack/react-query";

import { apiClient } from "@/shared/api/client";

import { buildEpigramListParams } from "./buildListParams";
import { epigramListResponseSchema, type EpigramListResponse } from "../model/schema";

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
      const params = buildEpigramListParams({ limit, pageParam, keyword, writerId });
      const response = await apiClient.get<unknown>(`/api/epigrams?${params}`);
      return epigramListResponseSchema.parse(response.data);
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}
