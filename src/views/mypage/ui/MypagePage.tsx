"use client";

import type { ReactElement } from "react";

import Image from "next/image";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";

import { postTodayEmotion, useTodayEmotion } from "@/entities/emotion-log";
import type { Emotion } from "@/entities/emotion-log";
import { getMe } from "@/entities/user";
import { ProfileImageUpload, useLogout } from "@/features/auth";
import { MypageActivity } from "@/widgets/mypage-activity";

const EMOTION_OPTIONS: { value: Emotion; icon: string; label: string }[] = [
  { value: "MOVED", icon: "/icon/012-heart face.png", label: "감동" },
  { value: "HAPPY", icon: "/icon/035-smiling face.png", label: "기쁨" },
  { value: "WORRIED", icon: "/icon/044-thinking.png", label: "고민" },
  { value: "SAD", icon: "/icon/034-sad.png", label: "슬픔" },
  { value: "ANGRY", icon: "/icon/Frame 65.png", label: "분노" },
];

// Computed once at module load — date does not change during a session
const _today = new Date();
const TODAY_LABEL = `${_today.getFullYear()}.${String(_today.getMonth() + 1).padStart(2, "0")}.${String(_today.getDate()).padStart(2, "0")}`;

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
    <div className="w-full rounded-2xl bg-white px-4 py-5 shadow-sm ring-1 ring-blue-200 tablet:px-6 tablet:py-6">
      <div className="mb-4 flex items-center justify-between tablet:mb-6">
        <h2 className="text-base font-semibold text-black-600 tablet:text-xl">오늘의 감정</h2>
        <span className="text-xs text-blue-400 tablet:text-base">{TODAY_LABEL}</span>
      </div>

      <div className="flex items-start justify-between gap-1 tablet:justify-around tablet:gap-2">
        {EMOTION_OPTIONS.map(({ value, icon, label }) => {
          const isSelected = selectedEmotion === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => onSelect(value)}
              disabled={isPending}
              aria-label={`${label} 감정 선택`}
              aria-pressed={isSelected}
              className="group flex flex-col items-center gap-1.5 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 active:scale-95 tablet:gap-2"
            >
              <span
                className={[
                  "flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-200",
                  "tablet:h-16 tablet:w-16 tablet:rounded-2xl pc:h-20 pc:w-20",
                  isSelected
                    ? "border-4 border-illust-green"
                    : "bg-blue-400/15 group-hover:bg-blue-400/25",
                ].join(" ")}
              >
                <Image
                  src={icon}
                  alt={label}
                  width={48}
                  height={48}
                  className="h-7 w-7 transition-transform duration-200 group-hover:scale-110 tablet:h-9 tablet:w-9 pc:h-12 pc:w-12"
                />
              </span>
              <span
                className={[
                  "text-xs font-semibold transition-colors tablet:text-sm pc:text-base",
                  isSelected ? "text-black-600" : "text-gray-300",
                ].join(" ")}
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
      className="mx-auto min-h-screen w-full max-w-xl px-4 pb-24 pt-10 tablet:max-w-2xl tablet:px-8 tablet:pt-14 pc:max-w-4xl pc:px-12 pc:pt-16 desktop:max-w-5xl desktop:px-16"
    >
      <section className="mb-6 flex flex-col items-center gap-3 animate-fade-in-up">
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

      <div className="mb-5 animate-fade-in-up" style={{ animationDelay: "80ms" }}>
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
