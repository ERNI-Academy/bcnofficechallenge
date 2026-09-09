async function readError(response: Response, fallback: string) {
  try {
    const payload = (await response.json()) as {
      title?: string;
      error?: string;
      message?: string;
    };
    return payload.title ?? payload.error ?? payload.message ?? fallback;
  } catch {
    return fallback;
  }
}

export async function getViewedCuriosityRoomIds(): Promise<string[]> {
  const response = await fetch("/api/curiosities", {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await readError(response, "Could not load curiosities"));
  }

  const payload = (await response.json()) as unknown;
  return Array.isArray(payload) && payload.every((item) => typeof item === "string")
    ? payload
    : [];
}

export async function markCuriosityViewed(sponsorId: string): Promise<void> {
  const response = await fetch("/api/curiosities", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ sponsorId }),
  });

  if (!response.ok) {
    throw new Error(await readError(response, "Could not save curiosity"));
  }
}
