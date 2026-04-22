import type { ReactElement } from "react";

import { Suspense } from "react";

import Link from "next/link";

import { AuthLeftPanel } from "@/features/auth/ui/AuthLeftPanel";
import { GuestLoginButton } from "@/features/auth/ui/GuestLoginButton";
import { KakaoLoginButton } from "@/features/auth/ui/KakaoLoginButton";
import { LoginForm } from "@/features/auth/ui/LoginForm";
import { EpigramLogo } from "@/shared/ui/EpigramLogo";

export function LoginPage(): ReactElement {
  return (
    <div className="flex flex-1 flex-col tablet:flex-row">
      <AuthLeftPanel />

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
        <div className="flex w-full max-w-sm flex-col gap-[50px]">
          <div className="tablet:hidden">
            <EpigramLogo />
          </div>
          <div className="flex flex-col gap-[50px]">
            <div className="flex flex-col gap-[10px]">
              <Suspense>
                <LoginForm />
                <GuestLoginButton />
              </Suspense>
              <SignupPrompt />
            </div>
            <SocialLoginSection />
          </div>
        </div>
      </div>
    </div>
  );
}

function SignupPrompt(): ReactElement {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-blue-400">회원이 아니신가요?</span>
      <Link href="/signup" className="text-sm font-medium text-black-600 hover:underline">
        가입하기
      </Link>
    </div>
  );
}

function SocialLoginSection(): ReactElement {
  const kakaoOauthUrl = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID ?? "";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-[14px]">
        <hr className="flex-1 border-line-200" />
        <span className="text-xs text-blue-400">SNS 계정으로 로그인하기</span>
        <hr className="flex-1 border-line-200" />
      </div>
      <div className="flex justify-center gap-4">
        <Suspense>
          <KakaoLoginButton kakaoOauthUrl={kakaoOauthUrl} />
        </Suspense>
      </div>
    </div>
  );
}
