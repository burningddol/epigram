import { NextResponse } from "next/server";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

const COOKIE_BASE = {
  httpOnly: true,
  sameSite: "strict" as const,
  secure: IS_PRODUCTION,
  path: "/",
};

export function setAccessTokenCookie(response: NextResponse, value: string): void {
  response.cookies.set({ name: "accessToken", value, ...COOKIE_BASE, maxAge: 3600 });
}

export function setRefreshTokenCookie(response: NextResponse, value: string): void {
  response.cookies.set({ name: "refreshToken", value, ...COOKIE_BASE, maxAge: 604800 });
}

export function clearAuthCookies(response: NextResponse): void {
  response.cookies.set({ name: "accessToken", value: "", path: "/", maxAge: 0 });
  response.cookies.set({ name: "refreshToken", value: "", path: "/", maxAge: 0 });
}
