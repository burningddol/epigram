import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginForm } from "@/features/auth/ui/LoginForm";

export async function LoginPage() {
  const cookieStore = await cookies();
  if (cookieStore.has("accessToken")) {
    redirect("/epigrams");
  }

  const kakaoOauthUrl = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID ?? "";

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <h1 className="mb-8 text-center font-serif text-2xl font-bold text-black-950">로그인</h1>
        <LoginForm />
        <div className="my-6 flex items-center gap-4">
          <hr className="flex-1 border-line-200" />
          <span className="text-sm text-black-300">또는</span>
          <hr className="flex-1 border-line-200" />
        </div>
        <a
          href={kakaoOauthUrl}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#FEE500] text-sm font-semibold text-[#191919] transition-colors hover:bg-[#F0D800]"
        >
          카카오로 로그인
        </a>
        <p className="mt-6 text-center text-sm text-black-300">
          계정이 없으신가요?{" "}
          <Link href="/signup" className="font-semibold text-blue-700 hover:underline">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
