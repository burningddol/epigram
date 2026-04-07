"use client";

import type { ReactElement, ReactNode } from "react";

import { isServer, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

interface QueryProviderProps {
  children: ReactNode;
}

function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 1,
        throwOnError: true,
      },
    },
  });
}

// 브라우저에서는 싱글톤 유지 — Next.js App Router 페이지 이동 시 QueryProvider가
// 언마운트/리마운트되더라도 캐시가 초기화되지 않는다.
// 서버에서는 요청별로 새 인스턴스를 생성해 요청 간 캐시 공유를 방지한다.
let browserQueryClient: QueryClient | undefined;

function getQueryClient(): QueryClient {
  if (isServer) {
    return makeQueryClient();
  }

  if (browserQueryClient == null) {
    browserQueryClient = makeQueryClient();
  }

  return browserQueryClient;
}

export function QueryProvider({ children }: QueryProviderProps): ReactElement {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
