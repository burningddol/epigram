import { apiClient } from "@/shared/api/client";

import { epigramSchema, type Epigram } from "../model/schema";

export interface CreateEpigramRequest {
  content: string;
  author: string;
  referenceTitle?: string;
  referenceUrl?: string;
  tags: string[];
}

export async function createEpigram(data: CreateEpigramRequest): Promise<Epigram> {
  const response = await apiClient.post<unknown>("/api/epigrams", data);
  return epigramSchema.parse(response.data);
}
