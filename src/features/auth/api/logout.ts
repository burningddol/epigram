"use client";

import { useRouter } from "next/navigation";

import { logout } from "@/entities/user";

interface UseLogoutReturn {
  handleLogout: () => Promise<void>;
}

export function useLogout(): UseLogoutReturn {
  const router = useRouter();

  async function handleLogout(): Promise<void> {
    await logout();
    router.push("/");
  }

  return { handleLogout };
}
