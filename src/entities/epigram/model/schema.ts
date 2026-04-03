import { z } from "zod";

import { buildPaginatedSchema } from "@/shared/types/pagination";

export const epigramTagSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(10),
});

export const epigramSchema = z.object({
  id: z.number().int().positive(),
  content: z.string().min(1).max(500),
  author: z.string().min(1).max(30),
  referenceTitle: z.string().max(100).nullable(),
  referenceUrl: z
    .string()
    .regex(/^https?:\/\/.+/)
    .nullable(),
  writerId: z.number().int().positive(),
  tags: z.array(epigramTagSchema),
  likeCount: z.number(),
});

export const epigramDetailSchema = epigramSchema.extend({
  isLiked: z.boolean(),
});

export const epigramListResponseSchema = buildPaginatedSchema(epigramSchema);

export type EpigramTag = z.infer<typeof epigramTagSchema>;
export type Epigram = z.infer<typeof epigramSchema>;
export type EpigramDetail = z.infer<typeof epigramDetailSchema>;
export type EpigramListResponse = z.infer<typeof epigramListResponseSchema>;
