import { buildBackendUrl } from "@/lib/server/env";
import { fetchBackend } from "@/lib/server/http/fetch-backend";
import type { LoggedUser } from "@/features/auth/types";

export async function fetchCurrentUserFromBackend(
  accessToken: string,
): Promise<LoggedUser | null> {
  const response = await fetchBackend(buildBackendUrl("/users/me"), {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (response.status === 401 || response.status === 403) {
    return null;
  }
  if (!response.ok) {
    throw new Error("Could not validate the active session");
  }

  return (await response.json()) as LoggedUser;
}
