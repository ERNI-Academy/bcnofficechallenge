import type { UserPoints, UserPointsApiError } from "@/features/users/types";

export async function getUserPoints(userId: string): Promise<UserPoints> {
  const response = await fetch(`/api/users/${userId}/points`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let message = "Could not load user points";
    try {
      const payload = (await response.json()) as UserPointsApiError;
      message =
        payload.title ?? payload.error ?? payload.message ?? message;
    } catch {
      // Keep fallback message.
    }
    throw new Error(message);
  }

  return (await response.json()) as UserPoints;
}

