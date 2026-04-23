export const commentQueryKeys = {
  all: ["comments"] as const,
  recent: (params: { limit: number }) => ["comments", params] as const,
  byEpigram: (epigramId: number) => ["epigrams", epigramId, "comments"] as const,
  byEpigramWithParams: (epigramId: number, params: { limit: number }) =>
    ["epigrams", epigramId, "comments", params] as const,
  byUser: (userId: number) => ["users", userId, "comments"] as const,
  byUserWithParams: (userId: number, params: { limit: number }) =>
    ["users", userId, "comments", params] as const,
} as const;

export function matchesCommentQuery(queryKey: readonly unknown[]): boolean {
  const [prefix, , third] = queryKey;
  if (prefix === "comments") return true;
  if (prefix === "epigrams" && third === "comments") return true;
  if (prefix === "users" && third === "comments") return true;
  return false;
}
