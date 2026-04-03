export interface SignUpResponse {
  id: number;
  nickname: string;
  email: string;
  image: string | null;
}

export interface SignInResponse {
  id: number;
  nickname: string;
  email: string;
  image: string | null;
}

// 카카오 로그인 시 미가입 사용자에게 반환되는 응답
export interface KakaoSignInNeedsSignupResponse {
  needsSignup: true;
  tempToken: string;
}

export type KakaoSignInResponse = SignInResponse | KakaoSignInNeedsSignupResponse;

export function isNeedsSignup(
  response: KakaoSignInResponse
): response is KakaoSignInNeedsSignupResponse {
  return "needsSignup" in response && response.needsSignup === true;
}
