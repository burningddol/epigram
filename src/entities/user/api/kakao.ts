import { apiClient } from "@/shared/api/client";
import type { KakaoSignInResponse } from "../model/types";

export interface SignInKakaoBody {
  token: string;
  redirectUri: string;
}

export async function signInKakao(body: SignInKakaoBody): Promise<KakaoSignInResponse> {
  const response = await apiClient.post<KakaoSignInResponse>("/api/auth/signIn/kakao", body);
  return response.data;
}
