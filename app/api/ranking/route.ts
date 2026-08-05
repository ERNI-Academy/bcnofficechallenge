import { NextResponse } from "next/server";
import { fetchRankingFromBackend } from "@/features/leaderboard/server/ranking-service";

export async function GET() {
  try {
    const result = await fetchRankingFromBackend();

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
      error instanceof Error ? error.message : "Unexpected ranking error";

    return NextResponse.json(
      {
        title: message,
      },
      { status: 500 },
    );
  }
}

