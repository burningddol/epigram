import { NextRequest, NextResponse } from "next/server";

import { setAccessTokenCookie } from "../_lib/cookies";
import {
  buildBackendUrl,
  readRequestBody,
  callBackend,
  buildProxyResponse,
  attemptTokenRefresh,
  buildUnauthorizedResponse,
} from "../_lib/proxy";

async function withTokenRefresh(
  backendUrl: string,
  method: string,
  body: BodyInit | undefined,
  contentType: string,
  refreshToken: string
): Promise<NextResponse> {
  const newAccessToken = await attemptTokenRefresh(refreshToken);
  if (!newAccessToken) return buildUnauthorizedResponse();

  const backendResponse = await callBackend(backendUrl, method, newAccessToken, body, contentType);
  const response = buildProxyResponse(backendResponse);
  setAccessTokenCookie(response, newAccessToken);
  return response;
}

async function handler(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
): Promise<NextResponse> {
  const { path: pathSegments } = await context.params;
  const path = pathSegments.join("/");

  const backendUrl = buildBackendUrl(path, request.nextUrl.searchParams);
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const contentType = request.headers.get("Content-Type") ?? "";

  // 토큰이 전혀 없으면 백엔드 요청 없이 null 반환 — 브라우저 콘솔 401 방지
  if (!accessToken && !refreshToken && path === "users/me") {
    return NextResponse.json(null, { status: 200 });
  }

  const body = await readRequestBody(request);

  if (!accessToken && refreshToken) {
    return withTokenRefresh(backendUrl, request.method, body, contentType, refreshToken);
  }

  const backendResponse = await callBackend(backendUrl, request.method, accessToken, body, contentType);

  if (backendResponse.status === 401) {
    if (!refreshToken) return buildUnauthorizedResponse();
    return withTokenRefresh(backendUrl, request.method, body, contentType, refreshToken);
  }

  return buildProxyResponse(backendResponse);
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
