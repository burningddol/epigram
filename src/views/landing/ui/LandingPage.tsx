import type { ReactElement } from "react";

import { ChevronDown } from "lucide-react";
import Link from "next/link";

export function LandingPage(): ReactElement {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <EmotionSection />
      <EpigramsSection />
      <CtaSection />
    </div>
  );
}

function HeroSection(): ReactElement {
  return (
    <section className="relative flex min-h-[calc(100dvh-52px)] flex-col items-center justify-center gap-6 overflow-hidden px-6 py-16 text-center">
      {/* 배경 depth — 중앙으로 갈수록 밝아지는 radial gradient */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 40%, #eceff4 0%, #f5f7fa 100%)",
        }}
        aria-hidden="true"
      />

      {/* 장식용 대형 인용부호 */}
      <span
        className="pointer-events-none absolute left-2 top-8 select-none font-serif text-[140px] leading-none text-blue-300 opacity-40 tablet:left-10 tablet:text-[220px]"
        aria-hidden="true"
      >
        {"\u201C"}
      </span>

      <div className="relative flex flex-col items-center gap-6 animate-fade-in-up">
        <div className="flex flex-col gap-3">
          <h1 className="font-serif text-2xl font-normal leading-tight text-black-500 tablet:text-4xl desktop:text-5xl">
            나만 갖고 있기엔
            <br />
            아까운 글이 있지 않나요?
          </h1>
          <p className="font-serif text-sm text-black-300 tablet:text-base">
            다른 사람들과 감정을 공유해 보세요.
          </p>
        </div>
        <Link
          href="/epigrams"
          className="inline-flex h-12 w-32 items-center justify-center rounded-xl bg-black-500 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:bg-black-600 hover:shadow-md active:scale-95"
        >
          시작하기
        </Link>
      </div>

      <div className="absolute bottom-8 flex flex-col items-center gap-1">
        <span className="text-xs font-semibold text-blue-400">더 알아보기</span>
        <ChevronDown size={24} className="animate-bounce text-blue-400" aria-hidden="true" />
      </div>
    </section>
  );
}

function EmotionSection(): ReactElement {
  return (
    <section className="flex flex-col items-center gap-10 px-6 py-16 tablet:px-[72px] desktop:px-[120px]">
      <div className="w-full max-w-sm rounded-2xl bg-blue-200 px-6 py-8">
        <div className="mb-6 flex flex-wrap gap-3">
          {EMOTION_TAGS.map((tag) => (
            <span key={tag} className="font-serif text-xl text-blue-400">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex justify-center gap-2">
          {EMOTION_BADGES.map(({ emoji, label }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-400 text-2xl transition-transform duration-200 hover:-translate-y-1">
                {emoji}
              </div>
              <span className="text-xs font-semibold text-gray-400">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EpigramsSection(): ReactElement {
  return (
    <section className="mx-auto w-full max-w-5xl flex flex-col gap-10 px-6 py-16 tablet:px-[72px]">
      <h2 className="text-2xl font-bold text-black-950 tablet:text-3xl">
        사용자들이 직접
        <br />
        인용한 에피그램들
      </h2>
      <ul className="flex flex-col gap-4">
        {SAMPLE_EPIGRAMS.map((item, index) => (
          <li
            key={item.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 0.12}s` }}
          >
            <div className="flex flex-col gap-1 rounded-2xl border-l-2 border-blue-500 bg-white px-6 py-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <p className="font-serif text-sm leading-relaxed text-black-600">{item.content}</p>
              <p className="font-serif text-sm text-blue-400">{item.author}</p>
            </div>
            <div className="mt-2 flex gap-2 px-2">
              {item.tags.map((tag) => (
                <span key={tag} className="font-serif text-xs text-blue-400">
                  #{tag}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function CtaSection(): ReactElement {
  return (
    <section className="flex flex-col items-center gap-8 bg-blue-950 px-6 py-20 tablet:px-[72px] desktop:px-[120px]">
      <div className="flex flex-col items-center gap-2">
        <span className="font-serif text-xs uppercase tracking-widest text-blue-500">
          every day
        </span>
        <div className="flex flex-col items-center leading-snug">
          <span className="font-serif text-3xl font-bold text-white">날마다</span>
          <span className="font-serif text-3xl font-bold text-blue-300">에피그램</span>
        </div>
      </div>
      <Link
        href="/epigrams"
        className="inline-flex h-12 w-32 items-center justify-center rounded-xl border border-blue-400 text-base font-semibold text-white transition-all duration-200 hover:bg-white hover:text-blue-950 active:scale-95"
      >
        시작하기
      </Link>
    </section>
  );
}

const EMOTION_TAGS = ["#우울해요", "#슬플때에필로그", "#위로가", "#마음이착잡할때"] as const;

const EMOTION_BADGES = [
  { emoji: "🤩", label: "감동" },
  { emoji: "😊", label: "기쁨" },
  { emoji: "🤔", label: "고민" },
  { emoji: "😢", label: "슬픔" },
] as const;

const SAMPLE_EPIGRAMS = [
  {
    id: 1,
    content: "오랫동안 꿈을 그리는 사람은 마침내 그 꿈을 닮아 간다.",
    author: "- 앙드레 말로 -",
    tags: ["나아가야할때", "꿈을이루고싶을때"],
  },
  {
    id: 2,
    content:
      "이 세상에는 위대한 진실이 하나 있어. 무언가를 온 마음을 다해 원하면, 반드시 그렇게 된다.",
    author: "- 파울로 코엘료 -",
    tags: ["나아가야할때", "꿈을이루고싶을때"],
  },
  {
    id: 3,
    content: "오랫동안 꿈을 그리는 사람은 마침내 그 꿈을 닮아 간다.",
    author: "- 앙드레 말로 -",
    tags: ["나아가야할때", "꿈을이루고싶을때"],
  },
] as const;
