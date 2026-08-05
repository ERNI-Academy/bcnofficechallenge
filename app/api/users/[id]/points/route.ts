import { NextResponse } from "next/server";
import { fetchUserPointsFromBackend } from "@/features/users/server/user-points-service";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_: Request, { params }: RouteParams) {
  const resolvedParams = await params;
  const userId = resolvedParams.id?.trim();

  if (!userId) {
    return NextResponse.json(
      {
        title: "Invalid user id",
      },
      { status: 400 },
    );
  }

  try {
    const result = await fetchUserPointsFromBackend(userId);
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
      error instanceof Error ? error.message : "Unexpected user points error";

    return NextResponse.json(
      {
        title: message,
      },
      { status: 500 },
    );
  }
}

