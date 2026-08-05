"use client";

import Image from "next/image";
import { useI18n } from "@/features/i18n/i18n-context";

export function AppFooter() {
  const { t } = useI18n();

  return (
    <footer className="fixed inset-x-0 bottom-0 z-20 flex min-h-[3.2rem] items-center justify-between bg-[#031d3b] px-4">
      <div className="flex flex-col items-start justify-center">
        <span className="mb-1 text-[0.50rem] leading-none text-white">
          {t("footer.poweredBy")}
        </span>
        <Image
          src="/ERNI_Logo_white.png"
          alt="ERNI logo"
          width={50}
          height={43}
          className="h-auto w-auto"
        />
      </div>
      <a
        href="https://www.betterask.erni/es-es/oportunidades-carrera/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[0.80rem] text-white underline underline-offset-2"
      >
        {t("footer.knowMore")}
      </a>
    </footer>
  );
}

