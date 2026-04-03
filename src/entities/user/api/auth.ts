import { apiClient } from "@/shared/api/client";

import type { SignUpResponse, SignInResponse } from "../model/types";

export interface SignUpBody {
  email: string;
  nickname: string;
  password: string;
  passwordConfirmation: string;
}

export interface SignInBody {
  email: string;
  password: string;
}

export async function signUp(body: SignUpBody): Promise<SignUpResponse> {
  const response = await apiClient.post<SignUpResponse>("/api/auth/signUp", body);
  return response.data;
}

export async function signIn(body: SignInBody): Promise<SignInResponse> {
  const response = await apiClient.post<SignInResponse>("/api/auth/signIn", body);
  return response.data;
}

export async function logout(): Promise<void> {
  await apiClient.post("/api/auth/logout");
}
