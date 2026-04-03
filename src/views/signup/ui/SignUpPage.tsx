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
    <div className="flex flex-1 flex-col tablet:flex-row">
      <AuthLeftPanel />

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
        <div className="flex w-full max-w-sm flex-col gap-[50px]">
          <div className="tablet:hidden">
            <EpigramLogo />
          </div>
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
    </div>
  );
}

function AuthLeftPanel() {
  return (
    <div className="hidden tablet:flex tablet:w-[380px] desktop:w-[460px] flex-col justify-between bg-blue-950 p-12">
      <span className="font-serif text-xl font-black tracking-tight text-white">Epigram</span>

      <div className="flex flex-col gap-5">
        <span
          className="font-serif leading-none text-blue-400"
          style={{ fontSize: "80px" }}
          aria-hidden="true"
        >
          "
        </span>
        <p className="font-serif text-xl leading-relaxed text-blue-100">
          나만 갖고 있기엔
          <br />
          아까운 글이 있지 않나요?
        </p>
        <p className="font-serif text-sm text-blue-500">— Epigram</p>
      </div>

      <p className="text-xs tracking-wide text-blue-600">다른 사람들과 감정을 공유해 보세요</p>
    </div>
  );
}
