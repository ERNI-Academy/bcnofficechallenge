import { NextResponse } from "next/server";
import { createScanInBackend } from "@/features/scans/server/scans-service";
import type { CreateScanPayload } from "@/features/scans/types";

export async function POST(request: Request) {
  let body: Partial<CreateScanPayload>;

  try {
    body = (await request.json()) as Partial<CreateScanPayload>;
  } catch {
    return NextResponse.json(
      {
        title: "Invalid request body",
      },
      { status: 400 },
    );
  }

  const userId =
    typeof body.userId === "string" ? body.userId.trim() : "";
  const qrId =
    typeof body.qrId === "string" ? body.qrId.trim() : "";

  if (!userId || !qrId) {
    return NextResponse.json(
      {
        title: "userId and qrId are required",
      },
      { status: 400 },
    );
  }

  try {
    const result = await createScanInBackend({ userId, qrId });
    if (!result.ok) {
      return NextResponse.json(
        {
          title: result.error,
        },
        { status: result.status },
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected create scan error";

    return NextResponse.json(
      {
        title: message,
      },
      { status: 500 },
    );
  }
}

