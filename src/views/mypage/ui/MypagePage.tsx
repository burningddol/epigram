"use client";

import type { ReactElement } from "react";

import Image from "next/image";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  EMOTION_META,
  EMOTION_ORDER,
  postTodayEmotion,
  useTodayEmotion,
} from "@/entities/emotion-log";
import { getMe } from "@/entities/user";
import { ProfileImageUpload, useLogout } from "@/features/auth";
import { cn } from "@/shared/lib/cn";
import { MypageActivity } from "@/widgets/mypage-activity";

import type { Emotion } from "@/entities/emotion-log";

// Computed once at module load — date does not change during a session
const TODAY_LABEL = new Date().toLocaleDateString("ko-KR", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

// ─── Skeletons ────────────────────────────────────────────────────────────────

function ProfileSkeleton(): ReactElement {
  return (
    <div className="animate-pulse flex flex-col items-center gap-4">
      <div className="h-[120px] w-[120px] rounded-full bg-blue-200" />
      <div className="h-6 w-28 rounded-lg bg-blue-200" />
      <div className="h-10 w-24 rounded-full bg-blue-200" />
    </div>
  );
}

// ─── Emotion Selector ─────────────────────────────────────────────────────────

interface EmotionSelectorProps {
  selectedEmotion: Emotion | null;
  onSelect: (emotion: Emotion) => void;
  isPending: boolean;
}

function EmotionSelector({
  selectedEmotion,
  onSelect,
  isPending,
}: EmotionSelectorProps): ReactElement {
  return (
    <div className="w-full">
      <div className="mb-12 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-black-600">오늘의 감정</h2>
        <span className="text-xl text-blue-400">{TODAY_LABEL}</span>
      </div>

      <div className="flex items-start justify-between gap-2 tablet:justify-start tablet:gap-4">
        {EMOTION_ORDER.map((value) => {
          const { icon, label } = EMOTION_META[value];
          const isSelected = selectedEmotion === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => onSelect(value)}
              disabled={isPending}
              aria-label={`${label} 감정 선택`}
              aria-pressed={isSelected}
              className="group flex flex-col items-center gap-2 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span
                className={cn(
                  "flex h-16 w-16 items-center justify-center rounded-2xl p-3 transition-all duration-200 tablet:h-24 tablet:w-24 tablet:p-4",
                  isSelected
                    ? "border-4 border-illust-green"
                    : "bg-[#afbacd]/15 group-hover:bg-[#afbacd]/25"
                )}
              >
                <Image
                  src={icon}
                  alt={label}
                  width={48}
                  height={48}
                  className="h-9 w-9 transition-transform duration-200 group-hover:scale-110 tablet:h-12 tablet:w-12"
                />
              </span>
              <span
                className={cn(
                  "text-base font-semibold transition-colors tablet:text-xl",
                  isSelected ? "text-sub-blue-1" : "text-[#999]"
                )}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── MypagePage ───────────────────────────────────────────────────────────────

export function MypagePage(): ReactElement {
  const queryClient = useQueryClient();
  const { data: me, isLoading } = useQuery({ queryKey: ["me"], queryFn: getMe });
  const { handleLogout } = useLogout();
  const { data: todayEmotion } = useTodayEmotion(me?.id ?? 0);

  const { mutate: selectEmotion, isPending } = useMutation({
    mutationFn: postTodayEmotion,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["emotionLogs", "today"] });
      void queryClient.invalidateQueries({ queryKey: ["emotionLogs"] });
    },
  });

  const selectedEmotion = todayEmotion?.emotion ?? null;

  return (
    <main
      id="main-content"
      className="mx-auto min-h-screen w-full max-w-[640px] bg-[#dde3ee] pb-24 pt-10"
    >
      <section className="mb-8 flex flex-col items-center gap-4 px-6 animate-fade-in-up">
        {isLoading || !me ? (
          <ProfileSkeleton />
        ) : (
          <>
            <ProfileImageUpload currentImageUrl={me.image} nickname={me.nickname} />
            <p className="text-2xl font-medium text-black-950">{me.nickname}</p>
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="rounded-full bg-line-100 px-5 py-2.5 text-xl font-medium text-gray-300 transition-all duration-200 hover:bg-[#e8e8e8] active:scale-95"
            >
              로그아웃
            </button>
          </>
        )}
      </section>

      <div
        className="flex flex-col gap-10 rounded-3xl bg-white px-6 py-8 shadow-[0px_2px_24px_0_rgba(0,0,0,0.1)] animate-fade-in-up"
        style={{ animationDelay: "80ms" }}
      >
        <EmotionSelector
          selectedEmotion={selectedEmotion}
          onSelect={selectEmotion}
          isPending={isPending}
        />

        {me && <MypageActivity userId={me.id} />}
      </div>
    </main>
  );
}
