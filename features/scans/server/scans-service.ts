import { buildBackendUrl } from "@/lib/server/env";
import { fetchBackend } from "@/lib/server/http/fetch-backend";
import type {
  CreateScanPayload,
  ScanApiError,
  ScanRecord,
} from "@/features/scans/types";

export type ScansResult =
  | { ok: true; items: ScanRecord[] }
  | { ok: false; status: number; error: string };

export type CreateScanResult =
  | { ok: true }
  | { ok: false; status: number; error: string };

export async function fetchUserScansFromBackend(
  userId: string,
): Promise<ScansResult> {
  const response = await fetchBackend(buildBackendUrl(`/scans/${userId}`), {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let errorMessage = "Could not load scans";
    try {
      const payload = (await response.json()) as ScanApiError;
      errorMessage =
        payload.title ?? payload.error ?? payload.message ?? errorMessage;
    } catch {
      // Keep fallback message.
    }
    return { ok: false, status: response.status || 500, error: errorMessage };
  }

  const items = (await response.json()) as ScanRecord[];
  return { ok: true, items };
}

export async function createScanInBackend(
  payload: CreateScanPayload,
): Promise<CreateScanResult> {
  const response = await fetchBackend(buildBackendUrl("/scans"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    let errorMessage = "Could not save scan";
    try {
      const errorPayload = (await response.json()) as ScanApiError;
      errorMessage =
        errorPayload.title ?? errorPayload.error ?? errorPayload.message ?? errorMessage;
    } catch {
      // Keep fallback message.
    }
    return { ok: false, status: response.status || 500, error: errorMessage };
  }

  return { ok: true };
}

