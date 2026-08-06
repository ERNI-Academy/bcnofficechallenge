"use client";

import Link from "next/link";
import Image from "next/image";
import { Spinner } from "@/components/ui/spinner";
import { useAuthSession } from "@/features/auth/client/auth-session-context";
import { useI18n } from "@/features/i18n/i18n-context";
import { useUserScans } from "@/features/scans/hooks/use-user-scans";
import { useSponsors } from "@/features/sponsors/hooks/use-sponsors";

export default function WelcomePage() {
  const { t } = useI18n();
  const { isAuthenticated } = useAuthSession();
  const { items, loading, error } = useSponsors();
  const {
    scannedSponsorIds,
    loading: scansLoading,
    error: scansError,
  } = useUserScans(isAuthenticated);

  if (loading || scansLoading) {
    return (
      <main className="flex min-h-[calc(100vh-13.8rem)] items-center justify-center">
        <Spinner className="h-10 w-10 border-[3px]" />
      </main>
    );
  }

  const resolvedError = error ?? scansError;
  if (resolvedError) {
    return (
      <main className="fixed bottom-[4.2rem] left-1/2 top-[8.6rem] z-10 flex w-full max-w-[30rem] -translate-x-1/2 flex-col overflow-hidden px-4">
        <h1 className="sticky top-0 z-10 shrink-0 bg-[#031d3b] py-1 text-left text-4xl font-extrabold tracking-tight">
          {t("welcome.title")}
        </h1>
        <section className="mt-3 flex min-h-0 flex-1 flex-col overflow-y-auto pb-2 pr-1">
          <p className="text-[#ff8181]">{resolvedError}</p>
        </section>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="fixed bottom-[4.2rem] left-1/2 top-[8.6rem] z-10 flex w-full max-w-[30rem] -translate-x-1/2 flex-col overflow-hidden px-4">
        <h1 className="sticky top-0 z-10 shrink-0 bg-[#031d3b] py-1 text-left text-4xl font-extrabold tracking-tight">
          {t("welcome.title")}
        </h1>
        <section className="mt-3 flex min-h-0 flex-1 flex-col overflow-y-auto pb-2 pr-1">
          <p>{t("common.emptyList")}</p>
        </section>
      </main>
    );
  }

  return (
    <main className="fixed bottom-[4.2rem] left-1/2 top-[8.6rem] z-10 flex w-full max-w-[30rem] -translate-x-1/2 flex-col overflow-hidden px-4">
      <h1 className="sticky top-0 z-10 shrink-0 bg-[#031d3b] py-1 text-left text-4xl font-extrabold tracking-tight">
        {t("welcome.title")}
      </h1>
      <section className="mt-3 grid min-h-0 flex-1 content-start grid-cols-2 gap-3 overflow-y-auto pb-2 pr-1">
        {items.map((sponsor) => (
          <Link
            key={sponsor.id}
            href={`/sponsor/${sponsor.id}`}
            className="relative aspect-square rounded-xl border border-white/20 bg-gradient-to-br from-white/20 via-white/5 to-white/0 p-3 shadow-[0_8px_30px_rgba(0,0,0,0.45)] backdrop-blur-md"
          >
            {scannedSponsorIds.has(sponsor.id) ? (
              <Image
                src="/check.png"
                alt="Scanned"
                width={36}
                height={36}
                className="absolute -right-2 -top-2 h-9 w-9"
              />
            ) : null}
            <div className="flex h-[72%] items-center justify-center rounded-lg bg-white p-2">
              {sponsor.imageUrl ? (
                <Image
                  src={sponsor.imageUrl}
                  alt={sponsor.name}
                  width={160}
                  height={160}
                  unoptimized
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <span className="text-5xl font-black text-[#033470]">
                  {sponsor.name.slice(0, 1).toUpperCase()}
                </span>
              )}
            </div>
            <p
              className="mt-3 w-full min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-center text-sm font-semibold text-white"
              title={sponsor.name}
            >
              {sponsor.name}
            </p>
          </Link>
        ))}
      </section>
    </main>
  );
}

