export const RAFFLE_TARGET_ISO = "2026-09-09T16:22:00";

export function isRaffleEndedAt(referenceMs: number = Date.now()): boolean {
  return referenceMs >= new Date(RAFFLE_TARGET_ISO).getTime();
}

