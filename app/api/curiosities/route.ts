import { NextResponse } from "next/server";
import { getAccessToken } from "@/features/auth/server/session";
import {
  fetchUserCuriositiesFromBackend,
  markCuriosityViewedInBackend,
} from "@/features/curiosities/server/curiosities-service";

export async function GET() {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json({ title: "No active session" }, { status: 401 });
  }

  const result = await fetchUserCuriositiesFromBackend(accessToken);
  return result.ok
    ? NextResponse.json(result.value, { status: 200 })
    : NextResponse.json({ title: result.error }, { status: result.status });
}

export async function POST(request: Request) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json({ title: "No active session" }, { status: 401 });
  }

  let payload: { sponsorId?: unknown };
  try {
    payload = (await request.json()) as { sponsorId?: unknown };
  } catch {
    return NextResponse.json({ title: "Invalid request body" }, { status: 400 });
  }

  if (typeof payload.sponsorId !== "string" || payload.sponsorId.trim().length === 0) {
    return NextResponse.json({ title: "A room id is required" }, { status: 400 });
  }

  const result = await markCuriosityViewedInBackend(
    accessToken,
    payload.sponsorId.trim(),
  );
  return result.ok
    ? new NextResponse(null, { status: 204 })
    : NextResponse.json({ title: result.error }, { status: result.status });
}
