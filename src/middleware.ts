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
    // prefetch 요청에 307을 돌려주면 그 결과가 클라이언트 라우터 캐시에 박혀,
    // 로그인 후에도 stale "→ /login" 엔트리가 재사용되어 사용자가 튕긴다.
    // 401은 라우터 캐시에 저장되지 않으므로 prefetch만 끊어 캐시 오염을 막는다.
    if (request.headers.get("next-router-prefetch")) {
      return new NextResponse(null, { status: 401 });
    }
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
