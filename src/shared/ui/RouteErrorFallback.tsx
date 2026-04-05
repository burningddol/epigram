"use client";

import type { ReactElement } from "react";

import Link from "next/link";

import { AlertTriangle } from "lucide-react";

import { EmptyState } from "@/shared/ui/EmptyState";

interface RouteErrorFallbackProps {
  reset: () => void;
}

export function RouteErrorFallback({ reset }: RouteErrorFallbackProps): ReactElement {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6">
      <EmptyState
        icon={
          <AlertTriangle className="h-7 w-7 text-red-400" strokeWidth={1.5} aria-hidden="true" />
        }
        title="오류가 발생했습니다"
        description="일시적인 오류입니다. 잠시 후 다시 시도해 주세요."
        action={
          <div className="flex gap-3">
            <button
              type="button"
              onClick={reset}
              className="inline-flex h-9 items-center justify-center rounded-xl border border-black-400 px-5 text-xs font-semibold text-black-500 transition-all duration-200 hover:bg-black-500 hover:text-white active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black-500 focus-visible:ring-offset-1"
            >
              다시 시도
            </button>
            <Link
              href="/epigrams"
              className="inline-flex h-9 items-center justify-center rounded-xl bg-black-500 px-5 text-xs font-semibold text-white transition-all duration-200 hover:bg-black-600 active:scale-95"
            >
              홈으로
            </Link>
          </div>
        }
      />
    </div>
  );
}
