import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { apiClient } from "@/shared/api/client";

import { emotionLogSchema, type EmotionLog } from "../model/schema";

export function useTodayEmotion(userId: number): UseQueryResult<EmotionLog | null, Error> {
  return useQuery({
    queryKey: ["emotionLogs", "today", userId],
    enabled: userId > 0,
    queryFn: async () => {
      const response = await apiClient.get<unknown>("/api/emotionLogs/today", {
        params: { userId },
      });
      if (response.data === null || response.data === undefined) return null;
      return emotionLogSchema.parse(response.data);
    },
  });
}
