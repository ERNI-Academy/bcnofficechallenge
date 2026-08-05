import type {
  CreateScanPayload,
  ScanApiError,
  ScanRecord,
} from "@/features/scans/types";

export async function getUserScans(userId: string): Promise<ScanRecord[]> {
  const response = await fetch(`/api/scans/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let message = "Could not load scans";
    try {
      const payload = (await response.json()) as ScanApiError;
      message =
        payload.title ?? payload.error ?? payload.message ?? message;
    } catch {
      // Keep fallback message.
    }
    throw new Error(message);
  }

  return (await response.json()) as ScanRecord[];
}

export async function createScan(payload: CreateScanPayload): Promise<void> {
  const response = await fetch("/api/scans", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = "Could not save scan";
    try {
      const data = (await response.json()) as ScanApiError;
      message = data.title ?? data.error ?? data.message ?? message;
    } catch {
      // Keep fallback message.
    }
    throw new Error(message);
  }
}

