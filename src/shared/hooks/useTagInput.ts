"use client";

import { useState } from "react";

const MAX_TAG_COUNT = 3;
const MAX_TAG_LENGTH = 10;

interface UseTagInputReturn {
  tagInput: string;
  handleTagInputChange: (value: string) => void;
  handleAddTag: (currentTags: string[], onChange: (tags: string[]) => void) => void;
  handleRemoveTag: (tag: string, currentTags: string[], onChange: (tags: string[]) => void) => void;
}

export function useTagInput(): UseTagInputReturn {
  const [tagInput, setTagInput] = useState("");

  function handleTagInputChange(value: string): void {
    setTagInput(value.slice(0, MAX_TAG_LENGTH));
  }

  function handleAddTag(currentTags: string[], onChange: (tags: string[]) => void): void {
    const trimmed = tagInput.trim();
    if (!trimmed || currentTags.length >= MAX_TAG_COUNT || currentTags.includes(trimmed)) return;
    onChange([...currentTags, trimmed]);
    setTagInput("");
  }

  function handleRemoveTag(
    tag: string,
    currentTags: string[],
    onChange: (tags: string[]) => void
  ): void {
    onChange(currentTags.filter((t) => t !== tag));
  }

  return { tagInput, handleTagInputChange, handleAddTag, handleRemoveTag };
}
