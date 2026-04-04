import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { apiClient } from "@/shared/api/client";

import type { EpigramDetail } from "../model/schema";

export function useEpigramDetail(id: number): UseQueryResult<EpigramDetail, Error> {
  return useQuery({
    queryKey: ["epigrams", id],
    enabled: id > 0,
    queryFn: async () => {
      const response = await apiClient.get<EpigramDetail>(`/api/epigrams/${id}`);
      return response.data;
    },
  });
}
