import { useQuery } from "@tanstack/react-query";

import { type User } from "../model/schema";
import { getMe } from "./user";

export function useMe(): { user: User | null; isLoading: boolean } {
  const { data, isLoading } = useQuery<User, Error>({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
    // 401 등 인증 에러는 에러로 throw하지 않고 null로 처리
    throwOnError: false,
  });

  return { user: data ?? null, isLoading };
}
