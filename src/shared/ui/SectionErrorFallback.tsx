"use client";

import type { ReactElement } from "react";

import { AlertTriangle } from "lucide-react";

interface SectionErrorFallbackProps {
  reset: () => void;
}

export function SectionErrorFallback({ reset }: SectionErrorFallbackProps): ReactElement {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-red-100 bg-red-50 py-10 text-center">
      <AlertTriangle className="h-5 w-5 text-red-400" strokeWidth={1.5} aria-hidden="true" />
      <p className="text-sm font-medium text-red-500">불러오지 못했습니다</p>
      <button
        type="button"
        onClick={reset}
        className="text-xs text-black-400 underline underline-offset-2 hover:text-black-600"
      >
        다시 시도
      </button>
    </div>
  );
}
