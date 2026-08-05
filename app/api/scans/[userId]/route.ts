import { NextResponse } from "next/server";
import { fetchUserScansFromBackend } from "@/features/scans/server/scans-service";

type RouteParams = {
  params: Promise<{
    userId: string;
  }>;
};

export async function GET(_: Request, { params }: RouteParams) {
  const resolvedParams = await params;
  const userId = resolvedParams.userId?.trim();

  if (!userId) {
    return NextResponse.json(
      {
        title: "Invalid user id",
      },
      { status: 400 },
    );
  }

  try {
    const result = await fetchUserScansFromBackend(userId);
    if (!result.ok) {
      return NextResponse.json(
        {
          title: result.error,
        },
        { status: result.status },
      );
    }

    return NextResponse.json(result.items, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected scans error";

    return NextResponse.json(
      {
        title: message,
      },
      { status: 500 },
    );
  }
}

