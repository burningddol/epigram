"use client";

import { ArrowUp, Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

import { EmotionSelector } from "@/features/emotion-select";
import { useScrollToTop } from "@/shared/hooks/useScrollToTop";
import { RecentComments } from "@/widgets/comment-section";
import { EpigramFeed } from "@/widgets/epigram-feed";

function ScrollToTopButton(): React.ReactElement | null {
  const { isVisible, scrollToTop } = useScrollToTop();

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="페이지 상단으로 이동"
      className="fixed bottom-20 right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-line-200 bg-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-xl active:scale-95 tablet:right-8"
    >
      <ArrowUp className="h-5 w-5 text-black-500" aria-hidden="true" />
    </button>
  );
}

function CreateEpigramFab(): React.ReactElement {
  return (
    <Link
      href="/addepigram"
      aria-label="에피그램 만들기"
      className="group fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full bg-black-700 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-black-900 hover:shadow-xl active:scale-95 tablet:right-8"
    >
      <Plus
        className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90"
        aria-hidden="true"
      />
      에피그램 만들기
    </Link>
  );
}

export function EpigramsPage(): React.ReactElement {
  return (
    <main
      id="main-content"
      className="relative mx-auto min-h-screen max-w-2xl px-4 py-10 tablet:px-6 desktop:max-w-3xl"
    >
      <div className="flex flex-col gap-12 bg-background">
        <EmotionSelector />
        <EpigramFeed />
        <RecentComments />
      </div>
      <ScrollToTopButton />
      <CreateEpigramFab />
    </main>
  );
}
