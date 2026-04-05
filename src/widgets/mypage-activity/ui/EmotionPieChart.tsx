"use client";

import { useMemo } from "react";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import type { Emotion, EmotionLog } from "@/entities/emotion-log/model/schema";

interface EmotionMeta {
  label: string;
  emoji: string;
  color: string;
}

// Emojis and labels aligned with EmotionSelector to ensure consistency across the UI
const EMOTION_META: Record<Emotion, EmotionMeta> = {
  MOVED: { label: "감동", emoji: "🥹", color: "#48bb98" },
  HAPPY: { label: "기쁨", emoji: "😊", color: "#fbc85b" },
  WORRIED: { label: "고민", emoji: "😟", color: "#8e80e3" },
  SAD: { label: "슬픔", emoji: "😔", color: "#5195ee" },
  ANGRY: { label: "분노", emoji: "😡", color: "#e46e80" },
};

const EMOTION_ORDER: Emotion[] = ["MOVED", "HAPPY", "WORRIED", "SAD", "ANGRY"];

interface ChartDatum {
  emotion: Emotion;
  count: number;
  percentage: number;
}

function buildChartData(emotionLogs: EmotionLog[]): ChartDatum[] {
  const counts = new Map<Emotion, number>();

  for (const log of emotionLogs) {
    counts.set(log.emotion, (counts.get(log.emotion) ?? 0) + 1);
  }

  const total = emotionLogs.length;

  return EMOTION_ORDER.filter((emotion) => counts.has(emotion)).map((emotion) => {
    const count = counts.get(emotion)!;
    return {
      emotion,
      count,
      percentage: Math.round((count / total) * 100),
    };
  });
}

interface EmotionPieChartProps {
  emotionLogs: EmotionLog[];
}

export function EmotionPieChart({ emotionLogs }: EmotionPieChartProps): React.ReactElement {
  const chartData = useMemo(() => buildChartData(emotionLogs), [emotionLogs]);

  if (chartData.length === 0) {
    return (
      <section className="flex w-full flex-col rounded-2xl bg-white px-5 py-5 shadow-sm ring-1 ring-line-200">
        <h2 className="mb-4 text-sm font-semibold text-black-700">감정 기록</h2>
        <div className="flex flex-1 flex-col items-center justify-center gap-2 py-8">
          <span className="text-4xl">📭</span>
          <p className="text-sm text-black-300">이번 달 감정 기록이 없어요</p>
        </div>
      </section>
    );
  }

  const topEmotion = chartData.reduce((max, d) => (d.count > max.count ? d : max));

  return (
    <section className="w-full rounded-2xl bg-white px-5 py-5 shadow-sm ring-1 ring-line-200">
      <h2 className="mb-4 text-sm font-semibold text-black-700">감정 기록</h2>

      <div className="flex items-center gap-6">
        {/* Donut chart */}
        <div className="relative h-[130px] w-[130px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={58}
                dataKey="count"
                startAngle={90}
                endAngle={-270}
                strokeWidth={0}
                isAnimationActive={true}
                animationBegin={0}
                animationDuration={600}
              >
                {chartData.map(({ emotion }) => (
                  <Cell key={emotion} fill={EMOTION_META[emotion].color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl leading-none">{EMOTION_META[topEmotion.emotion].emoji}</span>
            <span className="mt-1 text-xs font-semibold text-black-500">
              {topEmotion.percentage}%
            </span>
          </div>
        </div>

        {/* Legend */}
        <ul className="flex flex-1 flex-col gap-2.5">
          {chartData.map(({ emotion, percentage }) => (
            <li key={emotion} className="flex items-center gap-2.5">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: EMOTION_META[emotion].color }}
              />
              <span className="w-10 text-xs text-black-400">{EMOTION_META[emotion].label}</span>
              <div className="relative flex-1 overflow-hidden rounded-full bg-line-100 h-1.5">
                <div
                  className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: EMOTION_META[emotion].color,
                  }}
                />
              </div>
              <span className="w-8 text-right text-xs font-semibold text-black-600">
                {percentage}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
