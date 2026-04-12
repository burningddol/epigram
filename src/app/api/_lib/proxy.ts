import { NextResponse } from "next/server";

import { clearAuthCookies } from "./cookies";

export function buildBackendUrl(path: string, searchParams: URLSearchParams): string {
  const base = `${process.env.BACKEND_URL}/${process.env.TEAM_ID}/${path}`;
  const query = searchParams.toString();
  return query ? `${base}?${query}` : base;
}

export async function readRequestBody(request: Request): Promise<BodyInit | undefined> {
  if (request.method === "GET" || request.method === "HEAD") return undefined;

  const contentType = request.headers.get("Content-Type") ?? "";
  const isMultipart = contentType.includes("multipart/form-data");

  return isMultipart
    ? request.blob()
    : JSON.stringify(await request.json().catch(() => ({})));
}

export async function callBackend(
  url: string,
  method: string,
  accessToken: string | undefined,
  body: BodyInit | undefined,
  contentType: string
): Promise<Response> {
  const isMultipart = contentType.includes("multipart/form-data");

  return fetch(url, {
    method,
    headers: {
      "Content-Type": isMultipart ? contentType : "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
    body,
    cache: "no-store",
  });
}

export function buildProxyResponse(backendResponse: Response): NextResponse {
  return new NextResponse(backendResponse.body, {
    status: backendResponse.status,
    headers: {
      "Content-Type": backendResponse.headers.get("Content-Type") ?? "application/json",
    },
  });
}

export async function attemptTokenRefresh(refreshToken: string): Promise<string | null> {
  const refreshUrl = `${process.env.BACKEND_URL}/${process.env.TEAM_ID}/auth/refresh-token`;

  try {
    const response = await fetch(refreshUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });

    if (!response.ok) return null;

    const data = (await response.json()) as { accessToken?: string };
    return data.accessToken ?? null;
  } catch {
    return null;
  }
}

export function buildUnauthorizedResponse(): NextResponse {
  const response = NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  clearAuthCookies(response);
  return response;
}
