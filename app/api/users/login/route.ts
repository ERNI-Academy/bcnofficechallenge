import { NextResponse } from "next/server";
import { loginWithBackend } from "@/features/auth/server/login-service";
import { buildAccessTokenCookie } from "@/features/auth/server/session";
import { hasCompanyEmailDomain } from "@/features/auth/constants";
import type { LoginCredentials } from "@/features/auth/types";

export async function POST(request: Request) {
  let body: Partial<LoginCredentials>;

  try {
    body = (await request.json()) as Partial<LoginCredentials>;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const email = body.email?.trim() ?? "";
  const password = body.password ?? "";

  if (!hasCompanyEmailDomain(email) || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 },
    );
  }

  try {
    const result = await loginWithBackend({
      email,
      password,
    });

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }

    const sessionCookie = buildAccessTokenCookie(
      result.session.accessToken,
      result.session.expiresAt,
    );

    const response = NextResponse.json(result.session.user, { status: 200 });
    response.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.options,
    );

    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected login error";

    return NextResponse.json(
      {
        error: message,
      },
      { status: 500 },
    );
  }
}

