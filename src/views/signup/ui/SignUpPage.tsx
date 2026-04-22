import type { ReactElement } from "react";

import Link from "next/link";

import { AuthLeftPanel, SignUpForm } from "@/features/auth";
import { EpigramLogo } from "@/shared/ui/EpigramLogo";

export function SignUpPage(): ReactElement {
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
