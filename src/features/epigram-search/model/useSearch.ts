"use client";

import { useState, useCallback } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { useRecentSearches } from "./useRecentSearches";

interface UseSearchResult {
  inputValue: string;
  activeKeyword: string;
  recentSearches: string[];
  handleInputChange: (value: string) => void;
  handleSearch: (keyword: string) => void;
  removeRecentSearch: (keyword: string) => void;
  clearAllRecentSearches: () => void;
}

export function useSearch(): UseSearchResult {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialKeyword = searchParams.get("keyword") ?? "";

  const [inputValue, setInputValue] = useState(initialKeyword);
  const [activeKeyword, setActiveKeyword] = useState(initialKeyword);

  const { recentSearches, addRecentSearch, removeRecentSearch, clearAllRecentSearches } =
    useRecentSearches();

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
  }, []);

  const handleSearch = useCallback(
    (keyword: string) => {
      const trimmed = keyword.trim();
      if (!trimmed) return;

      setInputValue(trimmed);
      setActiveKeyword(trimmed);
      addRecentSearch(trimmed);

      const params = new URLSearchParams(searchParams.toString());
      params.set("keyword", trimmed);
      router.push(`/search?${params.toString()}`);
    },
    [router, searchParams, addRecentSearch]
  );

  return {
    inputValue,
    activeKeyword,
    recentSearches,
    handleInputChange,
    handleSearch,
    removeRecentSearch,
    clearAllRecentSearches,
  };
}
