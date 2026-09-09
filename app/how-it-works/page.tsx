"use client";

import { Countdown } from "@/components/ui/countdown";
import { useI18n } from "@/features/i18n/i18n-context";
import { RAFFLE_TARGET_ISO } from "@/features/raffle/constants";
import Image from "next/image";
import Link from "next/link";

const steps = [
  "Sign in with your @betterask.erni account.",
  "Visit Kitchen, Toilets and the other available rooms.",
  "Open the room card and scan the QR code on the wall panel.",
  "Answer every True/False question and submit your answers.",
  "Earn points for correct answers and climb the leaderboard.",
];

export default function HowItWorksPage() {
  const { t } = useI18n();
  return (
    <main className="fixed bottom-[4.2rem] left-1/2 top-[var(--app-content-top)] z-10 flex w-full max-w-[30rem] -translate-x-1/2 flex-col overflow-hidden px-4">
      <Link
        href="/welcome"
        className="mb-1 mt-1 inline-flex w-fit items-center gap-2 text-sm font-semibold text-white/90"
      >
        <span aria-hidden="true">←</span>
        <span>Go back</span>
      </Link>

      <h1 className="shrink-0 py-1 text-left text-3xl font-extrabold tracking-tight">
        How it works
      </h1>
      <section className="mt-3 min-h-0 flex-1 overflow-y-auto pb-4 pr-1 text-sm leading-6 text-white/95">
        <div className="mx-auto flex w-full max-w-[16rem] flex-col items-center gap-5">
          <p className="text-center text-sm font-semibold text-white/90">
            {t("raffle.hurryUp")}
          </p>

          <p className="text-center text-2xl font-extrabold text-[#ffc24d]">
            <Countdown
              targetDateIso={RAFFLE_TARGET_ISO}
              endedText={t("raffle.ended")}
            />
          </p>
        </div>
        <div className="mb-5 flex justify-center">
          <Image
            src="/ERNIMatrix.png"
            alt="Codemotion Bear"
            width={180}
            height={180}
            className="h-auto w-auto object-contain"
            priority
          />
        </div>
        <p>
          The BCN Office Challenge is a QR quiz spread across different rooms
          in the office.
        </p>
        <ol className="mt-5 space-y-3">
          {steps.map((step, index) => (
            <li
              key={step}
              className="flex gap-3 rounded-xl border border-white/15 bg-white/5 p-3"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ff5b00] font-extrabold">
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        <p className="mt-5 font-bold">
          Each room can only be completed once. Correct answers and their
          scores are checked exclusively by the backend.
        </p>
      </section>
    </main>
  );
}
