import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { syncLinkedInUserWithBackend } from "@/features/auth/server/linkedin-service";
import { buildUserSessionCookie } from "@/features/auth/server/session";

const LINKEDIN_STATE_COOKIE = "linkedin_oauth_state";

function errorRedirect(requestUrl: URL, message: string) {
  const url = new URL("/auth/linkedin/success", requestUrl);
  url.searchParams.set("error", message);
  return NextResponse.redirect(url);
}

function readLinkedInEnv() {
  const clientId = process.env.LINKEDIN_CLIENT_ID?.trim();
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET?.trim();
  const redirectUri = process.env.LINKEDIN_REDIRECT_URI?.trim();

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error(
      "Missing LinkedIn environment variables. Configure LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET and LINKEDIN_REDIRECT_URI.",
    );
  }

  return { clientId, clientSecret, redirectUri };
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code")?.trim() ?? "";
  const state = requestUrl.searchParams.get("state")?.trim() ?? "";
  const error = requestUrl.searchParams.get("error")?.trim();

  if (error) {
    return errorRedirect(requestUrl, error);
  }

  if (!code || !state) {
    return errorRedirect(requestUrl, "Missing LinkedIn auth code");
  }

  const cookieStore = await cookies();
  const expectedState = cookieStore.get(LINKEDIN_STATE_COOKIE)?.value;

  if (!expectedState || expectedState !== state) {
    return errorRedirect(requestUrl, "Invalid OAuth state");
  }

  try {
    const { clientId, clientSecret, redirectUri } = readLinkedInEnv();

    const tokenPayload = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
    });

    const tokenResponse = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: tokenPayload.toString(),
      cache: "no-store",
    });

    if (!tokenResponse.ok) {
      return errorRedirect(requestUrl, "Could not get LinkedIn access token");
    }

    const tokenData = (await tokenResponse.json()) as {
      access_token?: string;
    };
    const accessToken = tokenData.access_token?.trim() ?? "";
    if (!accessToken) {
      return errorRedirect(requestUrl, "LinkedIn access token is empty");
    }

    const userInfoResponse = await fetch("https://api.linkedin.com/v2/userinfo", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!userInfoResponse.ok) {
      return errorRedirect(requestUrl, "Could not read LinkedIn profile");
    }

    const linkedInProfile = (await userInfoResponse.json()) as {
      sub?: string;
      name?: string;
      given_name?: string;
      family_name?: string;
      email?: string;
    }; 
    console.log("linkedInProfile", linkedInProfile);

    const result = await syncLinkedInUserWithBackend(linkedInProfile);
    if (!result.ok) {
      return errorRedirect(requestUrl, result.error);
    }

    const successUrl = new URL("/auth/linkedin/success", requestUrl);
    const response = NextResponse.redirect(successUrl);
    response.cookies.set(LINKEDIN_STATE_COOKIE, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    const sessionCookie = buildUserSessionCookie(result.user);
    response.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.options,
    );

    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected LinkedIn callback error";
    return errorRedirect(requestUrl, message);
  }
}

