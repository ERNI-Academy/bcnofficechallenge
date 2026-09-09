"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useAuthSession } from "@/features/auth/client/auth-session-context";
import { useUserCuriosities } from "@/features/curiosities/hooks/use-user-curiosities";
import { useI18n } from "@/features/i18n/i18n-context";
import { useUserScans } from "@/features/scans/hooks/use-user-scans";
import type { Sponsor } from "@/features/sponsors/types";
import { useSponsors } from "@/features/sponsors/hooks/use-sponsors";

export default function WelcomePage() {
  const router = useRouter();
  const { t } = useI18n();
  const { isAuthenticated } = useAuthSession();
  const { items, loading, error } = useSponsors();
  const {
    scannedSponsorIds,
    loading: scansLoading,
    error: scansError,
  } = useUserScans(isAuthenticated);
  const {
    viewedSponsorIds,
    loading: curiositiesLoading,
    markViewed,
  } = useUserCuriosities(isAuthenticated);
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);
  const [openingRoomId, setOpeningRoomId] = useState<string | null>(null);

  async function handleRoomClick(sponsor: Sponsor) {
    if (openingRoomId) return;

    if (!sponsor.curiosity || viewedSponsorIds.has(sponsor.id)) {
      router.push(`/sponsor/${sponsor.id}`);
      return;
    }

    setOpeningRoomId(sponsor.id);
    try {
      await markViewed(sponsor.id);
      setSelectedSponsor(sponsor);
    } catch {
      router.push(`/sponsor/${sponsor.id}`);
    } finally {
      setOpeningRoomId(null);
    }
  }

  function continueToRoom() {
    if (!selectedSponsor) return;
    const roomId = selectedSponsor.id;
    setSelectedSponsor(null);
    router.push(`/sponsor/${roomId}`);
  }

  if (loading || scansLoading || curiositiesLoading) {
    return (
      <main className="flex min-h-[calc(100vh-13.8rem)] items-center justify-center">
        <Spinner className="h-10 w-10 border-[3px]" />
      </main>
    );
  }

  const resolvedError = error ?? scansError;
  if (resolvedError) {
    return (
      <main className="fixed bottom-[4.2rem] left-1/2 top-[var(--app-content-top)] z-10 flex w-full max-w-[30rem] -translate-x-1/2 flex-col overflow-hidden px-4">
        <h1 className="sticky top-0 z-10 shrink-0 bg-[#033470] py-1 text-left text-4xl font-extrabold tracking-tight">
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
      <main className="fixed bottom-[4.2rem] left-1/2 top-[var(--app-content-top)] z-10 flex w-full max-w-[30rem] -translate-x-1/2 flex-col overflow-hidden px-4">
        <h1 className="sticky top-0 z-10 shrink-0 bg-[#033470] py-1 text-left text-4xl font-extrabold tracking-tight">
          {t("welcome.title")}
        </h1>
        <section className="mt-3 flex min-h-0 flex-1 flex-col overflow-y-auto pb-2 pr-1">
          <p>{t("common.emptyList")}</p>
        </section>
      </main>
    );
  }

  return (
    <>
      <main className="fixed bottom-[4.2rem] left-1/2 top-[var(--app-content-top)] z-10 flex w-full max-w-[30rem] -translate-x-1/2 flex-col overflow-hidden px-4">
      <h1 className="sticky top-0 z-10 shrink-0 bg-[#033470] py-1 text-left text-4xl font-extrabold tracking-tight">
        {t("welcome.title")}
      </h1>
      <section className="mt-3 grid min-h-0 flex-1 content-start grid-cols-2 gap-3 overflow-y-auto pb-2 pr-1">
        {items.map((sponsor) => (
          <button
            key={sponsor.id}
            type="button"
            onClick={() => void handleRoomClick(sponsor)}
            disabled={openingRoomId !== null}
            className="relative aspect-square rounded-xl border border-white/20 bg-gradient-to-br from-white/20 via-white/5 to-white/0 p-3 text-left shadow-[0_8px_30px_rgba(0,0,0,0.45)] backdrop-blur-md disabled:cursor-wait disabled:opacity-70"
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
          </button>
        ))}
      </section>
      </main>

    {selectedSponsor ? (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 px-5 py-6">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="curiosity-title"
          className="flex max-h-[85dvh] w-full max-w-[22rem] flex-col overflow-y-auto rounded-2xl border border-white/20 bg-[#0f3156] p-6 text-white shadow-2xl"
        >
          <Image
            src="/didYouKnow.png"
            alt="Did you know?"
            width={180}
            height={180}
            className="mx-auto mb-4 h-28 w-28 object-contain"
          />
          <h2 id="curiosity-title" className="text-center text-2xl font-extrabold text-[#ffc24d]">
            {t("curiosity.title")}
          </h2>
          <p className="mt-4 whitespace-pre-wrap text-center text-base leading-6 text-white/95">
            {selectedSponsor.curiosity}
          </p>
          <button
            type="button"
            onClick={continueToRoom}
            className="mt-6 h-12 w-full rounded-[0.55rem] border-none bg-[#ff5b00] text-base font-bold text-white"
          >
            {t("curiosity.button")}
          </button>
        </div>
      </div>
    ) : null}
    </>
  );
}

