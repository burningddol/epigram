"use client";

import type { ReactElement } from "react";

import { useQuery } from "@tanstack/react-query";

import { getMe } from "@/entities/user/api/user";
import { EpigramCreateForm } from "@/features/epigram-create";

const WRITING_TIPS = [
  "500자 이내의 짧고 인상적인 문장을 담아보세요.",
  "출처가 있다면 함께 기록해두면 좋습니다.",
  "태그를 활용하면 비슷한 글귀를 찾기 쉬워집니다.",
];

export function AddEpigramPage(): ReactElement {
  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 tablet:max-w-3xl tablet:px-6 pc:max-w-screen-xl pc:px-16 pc:py-16">
      <div className="mb-8 pc:mb-12">
        <h1 className="text-2xl font-bold text-black-950 tablet:text-3xl pc:text-4xl">
          에피그램 만들기
        </h1>
        <p className="mt-2 text-sm text-blue-400 pc:text-base">
          마음에 새겨두고 싶은 글귀를 에피그램으로 만들어보세요.
        </p>
      </div>

      <div className="pc:grid pc:grid-cols-[5fr_7fr] pc:items-start pc:gap-16">
        <aside className="hidden pc:block pc:sticky pc:top-24">
          <blockquote className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-blue-200">
            <p className="font-serif text-lg leading-relaxed text-black-700">
              &ldquo;짧은 글 하나가
              <br />긴 침묵보다 깊을 수 있다.&rdquo;
            </p>
            <footer className="mt-3 text-xs text-blue-400">— Epigram</footer>
          </blockquote>

          <div className="mt-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-400">
              작성 팁
            </p>
            <ul className="space-y-2">
              {WRITING_TIPS.map((tip) => (
                <li key={tip} className="flex items-start gap-2 text-sm text-black-400">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-blue-400" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-blue-200 tablet:p-8 pc:p-10">
          <EpigramCreateForm userNickname={user?.nickname} />
        </div>
      </div>
    </div>
  );
}
