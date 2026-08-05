"use client";

import { useEffect, useState } from "react";
import { getSponsorDetails } from "@/features/sponsors/client/sponsor-details-api";
import type { Sponsor } from "@/features/sponsors/types";

export function useSponsorDetails(sponsorId: string) {
  const [item, setItem] = useState<Sponsor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sponsorId) {
      setLoading(false);
      setError("Invalid sponsor id");
      return;
    }

    let isMounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const sponsor = await getSponsorDetails(sponsorId);
        if (isMounted) {
          setItem(sponsor);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unexpected error loading sponsor details",
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
  }, [sponsorId]);

  return { item, loading, error };
}

