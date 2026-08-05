"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { useAuthSession } from "@/features/auth/client/auth-session-context";
import { useI18n } from "@/features/i18n/i18n-context";
import { isRaffleEndedAt } from "@/features/raffle/constants";
import { useUserScans } from "@/features/scans/hooks/use-user-scans";
import { useSponsorDetails } from "@/features/sponsors/hooks/use-sponsor-details";
import { formatSponsorDescription } from "@/features/sponsors/utils/description-format";

function sponsorWebsiteHref(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) {
    return null;
  }
  const lower = trimmed.toLowerCase();
  if (lower.startsWith("javascript:") || lower.startsWith("data:")) {
    return null;
  }
  return trimmed;
}

export default function SponsorDetailsPage() {
  const { t } = useI18n();
  const params = useParams<{ id: string }>();
  const sponsorId = params.id;
  const { user } = useAuthSession();
  const userId = user?.id;
  const {
    scannedSponsorIds,
    loading: scansLoading,
    error: scansError,
  } = useUserScans(userId);
  const { item: sponsor, loading, error } = useSponsorDetails(sponsorId);
  const descriptionBlocks = sponsor
    ? formatSponsorDescription(sponsor.description)
    : [];
  const isScanned = scannedSponsorIds.has(sponsorId);
  const [isRaffleEnded, setIsRaffleEnded] = useState(false);
  const websiteHref = sponsor ? sponsorWebsiteHref(sponsor.url) : null;

  useEffect(() => {
    const syncStatus = () => {
      setIsRaffleEnded(isRaffleEndedAt());
    };

    syncStatus();
    const timer = window.setInterval(syncStatus, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

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
        <Link
          href="/welcome"
          className="mb-1 mt-1 inline-flex w-fit items-center gap-2 text-sm font-semibold text-white/90"
        >
          <span aria-hidden="true">←</span>
          <span>{t("common.goBack")}</span>
        </Link>
        <h1 className="sticky top-0 z-10 shrink-0 bg-[#031d3b] py-1 text-left text-3xl font-extrabold tracking-tight">
          {t("common.sponsor")}
        </h1>
        <section className="mt-3 flex min-h-0 flex-1 flex-col overflow-y-auto pb-24 pr-1">
          <p className="text-[#ff8181]">{resolvedError}</p>
        </section>
      </main>
    );
  }

  if (!sponsor) {
    return (
      <main className="fixed bottom-[4.2rem] left-1/2 top-[8.6rem] z-10 flex w-full max-w-[30rem] -translate-x-1/2 flex-col overflow-hidden px-4">
        <Link
          href="/welcome"
          className="mb-1 mt-1 inline-flex w-fit items-center gap-2 text-sm font-semibold text-white/90"
        >
          <span aria-hidden="true">←</span>
          <span>{t("common.goBack")}</span>
        </Link>
        <h1 className="sticky top-0 z-10 shrink-0 bg-[#031d3b] py-1 text-left text-3xl font-extrabold tracking-tight">
          {t("common.sponsor")}
        </h1>
        <section className="mt-3 flex min-h-0 flex-1 flex-col overflow-y-auto pb-24 pr-1">
          <p>{t("common.sponsorNotFound")}</p>
        </section>
      </main>
    );
  }

  return (
    <main className="fixed bottom-[4.2rem] left-1/2 top-[8.6rem] z-10 flex w-full max-w-[30rem] -translate-x-1/2 flex-col overflow-hidden px-4">
      <Link
        href="/welcome"
        className="mb-1 mt-1 inline-flex w-fit items-center gap-2 text-sm font-semibold text-white/90"
      >
        <span aria-hidden="true">←</span>
        <span>{t("common.goBack")}</span>
      </Link>
      <h1 className="sticky top-0 z-10 flex shrink-0 items-center gap-2 bg-[#031d3b] py-1 text-left text-3xl font-extrabold tracking-tight">
        <span>{sponsor.name}</span>
        {isScanned ? (
          <Image
            src="/check.png"
            alt="Scanned"
            width={34}
            height={34}
            className="h-8 w-8"
          />
        ) : null}
      </h1>

      <section className="relative mt-3 min-h-0 flex-1 overflow-y-auto pb-24 pr-1">
        {websiteHref ? (
          <a
            href={websiteHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("sponsor.openLogoLink")}
            className="float-left mb-3 mr-4 flex aspect-square w-1/3 min-w-[96px] max-w-[150px] items-center justify-center rounded-xl border border-white/20 bg-white from-white/20 via-white/5 to-white/0 p-3 shadow-[0_8px_30px_rgba(0,0,0,0.45)] backdrop-blur-md transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
          >
            <img
              src={sponsor.imageUrl}
              alt=""
              className="max-h-full max-w-full object-contain"
            />
          </a>
        ) : (
          <div className="float-left mb-3 mr-4 flex aspect-square w-1/3 min-w-[96px] max-w-[150px] items-center justify-center rounded-xl border border-white/20 bg-white from-white/20 via-white/5 to-white/0 p-3 shadow-[0_8px_30px_rgba(0,0,0,0.45)] backdrop-blur-md">
            <img
              src={sponsor.imageUrl}
              alt={sponsor.name}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        )}

        <div className="text-sm leading-6 text-white/95">
          {descriptionBlocks.map((block, blockIndex) => {
            if (block.type === "spacer") {
              return <div key={`spacer-${blockIndex}`} className="h-4" />;
            }

            if (block.type === "bullet") {
              return (
                <div
                  key={`bullet-${blockIndex}`}
                  className="mt-2 flex items-start gap-2 text-sm leading-6 text-white/95"
                >
                  <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-white/95" />
                  <span>
                    {block.parts.map((part, partIndex) => {
                      if (part.type === "bold") {
                        return (
                          <strong
                            key={`bullet-bold-${blockIndex}-${partIndex}`}
                            className="font-extrabold text-white"
                          >
                            {part.value}
                          </strong>
                        );
                      }
                      if (part.type === "link") {
                        const linkText = part.label ?? part.href;
                        return (
                          <a
                            key={`bullet-link-${blockIndex}-${partIndex}`}
                            href={part.href}
                            target="_blank"
                            rel="noreferrer"
                            className="underline underline-offset-2"
                          >
                            {linkText}
                          </a>
                        );
                      }
                      return (
                        <span key={`bullet-text-${blockIndex}-${partIndex}`}>
                          {part.value}
                        </span>
                      );
                    })}
                  </span>
                </div>
              );
            }

            return (
              <p
                key={`paragraph-${blockIndex}`}
                className="mt-2 text-sm leading-6 text-white/95"
              >
                {block.parts.map((part, partIndex) => {
                  if (part.type === "bold") {
                    return (
                      <strong
                        key={`paragraph-bold-${blockIndex}-${partIndex}`}
                        className="font-extrabold text-white"
                      >
                        {part.value}
                      </strong>
                    );
                  }
                  if (part.type === "link") {
                    const linkText = part.label ?? part.href;
                    return (
                      <a
                        key={`paragraph-link-${blockIndex}-${partIndex}`}
                        href={part.href}
                        target="_blank"
                        rel="noreferrer"
                        className="underline underline-offset-2"
                      >
                        {linkText}
                      </a>
                    );
                  }
                  return (
                    <span key={`paragraph-text-${blockIndex}-${partIndex}`}>
                      {part.value}
                    </span>
                  );
                })}
              </p>
            );
          })}
        </div>
      </section>

      {!isScanned ? (
        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-[#031d3b] via-[#031d3b] to-transparent px-4 pb-2 pt-6">
          {isRaffleEnded ? (
            <p className="text-center text-base font-bold text-white">
              {t("sponsor.scanParticipationEnded")}
            </p>
          ) : (
            <Link
              href={`/sponsor/${sponsor.id}/scan`}
              className="flex h-12 w-full items-center justify-center rounded-[0.55rem] bg-[#ff5b00] text-base font-bold text-white"
            >
              {t("sponsor.scanQr")}
            </Link>
          )}
        </div>
      ) : null}
    </main>
  );
}

