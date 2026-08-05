import { NextResponse } from "next/server";
import { getLoggedUser } from "@/features/auth/server/session";

export async function GET() {
  try {
    const user = await getLoggedUser();
    if (!user) {
      return NextResponse.json(
        {
          error: "No active session",
        },
        { status: 401 },
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected session error";

    return NextResponse.json(
      {
        error: message,
      },
      { status: 500 },
    );
  }
}

