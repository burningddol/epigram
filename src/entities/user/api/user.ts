import { apiClient } from "@/shared/api/client";
import { userSchema, type User } from "../model/schema";

export async function getMe(): Promise<User> {
  const response = await apiClient.get("/api/users/me");
  return userSchema.parse(response.data);
}
