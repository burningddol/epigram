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

// 미들웨어 리다이렉트 응답이 브라우저/Next 클라이언트 캐시에 남으면
// 로그인 후에도 보호 경로로 이동했을 때 캐시된 "→ /login" 응답이 재사용되어
// 사용자가 다시 로그인 페이지로 튕긴다. no-store로 캐시 자체를 차단한다.
function redirectWithoutCache(url: URL): NextResponse {
  const response = NextResponse.redirect(url);
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export function middleware(request: NextRequest): NextResponse | undefined {
  const { pathname } = request.nextUrl;
  // accessToken이 없어도 refreshToken이 있으면 BFF에서 갱신 가능하므로 통과
  const isLoggedIn = request.cookies.has("accessToken") || request.cookies.has("refreshToken");

  if (isProtectedPath(pathname) && !isLoggedIn) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return redirectWithoutCache(loginUrl);
  }

  if (AUTH_ONLY_PATHS.some((p) => pathname.startsWith(p)) && isLoggedIn) {
    return redirectWithoutCache(new URL("/epigrams", request.url));
  }
}

export const config = {
  matcher: [
    // 보호 경로: /epigrams/[id] 이하, /addepigram(+하위), /mypage(+하위)
    // /addepigram, /mypage 는 정확 매칭과 하위 경로를 모두 등록 — path-to-regexp의
    // ":path*"는 "/addepigram/..." 형태만 매칭하고 "/addepigram" 자체는 빠진다.
    "/epigrams/:path+",
    "/addepigram",
    "/addepigram/:path+",
    "/mypage",
    "/mypage/:path+",
    // 로그인 전용: 이미 로그인 시 홈으로
    "/login",
    "/signup",
    "/oauth/:path*",
  ],
};
