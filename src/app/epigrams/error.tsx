"use client";

import { useEffect } from "react";
import type { ReactElement } from "react";

import { RouteErrorFallback } from "@/shared/ui/RouteErrorFallback";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps): ReactElement {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <RouteErrorFallback reset={reset} />;
}
