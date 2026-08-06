import { NextResponse } from "next/server";
import { fetchUserPointsFromBackend } from "@/features/users/server/user-points-service";
import { getAccessToken } from "@/features/auth/server/session";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_: Request, { params }: RouteParams) {
  await params;
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      {
        title: "No active session",
      },
      { status: 401 },
    );
  }

  try {
    const result = await fetchUserPointsFromBackend(accessToken);
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

