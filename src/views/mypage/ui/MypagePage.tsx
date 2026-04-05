"use client";

import type { ReactElement } from "react";

import { useQuery } from "@tanstack/react-query";
import { LogOut } from "lucide-react";

import { getMe } from "@/entities/user";
import { ProfileImageUpload } from "@/features/auth";
import { useLogout } from "@/features/auth";
import { MypageActivity } from "@/widgets/mypage-activity";

function ProfileSkeleton(): ReactElement {
  return (
    <div className="animate-pulse">
      <div className="mx-auto h-20 w-20 rounded-full bg-blue-200" />
      <div className="mx-auto mt-3 h-5 w-24 rounded-lg bg-blue-200" />
    </div>
  );
}

export function MypagePage(): ReactElement {
  const { data: me, isLoading } = useQuery({ queryKey: ["me"], queryFn: getMe });
  const { handleLogout } = useLogout();

  return (
    <main
      id="main-content"
      className="mx-auto min-h-screen max-w-2xl px-4 py-10 tablet:px-6 desktop:max-w-3xl"
    >
      <section className="mb-8 flex flex-col items-center gap-3">
        {isLoading || !me ? (
          <ProfileSkeleton />
        ) : (
          <>
            <ProfileImageUpload currentImageUrl={me.image} nickname={me.nickname} />
            <p className="text-lg font-semibold text-black-700">{me.nickname}</p>
          </>
        )}

        <button
          type="button"
          onClick={() => void handleLogout()}
          className="mt-1 flex items-center gap-1.5 rounded-full border border-line-200 px-4 py-1.5 text-sm text-black-400 transition-colors hover:border-red-300 hover:text-red-500"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          로그아웃
        </button>
      </section>

      {me && <MypageActivity userId={me.id} />}
    </main>
  );
}
