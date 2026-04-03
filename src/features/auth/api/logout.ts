"use client";

import { useRouter } from "next/navigation";

import { logout } from "@/entities/user";

export function useLogout() {
  const router = useRouter();

  async function handleLogout(): Promise<void> {
    await logout();
    router.push("/");
  }

  return { handleLogout };
}
