import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { apiClient } from "@/shared/api/client";

import { epigramDetailSchema, type EpigramDetail } from "../model/schema";

export function useTodayEpigram(): UseQueryResult<EpigramDetail | null, Error> {
  return useQuery({
    queryKey: ["epigrams", "today"],
    queryFn: async () => {
      const response = await apiClient.get<unknown>("/api/epigrams/today");
      if (response.data == null || typeof response.data !== "object") return null;
      return epigramDetailSchema.parse(response.data);
    },
  });
}
