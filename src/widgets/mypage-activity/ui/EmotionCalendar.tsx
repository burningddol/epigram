"use client";

import { useMemo, useState, type ReactElement } from "react";

import Image from "next/image";

import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

import { useMonthlyEmotions } from "@/entities/emotion-log";

import type { Emotion } from "@/entities/emotion-log";

const EMOTION_ICONS: Record<Emotion, string> = {
  MOVED: "/icon/012-heart face.png",
  HAPPY: "/icon/035-smiling face.png",
  WORRIED: "/icon/044-thinking.png",
  SAD: "/icon/034-sad.png",
  ANGRY: "/icon/Frame 65.png",
};

const EMOTION_LABELS: Record<Emotion, string> = {
  MOVED: "감동",
  HAPPY: "기쁨",
  WORRIED: "고민",
  SAD: "슬픔",
  ANGRY: "분노",
};

const EMOTION_ORDER: Emotion[] = ["MOVED", "HAPPY", "WORRIED", "SAD", "ANGRY"];
const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

const TODAY = new Date();
const TODAY_YEAR = TODAY.getFullYear();
const TODAY_MONTH = TODAY.getMonth() + 1;
const TODAY_DATE = TODAY.getDate();

interface CalendarCell {
  day: number;
  isCurrentMonth: boolean;
  dateKey: string;
}

function buildCalendarCells(year: number, month: number): CalendarCell[] {
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const daysInPrevMonth = new Date(year, month - 1, 0).getDate();

  const cells: CalendarCell[] = [];

  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    cells.push({
      day,
      isCurrentMonth: false,
      dateKey: `${prevYear}-${String(prevMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      day: d,
      isCurrentMonth: true,
      dateKey: `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
    });
  }

  const remainder = cells.length % 7;
  if (remainder !== 0) {
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    const toAdd = 7 - remainder;
    for (let i = 1; i <= toAdd; i++) {
      cells.push({
        day: i,
        isCurrentMonth: false,
        dateKey: `${nextYear}-${String(nextMonth).padStart(2, "0")}-${String(i).padStart(2, "0")}`,
      });
    }
  }

  return cells;
}

interface MonthNavigationProps {
  onPrev: () => void;
  onNext: () => void;
  size?: "sm" | "md";
}

function MonthNavigation({ onPrev, onNext, size = "md" }: MonthNavigationProps): ReactElement {
  const btnClass =
    size === "sm"
      ? "flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-background active:scale-90"
      : "flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-background active:scale-90";
  const iconClass = size === "sm" ? "h-4 w-4 text-black-600" : "h-5 w-5 text-black-600";

  return (
    <div className="flex items-center gap-2">
      <button type="button" aria-label="이전 달" onClick={onPrev} className={btnClass}>
        <ChevronLeft className={iconClass} strokeWidth={2.5} />
      </button>
      <button type="button" aria-label="다음 달" onClick={onNext} className={btnClass}>
        <ChevronRight className={iconClass} strokeWidth={2.5} />
      </button>
    </div>
  );
}

interface EmotionCalendarProps {
  userId: number;
}

