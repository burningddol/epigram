"use client";

import { useEffect } from "react";
import type { ReactElement } from "react";

import { useQueryErrorResetBoundary } from "@tanstack/react-query";

import { RouteErrorFallback } from "@/shared/ui/RouteErrorFallback";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps): ReactElement {
  const { reset: resetQueries } = useQueryErrorResetBoundary();

  useEffect(() => {
    console.error(error);
  }, [error]);

  function handleReset(): void {
    resetQueries();
    reset();
  }

  return <RouteErrorFallback reset={handleReset} />;
}
