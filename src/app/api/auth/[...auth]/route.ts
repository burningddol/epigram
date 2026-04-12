import { NextRequest, NextResponse } from "next/server";

import { setAccessTokenCookie, setRefreshTokenCookie } from "../../_lib/cookies";
import { buildBackendUrl, callBackend, buildProxyResponse } from "../../_lib/proxy";

interface AuthPayload {
  accessToken?: string;
  refreshToken?: string;
  [key: string]: unknown;
}

async function handler(
  request: NextRequest,
  context: { params: Promise<{ auth: string[] }> }
): Promise<NextResponse> {
  const { auth } = await context.params;
  const path = `auth/${auth.join("/")}`;
  const backendUrl = buildBackendUrl(path, request.nextUrl.searchParams);
  const contentType = request.headers.get("Content-Type") ?? "";
  const body = JSON.stringify(await request.json().catch(() => ({})));

  const backendResponse = await callBackend(backendUrl, request.method, undefined, body, contentType);

  if (!backendResponse.ok) {
    return buildProxyResponse(backendResponse);
  }

  const payload = (await backendResponse.json()) as AuthPayload;
  const { accessToken, refreshToken, ...rest } = payload;

  const response = NextResponse.json(rest, { status: backendResponse.status });

  if (accessToken) setAccessTokenCookie(response, accessToken);
  if (refreshToken) setRefreshTokenCookie(response, refreshToken);

  return response;
}

export const POST = handler;
