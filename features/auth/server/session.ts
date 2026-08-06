import { cookies } from "next/headers";

export const ACCESS_TOKEN_COOKIE = "bcnofficechallenge_access_token";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export function buildAccessTokenCookie(accessToken: string, expiresAt: string) {
  const expires = new Date(expiresAt);
  return {
    name: ACCESS_TOKEN_COOKIE,
    value: accessToken,
    options: {
      ...cookieOptions,
      expires,
    },
  };
}

export function buildClearAccessTokenCookie() {
  return {
    name: ACCESS_TOKEN_COOKIE,
    value: "",
    options: {
      ...cookieOptions,
      maxAge: 0,
    },
  };
}

export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
}
