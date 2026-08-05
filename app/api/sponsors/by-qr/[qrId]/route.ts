import { NextResponse } from "next/server";
import { fetchSponsorByQrFromBackend } from "@/features/sponsors/server/sponsors-service";

type RouteParams = {
  params: Promise<{
    qrId: string;
  }>;
};

export async function GET(_: Request, { params }: RouteParams) {
  const resolvedParams = await params;
  const qrId = resolvedParams.qrId?.trim();

  if (!qrId) {
    return NextResponse.json(
      {
        title: "Invalid qr id",
      },
      { status: 400 },
    );
  }

  try {
    const result = await fetchSponsorByQrFromBackend(qrId);
    if (!result.ok) {
      return NextResponse.json(
        {
          title: result.error,
        },
        { status: result.status },
      );
    }

    return NextResponse.json(result.item, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected sponsor by QR error";

    return NextResponse.json(
      {
        title: message,
      },
      { status: 500 },
    );
  }
}

