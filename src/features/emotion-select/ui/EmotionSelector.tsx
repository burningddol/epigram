"use client";

import type { ReactElement } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { cn } from "@/shared/lib/cn";

import type { Emotion } from "@/entities/emotion-log";

import { useEmotionSelect } from "../model/useEmotionSelect";

interface EmotionOption {
  value: Emotion;
  icon: string;
  label: string;
}

const EMOTION_OPTIONS: EmotionOption[] = [
  { value: "MOVED", icon: "/icon/012-heart face.png", label: "감동" },
  { value: "HAPPY", icon: "/icon/035-smiling face.png", label: "기쁨" },
  { value: "WORRIED", icon: "/icon/044-thinking.png", label: "고민" },
  { value: "SAD", icon: "/icon/034-sad.png", label: "슬픔" },
  { value: "ANGRY", icon: "/icon/Frame 65.png", label: "분노" },
];

export function EmotionSelector(): ReactElement {
  const router = useRouter();
  const { isLoggedIn, todayEmotion, isSubmitting, selectEmotion } = useEmotionSelect();

  function handleEmotionClick(emotion: Emotion): void {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
      router.push("/login");
      return;
    }

    if (todayEmotion != null) return;

    selectEmotion(emotion);
  }

  return (
    <section>
      <h2 className="mb-6 text-xl font-semibold text-black-700">오늘의 감정은 어떤가요?</h2>
      <ul className="flex items-center justify-center gap-5" role="list">
        {EMOTION_OPTIONS.map((option) => {
          const isSelected = todayEmotion === option.value;
          // 비로그인: 버튼 활성(클릭 시 로그인 유도) / 로그인: 이미 선택했으면 선택된 것 제외 비활성
          const isButtonDisabled =
            isLoggedIn && (isSubmitting || (todayEmotion != null && !isSelected));

          return (
            <li key={option.value}>
              <button
                type="button"
                onClick={() => handleEmotionClick(option.value)}
                disabled={isButtonDisabled}
                aria-label={option.label}
                aria-pressed={isSelected}
                className="group flex flex-col items-center gap-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-200 tablet:h-[72px] tablet:w-[72px]",
                    isSelected
                      ? "bg-blue-100 ring-2 ring-blue-300"
                      : "bg-gray-100 group-hover:bg-gray-200 group-active:bg-gray-300"
                  )}
                >
                  <Image
                    src={option.icon}
                    alt={option.label}
                    width={48}
                    height={48}
                    className="h-9 w-9 tablet:h-12 tablet:w-12 transition-transform duration-200 group-hover:scale-110 group-active:scale-100"
                  />
                </span>
                <span
                  className={cn(
                    "text-sm transition-colors duration-200",
                    isSelected ? "font-semibold text-black-700" : "font-medium text-black-300"
                  )}
                >
                  {option.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
