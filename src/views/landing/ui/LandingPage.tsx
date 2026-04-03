import { cookies } from "next/headers";
import Link from "next/link";

export async function LandingPage() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has("accessToken");
  const ctaHref = isLoggedIn ? "/epigrams" : "/login";

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="flex min-h-[calc(100dvh-52px)] flex-col items-center justify-center gap-6 px-6 py-16 text-center">
        <div className="flex flex-col gap-2">
          <h1 className="font-serif text-2xl font-normal leading-tight text-black-500 tablet:text-4xl desktop:text-5xl">
            나만 갖고 있기엔
            <br />
            아까운 글이 있지 않나요?
          </h1>
          <p className="font-serif text-sm text-black-300 tablet:text-base desktop:text-lg">
            다른 사람들과 감정을 공유해 보세요.
          </p>
        </div>
        <Link
          href={ctaHref}
          className="inline-flex h-12 w-28 items-center justify-center rounded-xl bg-black-500 text-base font-semibold text-white transition-colors hover:bg-black-600"
        >
          시작하기
        </Link>
      </section>

      {/* Sample epigrams */}
      <section className="flex flex-col gap-6 px-6 py-16">
        <h2 className="text-2xl font-bold text-black-950 tablet:text-3xl">
          사용자들이 직접
          <br />
          인용한 에피그램들
        </h2>
        <ul className="flex flex-col gap-4">
          {SAMPLE_EPIGRAMS.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-2 rounded-2xl bg-white px-6 py-6 shadow-sm"
            >
              <div className="flex flex-col gap-1">
                <p className="font-serif text-sm leading-relaxed text-black-600">{item.content}</p>
                <p className="font-serif text-sm text-blue-400">{item.author}</p>
              </div>
              <div className="flex gap-2">
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
    </div>
  );
}

const SAMPLE_EPIGRAMS = [
  {
    id: 1,
    content: "오랫동안 꿈을 그리는 사람은 마침내 그 꿈을 닮아 간다.",
    author: "- 앙드레 말로 -",
    tags: ["나아가야할때", "꿈을이루고싶을때"],
  },
  {
    id: 2,
    content: "삶이 있는 한 희망은 있다.",
    author: "- 키케로 -",
    tags: ["힘들때", "버티고싶을때"],
  },
  {
    id: 3,
    content:
      "우리가 겪는 가장 큰 영광은 한 번도 실패하지 않는 것이 아니라, 실패할 때마다 다시 일어서는 것이다.",
    author: "- 공자 -",
    tags: ["포기하고싶을때", "힘들때"],
  },
] as const;
