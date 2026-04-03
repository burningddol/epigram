import { z } from "zod";

export interface PaginatedResponse<T> {
  totalCount: number;
  nextCursor: number | null;
  list: T[];
}

export function buildPaginatedSchema<T extends z.ZodTypeAny>(
  itemSchema: T
): z.ZodObject<{
  totalCount: z.ZodNumber;
  nextCursor: z.ZodNullable<z.ZodNumber>;
  list: z.ZodArray<T>;
}> {
  return z.object({
    totalCount: z.number(),
    nextCursor: z.number().nullable(),
    list: z.array(itemSchema),
  });
}

export type PaginatedSchemaOf<T extends z.ZodTypeAny> = ReturnType<typeof buildPaginatedSchema<T>>;
