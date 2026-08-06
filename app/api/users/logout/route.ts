import { NextResponse } from "next/server";
import { buildClearAccessTokenCookie } from "@/features/auth/server/session";

export async function POST() {
  const response = NextResponse.json({ ok: true }, { status: 200 });
  const cookie = buildClearAccessTokenCookie();
  response.cookies.set(cookie.name, cookie.value, cookie.options);
  return response;
}

