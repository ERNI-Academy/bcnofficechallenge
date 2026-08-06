import { buildBackendUrl } from "@/lib/server/env";
import { fetchBackend } from "@/lib/server/http/fetch-backend";
import type {
  CompleteQuizPayload,
  PreparedQuiz,
  PrepareQuizPayload,
  QuizResult,
  ScanApiError,
  ScanRecord,
} from "@/features/scans/types";

export type BackendResult<T> =
  | { ok: true; value: T }
  | { ok: false; status: number; error: string };

async function callBackend<T>(
  path: string,
  accessToken: string,
  init: RequestInit,
): Promise<BackendResult<T>> {
  const response = await fetchBackend(buildBackendUrl(path), {
    ...init,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...init.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let errorMessage = "Backend request failed";
    try {
      const payload = (await response.json()) as ScanApiError;
      errorMessage =
        payload.title ?? payload.error ?? payload.message ?? errorMessage;
    } catch {
      // Keep fallback.
    }
    return { ok: false, status: response.status || 500, error: errorMessage };
  }

  return { ok: true, value: (await response.json()) as T };
}

export function fetchUserScansFromBackend(accessToken: string) {
  return callBackend<ScanRecord[]>("/scans/me", accessToken, { method: "GET" });
}

export function prepareQuizInBackend(
  accessToken: string,
  payload: PrepareQuizPayload,
) {
  return callBackend<PreparedQuiz>("/scans/prepare", accessToken, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function completeQuizInBackend(
  accessToken: string,
  payload: CompleteQuizPayload,
) {
  return callBackend<QuizResult>("/scans/complete", accessToken, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
