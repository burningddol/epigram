import { useQuery } from "@tanstack/react-query";

import { type User } from "../model/schema";
import { getMe } from "./user";

export function useMe(): { user: User | null; isLoading: boolean } {
  const { data, isLoading } = useQuery<User | null, Error>({
    queryKey: ["me"],

    queryFn: async () => {
      try {
        return await getMe();
      } catch {
        return null;
      }
    },
    retry: false,

    staleTime: Infinity,
  });

  return { user: data ?? null, isLoading };
}
