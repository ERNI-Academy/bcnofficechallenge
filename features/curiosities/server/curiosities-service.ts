import { buildBackendUrl } from "@/lib/server/env";
import { fetchBackend } from "@/lib/server/http/fetch-backend";

type BackendResult<T> =
  | { ok: true; value: T }
  | { ok: false; status: number; error: string };

async function readError(response: Response, fallback: string) {
  try {
    const payload = (await response.json()) as {
      title?: string;
      error?: string;
      message?: string;
    };
    return payload.title ?? payload.error ?? payload.message ?? fallback;
  } catch {
    return fallback;
  }
}

export async function fetchUserCuriositiesFromBackend(
  accessToken: string,
): Promise<BackendResult<string[]>> {
  const response = await fetchBackend(buildBackendUrl("/curiosities/me"), {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return {
      ok: false,
      status: response.status || 500,
      error: await readError(response, "Could not load curiosities"),
    };
  }

  const payload = (await response.json()) as unknown;
  const value = Array.isArray(payload) && payload.every((item) => typeof item === "string")
    ? payload
    : [];
  return { ok: true, value };
}

export async function markCuriosityViewedInBackend(
  accessToken: string,
  sponsorId: string,
): Promise<BackendResult<null>> {
  const response = await fetchBackend(
    buildBackendUrl(`/curiosities/${encodeURIComponent(sponsorId)}/view`),
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return {
      ok: false,
      status: response.status || 500,
      error: await readError(response, "Could not save curiosity"),
    };
  }

  return { ok: true, value: null };
}
