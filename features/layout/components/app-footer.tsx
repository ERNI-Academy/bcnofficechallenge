"use client";

import Image from "next/image";
import { useI18n } from "@/features/i18n/i18n-context";

export function AppFooter() {
  const { t } = useI18n();

  return (
    <footer className="fixed inset-x-0 bottom-0 z-20 flex min-h-[3.2rem] items-center justify-between px-4">
      <div className="flex flex-col items-start justify-center">
        <Image
          src="/betteraskerni.png"
          alt="ERNI logo"
          width={100}
          height={43}
          className="h-auto w-auto"
        />
      </div>
    </footer>
  );
}

