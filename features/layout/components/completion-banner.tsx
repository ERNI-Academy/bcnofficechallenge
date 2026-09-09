"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuthSession } from "@/features/auth/client/auth-session-context";
import { useI18n } from "@/features/i18n/i18n-context";
import { useUserScans } from "@/features/scans/hooks/use-user-scans";
import { useSponsors } from "@/features/sponsors/hooks/use-sponsors";

export function CompletionBanner() {
  const pathname = usePathname();
  const { t } = useI18n();
  const { isAuthenticated } = useAuthSession();
  const { items, loading: sponsorsLoading } = useSponsors();
  const { scannedSponsorIds, loading: scansLoading } =
    useUserScans(isAuthenticated);

  const isPublicPath = pathname === "/" || pathname === "/sign-up";
  const allRoomsCompleted =
    !isPublicPath &&
    isAuthenticated &&
    !sponsorsLoading &&
    !scansLoading &&
    items.length > 0 &&
    items.every((sponsor) => scannedSponsorIds.has(sponsor.id));

  useEffect(() => {
    const root = document.documentElement;
    if (allRoomsCompleted) {
      root.dataset.allRoomsCompleted = "true";
    } else {
      delete root.dataset.allRoomsCompleted;
    }

    return () => {
      delete root.dataset.allRoomsCompleted;
    };
  }, [allRoomsCompleted]);

  if (!allRoomsCompleted) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 top-[7.7rem] z-[18] border-b border-white/15 bg-gradient-to-r from-[#ff5b00] via-[#ff7a18] to-[#ffc24d] px-3 py-2">
      <div className="mx-auto flex h-6 w-full max-w-[30rem] items-center gap-2">
        <span aria-hidden="true" className="shrink-0 text-xl leading-none">
          🎉
        </span>
        <p className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-center text-[0.72rem] font-extrabold leading-4 text-[#033470]">
          {t("raffle.challengeComplete")}
        </p>
      </div>
    </div>
  );
}
