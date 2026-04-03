import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginForm } from "@/features/auth/ui/LoginForm";
import { EpigramLogo } from "@/shared/ui/EpigramLogo";

export async function LoginPage() {
  const cookieStore = await cookies();
  if (cookieStore.has("accessToken")) {
    redirect("/epigrams");
  }

  const kakaoOauthUrl = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID ?? "";

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="flex w-full max-w-sm flex-col gap-[50px]">
        <EpigramLogo />
        <div className="flex flex-col gap-[50px]">
          <div className="flex flex-col gap-[10px]">
            <LoginForm />
            <div className="flex items-center gap-2">
              <span className="text-sm text-blue-400">회원이 아니신가요?</span>
              <Link href="/signup" className="text-sm font-medium text-black-600 hover:underline">
                가입하기
              </Link>
            </div>
          </div>
          <SocialLoginSection kakaoOauthUrl={kakaoOauthUrl} />
        </div>
      </div>
    </div>
  );
}

interface SocialLoginSectionProps {
  kakaoOauthUrl: string;
}

function SocialLoginSection({ kakaoOauthUrl }: SocialLoginSectionProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-[14px]">
        <hr className="flex-1 border-line-200" />
        <span className="text-xs text-blue-400">SNS 계정으로 로그인하기</span>
        <hr className="flex-1 border-line-200" />
      </div>
      <div className="flex justify-center gap-4">
        <SocialIconButton
          href="https://nid.naver.com/oauth2.0/authorize"
          label="네이버로 로그인"
          bgColor="#03C75A"
        >
          <span className="text-white font-bold text-sm leading-none">N</span>
        </SocialIconButton>
        <SocialIconButton
          href="https://accounts.google.com/o/oauth2/v2/auth"
          label="구글로 로그인"
          bgColor="#ffffff"
          className="border border-line-200"
        >
          <span className="text-[#4285F4] font-bold text-sm leading-none">G</span>
        </SocialIconButton>
        <SocialIconButton href={kakaoOauthUrl} label="카카오로 로그인" bgColor="#FEE500">
          <span className="text-[#191919] font-bold text-sm leading-none">K</span>
        </SocialIconButton>
      </div>
    </div>
  );
}

interface SocialIconButtonProps {
  href: string;
  label: string;
  bgColor: string;
  className?: string;
  children: React.ReactNode;
}

function SocialIconButton({
  href,
  label,
  bgColor,
  className = "",
  children,
}: SocialIconButtonProps) {
  return (
    <a
      href={href}
      aria-label={label}
      className={`flex h-10 w-10 items-center justify-center rounded-full transition-opacity hover:opacity-80 ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      {children}
    </a>
  );
}
