// Server-only: DO NOT import in client components
import { BACKEND_BASE } from "@/shared/config/backend";

import { buildEpigramListParams } from "./buildListParams";
import { epigramListResponseSchema, epigramSchema } from "../model/schema";

import type { Epigram, EpigramListResponse } from "../model/schema";

interface FetchEpigramsPageParams {
  limit: number;
  pageParam?: number;
  keyword?: string;
  writerId?: number;
}

export async function fetchEpigramsPageServer(
  args: FetchEpigramsPageParams
): Promise<EpigramListResponse> {
  const params = buildEpigramListParams(args);
  const res = await fetch(`${BACKEND_BASE}/epigrams?${params}`, {
    next: { revalidate: 30, tags: ["epigrams"] },
    signal: AbortSignal.timeout(5000),
  });

  if (!res.ok) throw new Error(`Failed to fetch epigrams: ${res.status}`);
  return epigramListResponseSchema.parse(await res.json());
}

export async function fetchTodayEpigramServer(): Promise<Epigram | null> {
  const res = await fetch(`${BACKEND_BASE}/epigrams/today`, {
    next: { revalidate: 60, tags: ["epigrams", "epigrams-today"] },
    signal: AbortSignal.timeout(5000),
  });

  if (!res.ok) return null;

  const data: unknown = await res.json();
  if (data == null || typeof data !== "object") return null;
  return epigramSchema.parse(data);
}
