"use client";

import type { ReactElement } from "react";

import Image from "next/image";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";

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
    <div className="animate-pulse flex flex-col items-center gap-3">
      <div className="h-[100px] w-[100px] rounded-full bg-blue-200" />
      <div className="h-5 w-28 rounded-lg bg-blue-200" />
      <div className="h-7 w-20 rounded-full bg-blue-200" />
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
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-black-800">오늘의 감정</h2>
        <span className="text-sm text-black-300">{TODAY_LABEL}</span>
      </div>

      <div className="flex items-center justify-around">
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
              className="group flex flex-col items-center gap-1.5 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 tablet:gap-2"
            >
              <span
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-200 tablet:h-20 tablet:w-20",
                  isSelected
                    ? "border-4 border-illust-green"
                    : "bg-[#afbacd]/15 group-hover:bg-[#afbacd]/25"
                )}
              >
                <Image
                  src={icon}
                  alt={label}
                  width={52}
                  height={52}
                  className="h-7 w-7 transition-transform duration-200 group-hover:scale-110 tablet:h-12 tablet:w-12"
                />
              </span>
              <span
                className={cn(
                  "text-xs font-semibold transition-colors tablet:text-sm",
                  isSelected ? "text-black-800" : "text-black-300"
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
    <main id="main-content" className="mx-auto min-h-screen w-full max-w-[640px] px-6 pb-24 pt-10">
      <section className="mb-8 flex flex-col items-center gap-3 animate-fade-in-up">
        {isLoading || !me ? (
          <ProfileSkeleton />
        ) : (
          <>
            <ProfileImageUpload currentImageUrl={me.image} nickname={me.nickname} />
            <p className="text-xl font-bold text-black-800">{me.nickname}</p>
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="flex items-center gap-1.5 rounded-full border border-line-200 px-4 py-1.5 text-xs text-black-400 transition-all duration-200 hover:border-error/40 hover:bg-red-50 hover:text-error active:scale-95"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              로그아웃
            </button>
          </>
        )}
      </section>

      <div className="mb-8 animate-fade-in-up" style={{ animationDelay: "80ms" }}>
        <EmotionSelector
          selectedEmotion={selectedEmotion}
          onSelect={selectEmotion}
          isPending={isPending}
        />
      </div>

      {me && (
        <div className="animate-fade-in-up" style={{ animationDelay: "160ms" }}>
          <MypageActivity userId={me.id} />
        </div>
      )}
    </main>
  );
}
