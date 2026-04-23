import { apiClient } from "@/shared/api/client";

import { userSchema, type User } from "../model/schema";

export interface UpdateMeBody {
  nickname?: string;
  image?: string;
}

export async function getMe(): Promise<User | null> {
  const response = await apiClient.get<unknown>("/api/users/me");
  if (response.data === null) return null;
  return userSchema.parse(response.data);
}

export async function updateMe(body: UpdateMeBody): Promise<User> {
  const response = await apiClient.patch<unknown>("/api/users/me", body);
  return userSchema.parse(response.data);
}
