import type { LoggedUser } from "@/features/auth/types";

export const USER_STORAGE_KEY = "codemotion_user";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getStoredUser(): LoggedUser | null {
  if (!isBrowser()) {
    return null;
  }

  const raw = window.localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as LoggedUser;
  } catch {
    return null;
  }
}

export function setStoredUser(user: LoggedUser): void {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

export function clearStoredUser(): void {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.removeItem(USER_STORAGE_KEY);
}

