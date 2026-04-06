import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { apiClient } from "@/shared/api/client";

import { emotionLogArraySchema, type EmotionLog } from "../model/schema";

interface UseMonthlyEmotionsParams {
  userId: number;
  year: number;
  month: number;
}

export function useMonthlyEmotions({
  userId,
  year,
  month,
}: UseMonthlyEmotionsParams): UseQueryResult<EmotionLog[], Error> {
  return useQuery({
    queryKey: ["emotionLogs", "monthly", userId, year, month],
    queryFn: async () => {
      const response = await apiClient.get<unknown>("/api/emotionLogs/monthly", {
        params: { userId, year, month },
      });
      return emotionLogArraySchema.parse(response.data);
    },
    // userId 0 or negative is invalid per API spec (minimum: 1)
    enabled: userId > 0,
  });
}
