import { apiClient } from "@/shared/api/client";
import type { Emotion, EmotionLog } from "../model/schema";

export async function postTodayEmotion(emotion: Emotion): Promise<EmotionLog> {
  const response = await apiClient.post<EmotionLog>("/api/emotionLogs/today", { emotion });
  return response.data;
}
