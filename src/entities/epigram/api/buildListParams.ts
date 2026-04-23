interface EpigramListParams {
  limit: number;
  pageParam?: number;
  keyword?: string;
  writerId?: number;
}

export function buildEpigramListParams({
  limit,
  pageParam,
  keyword,
  writerId,
}: EpigramListParams): URLSearchParams {
  const params = new URLSearchParams({ limit: String(limit) });
  if (pageParam !== undefined) params.set("cursor", String(pageParam));
  if (keyword) params.set("keyword", keyword);
  if (writerId !== undefined) params.set("writerId", String(writerId));
  return params;
}
