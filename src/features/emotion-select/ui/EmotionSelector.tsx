"use client";

import type { ReactElement } from "react";

import { useRouter } from "next/navigation";

import type { Emotion } from "@/entities/emotion-log";

import { useEmotionSelect } from "../model/useEmotionSelect";

interface EmotionOption {
  value: Emotion;
  emoji: string;
  label: string;
  hoverColor: string;
  activeColor: string;
  ringColor: string;
  selectedColor: string;
}

const EMOTION_OPTIONS: EmotionOption[] = [
  {
    value: "MOVED",
    emoji: "😍",
    label: "감동",
    hoverColor: "hover:bg-red-50",
    activeColor: "active:bg-red-100",
    ringColor: "focus-visible:ring-red-300",
    selectedColor: "bg-red-100 ring-2 ring-red-300",
  },
  {
    value: "HAPPY",
    emoji: "😊",
    label: "기쁨",
    hoverColor: "hover:bg-yellow-50",
    activeColor: "active:bg-yellow-100",
    ringColor: "focus-visible:ring-yellow-300",
    selectedColor: "bg-yellow-100 ring-2 ring-yellow-300",
  },
  {
    value: "WORRIED",
    emoji: "😟",
    label: "고민",
    hoverColor: "hover:bg-blue-50",
    activeColor: "active:bg-blue-100",
    ringColor: "focus-visible:ring-blue-300",
    selectedColor: "bg-blue-100 ring-2 ring-blue-300",
  },
  {
    value: "SAD",
    emoji: "😢",
    label: "슬픔",
    hoverColor: "hover:bg-indigo-50",
    activeColor: "active:bg-indigo-100",
    ringColor: "focus-visible:ring-indigo-300",
    selectedColor: "bg-indigo-100 ring-2 ring-indigo-300",
  },
  {
    value: "ANGRY",
    emoji: "😡",
    label: "분노",
    hoverColor: "hover:bg-orange-50",
    activeColor: "active:bg-orange-100",
    ringColor: "focus-visible:ring-orange-300",
    selectedColor: "bg-orange-100 ring-2 ring-orange-300",
  },
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
    <section className="rounded-2xl border border-line-200 bg-white px-6 py-8 shadow-sm">
      <h2 className="mb-6 text-center text-lg font-semibold text-black-700">
        오늘의 감정은 어떤가요?
      </h2>
      <ul className="flex items-center justify-center gap-2 tablet:gap-8" role="list">
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
                className={`
                  group flex flex-col items-center gap-1.5
                  rounded-xl p-1.5 tablet:p-2 transition-all duration-200
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                  disabled:cursor-not-allowed disabled:opacity-50
                  ${isSelected ? option.selectedColor : `${option.hoverColor} ${option.activeColor} ${option.ringColor}`}
                `}
              >
                <span
                  className={`text-3xl tablet:text-4xl transition-transform duration-200 ${isSelected ? "scale-125" : "group-hover:scale-125 group-active:scale-110"}`}
                  role="img"
                  aria-hidden="true"
                >
                  {option.emoji}
                </span>
                <span
                  className={`text-xs font-medium transition-colors duration-200 ${isSelected ? "text-black-700 font-semibold" : "text-black-300 group-hover:text-black-600"}`}
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
