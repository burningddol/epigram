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

interface RecentSearchChipProps {
  keyword: string;
  onSelect: (keyword: string) => void;
  onRemove: (keyword: string) => void;
}

function RecentSearchChip({ keyword, onSelect, onRemove }: RecentSearchChipProps): ReactElement {
  return (
    <li className="group flex items-center gap-0.5 rounded-full bg-blue-200/60 px-3 py-1.5 text-sm text-black-600 transition-all duration-150 hover:bg-blue-200 hover:text-black-900 pc:px-4 pc:py-2 pc:text-sm">
      <button
        type="button"
        onClick={() => onSelect(keyword)}
        className="max-w-[120px] truncate leading-none pc:max-w-[160px]"
      >
        {keyword}
      </button>
      <button
        type="button"
        aria-label={`"${keyword}" 검색어 삭제`}
        onClick={(e) => {
          e.stopPropagation();
          onRemove(keyword);
        }}
        className="ml-1 flex items-center text-blue-400 opacity-60 transition-opacity duration-150 hover:text-black-500 hover:opacity-100 group-hover:opacity-100"
      >
        <X size={11} strokeWidth={2.5} />
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
    <div className="flex w-full flex-col gap-6 pc:gap-8">
      {/* 언더라인 스타일 검색 입력 */}
      <div className="group relative flex items-center border-b-2 border-blue-300 pb-2 transition-colors duration-200 focus-within:border-black-700 pc:pb-3">
        <input
          type="search"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="검색어를 입력하세요"
          autoComplete="off"
          className="h-10 w-full bg-transparent pr-10 text-base text-black-950 outline-none placeholder:text-blue-400
            tablet:h-12 tablet:text-lg tablet:pr-12
            pc:h-16 pc:pr-14 pc:text-2xl"
        />
        <button
          type="button"
          aria-label="검색"
          onClick={() => onSearch(inputValue)}
          className="absolute right-0 flex items-center justify-center text-blue-400 transition-all duration-150 hover:scale-110 hover:text-black-700 active:scale-95 pc:[&>svg]:h-7 pc:[&>svg]:w-7"
        >
          <Search size={20} strokeWidth={2} className="tablet:h-6 tablet:w-6" />
        </button>
      </div>

      {/* 최근 검색어 */}
      {recentSearches.length > 0 && (
        <div className="animate-fade-in flex flex-col gap-3 pc:gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-black-600 pc:text-base">최근 검색어</span>
            <button
              type="button"
              onClick={onClearAllRecent}
              className="text-xs text-blue-400 transition-colors duration-150 hover:text-black-600 pc:text-sm"
            >
              모두 지우기
            </button>
          </div>
          <ul className="flex flex-wrap gap-2 pc:gap-2.5">
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
      )}
    </div>
  );
}
