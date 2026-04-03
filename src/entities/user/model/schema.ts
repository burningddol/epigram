import { z } from "zod";

export const userSchema = z.object({
  id: z.number().int().positive(),
  nickname: z.string().min(1).max(30),
  email: z.string().email().optional(),
  image: z.string().url().nullable(),
  teamId: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type User = z.infer<typeof userSchema>;
