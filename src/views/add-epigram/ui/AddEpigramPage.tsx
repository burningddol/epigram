"use client";

import type { ReactElement } from "react";

import { useQuery } from "@tanstack/react-query";

import { getMe } from "@/entities/user/api/user";
import { EpigramCreateForm } from "@/features/epigram-create";

export function AddEpigramPage(): ReactElement {
  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  return (
    <main
      id="main-content"
      className="mx-auto min-h-screen max-w-2xl px-4 py-10 tablet:px-6 desktop:max-w-3xl"
    >
      {/* 페이지 헤더 */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-black-950 tablet:text-3xl">에피그램 만들기</h1>
        <p className="mt-2 text-sm text-blue-400">
          마음에 새겨두고 싶은 글귀를 에피그램으로 만들어보세요.
        </p>
      </div>

      {/* 작성 폼 */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-blue-200 tablet:p-8">
        <EpigramCreateForm userNickname={user?.nickname} />
      </div>
    </main>
  );
}
