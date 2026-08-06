import { NextResponse } from "next/server";
import { getAccessToken } from "@/features/auth/server/session";
import { fetchUserScansFromBackend } from "@/features/scans/server/scans-service";

export async function GET() {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json({ title: "No active session" }, { status: 401 });
  }

  const result = await fetchUserScansFromBackend(accessToken);
  return result.ok
    ? NextResponse.json(result.value, { status: 200 })
    : NextResponse.json({ title: result.error }, { status: result.status });
}
