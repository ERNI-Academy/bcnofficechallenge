import { cookies } from "next/headers";
import type { LoggedUser } from "@/features/auth/types";

export const USER_SESSION_COOKIE = "bcnofficechallenge_user_session";

function encodeSession(user: LoggedUser): string {
  return Buffer.from(JSON.stringify(user), "utf8").toString("base64url");
}

function decodeSession(encoded: string): LoggedUser | null {
  try {
    const raw = Buffer.from(encoded, "base64url").toString("utf8");
    return JSON.parse(raw) as LoggedUser;
  } catch {
    return null;
  }
}

export function buildUserSessionCookie(user: LoggedUser) {
  return {
    name: USER_SESSION_COOKIE,
    value: encodeSession(user),
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 60 * 60 * 8,
    },
  };
}

export function buildClearUserSessionCookie() {
  return {
    name: USER_SESSION_COOKIE,
    value: "",
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 0,
    },
  };
}

export async function getLoggedUser(): Promise<LoggedUser | null> {
  const cookieStore = await cookies();
  const encoded = cookieStore.get(USER_SESSION_COOKIE)?.value;

  if (!encoded) {
    return null;
  }

  return decodeSession(encoded);
}

