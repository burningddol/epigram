// 소비자(features/auth 등)가 stringly-typed `["me"]`를 반복하지 않도록 단일 진실 공급원으로 둔다.
export const userQueryKeys = {
  me: () => ["me"] as const,
} as const;
