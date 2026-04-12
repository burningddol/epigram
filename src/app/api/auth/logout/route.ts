import { NextResponse } from "next/server";

import { clearAuthCookies } from "../../_lib/cookies";

export function POST(): NextResponse {
  const response = NextResponse.json({ success: true });
  clearAuthCookies(response);
  return response;
}
