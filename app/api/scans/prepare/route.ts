import { NextResponse } from "next/server";
import { getAccessToken } from "@/features/auth/server/session";
import { prepareQuizInBackend } from "@/features/scans/server/scans-service";
import type { PrepareQuizPayload } from "@/features/scans/types";

export async function POST(request: Request) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json({ title: "No active session" }, { status: 401 });
  }

  let payload: PrepareQuizPayload;
  try {
    payload = (await request.json()) as PrepareQuizPayload;
  } catch {
    return NextResponse.json({ title: "Invalid request body" }, { status: 400 });
  }

  const result = await prepareQuizInBackend(accessToken, payload);
  return result.ok
    ? NextResponse.json(result.value, { status: 200 })
    : NextResponse.json({ title: result.error }, { status: result.status });
}
