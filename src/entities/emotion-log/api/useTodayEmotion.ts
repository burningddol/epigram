import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { apiClient } from "@/shared/api/client";

import type { EmotionLog } from "../model/schema";

export function useTodayEmotion(userId: number): UseQueryResult<EmotionLog | null, Error> {
  return useQuery({
    queryKey: ["emotionLogs", "today", userId],
    enabled: userId > 0,
    queryFn: async () => {
      const response = await apiClient.get<EmotionLog | null>("/api/emotionLogs/today", {
        params: { userId },
      });
      return response.data;
    },
  });
}
