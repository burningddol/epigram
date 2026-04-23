export function buildCursorParams(limit: number, cursor?: number): URLSearchParams {
  const params = new URLSearchParams({ limit: String(limit) });
  if (cursor !== undefined) params.set("cursor", String(cursor));
  return params;
}
