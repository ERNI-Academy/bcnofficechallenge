"use client";

export const RAFFLE_SEEN_KEY = "bcnofficechallenge_raffle_seen";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function hasSeenRaffle(): boolean {
  if (!isBrowser()) {
    return false;
  }

  return window.localStorage.getItem(RAFFLE_SEEN_KEY) === "true";
}

export function markRaffleSeen(): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(RAFFLE_SEEN_KEY, "true");
}

