import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { SignUpForm } from "@/features/auth/ui/SignUpForm";
import { EpigramLogo } from "@/shared/ui/EpigramLogo";

export async function SignUpPage() {
  const cookieStore = await cookies();
  if (cookieStore.has("accessToken")) {
    redirect("/epigrams");
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="flex w-full max-w-sm flex-col gap-[50px]">
        <EpigramLogo />
        <div className="flex flex-col gap-[10px]">
          <SignUpForm />
          <div className="flex items-center gap-2">
            <span className="text-sm text-blue-400">이미 회원이신가요?</span>
            <Link href="/login" className="text-sm font-medium text-black-600 hover:underline">
              로그인
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
