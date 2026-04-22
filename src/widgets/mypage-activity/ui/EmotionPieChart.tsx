"use client";

import { type ReactElement } from "react";

import Image from "next/image";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import type { Emotion, EmotionLog } from "@/entities/emotion-log";

interface EmotionMeta {
  label: string;
  icon: string;
  color: string;
}

const EMOTION_META: Record<Emotion, EmotionMeta> = {
  MOVED: { label: "감동", icon: "/icon/012-heart face.png", color: "#48bb98" },
  HAPPY: { label: "기쁨", icon: "/icon/035-smiling face.png", color: "#fbc85b" },
  WORRIED: { label: "고민", icon: "/icon/044-thinking.png", color: "#8e80e3" },
  SAD: { label: "슬픔", icon: "/icon/034-sad.png", color: "#5195ee" },
  ANGRY: { label: "분노", icon: "/icon/Frame 65.png", color: "#e46e80" },
};

const EMOTION_ORDER: Emotion[] = ["MOVED", "HAPPY", "WORRIED", "SAD", "ANGRY"];

interface ChartDatum {
  emotion: Emotion;
  count: number;
  percentage: number;
}

function findTopEmotion(chartData: ChartDatum[]): ChartDatum {
  let top = chartData[0];
  for (const datum of chartData) {
    if (datum.count > top.count) {
      top = datum;
    }
  }
  return top;
}

function buildChartData(emotionLogs: EmotionLog[]): ChartDatum[] {
  if (emotionLogs.length === 0) return [];

  const counts = new Map<Emotion, number>();
  for (const log of emotionLogs) {
    counts.set(log.emotion, (counts.get(log.emotion) ?? 0) + 1);
  }

  const total = emotionLogs.length;
  const result: ChartDatum[] = [];
  for (const emotion of EMOTION_ORDER) {
    const count = counts.get(emotion);
    if (count === undefined) continue;
    result.push({
      emotion,
      count,
      percentage: Math.round((count / total) * 100),
    });
  }
  return result;
}

interface EmotionPieChartProps {
  emotionLogs: EmotionLog[];
}

export function EmotionPieChart({ emotionLogs }: EmotionPieChartProps): ReactElement {
  const chartData = buildChartData(emotionLogs);

  if (chartData.length === 0) {
    return (
      <section className="flex w-full flex-col rounded-2xl bg-white px-6 py-6 shadow-sm ring-1 ring-blue-200">
        <h2 className="mb-4 text-xl font-semibold text-black-600">감정 차트</h2>
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-10">
          <Image
            src="/icon/035-smiling face.png"
            alt="감정 없음"
            width={48}
            height={48}
            className="h-12 w-12 opacity-30"
          />
          <p className="text-sm text-gray-300">이번 달 감정 기록이 없어요</p>
        </div>
      </section>
    );
  }

  const topEmotion = findTopEmotion(chartData);

  return (
    <section className="w-full rounded-2xl bg-white px-6 py-6 shadow-sm ring-1 ring-blue-200">
      <h2 className="mb-6 text-xl font-semibold text-black-600">감정 차트</h2>

      <div className="flex items-center gap-8">
        {/* Donut chart */}
        <div className="relative h-[140px] w-[140px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={44}
                outerRadius={62}
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

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1">
            <Image
              src={EMOTION_META[topEmotion.emotion].icon}
              alt={EMOTION_META[topEmotion.emotion].label}
              width={36}
              height={36}
              className="h-9 w-9"
            />
            <span className="text-xs font-semibold text-black-500">
              {EMOTION_META[topEmotion.emotion].label}
            </span>
          </div>
        </div>

        {/* Legend */}
        <ul className="flex flex-1 flex-col gap-3">
          {chartData.map(({ emotion, percentage }) => (
            <li key={emotion} className="flex items-center gap-3">
              <Image
                src={EMOTION_META[emotion].icon}
                alt={EMOTION_META[emotion].label}
                width={24}
                height={24}
                className="h-6 w-6 shrink-0"
              />
              <span className="w-8 shrink-0 text-sm text-black-400">
                {EMOTION_META[emotion].label}
              </span>
              <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-blue-200">
                <div
                  className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: EMOTION_META[emotion].color,
                  }}
                />
              </div>
              <span className="w-9 shrink-0 text-right text-sm font-semibold text-black-600">
                {percentage}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
