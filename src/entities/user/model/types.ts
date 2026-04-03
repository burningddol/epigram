// BFF가 accessToken/refreshToken을 쿠키로 제거한 뒤 클라이언트에 반환하는 user 객체
// swagger SignInResponse.user = User + email
export interface UserWithEmail {
  id: number;
  nickname: string;
  email: string;
  image: string | null;
  teamId: string;
  createdAt: string;
  updatedAt: string;
}

// swagger SignUpResponse / SignInResponse 에서 토큰 제거 후 BFF가 반환하는 구조
export interface SignUpResponse {
  user: UserWithEmail;
}

export interface SignInResponse {
  user: UserWithEmail;
}
