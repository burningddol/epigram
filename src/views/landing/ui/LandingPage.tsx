import { ChevronDown } from "lucide-react";
import Link from "next/link";

export function LandingPage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <EmotionSection />
      <EpigramsSection />
      <CtaSection />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative flex min-h-[calc(100dvh-52px)] flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-col gap-2">
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
          className="inline-flex h-12 w-28 items-center justify-center rounded-xl bg-black-500 text-base font-semibold text-white transition-colors hover:bg-black-600"
        >
          시작하기
        </Link>
      </div>

      <div className="absolute bottom-8 flex flex-col items-center gap-1">
        <span className="text-xs font-semibold text-blue-400">더 알아보기</span>
        <ChevronDown size={24} className="text-blue-400" aria-hidden="true" />
      </div>
    </section>
  );
}

function EmotionSection() {
  return (
    <section className="flex flex-col items-center gap-10 px-6 py-16 tablet:px-[72px]">
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
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-400 text-2xl">
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

function EpigramsSection() {
  return (
    <section className="flex flex-col gap-10 px-6 py-16 tablet:px-[72px]">
      <h2 className="text-2xl font-bold text-black-950 tablet:text-3xl">
        사용자들이 직접
        <br />
        인용한 에피그램들
      </h2>
      <ul className="flex flex-col gap-4">
        {SAMPLE_EPIGRAMS.map((item) => (
          <li key={item.id} className="flex flex-col gap-2">
            <div className="flex flex-col gap-1 rounded-2xl bg-white px-6 py-6">
              <p className="font-serif text-sm leading-relaxed text-black-600">{item.content}</p>
              <p className="font-serif text-sm text-blue-400">{item.author}</p>
            </div>
            <div className="flex gap-2 px-2">
              {item.tags.map((tag) => (
                <span key={tag} className="font-serif text-sm text-blue-400">
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

function CtaSection() {
  return (
    <section className="flex flex-col items-center gap-8 px-6 py-16 tablet:px-[72px]">
      <div className="flex flex-col items-center leading-snug">
        <span className="font-serif text-2xl font-bold text-black-600">날마다</span>
        <span className="font-serif text-2xl font-bold text-black-600">에피그램</span>
      </div>
      <Link
        href="/epigrams"
        className="inline-flex h-12 w-28 items-center justify-center rounded-xl bg-black-500 text-base font-semibold text-white transition-colors hover:bg-black-600"
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
