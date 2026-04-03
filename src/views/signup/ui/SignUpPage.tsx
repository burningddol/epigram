import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { SignUpForm } from "@/features/auth/ui/SignUpForm";

export async function SignUpPage() {
  const cookieStore = await cookies();
  if (cookieStore.has("accessToken")) {
    redirect("/epigrams");
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <h1 className="mb-8 text-center font-serif text-2xl font-bold text-black-950">회원가입</h1>
        <SignUpForm />
        <p className="mt-6 text-center text-sm text-black-300">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="font-semibold text-blue-700 hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
