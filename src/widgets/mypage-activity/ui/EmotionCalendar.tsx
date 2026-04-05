"use client";

import { useMemo, useState } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import { useMonthlyEmotions } from "@/entities/emotion-log/api/useMonthlyEmotions";
import type { Emotion } from "@/entities/emotion-log/model/schema";

const EMOTION_EMOJI: Record<Emotion, string> = {
  MOVED: "🥹",
  HAPPY: "😊",
  WORRIED: "😟",
  SAD: "😔",
  ANGRY: "😡",
};

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

// Stable reference date — does not change during a session
const TODAY = new Date();
const TODAY_DATE_KEY = TODAY.toLocaleDateString("sv");

interface EmotionCalendarProps {
  userId: number;
}

export function EmotionCalendar({ userId }: EmotionCalendarProps): React.ReactElement {
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

  function renderTileContent({
    date,
    view,
  }: {
    date: Date;
    view: string;
  }): React.ReactElement | null {
    if (view !== "month") return null;

    const dateKey = date.toLocaleDateString("sv");
    const emotion = emotionByDate.get(dateKey);
    if (!emotion) return null;

    return (
      <span className="absolute inset-0 flex items-center justify-center text-lg leading-none">
        {EMOTION_EMOJI[emotion]}
      </span>
    );
  }

  return (
    <section className="w-full rounded-2xl bg-white px-6 py-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-black-700">
          {year}년 {month}월
        </h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="이전 달"
            onClick={handlePrevMonth}
            className="flex h-8 w-8 items-center justify-center rounded-full text-black-300 transition-colors hover:bg-blue-200 hover:text-black-600"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="다음 달"
            onClick={handleNextMonth}
            className="flex h-8 w-8 items-center justify-center rounded-full text-black-300 transition-colors hover:bg-blue-200 hover:text-black-600"
          >
            <ChevronRight className="h-4 w-4" />
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

      <style>{`
        .emotion-calendar {
          font-family: inherit;
          width: 100%;
        }
        .emotion-calendar .react-calendar__month-view__weekdays {
          text-align: center;
        }
        .emotion-calendar .react-calendar__month-view__weekdays__weekday {
          padding: 6px 0;
          font-size: 12px;
          font-weight: 500;
          color: #787878;
        }
        .emotion-calendar .react-calendar__month-view__weekdays__weekday abbr {
          text-decoration: none;
        }
        .emotion-calendar .react-calendar__tile {
          position: relative;
          aspect-ratio: 1;
          padding: 0;
          font-size: 12px;
          color: #454545;
          background: transparent;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s;
        }
        .emotion-calendar .react-calendar__tile:hover {
          background: #eceff4;
          border-radius: 50%;
        }
        .emotion-calendar .react-calendar__tile--now {
          background: transparent;
        }
        .emotion-calendar .react-calendar__tile--today-custom {
          box-shadow: inset 0 0 0 1.5px #e46e80;
          border-radius: 8px;
          color: #e46e80;
          font-weight: 600;
        }
        .emotion-calendar .react-calendar__tile--active {
          background: transparent;
          color: inherit;
        }
        .emotion-calendar .react-calendar__month-view__days__day--neighboringMonth {
          color: #c4c4c4;
        }
        .emotion-calendar .react-calendar__navigation {
          display: none;
        }
      `}</style>
    </section>
  );
}
