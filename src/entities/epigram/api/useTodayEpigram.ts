import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { apiClient } from "@/shared/api/client";

import { epigramSchema, type Epigram } from "../model/schema";

// /today 엔드포인트는 인증 없는 공개 API라 isLiked를 반환하지 않음.
// swagger의 EpigramDetailType 명세와 실제 응답이 불일치하므로 epigramSchema를 사용한다.
export function useTodayEpigram(): UseQueryResult<Epigram | null, Error> {
  return useQuery({
    queryKey: ["epigrams", "today"],
    queryFn: async () => {
      const response = await apiClient.get<unknown>("/api/epigrams/today");
      if (response.data == null || typeof response.data !== "object") return null;
      return epigramSchema.parse(response.data);
    },
  });
}
