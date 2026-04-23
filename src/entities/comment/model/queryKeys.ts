/**
 * comment 엔티티 쿼리키 팩토리.
 *
 * features/comment-create·comment-edit·comment-delete 등 소비자들이
 * 에피그램·유저별 댓글 캐시를 일관된 키로 무효화할 수 있도록 한 곳에 모은다.
 * 하드코딩된 `["epigrams", id, "comments"]` 반복 대신 이 팩토리를 사용한다.
 */
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
