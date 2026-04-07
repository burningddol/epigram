import type { ReactElement } from "react";

import Link from "next/link";

import type { Epigram } from "../model/schema";

interface EpigramListCardProps {
  epigram: Epigram;
}

export function EpigramListCard({ epigram }: EpigramListCardProps): ReactElement {
  return (
    <div className="flex flex-col items-end gap-2">
      <Link
        href={`/epigrams/${epigram.id}`}
        className="group relative w-full overflow-hidden rounded-2xl border border-line-100 bg-white p-6 transition-shadow duration-200 hover:shadow-md"
        style={{ boxShadow: "0px 3px 12px 0 rgba(0,0,0,0.04)" }}
      >
        {/* Decorative ruled lines */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(180deg, transparent 0px, transparent 24px, #f2f2f2 24px, #f2f2f2 25px)",
            backgroundPositionY: "1px",
          }}
        />

        <div className="font-serif relative flex flex-col gap-5">
          <p className="text-base font-medium leading-relaxed text-black-600 tablet:text-lg pc:text-xl">
            {epigram.content}
          </p>
          <p className="text-right text-base font-medium text-blue-400 tablet:text-lg pc:text-xl">
            - {epigram.author} -
          </p>
        </div>
      </Link>

      {epigram.tags.length > 0 && (
        <div className="flex flex-wrap justify-end gap-3">
          {epigram.tags.map((tag) => (
            <span
              key={tag.id}
              className="font-serif text-sm font-medium text-blue-400 tablet:text-base pc:text-lg"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
