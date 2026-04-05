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
  MOVED: { label: "감동", emoji: "😍", color: "#48bb98" },
  HAPPY: { label: "기쁨", emoji: "😊", color: "#fbc85b" },
  WORRIED: { label: "고민", emoji: "😟", color: "#8e80e3" },
  SAD: { label: "슬픔", emoji: "😢", color: "#5195ee" },
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
      <section className="w-full rounded-2xl bg-white px-6 py-5">
        <h2 className="mb-4 text-base font-semibold text-black-700">감정 기록</h2>
        <p className="text-center text-sm text-black-300">이번 달 감정 기록이 없어요.</p>
      </section>
    );
  }

  const topEmotion = chartData.reduce((max, d) => (d.count > max.count ? d : max));

  return (
    <section className="w-full rounded-2xl bg-white px-6 py-5">
      <h2 className="mb-4 text-base font-semibold text-black-700">감정 기록</h2>

      <div className="flex items-center gap-6">
        <div className="relative h-[120px] w-[120px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={38}
                outerRadius={55}
                dataKey="count"
                startAngle={90}
                endAngle={-270}
                strokeWidth={0}
              >
                {chartData.map(({ emotion }) => (
                  <Cell key={emotion} fill={EMOTION_META[emotion].color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl leading-none">{EMOTION_META[topEmotion.emotion].emoji}</span>
            <span className="mt-0.5 text-[10px] font-medium text-black-300">
              {EMOTION_META[topEmotion.emotion].label}
            </span>
          </div>
        </div>

        <ul className="flex flex-col gap-2">
          {chartData.map(({ emotion, percentage }) => (
            <li key={emotion} className="flex items-center gap-2 text-sm">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: EMOTION_META[emotion].color }}
              />
              <span className="w-12 text-black-400">{EMOTION_META[emotion].label}</span>
              <span className="font-semibold text-black-600">{percentage}%</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
