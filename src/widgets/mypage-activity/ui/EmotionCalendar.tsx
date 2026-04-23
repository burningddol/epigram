"use client";

import { useState, type ReactElement } from "react";

import Image from "next/image";

import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

import { useMonthlyEmotions } from "@/entities/emotion-log";

import type { Emotion, EmotionLog } from "@/entities/emotion-log";

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

function formatDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function getPrevMonth(year: number, month: number): { year: number; month: number } {
  if (month === 1) return { year: year - 1, month: 12 };
  return { year, month: month - 1 };
}

function getNextMonth(year: number, month: number): { year: number; month: number } {
  if (month === 12) return { year: year + 1, month: 1 };
  return { year, month: month + 1 };
}

function buildCalendarCells(year: number, month: number): CalendarCell[] {
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const daysInPrevMonth = new Date(year, month - 1, 0).getDate();
  const prev = getPrevMonth(year, month);
  const next = getNextMonth(year, month);

  const cells: CalendarCell[] = [];

  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    cells.push({
      day,
      isCurrentMonth: false,
      dateKey: formatDateKey(prev.year, prev.month, day),
    });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({
      day,
      isCurrentMonth: true,
      dateKey: formatDateKey(year, month, day),
    });
  }

  const remainder = cells.length % 7;
  if (remainder === 0) return cells;

  const toAdd = 7 - remainder;
  for (let day = 1; day <= toAdd; day++) {
    cells.push({
      day,
      isCurrentMonth: false,
      dateKey: formatDateKey(next.year, next.month, day),
    });
  }

  return cells;
}

interface MonthNavigationProps {
  onPrev: () => void;
  onNext: () => void;
  size?: "sm" | "md";
}

const NAV_BUTTON_BASE =
  "flex items-center justify-center rounded-full transition hover:bg-background active:scale-90";

const NAV_SIZE_CLASSES: Record<"sm" | "md", { button: string; icon: string }> = {
  sm: { button: "h-8 w-8", icon: "h-4 w-4 text-black-600" },
  md: { button: "h-9 w-9", icon: "h-5 w-5 text-black-600" },
};

function MonthNavigation({ onPrev, onNext, size = "md" }: MonthNavigationProps): ReactElement {
  const { button, icon } = NAV_SIZE_CLASSES[size];
  const btnClass = `${NAV_BUTTON_BASE} ${button}`;

  return (
    <div className="flex items-center gap-2">
      <button type="button" aria-label="이전 달" onClick={onPrev} className={btnClass}>
        <ChevronLeft className={icon} strokeWidth={2.5} />
      </button>
      <button type="button" aria-label="다음 달" onClick={onNext} className={btnClass}>
        <ChevronRight className={icon} strokeWidth={2.5} />
      </button>
    </div>
  );
}

interface EmotionCalendarProps {
  userId: number;
}

function buildEmotionByDate(emotionLogs: EmotionLog[]): Map<string, Emotion> {
  const map = new Map<string, Emotion>();
  for (const log of emotionLogs) {
    const dateKey = new Date(log.createdAt).toLocaleDateString("sv");
    map.set(dateKey, log.emotion);
  }
  return map;
}

export function EmotionCalendar({ userId }: EmotionCalendarProps): ReactElement {
  const [year, setYear] = useState(TODAY_YEAR);
  const [month, setMonth] = useState(TODAY_MONTH);
  const [filterEmotion, setFilterEmotion] = useState<Emotion | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: emotionLogs = [] } = useMonthlyEmotions({ userId, year, month });

  const emotionByDate = buildEmotionByDate(emotionLogs);
  const cells = buildCalendarCells(year, month);

  function handlePrevMonth(): void {
    const prev = getPrevMonth(year, month);
    setYear(prev.year);
    setMonth(prev.month);
  }

  function handleNextMonth(): void {
    const next = getNextMonth(year, month);
    setYear(next.year);
    setMonth(next.month);
  }

  function handleFilterSelect(emotion: Emotion | null): void {
    setFilterEmotion(emotion);
    setIsFilterOpen(false);
  }

  function handleToggleFilter(): void {
    setIsFilterOpen((open) => !open);
  }

  function isToday(cell: CalendarCell): boolean {
    if (!cell.isCurrentMonth) return false;
    if (year !== TODAY_YEAR || month !== TODAY_MONTH) return false;
    return cell.day === TODAY_DATE;
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
              onClick={handleToggleFilter}
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
