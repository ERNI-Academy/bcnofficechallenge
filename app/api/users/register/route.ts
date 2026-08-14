import { NextResponse } from "next/server";
import { registerWithBackend } from "@/features/auth/server/register-service";
import { buildAccessTokenCookie } from "@/features/auth/server/session";
import { hasCompanyEmailDomain } from "@/features/auth/constants";
import type { RegisterPayload } from "@/features/auth/types";

export async function POST(request: Request) {
  let body: Partial<RegisterPayload>;

  try {
    body = (await request.json()) as Partial<RegisterPayload>;
  } catch {
    return NextResponse.json(
      { title: "Invalid request body" },
      { status: 400 },
    );
  }

  const email = body.email?.trim() ?? "";
  const password = body.password ?? "";
  const fullName = body.fullName?.trim() ?? "";

  if (!hasCompanyEmailDomain(email) || !password || !fullName) {
    return NextResponse.json(
      { title: "All required fields must be completed" },
      { status: 400 },
    );
  }

  try {
    const result = await registerWithBackend({
      email,
      password,
      fullName,
    });

    if (!result.ok) {
      return NextResponse.json(
        { title: result.error },
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
      error instanceof Error ? error.message : "Unexpected register error";

    return NextResponse.json(
      {
        title: message,
      },
      { status: 500 },
    );
  }
}

