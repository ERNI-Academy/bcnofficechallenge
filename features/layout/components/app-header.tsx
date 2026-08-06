"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthSession } from "@/features/auth/client/auth-session-context";
import { useI18n } from "@/features/i18n/i18n-context";
import { getUserPoints } from "@/features/users/client/user-points-api";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
};

export function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, ready, isAuthenticated, logout } = useAuthSession();
  const { t } = useI18n();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [points, setPoints] = useState<number | null>(user?.points ?? null);
  const [pointsLoading, setPointsLoading] = useState(false);
  const [pointsError, setPointsError] = useState<string | null>(null);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installHint, setInstallHint] = useState<string | null>(null);
  const [isStandaloneMode, setIsStandaloneMode] = useState(false);
  const [installPlatform, setInstallPlatform] = useState<
    "iphone" | "android" | "other"
  >("other");

  useEffect(() => {
    setIsDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    let cancelled = false;

    async function loadPoints() {
      if (!isDrawerOpen || user === null) {
        return;
      }

      setPointsLoading(true);
      setPointsError(null);

      try {
        const response = await getUserPoints(user.id);
        if (cancelled) {
          return;
        }
        setPoints(response.points);
      } catch (error) {
        if (cancelled) {
          return;
        }
        setPointsError(
          error instanceof Error
            ? error.message
            : t("common.unexpectedError"),
        );
      } finally {
        if (!cancelled) {
          setPointsLoading(false);
        }
      }
    }

    void loadPoints();

    return () => {
      cancelled = true;
    };
  }, [isDrawerOpen, user, t]);

  useEffect(() => {
    const ua = navigator.userAgent || "";
    const isIPhone = /iPhone|iPad|iPod/i.test(ua);
    const isAndroid = /Android/i.test(ua);

    if (isIPhone) {
      setInstallPlatform("iphone");
    } else if (isAndroid) {
      setInstallPlatform("android");
    } else {
      setInstallPlatform("other");
    }
  }, []);

  useEffect(() => {
    function syncStandaloneMode() {
      const standaloneByMedia = window.matchMedia("(display-mode: standalone)").matches;
      const standaloneByNavigator =
        "standalone" in navigator &&
        Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
      setIsStandaloneMode(standaloneByMedia || standaloneByNavigator);
    }

    syncStandaloneMode();

    const media = window.matchMedia("(display-mode: standalone)");
    const handleDisplayModeChange = () => {
      syncStandaloneMode();
    };

    media.addEventListener("change", handleDisplayModeChange);

    return () => {
      media.removeEventListener("change", handleDisplayModeChange);
    };
  }, []);

  useEffect(() => {
    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
      setInstallHint(null);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  function goTo(path: string) {
    router.push(path);
  }

  async function handleInstallApp() {
    if (isStandaloneMode) {
      setInstallHint(t("header.alreadyInstalled"));
      return;
    }

    if (installPrompt) {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setInstallHint(t("header.addedToHome"));
      } else {
        setInstallHint(t("header.installCancelled"));
      }
      setInstallPrompt(null);
      return;
    }

    if (installPlatform === "iphone") {
      setInstallHint(t("header.installHintIphone"));
      return;
    }

    if (installPlatform === "android") {
      setInstallHint(t("header.installHintAndroid"));
      return;
    }

    setInstallHint(t("header.installHintGeneric"));
  }

  const installButtonLabel =
    installPlatform === "iphone"
      ? t("header.installAppIphone")
      : installPlatform === "android"
        ? t("header.installAppAndroid")
        : t("header.installApp");
  const displayName = user?.fullName?.trim() || t("header.userDefault");

  const nameSizeClass =
    displayName.length <= 16
      ? "text-3xl"
      : displayName.length <= 24
        ? "text-2xl"
        : displayName.length <= 34
          ? "text-xl"
          : "text-lg";

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-20 flex items-center justify-between bg-[#033470] px-5 py-4">
        <Link href="/welcome" aria-label="Go to welcome">
          <Image
            src="/erniLogoWhite.png"
            alt="ERNI logo"
            width={100}
            height={38}
            className="h-auto w-auto"
            priority
          />
        </Link>
        {ready && isAuthenticated ? (
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            aria-label={t("header.openMenu")}
            className="flex h-10 w-10 items-center justify-center rounded-md text-white"
          >
            <span className="sr-only">{t("header.openMenu")}</span>
            <span aria-hidden="true" className="flex flex-col gap-1.5">
              <span className="h-0.5 w-6 rounded bg-white" />
              <span className="h-0.5 w-6 rounded bg-white" />
              <span className="h-0.5 w-6 rounded bg-white" />
            </span>
          </button>
        ) : null}
      </header>

      {ready && isAuthenticated ? (
        <div
          className={`fixed inset-0 z-30 transition-opacity duration-300 ${
            isDrawerOpen
              ? "pointer-events-auto bg-black/45 opacity-100"
              : "pointer-events-none opacity-0"
          }`}
          onClick={() => setIsDrawerOpen(false)}
        >
          <aside
            className={`absolute right-0 top-0 flex h-full w-[17rem] flex-col bg-[#0f3156] px-6 pb-6 pt-[5.6rem] text-white shadow-2xl transition-transform duration-300 ${
              isDrawerOpen ? "translate-x-0" : "translate-x-full"
            }`}
            onClick={(event) => event.stopPropagation()}
          >
            {!isStandaloneMode ? (
              <>
                <button
                  type="button"
                  onClick={handleInstallApp}
                  className="mb-4 min-h-10 rounded-[0.55rem] bg-[#ff5b00] px-3 py-2 text-left text-sm font-bold text-white"
                >
                  {installButtonLabel}
                </button>
                {installHint ? (
                  <p className="mb-3 text-xs text-white/80">{installHint}</p>
                ) : null}
              </>
            ) : null}

            <h2 className="text-left text-3xl font-extrabold tracking-tight">
              {t("header.menu")}
            </h2>

            <nav className="mt-5 flex flex-col gap-4 text-lg">
              <button
                type="button"
                onClick={() => goTo("/welcome")}
                className="text-left underline underline-offset-4"
              >
                {t("header.sponsors")}
              </button>
              <button
                type="button"
                onClick={() => goTo("/leaderboard")}
                className="text-left underline underline-offset-4"
              >
                {t("header.leaderboard")}
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="text-left underline underline-offset-4"
              >
                {t("header.logout")}
              </button>
            </nav>

            <section className="mt-auto pt-6 text-left">
              <button
                type="button"
                onClick={() => goTo("/how-it-works")}
                className="mb-5 flex items-center gap-2 text-left"
              >
                <Image
                  src="/ask_icon.png"
                  alt={t("header.howItWorks")}
                  width={22}
                  height={22}
                  className="h-[1.15rem] w-[1.15rem] object-contain"
                />
                <span className="underline underline-offset-4">
                  {t("header.howItWorks")}
                </span>
              </button>
              <p
                className={`truncate whitespace-nowrap font-extrabold leading-tight text-white ${nameSizeClass}`}
              >
                {displayName}
              </p>
              {pointsLoading ? (
                <p className="mt-2 text-sm text-white/80">{t("header.loadingPoints")}</p>
              ) : pointsError ? (
                <p className="mt-2 text-sm text-[#ff9b9b]">{pointsError}</p>
              ) : (
                <p className="mt-2 text-2xl font-extrabold leading-tight text-white">
                  {points ?? 0} {t("header.pointsUnit")}
                </p>
              )}
            </section>
          </aside>
        </div>
      ) : null}
    </>
  );
}

