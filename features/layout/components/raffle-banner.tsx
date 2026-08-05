"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Countdown } from "@/components/ui/countdown";
import { useI18n } from "@/features/i18n/i18n-context";
import { RAFFLE_TARGET_ISO } from "@/features/raffle/constants";

export function RaffleBanner() {
  const { t } = useI18n();
  const pathname = usePathname();
  const shouldHide = pathname === "/" || pathname === "/sign-up";

  if (shouldHide) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 top-[5.2rem] z-[19] border-y border-white/15 bg-[#0f3156] px-3 py-2">
      <div className="mx-auto flex w-full max-w-[30rem] items-center gap-2">
        <Image
          src="/codemotionBear.png"
          alt="Raffle"
          width={24}
          height={24}
          className="h-6 w-6 shrink-0 object-contain"
        />
        <div className="min-w-0 flex-1 text-[0.8rem] font-semibold text-white">
          <span className="mr-1">{t("raffle.timeLeftToWin")}</span>
          <Countdown
            targetDateIso={RAFFLE_TARGET_ISO}
            className="text-[#ffc24d]"
            endedText={t("raffle.ended")}
          />
        </div>
        <Link href="/raffle" className="shrink-0 text-[0.8rem] underline">
          {t("raffle.moreInfo")}
        </Link>
      </div>
    </div>
  );
}

