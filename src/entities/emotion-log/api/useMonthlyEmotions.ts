import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { apiClient } from "@/shared/api/client";

import { emotionLogArraySchema, type EmotionLog } from "../model/schema";

interface UseMonthlyEmotionsParams {
  userId: number;
  year: number;
  month: number;
}

async function fetchMonthlyEmotions({
  userId,
  year,
  month,
}: UseMonthlyEmotionsParams): Promise<EmotionLog[]> {
  const response = await apiClient.get<unknown>("/api/emotionLogs/monthly", {
    params: { userId, year, month },
  });
  return emotionLogArraySchema.parse(response.data);
}

export function useMonthlyEmotions(
  params: UseMonthlyEmotionsParams
): UseQueryResult<EmotionLog[], Error> {
  const { userId, year, month } = params;
  // userId는 API 스펙상 minimum: 1 — 0/falsy이면(/me 로드 전) 요청을 보내지 않는다.
  return useQuery({
    queryKey: ["emotionLogs", "monthly", userId, year, month],
    enabled: userId > 0,
    queryFn: () => fetchMonthlyEmotions(params),
  });
}
