"use client";

import { type ReactElement, type ReactNode } from "react";

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

interface TagListProps {
  tags: Epigram["tags"];
  keyword: string;
}

function buildKeywordRegex(keyword: string): RegExp | null {
  const trimmed = keyword.trim();
  if (!trimmed) return null;
  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(${escaped})`, "i");
}

function renderHighlightedParts(text: string, regex: RegExp): ReactNode {
  // split은 매칭/비매칭을 번갈아 반환 — 홀수 index가 하이라이트할 매칭 부분.
  return text.split(regex).map((part, index) => {
    if (index % 2 === 0) return part;
    return (
      <mark key={index} className="bg-transparent px-0 font-semibold text-illust-blue not-italic">
        {part}
      </mark>
    );
  });
}

function HighlightedText({ text, keyword }: HighlightedTextProps): ReactElement {
  const regex = buildKeywordRegex(keyword);
  if (!regex) return <>{text}</>;
  return <>{renderHighlightedParts(text, regex)}</>;
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

function getAuthorLabel(epigram: Epigram): string {
  if (!epigram.referenceTitle) return epigram.author;
  return `${epigram.author} 《${epigram.referenceTitle}》`;
}

export function SearchResultItem({ epigram, keyword }: SearchResultItemProps): ReactElement {
  const authorLabel = getAuthorLabel(epigram);

  return (
    <Link
      href={`/epigrams/${epigram.id}`}
      className="group block border-b border-gray-100 py-6 transition-colors duration-150 hover:bg-blue-100/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-inset"
    >
      <article className="font-serif flex flex-col items-end gap-4">
        <div className="flex w-full flex-col gap-6">
          <p className=" break-all text-xl font-medium text-black-600">
            <HighlightedText text={epigram.content} keyword={keyword} />
          </p>
          <p className="text-xl font-medium text-blue-400">- {authorLabel} -</p>
        </div>

        <TagList tags={epigram.tags} keyword={keyword} />
      </article>
    </Link>
  );
}
