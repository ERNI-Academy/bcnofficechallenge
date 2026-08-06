import { NextResponse } from "next/server";
import { fetchCurrentUserFromBackend } from "@/features/auth/server/current-user-service";
import {
  buildClearAccessTokenCookie,
  getAccessToken,
} from "@/features/auth/server/session";

export async function GET() {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return NextResponse.json({ error: "No active session" }, { status: 401 });
    }

    const user = await fetchCurrentUserFromBackend(accessToken);
    if (!user) {
      const response = NextResponse.json(
        { error: "No active session" },
        { status: 401 },
      );
      const cookie = buildClearAccessTokenCookie();
      response.cookies.set(cookie.name, cookie.value, cookie.options);
      return response;
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected session error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
