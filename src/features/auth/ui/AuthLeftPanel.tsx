import type { ReactElement } from "react";

export function AuthLeftPanel(): ReactElement {
  return (
    <div className="hidden tablet:flex tablet:w-[380px] pc:w-[420px] desktop:w-[460px] flex-col justify-between bg-blue-950 p-12">
      <span className="font-serif text-xl font-black tracking-tight text-white">Epigram</span>

      <div className="flex flex-col gap-5">
        <span
          className="font-serif leading-none text-blue-400"
          style={{ fontSize: "80px" }}
          aria-hidden="true"
        >
          {"\u201C"}
        </span>
        <p className="font-serif text-xl leading-relaxed text-blue-100">
          나만 갖고 있기엔
          <br />
          아까운 글이 있지 않나요?
        </p>
        <p className="font-serif text-sm text-blue-500">— Epigram</p>
      </div>

      <p className="text-xs tracking-wide text-blue-600">다른 사람들과 감정을 공유해 보세요</p>
    </div>
  );
}
