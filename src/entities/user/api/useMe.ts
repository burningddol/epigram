import { useQuery } from "@tanstack/react-query";

import { type User } from "../model/schema";
import { getMe } from "./user";

export function useMe(): { user: User | null; isLoading: boolean } {
  const { data, isLoading } = useQuery<User, Error>({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
    // 헤더가 모든 라우트에 sticky로 마운트되므로, 전역 staleTime(60s)을 상속하면
    // 라우트 전환 시마다 /users/me 요청이 발생한다. 유저 정보는 세션 중 거의 불변이므로
    // staleTime: Infinity로 캐시를 무효화하지 않는다.
    staleTime: Infinity,
  });

  return { user: data ?? null, isLoading };
}
