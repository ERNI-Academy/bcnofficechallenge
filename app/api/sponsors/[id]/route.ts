import { NextResponse } from "next/server";
import { fetchSponsorDetailsFromBackend } from "@/features/sponsors/server/sponsors-service";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_: Request, { params }: RouteParams) {
  const resolvedParams = await params;
  const sponsorId = resolvedParams.id?.trim();

  if (!sponsorId) {
    return NextResponse.json(
      {
        title: "Invalid sponsor id",
      },
      { status: 400 },
    );
  }

  try {
    const result = await fetchSponsorDetailsFromBackend(sponsorId);

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
      error instanceof Error ? error.message : "Unexpected sponsor details error";

    return NextResponse.json(
      {
        title: message,
      },
      { status: 500 },
    );
  }
}

