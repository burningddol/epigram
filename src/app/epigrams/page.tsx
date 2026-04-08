import type { ReactElement } from "react";

import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

import { fetchRecentCommentsPageServer } from "@/entities/comment/api/server";
import { fetchEpigramsPageServer, fetchTodayEpigramServer } from "@/entities/epigram/api/server";
import { EpigramsPage } from "@/views/epigrams";

// Must match the values used in EpigramFeed and RecentComments widgets
const FEED_PAGE_SIZE = 5;
const COMMENTS_PAGE_SIZE = 4;

export default async function Page(): Promise<ReactElement> {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 60 * 1000 } },
  });

  await Promise.all([
    queryClient
      .prefetchQuery({
        queryKey: ["epigrams", "today"],
        queryFn: fetchTodayEpigramServer,
      })
      .catch(() => {}),
    queryClient
      .prefetchInfiniteQuery({
        queryKey: ["epigrams", { limit: FEED_PAGE_SIZE, keyword: undefined, writerId: undefined }],
        queryFn: ({ pageParam }) =>
          fetchEpigramsPageServer({
            limit: FEED_PAGE_SIZE,
            pageParam: pageParam as number | undefined,
          }),
        initialPageParam: undefined as number | undefined,
      })
      .catch(() => {}),
    queryClient
      .prefetchInfiniteQuery({
        queryKey: ["comments", { limit: COMMENTS_PAGE_SIZE }],
        queryFn: ({ pageParam }) =>
          fetchRecentCommentsPageServer({
            limit: COMMENTS_PAGE_SIZE,
            pageParam: pageParam as number | undefined,
          }),
        initialPageParam: undefined as number | undefined,
      })
      .catch(() => {}),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EpigramsPage />
    </HydrationBoundary>
  );
}
