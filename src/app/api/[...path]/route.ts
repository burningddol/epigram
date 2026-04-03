import { NextRequest, NextResponse } from 'next/server';

// 인증 엔드포인트: 백엔드 응답의 토큰을 HttpOnly 쿠키로 변환해야 하는 경로
const AUTH_TOKEN_ENDPOINTS = new Set(['auth/signUp', 'auth/signIn', 'auth/signIn/kakao']);

const COOKIE_BASE = 'HttpOnly; SameSite=Strict';

function buildSecureFlag(): string {
  return process.env.NODE_ENV === 'production' ? ' Secure;' : '';
}

function buildAccessTokenCookie(value: string): string {
  return `accessToken=${value}; ${COOKIE_BASE};${buildSecureFlag()} Path=/; Max-Age=3600`;
}

function buildRefreshTokenCookie(value: string): string {
  return `refreshToken=${value}; ${COOKIE_BASE};${buildSecureFlag()} Path=/api/auth/refresh-token; Max-Age=604800`;
}

function buildDeleteCookies(): string[] {
  return [
    `accessToken=; ${COOKIE_BASE}; Path=/; Max-Age=0`,
    `refreshToken=; ${COOKIE_BASE}; Path=/api/auth/refresh-token; Max-Age=0`,
  ];
}

function buildBackendUrl(path: string, searchParams: URLSearchParams): string {
  const base = `${process.env.BACKEND_URL}/${process.env.TEAM_ID}/${path}`;
  const query = searchParams.toString();
  return query ? `${base}?${query}` : base;
}

async function callBackend(
  url: string,
  method: string,
  accessToken: string | undefined,
  body: string | undefined,
  contentType: string | null,
): Promise<Response> {
  const headers: HeadersInit = {};

  if (contentType) {
    headers['Content-Type'] = contentType;
  }

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  return fetch(url, {
    method,
    headers,
    body,
    // 백엔드가 Next.js 캐시 없이 항상 최신 데이터를 반환하도록 강제
    cache: 'no-store',
  });
}

interface BackendAuthPayload {
  accessToken?: string;
  refreshToken?: string;
  [key: string]: unknown;
}

async function handleAuthEndpointResponse(backendResponse: Response): Promise<NextResponse> {
  const contentType = backendResponse.headers.get('Content-Type') ?? '';
  if (!contentType.includes('application/json')) {
    return new NextResponse(backendResponse.body, { status: backendResponse.status });
  }

  const payload = (await backendResponse.json()) as BackendAuthPayload;
  const { accessToken, refreshToken, ...rest } = payload;

  const response = NextResponse.json(rest, { status: backendResponse.status });

  if (accessToken) {
    response.headers.append('Set-Cookie', buildAccessTokenCookie(accessToken));
  }
  if (refreshToken) {
    response.headers.append('Set-Cookie', buildRefreshTokenCookie(refreshToken));
  }

  return response;
}

async function attemptTokenRefresh(refreshToken: string): Promise<string | null> {
  const refreshUrl = `${process.env.BACKEND_URL}/${process.env.TEAM_ID}/auth/refresh-token`;

  try {
    const response = await fetch(refreshUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      cache: 'no-store',
    });

    if (!response.ok) return null;

    const data = (await response.json()) as { accessToken?: string };
    return data.accessToken ?? null;
  } catch {
    return null;
  }
}

function buildClearedCookiesResponse(): NextResponse {
  const response = NextResponse.json(
    { message: 'Unauthorized' },
    { status: 401 },
  );
  buildDeleteCookies().forEach((cookie) => response.headers.append('Set-Cookie', cookie));
  return response;
}

async function handler(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
): Promise<NextResponse> {
  const { path: pathSegments } = await context.params;
  const path = pathSegments.join('/');

  // 로그아웃: 백엔드 호출 없이 쿠키만 삭제
  if (path === 'auth/logout' && request.method === 'POST') {
    const response = NextResponse.json({ success: true }, { status: 200 });
    buildDeleteCookies().forEach((cookie) => response.headers.append('Set-Cookie', cookie));
    return response;
  }

  const backendUrl = buildBackendUrl(path, request.nextUrl.searchParams);
  const accessToken = request.cookies.get('accessToken')?.value;
  const contentType = request.headers.get('Content-Type');
  const body =
    request.method !== 'GET' && request.method !== 'HEAD'
      ? await request.text()
      : undefined;

  let backendResponse = await callBackend(backendUrl, request.method, accessToken, body, contentType);

  // 401: refreshToken으로 갱신 후 재시도
  if (backendResponse.status === 401) {
    const refreshToken = request.cookies.get('refreshToken')?.value;
    if (!refreshToken) {
      return buildClearedCookiesResponse();
    }

    const newAccessToken = await attemptTokenRefresh(refreshToken);
    if (!newAccessToken) {
      return buildClearedCookiesResponse();
    }

    // 새 토큰으로 재시도
    backendResponse = await callBackend(backendUrl, request.method, newAccessToken, body, contentType);

    const responseData = AUTH_TOKEN_ENDPOINTS.has(path) && backendResponse.ok
      ? await handleAuthEndpointResponse(backendResponse)
      : new NextResponse(backendResponse.body, {
          status: backendResponse.status,
          headers: { 'Content-Type': backendResponse.headers.get('Content-Type') ?? 'application/json' },
        });

    // 새 accessToken을 쿠키에 갱신
    responseData.headers.append('Set-Cookie', buildAccessTokenCookie(newAccessToken));
    return responseData;
  }

  // 인증 엔드포인트 성공: 토큰 → 쿠키 변환
  if (AUTH_TOKEN_ENDPOINTS.has(path) && backendResponse.ok) {
    return handleAuthEndpointResponse(backendResponse);
  }

  // 일반 응답: 그대로 중계
  return new NextResponse(backendResponse.body, {
    status: backendResponse.status,
    headers: { 'Content-Type': backendResponse.headers.get('Content-Type') ?? 'application/json' },
  });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
