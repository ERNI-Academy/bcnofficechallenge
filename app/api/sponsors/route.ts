import { NextResponse } from "next/server";
import { fetchSponsorsFromBackend } from "@/features/sponsors/server/sponsors-service";

export async function GET() {
  try {
    const result = await fetchSponsorsFromBackend();

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
      error instanceof Error ? error.message : "Unexpected sponsors error";

    return NextResponse.json(
      {
        title: message,
      },
      { status: 500 },
    );
  }
}

