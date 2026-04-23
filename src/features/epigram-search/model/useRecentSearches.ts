import { useEffect, useState, startTransition } from "react";

const STORAGE_KEY = "epigram_recent_searches";
const MAX_RECENT_SEARCHES = 10;

interface UseRecentSearchesResult {
  recentSearches: string[];
  addRecentSearch: (keyword: string) => void;
  clearAllRecentSearches: () => void;
}

function loadFromStorage(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveToStorage(searches: string[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
}

export function useRecentSearches(): UseRecentSearchesResult {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // 초기 로드는 SSR/hydration mismatch 방지를 위해 마운트 이후에 수행.
  // startTransition으로 우선순위를 낮춰 입력 포커스 등 긴급 업데이트가 우선되도록 양보한다.
  useEffect(() => {
    startTransition(() => {
      setRecentSearches(loadFromStorage());
    });
  }, []);

  function addRecentSearch(keyword: string): void {
    const trimmed = keyword.trim();
    if (!trimmed) return;

    setRecentSearches((prev) => {
      const next = [trimmed, ...prev.filter((k) => k !== trimmed)].slice(0, MAX_RECENT_SEARCHES);
      saveToStorage(next);
      return next;
    });
  }

  function clearAllRecentSearches(): void {
    saveToStorage([]);
    setRecentSearches([]);
  }

  return { recentSearches, addRecentSearch, clearAllRecentSearches };
}
