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
  const [mounted, setMounted] = useState(false);
  const [remaining, setRemaining] = useState<Remaining>(() =>
    getRemaining(targetDateIso),
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    const timer = window.setInterval(() => {
      setRemaining(getRemaining(targetDateIso));
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [mounted, targetDateIso]);

  const text = useMemo(
    () =>
      `${remaining.days}d ${formatUnit(remaining.hours)}h ${formatUnit(
        remaining.minutes,
      )}m ${formatUnit(remaining.seconds)}s`,
    [remaining.days, remaining.hours, remaining.minutes, remaining.seconds],
  );

  if (!mounted) {
    return <span className={className}>--d --h --m --s</span>;
  }

  if (remaining.totalMs <= 0 && endedText) {
    return <span className={className}>{endedText}</span>;
  }

  return <span className={className}>{text}</span>;
}

