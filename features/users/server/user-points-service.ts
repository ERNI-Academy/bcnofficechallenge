import { buildBackendUrl } from "@/lib/server/env";
import { fetchBackend } from "@/lib/server/http/fetch-backend";
import type { UserPoints, UserPointsApiError } from "@/features/users/types";

export type UserPointsResult =
  | { ok: true; item: UserPoints }
  | { ok: false; status: number; error: string };

export async function fetchUserPointsFromBackend(
  userId: string,
): Promise<UserPointsResult> {
  const response = await fetchBackend(buildBackendUrl(`/users/${userId}/points`), {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let errorMessage = "Could not load user points";
    try {
      const payload = (await response.json()) as UserPointsApiError;
      errorMessage =
        payload.title ?? payload.error ?? payload.message ?? errorMessage;
    } catch {
      // Keep fallback message.
    }

    return { ok: false, status: response.status || 500, error: errorMessage };
  }

  const item = (await response.json()) as UserPoints;
  return { ok: true, item };
}

