import type {
  ApiValidationErrorResponse,
  LoggedUser,
  RegisterPayload,
} from "@/features/auth/types";

export async function registerRequest(
  payload: RegisterPayload,
): Promise<LoggedUser> {
  const response = await fetch("/api/users/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = "Register error";
    try {
      const apiError = (await response.json()) as ApiValidationErrorResponse;
      message = apiError.title ?? message;
    } catch {
      // Keep fallback message when response is empty or invalid JSON.
    }
    throw new Error(message);
  }

  return (await response.json()) as LoggedUser;
}

