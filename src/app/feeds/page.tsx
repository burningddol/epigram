import type { ReactElement } from "react";

import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

import { fetchEpigramsPageServer } from "@/entities/epigram/api/server";
import { FeedsPage, FEEDS_PAGE_SIZE } from "@/views/feeds";

export default async function FeedsRoute(): Promise<ReactElement> {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 60 * 1000 } },
  });

  await queryClient
    .prefetchInfiniteQuery({
      queryKey: ["epigrams", { limit: FEEDS_PAGE_SIZE, keyword: undefined, writerId: undefined }],
      queryFn: ({ pageParam }) =>
        fetchEpigramsPageServer({
          limit: FEEDS_PAGE_SIZE,
          pageParam: pageParam as number | undefined,
        }),
      initialPageParam: undefined as number | undefined,
    })
    .catch(() => {});

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FeedsPage />
    </HydrationBoundary>
  );
}
