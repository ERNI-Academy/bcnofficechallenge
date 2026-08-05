import type { Sponsor, SponsorApiError } from "@/features/sponsors/types";

export async function getSponsors(): Promise<Sponsor[]> {
  const response = await fetch("/api/sponsors", {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let message = "Could not load sponsors";
    try {
      const payload = (await response.json()) as SponsorApiError;
      message =
        payload.title ?? payload.error ?? payload.message ?? message;
    } catch {
      // Keep fallback message.
    }
    throw new Error(message);
  }

  return (await response.json()) as Sponsor[];
}

