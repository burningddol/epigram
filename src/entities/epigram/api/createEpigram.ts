import { apiClient } from "@/shared/api/client";

import { epigramDetailSchema, type EpigramDetail } from "../model/schema";

export interface CreateEpigramRequest {
  content: string;
  author: string;
  referenceTitle?: string;
  referenceUrl?: string;
  tags: string[];
}

export async function createEpigram(data: CreateEpigramRequest): Promise<EpigramDetail> {
  const response = await apiClient.post<unknown>("/api/epigrams", data);
  return epigramDetailSchema.parse(response.data);
}
