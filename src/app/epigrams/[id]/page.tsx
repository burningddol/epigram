import type { ReactElement } from "react";

import { EpigramDetailPage } from "@/views/epigram-detail";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps): Promise<ReactElement> {
  const { id } = await params;
  return <EpigramDetailPage epigramId={Number(id)} />;
}
