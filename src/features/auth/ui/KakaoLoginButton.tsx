"use client";

import type { ReactElement } from "react";

import { useSearchParams } from "next/navigation";

import { SESSION_REDIRECT_KEY } from "@/shared/lib";

interface KakaoLoginButtonProps {
  kakaoOauthUrl: string;
}

export function KakaoLoginButton({ kakaoOauthUrl }: KakaoLoginButtonProps): ReactElement {
  const searchParams = useSearchParams();

  function handleClick(): void {
    const redirect = searchParams.get("redirect");
    if (redirect?.startsWith("/")) {
      sessionStorage.setItem(SESSION_REDIRECT_KEY, redirect);
    }
  }

  return (
    <a
      href={kakaoOauthUrl}
      aria-label="카카오로 로그인"
      onClick={handleClick}
      className="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-150 hover:scale-110 hover:opacity-90 active:scale-95"
      style={{ backgroundColor: "#FEE500" }}
    >
      <span className="text-sm font-bold leading-none text-[#191919]">K</span>
    </a>
  );
}
