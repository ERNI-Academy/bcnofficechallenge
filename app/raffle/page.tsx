"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Countdown } from "@/components/ui/countdown";
import { useI18n } from "@/features/i18n/i18n-context";
import { markRaffleSeen } from "@/features/raffle/client/storage";
import { RAFFLE_TARGET_ISO } from "@/features/raffle/constants";

export default function RafflePage() {
  const { t } = useI18n();
  const router = useRouter();

  function handleGotIt() {
    markRaffleSeen();
    router.replace("/welcome");
  }

  return (
    <main className="fixed bottom-[4.2rem] left-1/2 top-[8.6rem] z-10 flex w-full max-w-[30rem] -translate-x-1/2 flex-col overflow-hidden px-4">
      <section className="mt-3 min-h-0 flex-1 overflow-y-auto pb-24 pr-1">
        <div className="mx-auto flex w-full max-w-[16rem] flex-col items-center gap-5">
          <Image
            src="/codemotionBear.png"
            alt="Codemotion Bear"
            width={180}
            height={180}
            className="h-auto w-auto object-contain"
            priority
          />

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

        <p className="mt-6 text-sm leading-6 text-white/95">
          {t("raffle.description")}
        </p>
        <p className="mt-6 text-sm leading-6 text-white/95">
          {t("raffle.followUs")}
        </p>
        <div className="mx-auto mt-3 flex w-full max-w-[18rem] items-center justify-between gap-2">
          <a
            href="https://www.facebook.com/NeolandStudio/"
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook @NEOLAND"
            className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/20 bg-white/10"
          >
            <Image
              src="/Facebook_logo.png"
              alt="Facebook @NEOLAND"
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
          </a>
          <a
            href="https://www.instagram.com/neolandschool/"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram @neolandschool"
            className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/20 bg-white/10"
          >
            <Image
              src="/Instagram_icon.png.webp"
              alt="Instagram @neolandschool"
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
          </a>
          <a
            href="https://www.linkedin.com/school/neoland/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn @NEOLAND"
            className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/20 bg-white/10"
          >
            <Image
              src="/LinkedIn_icon.svg.webp"
              alt="LinkedIn @NEOLAND"
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
          </a>
          <a
            href="https://x.com/NeolandStudio"
            target="_blank"
            rel="noreferrer"
            aria-label="X @neolandstudio"
            className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/20 bg-white/10"
          >
            <Image
              src="/x_logo.png"
              alt="X @neolandstudio"
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
          </a>
        </div>
      </section>

      <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-[#031d3b] via-[#031d3b] to-transparent px-4 pb-2 pt-6">
        <button
          type="button"
          onClick={handleGotIt}
          className="h-12 w-full rounded-[0.55rem] border-none bg-[#ff5b00] text-base font-bold text-white"
        >
          {t("raffle.gotIt")}
        </button>
      </div>
    </main>
  );
}

