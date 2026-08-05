"use client";

import { useEffect, useState } from "react";
import { getSponsors } from "@/features/sponsors/client/sponsors-api";
import type { Sponsor } from "@/features/sponsors/types";

export function useSponsors() {
  const [items, setItems] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const sponsors = await getSponsors();
        if (isMounted) {
          setItems(sponsors);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unexpected error loading sponsors",
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

