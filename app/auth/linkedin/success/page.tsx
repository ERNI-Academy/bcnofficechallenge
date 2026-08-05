"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { useAuthSession } from "@/features/auth/client/auth-session-context";
import { useI18n } from "@/features/i18n/i18n-context";
import type { LoggedUser } from "@/features/auth/types";

export default function LinkedInSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuthenticatedUser } = useAuthSession();
  const { t } = useI18n();
  const oauthError = searchParams.get("error");

  useEffect(() => {
    if (oauthError) {
      return;
    }

    let isCancelled = false;

    async function hydrateSession() {
      try {
        const response = await fetch("/api/users/session", {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        });

        if (!response.ok) {
          if (!isCancelled) {
            router.replace("/");
          }
          return;
        }

        const user = (await response.json()) as LoggedUser;
        if (!isCancelled) {
          setAuthenticatedUser(user);
          router.replace("/welcome");
        }
      } catch {
        if (!isCancelled) {
          router.replace("/");
        }
      }
    }

    void hydrateSession();

    return () => {
      isCancelled = true;
    };
  }, [oauthError, router, setAuthenticatedUser]);

  if (oauthError) {
    return (
      <main className="mx-auto flex w-full max-w-[30rem] flex-col items-center px-4 pt-6 text-center">
        <p className="text-[#ff8181]">{oauthError}</p>
        <Link href="/" className="mt-4 underline">
          {t("linkedin.backToLogin")}
        </Link>
      </main>
    );
  }

  return (
    <main className="flex min-h-[calc(100vh-13.8rem)] items-center justify-center">
      <Spinner className="h-10 w-10 border-[3px]" />
    </main>
  );
}

