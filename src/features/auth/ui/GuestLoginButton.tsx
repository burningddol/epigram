"use client";

import { type ReactElement, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";

import { signIn } from "@/entities/user";
import { getSafeRedirect } from "@/shared/lib";
import { Button } from "@/shared/ui/Button";

const GUEST_CREDENTIALS = {
  email: "guest13325@naver.com",
  password: "@qwer1234",
} as const;

export function GuestLoginButton(): ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGuestLogin(): Promise<void> {
    setIsLoading(true);
    setError(null);
    try {
      const { user } = await signIn(GUEST_CREDENTIALS);
      queryClient.setQueryData(["me"], user);
      router.push(getSafeRedirect(searchParams.get("redirect")));
    } catch {
      setError("게스트 로그인에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <Button
        type="button"
        variant="secondary"
        isLoading={isLoading}
        onClick={handleGuestLogin}
        className="h-11 w-full"
      >
        게스트로 둘러보기
      </Button>
      {error !== null && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
