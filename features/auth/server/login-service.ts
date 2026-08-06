import { buildBackendUrl } from "@/lib/server/env";
import { fetchBackend } from "@/lib/server/http/fetch-backend";
import type {
  AuthenticatedSession,
  LoginCredentials,
  LoginErrorResponse,
} from "@/features/auth/types";

export type LoginResult =
  | { ok: true; session: AuthenticatedSession }
  | { ok: false; status: number; error: string };

export async function loginWithBackend(
  credentials: LoginCredentials,
): Promise<LoginResult> {
  const response = await fetchBackend(buildBackendUrl("/users/login"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(credentials),
    cache: "no-store",
  });

  if (!response.ok) {
    let errorMessage = "Login failed";
    try {
      const payload = (await response.json()) as LoginErrorResponse;
      errorMessage = payload.error ?? errorMessage;
    } catch {
      // Keep fallback when backend sends empty response.
    }

    return {
      ok: false,
      status: response.status || 401,
      error: errorMessage,
    };
  }

  const session = (await response.json()) as AuthenticatedSession;
  return { ok: true, session };
}

