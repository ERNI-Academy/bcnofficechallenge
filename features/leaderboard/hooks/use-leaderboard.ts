"use client";

import { useEffect, useState } from "react";
import { getRanking } from "@/features/leaderboard/client/ranking-api";
import type { RankingItem } from "@/features/leaderboard/types";

export function useLeaderboard() {
  const [items, setItems] = useState<RankingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const ranking = await getRanking();
        if (isMounted) {
          setItems(ranking);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unexpected error loading leaderboard",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      isMounted = false;
    };
  }, []);

  return { items, loading, error };
}

