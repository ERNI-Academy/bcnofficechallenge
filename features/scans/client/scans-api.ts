import type {
  CompleteQuizPayload,
  PreparedQuiz,
  PrepareQuizPayload,
  QuizResult,
  ScanApiError,
  ScanRecord,
} from "@/features/scans/types";

async function readError(response: Response, fallback: string) {
  try {
    const payload = (await response.json()) as ScanApiError;
    return payload.title ?? payload.error ?? payload.message ?? fallback;
  } catch {
    return fallback;
  }
}

export async function getUserScans(): Promise<ScanRecord[]> {
  const response = await fetch("/api/scans", {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(await readError(response, "Could not load completed rooms"));
  }
  return (await response.json()) as ScanRecord[];
}

export async function prepareQuiz(
  payload: PrepareQuizPayload,
): Promise<PreparedQuiz> {
  const response = await fetch("/api/scans/prepare", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(await readError(response, "Could not load the questions"));
  }
  return (await response.json()) as PreparedQuiz;
}

export async function completeQuiz(
  payload: CompleteQuizPayload,
): Promise<QuizResult> {
  const response = await fetch("/api/scans/complete", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(await readError(response, "Could not submit the answers"));
  }
  return (await response.json()) as QuizResult;
}
