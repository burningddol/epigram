"use client";

import { useRouter } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";

import { logout } from "@/entities/user";

interface UseLogoutReturn {
  handleLogout: () => Promise<void>;
}

export function useLogout(): UseLogoutReturn {
  const router = useRouter();
  const queryClient = useQueryClient();

  async function handleLogout(): Promise<void> {
    await logout();
    await queryClient.invalidateQueries({ queryKey: ["me"] });
    router.push("/");
  }

  return { handleLogout };
}
