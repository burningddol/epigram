// Server-only: DO NOT import in client components
import { BACKEND_BASE } from "@/shared/config/backend";

import { buildCursorParams } from "./buildCursorParams";

import { commentListResponseSchema } from "../model/schema";
import type { CommentListResponse } from "../model/schema";

interface FetchCommentsPageParams {
  limit: number;
  pageParam?: number;
}

export async function fetchRecentCommentsPageServer({
  limit,
  pageParam,
}: FetchCommentsPageParams): Promise<CommentListResponse> {
  const params = buildCursorParams(limit, pageParam);

  const res = await fetch(`${BACKEND_BASE}/comments?${params}`, {
    next: { revalidate: 30, tags: ["comments"] },
    signal: AbortSignal.timeout(5000),
  });

  if (!res.ok) throw new Error(`Failed to fetch comments: ${res.status}`);
  return commentListResponseSchema.parse(await res.json());
}
