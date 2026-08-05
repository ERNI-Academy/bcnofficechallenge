"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthSession } from "@/features/auth/client/auth-session-context";
import { hasSeenRaffle } from "@/features/raffle/client/storage";

const PUBLIC_PATHS = new Set(["/", "/sign-up", "/auth/linkedin/success"]);

type AuthRouteGuardProps = {
  children: React.ReactNode;
};

export function AuthRouteGuard({ children }: AuthRouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { ready, isAuthenticated } = useAuthSession();

  useEffect(() => {
    if (!ready) {
      return;
    }

    const isPublic = PUBLIC_PATHS.has(pathname);

    if (!isAuthenticated && !isPublic) {
      router.replace("/");
      return;
    }

    if (isAuthenticated && pathname === "/") {
      router.replace("/welcome");
      return;
    }

    if (
      isAuthenticated &&
      pathname !== "/raffle" &&
      pathname !== "/auth/linkedin/success" &&
      !hasSeenRaffle()
    ) {
      router.replace("/raffle");
    }
  }, [ready, isAuthenticated, pathname, router]);

  if (!ready) {
    return null;
  }

  const isPublic = PUBLIC_PATHS.has(pathname);
  if (!isAuthenticated && !isPublic) {
    return null;
  }

  if (isAuthenticated && pathname === "/") {
    return null;
  }

  if (
    isAuthenticated &&
    pathname !== "/raffle" &&
    pathname !== "/auth/linkedin/success" &&
    !hasSeenRaffle()
  ) {
    return null;
  }

  return <>{children}</>;
}

