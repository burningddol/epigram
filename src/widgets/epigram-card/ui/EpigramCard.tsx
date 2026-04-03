"use client";

import type { ReactElement } from "react";

import Link from "next/link";

import type { Epigram } from "@/entities/epigram";

interface EpigramCardProps {
  epigram: Epigram;
  /** 강조 표시 (오늘의 에피그램 등) */
  isFeatured?: boolean;
}

interface EpigramAttributionProps {
  author: string;
  referenceTitle: string | null;
}

function EpigramAttribution({ author, referenceTitle }: EpigramAttributionProps): ReactElement {
  const citation = referenceTitle ? `${author} 《${referenceTitle}》` : author;

  return <footer className="mt-3 text-right text-sm text-black-300">— {citation}</footer>;
}

interface EpigramTagListProps {
  tags: Epigram["tags"];
}

function EpigramTagList({ tags }: EpigramTagListProps): ReactElement | null {
  if (tags.length === 0) return null;

  return (
    <ul className="mt-4 flex flex-wrap gap-2" aria-label="태그 목록">
      {tags.map((tag) => (
        <li key={tag.id}>
          <span className="rounded-full bg-blue-200 px-3 py-1 text-xs font-medium text-blue-700 transition-colors duration-150 hover:bg-blue-300">
            #{tag.name}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function EpigramCard({ epigram, isFeatured = false }: EpigramCardProps): ReactElement {
  const baseClasses =
    "group block rounded-2xl border bg-white px-6 py-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2";

  const featuredClasses = isFeatured
    ? "border-blue-300 shadow-sm shadow-blue-100 hover:border-blue-400 hover:shadow-blue-200"
    : "border-line-200 shadow-sm hover:border-blue-300";

  return (
    <Link href={`/epigrams/${epigram.id}`} className={`${baseClasses} ${featuredClasses}`}>
      <article>
        <blockquote>
          <p
            className={`font-serif leading-relaxed transition-colors duration-200 group-hover:text-black-900 ${
              isFeatured ? "text-lg text-black-800" : "text-base text-black-700"
            }`}
          >
            {epigram.content}
          </p>
          <EpigramAttribution author={epigram.author} referenceTitle={epigram.referenceTitle} />
        </blockquote>
        <EpigramTagList tags={epigram.tags} />
      </article>
    </Link>
  );
}
