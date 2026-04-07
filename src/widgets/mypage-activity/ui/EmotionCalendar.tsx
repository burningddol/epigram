"use client";

import { useMemo, useState, type ReactElement } from "react";

import Image from "next/image";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import { EMOTION_META, useMonthlyEmotions } from "@/entities/emotion-log";

import type { Emotion } from "@/entities/emotion-log";

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

// Stable reference date — does not change during a session
const TODAY = new Date();
const TODAY_DATE_KEY = TODAY.toLocaleDateString("sv");

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

  const activeStartDate = new Date(year, month - 1, 1);

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

  function renderTileContent({ date, view }: { date: Date; view: string }): ReactElement | null {
    if (view !== "month") return null;

    const dateKey = date.toLocaleDateString("sv");
    const emotion = emotionByDate.get(dateKey);
    if (!emotion) return null;

    return (
      <span className="absolute inset-0 flex items-center justify-center">
        <Image
          src={EMOTION_META[emotion].icon}
          alt={EMOTION_META[emotion].label}
          width={28}
          height={28}
          className="h-7 w-7"
        />
      </span>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-black-800">
          {year}년 {String(month).padStart(2, "0")}월
        </h2>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            aria-label="이전 달"
            onClick={handlePrevMonth}
            className="flex h-8 w-8 items-center justify-center rounded-full text-black-400 transition-all duration-150 hover:bg-blue-100 hover:text-blue-700 active:scale-90"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="다음 달"
            onClick={handleNextMonth}
            className="flex h-8 w-8 items-center justify-center rounded-full text-black-400 transition-all duration-150 hover:bg-blue-100 hover:text-blue-700 active:scale-90"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <Calendar
        activeStartDate={activeStartDate}
        showNavigation={false}
        view="month"
        maxDetail="month"
        minDetail="month"
        calendarType="gregory"
        locale="ko-KR"
        formatShortWeekday={(_, date) => WEEKDAY_LABELS[date.getDay()]}
        formatDay={(_, date) => String(date.getDate())}
        tileContent={renderTileContent}
        tileClassName={({ date, view }) => {
          if (view !== "month") return null;
          return date.toLocaleDateString("sv") === TODAY_DATE_KEY
            ? "react-calendar__tile--today-custom"
            : null;
        }}
        className="emotion-calendar w-full border-none"
      />
    </div>
  );
}
