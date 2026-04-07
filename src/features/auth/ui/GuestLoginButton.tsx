"use client";

import { type ReactElement, useState } from "react";

import { useRouter } from "next/navigation";

import { signIn } from "@/entities/user";
import { Button } from "@/shared/ui/Button";

const GUEST_CREDENTIALS = {
  email: "guestid@guestid.com",
  password: "qqqqqqqq",
} as const;

export function GuestLoginButton(): ReactElement {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGuestLogin(): Promise<void> {
    setIsLoading(true);
    setError(null);
    try {
      await signIn(GUEST_CREDENTIALS);
      router.push("/epigrams");
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
