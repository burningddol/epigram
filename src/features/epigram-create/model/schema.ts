import { z } from "zod";

export const AUTHOR_TYPE = {
  DIRECT: "direct",
  UNKNOWN: "unknown",
  SELF: "self",
} as const;

export type AuthorType = (typeof AUTHOR_TYPE)[keyof typeof AUTHOR_TYPE];

export const epigramCreateFormSchema = z
  .object({
    content: z
      .string()
      .min(1, "내용을 입력해주세요.")
      .max(500, "내용은 500자 이내로 입력해주세요."),
    authorType: z.enum([AUTHOR_TYPE.DIRECT, AUTHOR_TYPE.UNKNOWN, AUTHOR_TYPE.SELF]),
    authorName: z.string().max(30, "저자명은 30자 이내로 입력해주세요.").optional(),
    referenceTitle: z.string().max(100, "출처 제목은 100자 이내로 입력해주세요.").optional(),
    referenceUrl: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^https?:\/\/.+/.test(val),
        "올바른 URL 형식을 입력해주세요. (ex. https://www.website.com)"
      ),
    tags: z
      .array(z.string().min(1).max(10, "태그는 10자 이내로 입력해주세요."))
      .max(3, "태그는 최대 3개까지 추가할 수 있습니다."),
  })
  .superRefine((data, ctx) => {
    if (data.authorType === AUTHOR_TYPE.DIRECT && !data.authorName?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "저자 이름을 입력해주세요.",
        path: ["authorName"],
      });
    }
  });

export type EpigramCreateFormValues = z.infer<typeof epigramCreateFormSchema>;
