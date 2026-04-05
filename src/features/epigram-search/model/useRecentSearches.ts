import { useState, useEffect, useCallback, startTransition } from "react";

const STORAGE_KEY = "epigram_recent_searches";
const MAX_RECENT_SEARCHES = 10;

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

interface UseRecentSearchesResult {
  recentSearches: string[];
  addRecentSearch: (keyword: string) => void;
  removeRecentSearch: (keyword: string) => void;
  clearAllRecentSearches: () => void;
}

export function useRecentSearches(): UseRecentSearchesResult {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load from localStorage after mount to avoid SSR/client hydration mismatch.
  // startTransition: marks this low-priority so React can yield to urgent updates (e.g. input focus)
  useEffect(() => {
    startTransition(() => {
      setRecentSearches(loadFromStorage());
    });
  }, []);

  const addRecentSearch = useCallback((keyword: string) => {
    const trimmed = keyword.trim();
    if (!trimmed) return;

    setRecentSearches((prev) => {
      const deduplicated = prev.filter((k) => k !== trimmed);
      const updated = [trimmed, ...deduplicated].slice(0, MAX_RECENT_SEARCHES);
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const removeRecentSearch = useCallback((keyword: string) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((k) => k !== keyword);
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const clearAllRecentSearches = useCallback(() => {
    saveToStorage([]);
    setRecentSearches([]);
  }, []);

  return { recentSearches, addRecentSearch, removeRecentSearch, clearAllRecentSearches };
}
