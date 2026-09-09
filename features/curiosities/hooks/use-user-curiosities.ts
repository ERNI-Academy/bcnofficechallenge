"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getViewedCuriosityRoomIds,
  markCuriosityViewed,
} from "@/features/curiosities/client/curiosities-api";

export function useUserCuriosities(enabled = true) {
  const [viewedIds, setViewedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!enabled) {
      setViewedIds([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      setViewedIds(await getViewedCuriosityRoomIds());
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unexpected error loading curiosities",
      );
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const markViewed = useCallback(async (sponsorId: string) => {
    await markCuriosityViewed(sponsorId);
    setViewedIds((current) =>
      current.includes(sponsorId) ? current : [...current, sponsorId],
    );
  }, []);

  const viewedSponsorIds = useMemo(() => new Set(viewedIds), [viewedIds]);

  return { viewedSponsorIds, loading, error, refresh, markViewed };
}
