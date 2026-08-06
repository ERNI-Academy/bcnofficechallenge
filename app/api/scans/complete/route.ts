import { NextResponse } from "next/server";
import { getAccessToken } from "@/features/auth/server/session";
import { completeQuizInBackend } from "@/features/scans/server/scans-service";
import type { CompleteQuizPayload } from "@/features/scans/types";

export async function POST(request: Request) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json({ title: "No active session" }, { status: 401 });
  }

  let payload: CompleteQuizPayload;
  try {
    payload = (await request.json()) as CompleteQuizPayload;
  } catch {
    return NextResponse.json({ title: "Invalid request body" }, { status: 400 });
  }

  const result = await completeQuizInBackend(accessToken, payload);
  return result.ok
    ? NextResponse.json(result.value, { status: 200 })
    : NextResponse.json({ title: result.error }, { status: result.status });
}
