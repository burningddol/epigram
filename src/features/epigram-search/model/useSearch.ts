"use client";

import { useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { useRecentSearches } from "./useRecentSearches";

interface UseSearchResult {
  inputValue: string;
  activeKeyword: string;
  recentSearches: string[];
  handleInputChange: (value: string) => void;
  handleSearch: (keyword: string) => void;
  clearAllRecentSearches: () => void;
}

export function useSearch(): UseSearchResult {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL이 단일 진실 공급원 — 별도 상태 없이 직접 파생
  const activeKeyword = searchParams.get("keyword") ?? "";

  const [inputValue, setInputValue] = useState(activeKeyword);

  const { recentSearches, addRecentSearch, clearAllRecentSearches } = useRecentSearches();

  function handleInputChange(value: string): void {
    setInputValue(value);
  }

  function handleSearch(keyword: string): void {
    const trimmed = keyword.trim();
    if (!trimmed) return;

    setInputValue(trimmed);
    addRecentSearch(trimmed);

    const params = new URLSearchParams(searchParams.toString());
    params.set("keyword", trimmed);
    router.push(`/search?${params.toString()}`);
  }

  return {
    inputValue,
    activeKeyword,
    recentSearches,
    handleInputChange,
    handleSearch,
    clearAllRecentSearches,
  };
}
