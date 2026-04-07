"use client";

import { useMemo, useState, type ReactElement } from "react";

import Image from "next/image";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { EMOTION_META, useMonthlyEmotions } from "@/entities/emotion-log";
import { cn } from "@/shared/lib/cn";

import type { Emotion } from "@/entities/emotion-log";

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

// Stable reference date — does not change during a session
const TODAY = new Date();
const TODAY_DATE_KEY = TODAY.toLocaleDateString("sv");

function buildCalendarDays(year: number, month: number): (Date | null)[] {
  const firstDow = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  const days: (Date | null)[] = Array.from({ length: firstDow }, () => null);
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(new Date(year, month - 1, d));
  }
  while (days.length % 7 !== 0) {
    days.push(null);
  }
  return days;
}

interface EmotionCalendarProps {
  userId: number;
}

export function EmotionCalendar({ userId }: EmotionCalendarProps): ReactElement {
  const [year, setYear] = useState(TODAY.getFullYear());
  const [month, setMonth] = useState(TODAY.getMonth() + 1);

  const { data: emotionLogs = [] } = useMonthlyEmotions({ userId, year, month });

  const emotionByDate = useMemo(
    () =>
      new Map<string, Emotion>(
        emotionLogs.map((log) => {
          // "sv" locale produces ISO date strings (YYYY-MM-DD)
          const dateKey = new Date(log.createdAt).toLocaleDateString("sv");
          return [dateKey, log.emotion];
        })
      ),
    [emotionLogs]
  );

  const calendarDays = useMemo(() => buildCalendarDays(year, month), [year, month]);

  function handlePrevMonth(): void {
    if (month === 1) {
      setYear((y) => y - 1);
      setMonth(12);
    } else {
      setMonth((m) => m - 1);
    }
  }

  function handleNextMonth(): void {
    if (month === 12) {
      setYear((y) => y + 1);
      setMonth(1);
    } else {
      setMonth((m) => m + 1);
    }
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-black-800">
          {year}년 {String(month).padStart(2, "0")}월
        </h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="이전 달"
            onClick={handlePrevMonth}
            className="flex h-9 w-9 items-center justify-center rounded-full text-black-700 transition-all duration-150 hover:bg-blue-100 active:scale-90"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="다음 달"
            onClick={handleNextMonth}
            className="flex h-9 w-9 items-center justify-center rounded-full text-black-700 transition-all duration-150 hover:bg-blue-100 active:scale-90"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="flex aspect-square items-center justify-center border border-[#eceff4] bg-white"
          >
            <span className="text-2xl font-semibold text-[#c4c4c4]">{label}</span>
          </div>
        ))}

        {calendarDays.map((date, i) => {
          if (date === null) {
            return (
              <div key={`empty-${i}`} className="aspect-square border border-[#eceff4] bg-white" />
            );
          }

          const dateKey = date.toLocaleDateString("sv");
          const emotion = emotionByDate.get(dateKey) ?? null;
          const isToday = dateKey === TODAY_DATE_KEY;

          return (
            <div
              key={dateKey}
              className={cn(
                "flex aspect-square flex-col items-center justify-center gap-2 bg-white",
                isToday ? "rounded-sm border-[6px] border-[#ff6577]" : "border border-[#eceff4]"
              )}
            >
              <span
                className={cn(
                  "leading-none",
                  emotion !== null ? "text-base font-bold" : "text-2xl font-semibold",
                  isToday ? "text-[#ff6577]" : "text-[#c4c4c4]"
                )}
              >
                {date.getDate()}
              </span>
              {emotion !== null && (
                <Image
                  src={EMOTION_META[emotion].icon}
                  alt={EMOTION_META[emotion].label}
                  width={36}
                  height={36}
                  className="h-9 w-9"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
