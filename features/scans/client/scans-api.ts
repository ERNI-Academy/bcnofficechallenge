import { USER_SCANS_UPDATED_EVENT } from "@/features/scans/client/scans-events";
import type {
  CompleteQuizPayload,
  PreparedQuiz,
  PrepareQuizPayload,
  QuizAnswerResult,
  QuizResult,
  ScanApiError,
  ScanRecord,
} from "@/features/scans/types";

function normalizeAnswerResults(
  results: QuizAnswerResult[] | undefined,
): QuizAnswerResult[] {
  return (results ?? []).map((answer) => ({
    ...answer,
    correctOptionTexts: answer.correctOptionTexts ?? [],
  }));
}

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
  const scans = (await response.json()) as ScanRecord[];
  return scans.map((scan) => ({
    ...scan,
    answerResults: normalizeAnswerResults(scan.answerResults),
  }));
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
  const result = (await response.json()) as QuizResult;
  window.dispatchEvent(new Event(USER_SCANS_UPDATED_EVENT));
  return {
    ...result,
    answerResults: normalizeAnswerResults(result.answerResults),
  };
}
