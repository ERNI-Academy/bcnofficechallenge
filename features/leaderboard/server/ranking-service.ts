import { buildBackendUrl } from "@/lib/server/env";
import { fetchBackend } from "@/lib/server/http/fetch-backend";
import type { RankingApiError, RankingItem } from "@/features/leaderboard/types";

export type RankingResult =
  | { ok: true; items: RankingItem[] }
  | { ok: false; status: number; error: string };

export async function fetchRankingFromBackend(): Promise<RankingResult> {
  const response = await fetchBackend(buildBackendUrl("/ranking"), {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let errorMessage = "Could not load leaderboard";
    try {
      const payload = (await response.json()) as RankingApiError;
      errorMessage =
        payload.title ?? payload.error ?? payload.message ?? errorMessage;
    } catch {
      // Keep fallback message when backend response is empty/non-JSON.
    }

    return { ok: false, status: response.status || 500, error: errorMessage };
  }

  const items = (await response.json()) as RankingItem[];
  return { ok: true, items };
}

