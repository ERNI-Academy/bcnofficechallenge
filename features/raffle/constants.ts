export const RAFFLE_TARGET_ISO = "2026-04-21T13:00:00";

export function isRaffleEndedAt(referenceMs: number = Date.now()): boolean {
  return referenceMs >= new Date(RAFFLE_TARGET_ISO).getTime();
}

