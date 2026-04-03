import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { apiClient } from "@/shared/api/client";

import type { EpigramDetail } from "../model/schema";

export function useTodayEpigram(): UseQueryResult<EpigramDetail | null, Error> {
  return useQuery({
    queryKey: ["epigrams", "today"],
    queryFn: async () => {
      const response = await apiClient.get<EpigramDetail | null>("/api/epigrams/today");
      return response.data;
    },
  });
}
