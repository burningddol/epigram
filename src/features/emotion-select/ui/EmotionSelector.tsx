"use client";

import type { ReactElement } from "react";

import type { Emotion } from "@/entities/emotion-log";

import { useEmotionSelect } from "../model/useEmotionSelect";

interface EmotionOption {
  value: Emotion;
  emoji: string;
  label: string;
  hoverColor: string;
  activeColor: string;
  ringColor: string;
}

const EMOTION_OPTIONS: EmotionOption[] = [
  {
    value: "MOVED",
    emoji: "😍",
    label: "감동",
    hoverColor: "hover:bg-red-50",
    activeColor: "active:bg-red-100",
    ringColor: "focus-visible:ring-red-300",
  },
  {
    value: "HAPPY",
    emoji: "😊",
    label: "기쁨",
    hoverColor: "hover:bg-yellow-50",
    activeColor: "active:bg-yellow-100",
    ringColor: "focus-visible:ring-yellow-300",
  },
  {
    value: "WORRIED",
    emoji: "😟",
    label: "고민",
    hoverColor: "hover:bg-blue-50",
    activeColor: "active:bg-blue-100",
    ringColor: "focus-visible:ring-blue-300",
  },
  {
    value: "SAD",
    emoji: "😢",
    label: "슬픔",
    hoverColor: "hover:bg-indigo-50",
    activeColor: "active:bg-indigo-100",
    ringColor: "focus-visible:ring-indigo-300",
  },
  {
    value: "ANGRY",
    emoji: "😡",
    label: "분노",
    hoverColor: "hover:bg-orange-50",
    activeColor: "active:bg-orange-100",
    ringColor: "focus-visible:ring-orange-300",
  },
];

export function EmotionSelector(): ReactElement | null {
  const { hasSelectedToday, isSubmitting, selectEmotion } = useEmotionSelect();

  if (hasSelectedToday) return null;

  return (
    <section className="rounded-2xl border border-line-200 bg-white px-6 py-8 shadow-sm">
      <h2 className="mb-6 text-center text-lg font-semibold text-black-700">
        오늘의 감정은 어떤가요?
      </h2>
      <ul className="flex items-center justify-center gap-4 tablet:gap-8" role="list">
        {EMOTION_OPTIONS.map((option) => (
          <li key={option.value}>
            <button
              type="button"
              onClick={() => selectEmotion(option.value)}
              disabled={isSubmitting}
              aria-label={option.label}
              className={`
                group flex flex-col items-center gap-2
                rounded-xl p-2 transition-all duration-200
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                disabled:cursor-not-allowed disabled:opacity-50
                ${option.hoverColor} ${option.activeColor} ${option.ringColor}
              `}
            >
              <span
                className="text-4xl transition-transform duration-200 group-hover:scale-125 group-active:scale-110"
                role="img"
                aria-hidden="true"
              >
                {option.emoji}
              </span>
              <span className="text-xs font-medium text-black-300 transition-colors duration-200 group-hover:text-black-600">
                {option.label}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
