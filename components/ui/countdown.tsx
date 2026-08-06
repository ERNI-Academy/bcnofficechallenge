"use client";

import { useEffect, useMemo, useState } from "react";

type CountdownProps = {
  targetDateIso: string;
  className?: string;
  endedText?: string;
};

type Remaining = {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getRemaining(targetDateIso: string): Remaining {
  const target = new Date(targetDateIso).getTime();
  const now = Date.now();
  const totalMs = Math.max(target - now, 0);

  const days = Math.floor(totalMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((totalMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((totalMs / (1000 * 60)) % 60);
  const seconds = Math.floor((totalMs / 1000) % 60);

  return { totalMs, days, hours, minutes, seconds };
}

function formatUnit(value: number): string {
  return value.toString().padStart(2, "0");
}

export function Countdown({
  targetDateIso,
  className,
  endedText,
}: CountdownProps) {
  const [remaining, setRemaining] = useState<Remaining | null>(null);

  useEffect(() => {
    const update = () => setRemaining(getRemaining(targetDateIso));
    const initialTimer = window.setTimeout(update, 0);

    const timer = window.setInterval(update, 1000);

    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(timer);
    };
  }, [targetDateIso]);

  const text = useMemo(
    () =>
      remaining === null
        ? "--d --h --m --s"
        : `${remaining.days}d ${formatUnit(remaining.hours)}h ${formatUnit(
        remaining.minutes,
      )}m ${formatUnit(remaining.seconds)}s`,
    [remaining],
  );

  if (remaining !== null && remaining.totalMs <= 0 && endedText) {
    return <span className={className}>{endedText}</span>;
  }

  return <span className={className}>{text}</span>;
}

