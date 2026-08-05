"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getUserScans } from "@/features/scans/client/scans-api";
import type { ScanRecord } from "@/features/scans/types";

export function useUserScans(userId: string | undefined) {
  const [items, setItems] = useState<ScanRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (userId === undefined) {
      setItems([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const scans = await getUserScans(userId);
      setItems(scans);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unexpected error loading scans",
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const scannedSponsorIds = useMemo(
    () => new Set(items.map((scan) => scan.sponsorId)),
    [items],
  );

  return { items, scannedSponsorIds, loading, error, refresh };
}

