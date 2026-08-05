import { buildBackendUrl } from "@/lib/server/env";
import { fetchBackend } from "@/lib/server/http/fetch-backend";
import type {
  ApiValidationErrorResponse,
  LoggedUser,
  RegisterPayload,
} from "@/features/auth/types";

export type RegisterResult =
  | { ok: true; user: LoggedUser }
  | { ok: false; status: number; error: string };

export async function registerWithBackend(
  payload: RegisterPayload,
): Promise<RegisterResult> {
  const response = await fetchBackend(buildBackendUrl("/users/register"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    let errorMessage = "Register failed";
    try {
      const apiError = (await response.json()) as ApiValidationErrorResponse;
      errorMessage = apiError.title ?? errorMessage;
    } catch {
      // Keep fallback when backend response is empty or invalid.
    }

    return {
      ok: false,
      status: response.status || 400,
      error: errorMessage,
    };
  }

  const user = (await response.json()) as LoggedUser;
  return { ok: true, user };
}

