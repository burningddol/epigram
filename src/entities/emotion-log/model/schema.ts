import { z } from "zod";

export const emotionSchema = z.enum(["MOVED", "HAPPY", "WORRIED", "SAD", "ANGRY"]);

export const emotionLogSchema = z.object({
  id: z.number().int().positive(),
  userId: z.number().int().positive(),
  emotion: emotionSchema,
  createdAt: z.string().datetime(),
});

export type Emotion = z.infer<typeof emotionSchema>;
export type EmotionLog = z.infer<typeof emotionLogSchema>;
