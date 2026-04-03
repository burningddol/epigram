"use client";

import type { ReactElement } from "react";
import { Suspense, useEffect } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { signInKakao } from "@/entities/user";

function KakaoCallbackHandler(): null {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      router.replace("/login");
      return;
    }

    const redirectUri = `${window.location.origin}/oauth/callback/kakao`;

    signInKakao({ token: code, redirectUri })
      .then(() => router.replace("/epigrams"))
      .catch(() => router.replace("/login"));
  }, [router, searchParams]);

  return null;
}

export default function KakaoCallbackPage(): ReactElement {
  return (
    <div className="flex flex-1 items-center justify-center">
      <p className="text-sm text-black-300">카카오 로그인 처리 중...</p>
      <Suspense>
        <KakaoCallbackHandler />
      </Suspense>
    </div>
  );
}
