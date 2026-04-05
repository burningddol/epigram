import { Suspense } from "react";

import { SearchPage } from "@/views/search";

// 검색 페이지는 URL searchParams 기반이므로 force-dynamic
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense>
      <SearchPage />
    </Suspense>
  );
}
