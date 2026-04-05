"use client";

import { type ReactElement, type ReactNode, useMemo } from "react";

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

function buildHighlightedSegments(text: string, regex: RegExp): ReactNode {
  // Regex split creates alternating text/match parts; odd indices are the highlighted matches
  const parts = text.split(regex);

  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <mark
        key={index}
        className="rounded-sm bg-transparent px-0 font-semibold text-blue-700 not-italic"
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
}

function HighlightedText({ text, keyword }: HighlightedTextProps): ReactElement {
  const regex = useMemo(() => {
    if (!keyword.trim()) return null;
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(${escaped})`, "i");
  }, [keyword]);

  if (!regex) return <>{text}</>;
  return <>{buildHighlightedSegments(text, regex)}</>;
}

interface TagListProps {
  tags: Epigram["tags"];
  keyword: string;
}

function TagList({ tags, keyword }: TagListProps): ReactElement | null {
  if (tags.length === 0) return null;

  return (
    <ul
      className="flex flex-wrap items-center justify-end gap-x-2.5 gap-y-1"
      aria-label="태그 목록"
    >
      {tags.map((tag) => (
        <li key={tag.id}>
          <span className="text-xs font-medium text-blue-500 transition-colors duration-150 group-hover:text-blue-600 pc:text-sm">
            #<HighlightedText text={tag.name} keyword={keyword} />
          </span>
        </li>
      ))}
    </ul>
  );
}

export function SearchResultItem({ epigram, keyword }: SearchResultItemProps): ReactElement {
  // 피그마 시안: "- 저자 -" 혹은 "- 저자 《출처》 -" 형식, 좌측 배치
  const authorLabel = epigram.referenceTitle
    ? `${epigram.author} 《${epigram.referenceTitle}》`
    : epigram.author;

  return (
    <Link
      href={`/epigrams/${epigram.id}`}
      className="group block border-b border-line-100 px-1 py-6 transition-colors duration-150 last:border-0 hover:bg-blue-100/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-inset
        tablet:px-2 tablet:py-7
        pc:px-3 pc:py-9"
    >
      <article className="flex flex-col gap-3 pc:gap-4">
        {/* 에피그램 본문 */}
        <p
          className="font-serif text-sm leading-relaxed text-black-700 transition-colors duration-150 group-hover:text-black-950
            tablet:text-base tablet:leading-loose
            pc:text-lg pc:leading-loose"
        >
          <HighlightedText text={epigram.content} keyword={keyword} />
        </p>

        {/* 피그마 레이아웃: 좌측 저자 / 우측 태그 한 행 */}
        <div className="flex items-start justify-between gap-4">
          <footer className="shrink-0 text-xs text-black-300 pc:text-sm">- {authorLabel} -</footer>
          <TagList tags={epigram.tags} keyword={keyword} />
        </div>
      </article>
    </Link>
  );
}
