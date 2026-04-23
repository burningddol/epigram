import {
  useInfiniteQuery,
  type UseInfiniteQueryResult,
  type InfiniteData,
} from "@tanstack/react-query";

import { apiClient } from "@/shared/api/client";

import { buildEpigramListParams } from "./buildListParams";
import { epigramListResponseSchema, type EpigramListResponse } from "../model/schema";

interface UseSearchEpigramsParams {
  keyword: string;
  limit: number;
}

export function useSearchEpigrams({
  keyword,
  limit,
}: UseSearchEpigramsParams): UseInfiniteQueryResult<
  InfiniteData<EpigramListResponse, number | undefined>,
  Error
> {
  return useInfiniteQuery({
    queryKey: ["search", "epigrams", keyword],
    queryFn: async ({ pageParam }) => {
      const params = buildEpigramListParams({ limit, pageParam, keyword });
      const response = await apiClient.get<unknown>(`/api/epigrams?${params}`);
      return epigramListResponseSchema.parse(response.data);
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: keyword.trim().length > 0,
  });
}
