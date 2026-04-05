"use client";

import type { ReactElement, ReactNode } from "react";

import Link from "next/link";

import type { Epigram } from "@/entities/epigram";

interface SearchResultItemProps {
  epigram: Epigram;
  keyword: string;
}

interface HighlightedTextProps {
  text: string;
  keyword: string;
}

function buildHighlightedSegments(text: string, keyword: string): ReactNode {
  if (!keyword.trim()) return text;

  const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Capturing group in split → odd-indexed parts are always the matches
  const parts = text.split(new RegExp(`(${escapedKeyword})`, "i"));

  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <mark
        key={index}
        className="rounded bg-yellow-100 px-0.5 font-medium text-yellow-800 not-italic"
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
}

function HighlightedText({ text, keyword }: HighlightedTextProps): ReactElement {
  return <>{buildHighlightedSegments(text, keyword)}</>;
}

interface TagListProps {
  tags: Epigram["tags"];
  keyword: string;
}

function TagList({ tags, keyword }: TagListProps): ReactElement | null {
  if (tags.length === 0) return null;

  return (
    <ul className="mt-4 flex flex-wrap gap-2" aria-label="태그 목록">
      {tags.map((tag) => (
        <li key={tag.id}>
          <span className="rounded-full bg-blue-200 px-3 py-1 text-xs font-medium text-blue-700">
            #<HighlightedText text={tag.name} keyword={keyword} />
          </span>
        </li>
      ))}
    </ul>
  );
}

export function SearchResultItem({ epigram, keyword }: SearchResultItemProps): ReactElement {
  return (
    <Link
      href={`/epigrams/${epigram.id}`}
      className="group block rounded-2xl border border-line-200 bg-white px-6 py-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
    >
      <article>
        <blockquote>
          <p className="font-serif text-base leading-relaxed text-black-700 transition-colors duration-200 group-hover:text-black-900">
            <HighlightedText text={epigram.content} keyword={keyword} />
          </p>
          <footer className="mt-3 text-right text-sm text-black-300">
            —{" "}
            {epigram.referenceTitle
              ? `${epigram.author} 《${epigram.referenceTitle}》`
              : epigram.author}
          </footer>
        </blockquote>
        <TagList tags={epigram.tags} keyword={keyword} />
      </article>
    </Link>
  );
}
