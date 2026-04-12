import type { ReactElement } from "react";

import Image from "next/image";
import Link from "next/link";

import { ChevronDown } from "lucide-react";

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

      <div className="relative flex flex-col items-center gap-8 animate-fade-in-up">
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
        {/* border + fill-on-hover premium CTA */}
        <Link
          href="/epigrams"
          className="inline-flex h-12 w-36 items-center justify-center rounded-xl border border-blue-950 bg-blue-950 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-transparent hover:text-blue-950 hover:shadow-md active:scale-95"
        >
          시작하기
        </Link>
      </div>

      <div className="absolute bottom-8 flex flex-col items-center gap-1">
        <span className="text-xs font-semibold tracking-[0.2em] text-blue-400 uppercase">
          scroll
        </span>
        <ChevronDown size={20} className="animate-bounce text-blue-400" aria-hidden="true" />
      </div>
    </section>
  );
}

function EmotionSection(): ReactElement {
  return (
    <section className="flex flex-col items-center gap-10 bg-blue-200 px-6 py-20 tablet:px-[72px] desktop:px-[120px]">
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="font-serif text-xs uppercase tracking-[0.2em] text-blue-500">
          감정을 담다
        </span>
        <h2 className="font-serif text-2xl font-normal text-blue-950 tablet:text-3xl">
          오늘의 감정에 맞는 에피그램
        </h2>
      </div>

      <div className="w-full max-w-md rounded-2xl bg-white/60 px-8 py-8 shadow-sm backdrop-blur-sm">
        <div className="mb-6 flex flex-wrap gap-2">
          {EMOTION_TAGS.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-blue-300/60 px-3 py-1 font-serif text-sm text-blue-700"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex justify-center gap-3">
          {EMOTION_BADGES.map(({ icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 md:w-14 md:h-14 items-center justify-center rounded-xl bg-blue-200 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                <Image src={icon} alt={label} width={32} height={32} className="h-8 w-8" />
              </div>
              <span className="text-xs font-medium text-blue-600">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EpigramsSection(): ReactElement {
  return (
    <section className="mx-auto w-full max-w-5xl flex flex-col gap-10 px-6 py-20 tablet:px-[72px]">
      <div className="flex flex-col gap-1">
        <span className="font-serif text-xs uppercase tracking-[0.2em] text-blue-400">
          community
        </span>
        <h2 className="font-serif text-2xl font-normal text-black-800 tablet:text-3xl">
          사용자들이 직접
          <br />
          인용한 에피그램들
        </h2>
      </div>
      <ul className="flex flex-col gap-4">
        {SAMPLE_EPIGRAMS.map((item, index) => (
          <li
            key={item.id}
            className="flex min-w-0 flex-col items-end gap-2 animate-fade-in-up"
            style={{ animationDelay: `${index * 0.12}s` }}
          >
            <div className="relative w-full overflow-hidden rounded-2xl border border-line-100 bg-white p-6 shadow-[0px_3px_12px_0_rgba(0,0,0,0.04)] transition-shadow duration-200 hover:shadow-md">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(180deg, transparent 0px, transparent 24px, #f2f2f2 24px, #f2f2f2 25px)",
                  backgroundPositionY: "1px",
                }}
              />
              <div className="relative flex flex-col gap-5 font-serif">
                <p className="break-all text-base font-medium leading-relaxed text-black-600 tablet:text-lg pc:text-xl">
                  {item.content}
                </p>
                <p className="break-all text-right text-base font-medium text-blue-400 tablet:text-lg pc:text-xl">
                  - {item.author} -
                </p>
              </div>
            </div>
            <div className="flex flex-wrap justify-end gap-3">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-serif text-sm font-medium text-blue-400 tablet:text-base pc:text-lg"
                >
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
    <section className="relative flex flex-col items-center gap-8 overflow-hidden bg-blue-950 px-6 py-24 tablet:px-[72px] desktop:px-[120px]">
      {/* 미묘한 radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 60%, rgba(107,130,169,0.18) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative flex flex-col items-center gap-2">
        <span className="font-serif text-xs uppercase tracking-[0.25em] text-blue-500">
          every day
        </span>
        <div className="flex flex-col items-center leading-snug">
          <span className="font-serif text-3xl font-light text-white">날마다</span>
          <span className="font-serif text-3xl font-bold text-blue-300">에피그램</span>
        </div>
        <p className="mt-2 font-serif text-sm text-blue-600">
          좋은 글귀 하나가 하루를 바꿀 수 있습니다
        </p>
      </div>

      <Link
        href="/epigrams"
        className="relative inline-flex h-12 w-36 items-center justify-center rounded-xl border border-blue-400/60 text-sm font-semibold text-white transition-all duration-300 hover:border-white hover:bg-white/10 active:scale-95"
      >
        시작하기
      </Link>
    </section>
  );
}

const EMOTION_TAGS = ["#우울해요", "#슬플때에필로그", "#위로가", "#마음이착잡할때"] as const;

const EMOTION_BADGES = [
  { icon: "/icon/012-heart face.png", label: "감동" },
  { icon: "/icon/035-smiling face.png", label: "기쁨" },
  { icon: "/icon/044-thinking.png", label: "고민" },
  { icon: "/icon/034-sad.png", label: "슬픔" },
  { icon: "/icon/Frame 65.png", label: "분노" },
] as const;

const SAMPLE_EPIGRAMS = [
  {
    id: 1,
    content: "오랫동안 꿈을 그리는 사람은 마침내 그 꿈을 닮아 간다.",
    author: "앙드레 말로",
    tags: ["나아가야할때", "꿈을이루고싶을때"],
  },
  {
    id: 2,
    content:
      "이 세상에는 위대한 진실이 하나 있어. 무언가를 온 마음을 다해 원하면, 반드시 그렇게 된다.",
    author: "파울로 코엘료",
    tags: ["나아가야할때", "꿈을이루고싶을때"],
  },
  {
    id: 3,
    content: "당신이 꿈꿀 수 있다면, 이룰 수도 있다.",
    author: "월트 디즈니",
    tags: ["영감", "꿈"],
  },
] as const;
