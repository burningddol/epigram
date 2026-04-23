import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { apiClient } from "@/shared/api/client";

import { emotionLogSchema, type EmotionLog } from "../model/schema";

async function fetchTodayEmotion(userId: number): Promise<EmotionLog | null> {
  const response = await apiClient.get<unknown>("/api/emotionLogs/today", {
    params: { userId },
  });
  return emotionLogSchema.nullable().parse(response.data ?? null);
}

export function useTodayEmotion(userId: number): UseQueryResult<EmotionLog | null, Error> {
  // userId가 0/falsy이면(아직 /me 로드 전) 요청을 보내지 않는다. 호출부의 fallback(0)과 짝을 이룬다.
  return useQuery({
    queryKey: ["emotionLogs", "today", userId],
    enabled: userId > 0,
    queryFn: () => fetchTodayEmotion(userId),
  });
}
