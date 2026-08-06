import { buildBackendUrl } from "@/lib/server/env";
import { fetchBackend } from "@/lib/server/http/fetch-backend";
import type { Sponsor, SponsorApiError } from "@/features/sponsors/types";

type RawSponsor = Record<string, unknown>;

function readString(raw: RawSponsor, ...keys: string[]): string {
  for (const key of keys) {
    const value = raw[key];
    if (typeof value === "string") {
      return value;
    }
  }
  return "";
}

/** Maps backend JSON (camelCase or PascalCase, including `URL`) to {@link Sponsor}. */
function normalizeSponsorPayload(raw: unknown): Sponsor {
  if (!raw || typeof raw !== "object") {
    return {
      id: "",
      name: "",
      description: "",
      url: "",
      imageUrl: "",
    };
  }
  const r = raw as RawSponsor;
  return {
    id: readString(r, "id", "Id"),
    name: readString(r, "name", "Name"),
    description: readString(r, "description", "Description"),
    url: readString(r, "url", "URL"),
    imageUrl: readString(r, "imageUrl", "ImageUrl"),
  };
}

export type SponsorsResult =
  | { ok: true; items: Sponsor[] }
  | { ok: false; status: number; error: string };

export type SponsorDetailsResult =
  | { ok: true; item: Sponsor }
  | { ok: false; status: number; error: string };

export async function fetchSponsorsFromBackend(): Promise<SponsorsResult> {
  const response = await fetchBackend(buildBackendUrl("/sponsors"), {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let errorMessage = "Could not load sponsors";
    try {
      const payload = (await response.json()) as SponsorApiError;
      errorMessage =
        payload.title ?? payload.error ?? payload.message ?? errorMessage;
    } catch {
      // Keep fallback message on empty/non-JSON payload.
    }

    return {
      ok: false,
      status: response.status || 500,
      error: errorMessage,
    };
  }

  const rawItems = (await response.json()) as unknown[];
  const items = rawItems.map(normalizeSponsorPayload);
  return { ok: true, items };
}

export async function fetchSponsorDetailsFromBackend(
  sponsorId: string,
): Promise<SponsorDetailsResult> {
  const response = await fetchBackend(buildBackendUrl(`/sponsors/${sponsorId}`), {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let errorMessage = "Could not load sponsor details";
    try {
      const payload = (await response.json()) as SponsorApiError;
      errorMessage =
        payload.title ?? payload.error ?? payload.message ?? errorMessage;
    } catch {
      // Keep fallback message on empty/non-JSON payload.
    }

    return {
      ok: false,
      status: response.status || 500,
      error: errorMessage,
    };
  }

  const item = normalizeSponsorPayload(await response.json());
  return { ok: true, item };
}

