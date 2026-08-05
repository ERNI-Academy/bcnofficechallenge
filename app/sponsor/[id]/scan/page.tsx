"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Html5Qrcode } from "html5-qrcode";
import { Spinner } from "@/components/ui/spinner";
import { useAuthSession } from "@/features/auth/client/auth-session-context";
import { useI18n } from "@/features/i18n/i18n-context";
import { createScan } from "@/features/scans/client/scans-api";
import { getSponsorByQrId } from "@/features/sponsors/client/sponsor-details-api";
import { useUserScans } from "@/features/scans/hooks/use-user-scans";
import { useSponsorDetails } from "@/features/sponsors/hooks/use-sponsor-details";

const SCANNER_ELEMENT_ID = "qr-reader";

type QrPayload = {
  qrId?: string | number;
  id?: string | number;
  name?: string;
};

export default function SponsorScanPage() {
  const { t, language } = useI18n();
  const params = useParams<{ id: string }>();
  const sponsorId = params.id;
  const router = useRouter();
  const { user } = useAuthSession();
  const userId = user?.id;
  const { item: sponsor, loading: sponsorLoading, error: sponsorError } =
    useSponsorDetails(sponsorId);
  const {
    scannedSponsorIds,
    loading: scansLoading,
    error: scansError,
    refresh,
  } = useUserScans(userId);

  const [cameraError, setCameraError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [successToastVisible, setSuccessToastVisible] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isHandlingRef = useRef(false);
  const successTimeoutRef = useRef<number | null>(null);

  const isScanned = scannedSponsorIds.has(sponsorId);
  const canStartScanner =
    !sponsorLoading &&
    !scansLoading &&
    sponsor !== null &&
    !isScanned &&
    !processing;

  const combinedError = sponsorError ?? scansError ?? cameraError;

  useEffect(() => {
    if (!canStartScanner || userId === undefined) {
      return;
    }

    let isUnmounted = false;
    const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID);
    scannerRef.current = scanner;

    async function stopScanner() {
      if (!scannerRef.current) {
        return;
      }

      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
      } catch {
        // Ignore cleanup errors.
      }

      try {
        await scannerRef.current.clear();
      } catch {
        // Ignore cleanup errors.
      }
      scannerRef.current = null;
    }

    async function onScanSuccess(decodedText: string) {
      if (isHandlingRef.current || isUnmounted) {
        return;
      }

      isHandlingRef.current = true;
      setProcessing(true);
      setCameraError(null);

      try {
        const parsed = JSON.parse(decodedText) as QrPayload;
        const rawQrId = parsed.qrId ?? parsed.id;
        const resolvedQrId =
          rawQrId === undefined || rawQrId === null
            ? ""
            : String(rawQrId).trim();

        if (!resolvedQrId) {
          throw new Error(t("sponsor.scanInvalidPayload"));
        }

        const resolvedSponsor = await getSponsorByQrId(resolvedQrId);
        if (resolvedSponsor.id !== sponsorId) {
          throw new Error(t("sponsor.scanWrongSponsor"));
        }

        if (userId === undefined) {
          throw new Error(t("sponsor.scanNotAuthenticated"));
        }

        await stopScanner();
        await createScan({
          userId,
          qrId: resolvedQrId,
        });

        await refresh();
        setSuccessToastVisible(true);
        setProcessing(false);

        successTimeoutRef.current = window.setTimeout(() => {
          setSuccessToastVisible(false);
          router.replace("/welcome");
        }, 3000);
      } catch (scanError) {
        setCameraError(
          scanError instanceof Error
            ? scanError.message
            : t("sponsor.scanUnexpectedError"),
        );
        isHandlingRef.current = false;
        setProcessing(false);
      }
    }

    async function start() {
      try {
        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 260, height: 260 },
          },
          onScanSuccess,
          () => {
            // Ignore not-found frame callbacks.
          },
        );
      } catch (startError) {
        setCameraError(
          startError instanceof Error
            ? startError.message
            : t("sponsor.scanStartCameraError"),
        );
      }
    }

    void start();

    return () => {
      isUnmounted = true;
      if (successTimeoutRef.current !== null) {
        window.clearTimeout(successTimeoutRef.current);
      }
      void stopScanner();
    };
  }, [canStartScanner, refresh, router, sponsorId, t, userId]);

  const title = useMemo(
    () =>
      language === "es"
        ? `${t("sponsor.scanTitlePrefix")} ${sponsor?.name ?? t("common.sponsor")}`
        : `${t("sponsor.scanTitlePrefix")} ${sponsor?.name ?? t("common.sponsor")} ${t("sponsor.scanTitleSuffix")}`,
    [language, sponsor?.name, t],
  );

  if (sponsorLoading || scansLoading) {
    return (
      <main className="flex min-h-[calc(100vh-13.8rem)] items-center justify-center">
        <Spinner className="h-10 w-10 border-[3px]" />
      </main>
    );
  }

  if (sponsor === null) {
    return (
      <main className="fixed bottom-[4.2rem] left-1/2 top-[8.6rem] z-10 flex w-full max-w-[30rem] -translate-x-1/2 flex-col overflow-hidden px-4">
        <h1 className="sticky top-0 z-10 shrink-0 bg-[#031d3b] py-1 text-left text-3xl font-extrabold tracking-tight">
          {t("common.sponsor")}
        </h1>
        <section className="mt-3 flex min-h-0 flex-1 flex-col overflow-y-auto pb-2 pr-1">
          <p>{t("common.sponsorNotFound")}</p>
        </section>
      </main>
    );
  }

  return (
    <main className="fixed bottom-[4.2rem] left-1/2 top-[8.6rem] z-10 flex w-full max-w-[30rem] -translate-x-1/2 flex-col overflow-hidden px-4">
      <h1 className="sticky top-0 z-10 shrink-0 bg-[#031d3b] py-1 text-left text-3xl font-extrabold tracking-tight">
        {title}
      </h1>

      <section className="relative mt-3 flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto pb-2 pr-1">
        {combinedError ? (
          <p className="mb-4 text-center text-[#ff8181]">{combinedError}</p>
        ) : null}

        {isScanned ? (
          <div className="flex flex-col items-center gap-3">
            <Image
              src="/check.png"
              alt="Scanned"
              width={56}
              height={56}
              className="h-14 w-14"
            />
            <p className="text-center text-base text-white">
              {t("sponsor.scanAlreadyScanned")}
            </p>
          </div>
        ) : (
          <div className="relative h-[18rem] w-[18rem] overflow-hidden rounded-2xl border border-white/20 bg-black/25 p-2">
            <div id={SCANNER_ELEMENT_ID} className="h-full w-full rounded-xl" />
            {processing ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/45">
                <Spinner className="h-10 w-10 border-[3px]" />
              </div>
            ) : null}
          </div>
        )}
      </section>

      {successToastVisible ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-3 z-20 flex justify-center px-4">
          <div className="rounded-lg bg-[#1f9d50] px-4 py-3 text-sm font-semibold text-white shadow-lg">
            {t("sponsor.scanSuccess")}
          </div>
        </div>
      ) : null}
    </main>
  );
}

