import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { apiClient } from "@/shared/api/client";

import { epigramDetailSchema, type EpigramDetail } from "../model/schema";

export function useEpigramDetail(id: number): UseQueryResult<EpigramDetail, Error> {
  return useQuery({
    queryKey: ["epigrams", id],
    enabled: id > 0,
    queryFn: async () => {
      const response = await apiClient.get<unknown>(`/api/epigrams/${id}`);
      return epigramDetailSchema.parse(response.data);
    },
  });
}
