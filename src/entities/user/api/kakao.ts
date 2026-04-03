import { apiClient } from "@/shared/api/client";
import type { SignInResponse } from "../model/types";

export interface SignInKakaoBody {
  token: string;
  redirectUri: string;
}

export async function signInKakao(body: SignInKakaoBody): Promise<SignInResponse> {
  const response = await apiClient.post<SignInResponse>("/api/auth/signIn/kakao", body);
  return response.data;
}
