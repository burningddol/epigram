"use client";

import { type KeyboardEvent, type ReactElement } from "react";

import { Search, X } from "lucide-react";

interface SearchBarProps {
  inputValue: string;
  recentSearches: string[];
  onInputChange: (value: string) => void;
  onSearch: (keyword: string) => void;
  onRemoveRecent: (keyword: string) => void;
  onClearAllRecent: () => void;
}

function RecentSearchChip({
  keyword,
  onSelect,
  onRemove,
}: {
  keyword: string;
  onSelect: (keyword: string) => void;
  onRemove: (keyword: string) => void;
}): ReactElement {
  return (
    <li className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-black-600">
      <button type="button" onClick={() => onSelect(keyword)} className="hover:text-black-950">
        {keyword}
      </button>
      <button
        type="button"
        aria-label={`${keyword} 검색어 삭제`}
        onClick={() => onRemove(keyword)}
        className="flex items-center text-blue-400 hover:text-black-500"
      >
        <X size={12} />
      </button>
    </li>
  );
}

export function SearchBar({
  inputValue,
  recentSearches,
  onInputChange,
  onSearch,
  onRemoveRecent,
  onClearAllRecent,
}: SearchBarProps): ReactElement {
  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>): void {
    if (e.key === "Enter") {
      onSearch(inputValue);
    }
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="relative flex items-center">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="검색어를 입력하세요"
          className="h-12 w-full rounded-full border border-blue-200 bg-white px-5 pr-12 text-sm text-black-950 outline-none placeholder:text-blue-300 focus:border-black-500"
        />
        <button
          type="button"
          aria-label="검색"
          onClick={() => onSearch(inputValue)}
          className="absolute right-4 text-blue-300 hover:text-black-500"
        >
          <Search size={20} />
        </button>
      </div>

      {recentSearches.length > 0 ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-black-600">최근 검색어</span>
            <button
              type="button"
              onClick={onClearAllRecent}
              className="text-xs text-blue-400 hover:text-black-500"
            >
              모두 제거
            </button>
          </div>
          <ul className="flex flex-wrap gap-2">
            {recentSearches.map((keyword) => (
              <RecentSearchChip
                key={keyword}
                keyword={keyword}
                onSelect={onSearch}
                onRemove={onRemoveRecent}
              />
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
