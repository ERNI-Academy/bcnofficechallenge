import type { RankingApiError, RankingItem } from "@/features/leaderboard/types";

export async function getRanking(): Promise<RankingItem[]> {
  const response = await fetch("/api/ranking", {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let message = "Could not load leaderboard";
    try {
      const payload = (await response.json()) as RankingApiError;
      message =
        payload.title ?? payload.error ?? payload.message ?? message;
    } catch {
      // Keep fallback message.
    }
    throw new Error(message);
  }

  return (await response.json()) as RankingItem[];
}