export function EmotionCalendar({ userId }: EmotionCalendarProps): ReactElement {
  const [year, setYear] = useState(TODAY_YEAR);
  const [month, setMonth] = useState(TODAY_MONTH);
  const [filterEmotion, setFilterEmotion] = useState<Emotion | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: emotionLogs = [] } = useMonthlyEmotions({ userId, year, month });

  const emotionByDate = useMemo(
    () =>
      new Map<string, Emotion>(
        emotionLogs.map((log) => {
          const dateKey = new Date(log.createdAt).toLocaleDateString("sv");
          return [dateKey, log.emotion];
        })
      ),
    [emotionLogs]
  );

  const cells = useMemo(() => buildCalendarCells(year, month), [year, month]);

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

  function handleFilterSelect(emotion: Emotion | null): void {
    setFilterEmotion(emotion);
    setIsFilterOpen(false);
  }

  function isToday(cell: CalendarCell): boolean {
    return (
      cell.isCurrentMonth && year === TODAY_YEAR && month === TODAY_MONTH && cell.day === TODAY_DATE
    );
  }

  function getVisibleEmotion(cell: CalendarCell): Emotion | undefined {
    const emotion = emotionByDate.get(cell.dateKey);
    if (!emotion) return undefined;
    if (filterEmotion && emotion !== filterEmotion) return undefined;
    return emotion;
  }

  const filterLabel = filterEmotion ? EMOTION_LABELS[filterEmotion] : "없음";

  return (
    <section className="w-full rounded-2xl bg-white px-6 py-6 shadow-sm ring-1 ring-blue-200">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-2 tablet:mb-6 tablet:flex-row tablet:items-center tablet:justify-between">
        {/* Row 1: 연월 + 네비게이션 */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-black-600 tablet:text-xl">
            {year}년 {month}월
          </h2>

          {/* Navigation (모바일: 연월 오른쪽, tablet+: 헤더 우측) */}
          <div className="tablet:hidden">
            <MonthNavigation onPrev={handlePrevMonth} onNext={handleNextMonth} size="sm" />
          </div>
        </div>

        {/* Row 2 (모바일) / Row 1 우측 (tablet+): 필터 + 네비게이션 */}
        <div className="flex items-center justify-between tablet:justify-end tablet:gap-3">
          {/* Filter dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsFilterOpen((v) => !v)}
              className="flex items-center gap-1 rounded-xl bg-background px-3 py-1.5 text-xs font-semibold text-gray-200 transition hover:bg-blue-200 tablet:text-sm"
            >
              필터: {filterLabel}
              <ChevronDown className="h-3.5 w-3.5 tablet:h-4 tablet:w-4" />
            </button>

            {isFilterOpen && (
              <ul className="absolute left-0 top-full z-10 mt-1 min-w-[110px] rounded-xl border border-blue-200 bg-white py-1 shadow-md">
                <li>
                  <button
                    type="button"
                    onClick={() => handleFilterSelect(null)}
                    className={[
                      "w-full px-4 py-2 text-left text-sm hover:bg-background",
                      filterEmotion === null ? "font-semibold text-illust-green" : "text-black-500",
                    ].join(" ")}
                  >
                    없음
                  </button>
                </li>
                {EMOTION_ORDER.map((emotion) => (
                  <li key={emotion}>
                    <button
                      type="button"
                      onClick={() => handleFilterSelect(emotion)}
                      className={[
                        "flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-background",
                        filterEmotion === emotion
                          ? "font-semibold text-illust-green"
                          : "text-black-500",
                      ].join(" ")}
                    >
                      <Image
                        src={EMOTION_ICONS[emotion]}
                        alt={EMOTION_LABELS[emotion]}
                        width={20}
                        height={20}
                        className="h-5 w-5"
                      />
                      {EMOTION_LABELS[emotion]}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Navigation (tablet+만 표시) */}
          <div className="hidden tablet:block">
            <MonthNavigation onPrev={handlePrevMonth} onNext={handleNextMonth} />
          </div>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 border-l border-t border-blue-200">
        {/* Weekday header */}
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="flex items-center justify-center border-b border-r border-blue-200 py-3"
          >
            <span className="text-sm font-semibold text-gray-200 tablet:text-base">{label}</span>
          </div>
        ))}

        {/* Day cells */}
        {cells.map((cell, index) => {
          const emotion = getVisibleEmotion(cell);
          const today = isToday(cell);

          return (
            <div
              key={`${cell.dateKey}-${index}`}
              className={[
                "relative flex flex-col items-center justify-center border-b border-r border-blue-200 py-1",
                "min-h-[52px] tablet:min-h-[72px] pc:min-h-[91px]",
                today ? "ring-2 ring-inset ring-illust-red" : "",
                !cell.isCurrentMonth ? "bg-background/60" : "bg-white",
              ].join(" ")}
            >
              {emotion ? (
                <>
                  <span className="text-xs font-bold leading-none text-gray-200 tablet:text-sm">
                    {cell.day}
                  </span>
                  <Image
                    src={EMOTION_ICONS[emotion]}
                    alt={EMOTION_LABELS[emotion]}
                    width={36}
                    height={36}
                    className="mt-1 h-6 w-6 tablet:h-8 tablet:w-8 pc:h-9 pc:w-9"
                  />
                </>
              ) : (
                <span
                  className={[
                    "text-sm font-semibold tablet:text-lg pc:text-xl",
                    cell.isCurrentMonth ? "text-gray-200" : "text-gray-100/60",
                  ].join(" ")}
                >
                  {cell.day}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
