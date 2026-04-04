import type { ReactElement } from "react";

import { EpigramEditPage } from "@/views/epigram-edit";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps): Promise<ReactElement> {
  const { id } = await params;
  return <EpigramEditPage epigramId={Number(id)} />;
}
