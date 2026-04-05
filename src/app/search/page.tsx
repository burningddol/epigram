import { type ReactElement, Suspense } from "react";

import { SearchPage } from "@/views/search";

export const dynamic = "force-dynamic";

export default function Page(): ReactElement {
  return (
    <Suspense>
      <SearchPage />
    </Suspense>
  );
}
