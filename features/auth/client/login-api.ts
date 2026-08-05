import type {
  LoggedUser,
  LoginCredentials,
  LoginErrorResponse,
} from "@/features/auth/types";

export async function loginRequest(
  credentials: LoginCredentials,
): Promise<LoggedUser> {
  const response = await fetch("/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    let message = "Login error";
    try {
      const payload = (await response.json()) as LoginErrorResponse;
      message = payload.error ?? message;
    } catch {
      // Keep fallback message on empty or invalid response.
    }
    throw new Error(message);
  }

  return (await response.json()) as LoggedUser;
}

