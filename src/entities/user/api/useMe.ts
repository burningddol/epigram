import { useQuery } from "@tanstack/react-query";

import { userQueryKeys } from "../model/queryKeys";
import { type User } from "../model/schema";
import { getMe } from "./user";

export function useMe(): { user: User | null; isLoading: boolean } {
  const { data, isLoading } = useQuery({
    queryKey: userQueryKeys.me(),
    queryFn: getMe,
    retry: false,
    // 헤더가 모든 라우트에 sticky로 마운트되므로, 전역 staleTime(60s)을 상속하면
    // 라우트 전환 시마다 /users/me 요청이 발생한다. 유저 정보는 세션 중 거의 불변이므로
    // 명시적으로 staleTime: Infinity를 설정한다.
    staleTime: Infinity,
  });

  return { user: data ?? null, isLoading };
}
