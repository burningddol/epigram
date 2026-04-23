import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { apiClient } from "@/shared/api/client";

import { emotionLogSchema, type EmotionLog } from "../model/schema";

async function fetchTodayEmotion(userId: number): Promise<EmotionLog | null> {
  const response = await apiClient.get<unknown>("/api/emotionLogs/today", {
    params: { userId },
  });
  // 백엔드는 오늘 기록이 없을 때 null/빈 응답을 반환하므로 스키마 파싱 전에 걸러낸다.
  if (response.data == null || typeof response.data !== "object") return null;
  return emotionLogSchema.parse(response.data);
}

export function useTodayEmotion(userId: number): UseQueryResult<EmotionLog | null, Error> {
  // userId가 0/falsy이면(아직 /me 로드 전) 요청을 보내지 않는다. 호출부의 fallback(0)과 짝을 이룬다.
  return useQuery({
    queryKey: ["emotionLogs", "today", userId],
    enabled: userId > 0,
    queryFn: () => fetchTodayEmotion(userId),
  });
}
