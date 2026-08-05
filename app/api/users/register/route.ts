import { NextResponse } from "next/server";
import { registerWithBackend } from "@/features/auth/server/register-service";
import { buildUserSessionCookie } from "@/features/auth/server/session";
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
  const password = body.password?.trim() ?? "";
  const fullName = body.fullName?.trim() ?? "";
  const companyName = body.companyName?.trim() ?? "";
  const jobTitle = body.jobTitle?.trim() ?? "";
  const linkedIn = body.linkedIn?.trim() ?? "";

  if (!email || !password || !fullName || !companyName || !jobTitle) {
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
      companyName,
      jobTitle,
      linkedIn: linkedIn || undefined,
    });

    if (!result.ok) {
      return NextResponse.json(
        { title: result.error },
        { status: result.status },
      );
    }

    const sessionCookie = buildUserSessionCookie(result.user);

    const response = NextResponse.json(result.user, { status: 200 });
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

