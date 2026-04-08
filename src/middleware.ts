import { NextRequest, NextResponse } from "next/server";

// /epigrams/[id], /epigrams/[id]/edit 등 하위 경로는 보호
// /epigrams 자체(목록), /feeds, /search는 비회원 접근 가능
function isProtectedPath(pathname: string): boolean {
  if (pathname.startsWith("/epigrams/")) return true;
  if (pathname.startsWith("/addepigram")) return true;
  if (pathname.startsWith("/mypage")) return true;
  return false;
}

// 로그인 상태에서 접근하면 홈으로 리다이렉트
const AUTH_ONLY_PATHS = ["/login", "/signup", "/oauth/signup/kakao"];

export function middleware(request: NextRequest): NextResponse | undefined {
  const { pathname } = request.nextUrl;
  // accessToken이 없어도 refreshToken이 있으면 BFF에서 갱신 가능하므로 통과
  const isLoggedIn = request.cookies.has("accessToken") || request.cookies.has("refreshToken");

  if (isProtectedPath(pathname) && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (AUTH_ONLY_PATHS.some((p) => pathname.startsWith(p)) && isLoggedIn) {
    return NextResponse.redirect(new URL("/epigrams", request.url));
  }
}

export const config = {
  matcher: [
    // 보호 경로: /epigrams/[id] 이하, /addepigram, /mypage
    "/epigrams/:path+",
    "/addepigram/:path*",
    "/mypage/:path*",
    // 로그인 전용: 이미 로그인 시 홈으로
    "/login",
    "/signup",
    "/oauth/:path*",
  ],
};
