import { apiClient } from "@/shared/api/client";

import { emotionLogSchema, type Emotion, type EmotionLog } from "../model/schema";

export async function postTodayEmotion(emotion: Emotion): Promise<EmotionLog> {
  const response = await apiClient.post<unknown>("/api/emotionLogs/today", { emotion });
  return emotionLogSchema.parse(response.data);
}
