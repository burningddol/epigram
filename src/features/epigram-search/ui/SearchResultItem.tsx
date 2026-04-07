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
      <mark key={index} className="bg-transparent px-0 font-semibold text-illust-blue not-italic">
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
    <ul className="flex flex-wrap gap-3" aria-label="태그 목록">
      {tags.map((tag) => (
        <li key={tag.id}>
          <span className="text-xl text-blue-400">
            #<HighlightedText text={tag.name} keyword={keyword} />
          </span>
        </li>
      ))}
    </ul>
  );
}

export function SearchResultItem({ epigram, keyword }: SearchResultItemProps): ReactElement {
  const authorLabel = epigram.referenceTitle
    ? `${epigram.author} 《${epigram.referenceTitle}》`
    : epigram.author;

  return (
    <Link
      href={`/epigrams/${epigram.id}`}
      className="group block border-b border-gray-100 py-6 transition-colors duration-150 hover:bg-blue-100/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-inset"
    >
      <article className="flex flex-col items-end gap-4">
        <div className="flex w-full flex-col gap-6">
          <p className="font-serif break-all text-xl font-medium text-black-600">
            <HighlightedText text={epigram.content} keyword={keyword} />
          </p>
          <p className="text-xl font-medium text-blue-400">- {authorLabel} -</p>
        </div>

        <TagList tags={epigram.tags} keyword={keyword} />
      </article>
    </Link>
  );
}
