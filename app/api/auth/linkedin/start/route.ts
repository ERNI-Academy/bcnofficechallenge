import { NextResponse } from "next/server";

const LINKEDIN_STATE_COOKIE = "linkedin_oauth_state";

function readLinkedInEnv() {
  const clientId = process.env.LINKEDIN_CLIENT_ID?.trim();
  const redirectUri = process.env.LINKEDIN_REDIRECT_URI?.trim();

  if (!clientId || !redirectUri) {
    throw new Error(
      "Missing LinkedIn environment variables. Configure LINKEDIN_CLIENT_ID and LINKEDIN_REDIRECT_URI.",
    );
  }

  return { clientId, redirectUri };
}

export async function GET() {
  try {
    const { clientId, redirectUri } = readLinkedInEnv();
    const state = crypto.randomUUID();

    const authUrl = new URL("https://www.linkedin.com/oauth/v2/authorization");
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("client_id", clientId);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("scope", "openid profile email");
    authUrl.searchParams.set("state", state);

    const response = NextResponse.redirect(authUrl);
    response.cookies.set(LINKEDIN_STATE_COOKIE, state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 10,
    });

    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not start LinkedIn auth";

    return NextResponse.json(
      {
        error: message,
      },
      { status: 500 },
    );
  }
}

