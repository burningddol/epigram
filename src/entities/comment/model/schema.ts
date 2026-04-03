import { z } from "zod";

import { buildPaginatedSchema } from "@/shared/types/pagination";

export const writerSchema = z.object({
  id: z.number().int().positive(),
  nickname: z.string(),
  image: z.string().nullable(),
});

export const commentSchema = z.object({
  id: z.number().int().positive(),
  epigramId: z.number().int().positive(),
  writer: writerSchema,
  isPrivate: z.boolean(),
  content: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const commentListResponseSchema = buildPaginatedSchema(commentSchema);

export type Writer = z.infer<typeof writerSchema>;
export type Comment = z.infer<typeof commentSchema>;
export type CommentListResponse = z.infer<typeof commentListResponseSchema>;
