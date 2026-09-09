"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { USER_SCANS_UPDATED_EVENT } from "@/features/scans/client/scans-events";
import { getUserScans } from "@/features/scans/client/scans-api";
import type { ScanRecord } from "@/features/scans/types";

export function useUserScans(enabled = true) {
  const [items, setItems] = useState<ScanRecord[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!enabled) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      setItems(await getUserScans());
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unexpected error loading completed rooms",
      );
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    function handleScansUpdated() {
      void refresh();
    }

    window.addEventListener(USER_SCANS_UPDATED_EVENT, handleScansUpdated);
    return () => {
      window.removeEventListener(USER_SCANS_UPDATED_EVENT, handleScansUpdated);
    };
  }, [refresh]);

  const scannedSponsorIds = useMemo(
    () => new Set(items.map((scan) => scan.sponsorId)),
    [items],
  );

  return { items, scannedSponsorIds, loading, error, refresh };
}
