"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { LoggedUser } from "@/features/auth/types";

type AuthSessionContextValue = {
  user: LoggedUser | null;
  ready: boolean;
  isAuthenticated: boolean;
  setAuthenticatedUser: (user: LoggedUser) => void;
  logout: () => Promise<void>;
};

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

export function AuthSessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LoggedUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    void fetch("/api/users/session", { cache: "no-store" })
      .then(async (response) =>
        response.ok ? ((await response.json()) as LoggedUser) : null,
      )
      .then((sessionUser) => {
        if (active) setUser(sessionUser);
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setReady(true);
      });

    return () => {
      active = false;
    };
  }, []);

  const setAuthenticatedUser = useCallback((nextUser: LoggedUser) => {
    setUser(nextUser);
    setReady(true);
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    try {
      await fetch("/api/users/logout", { method: "POST" });
    } catch {
      // Local logout still completes if the request fails.
    }
  }, []);

  const value = useMemo<AuthSessionContextValue>(
    () => ({
      user,
      ready,
      isAuthenticated: user !== null,
      setAuthenticatedUser,
      logout,
    }),
    [user, ready, setAuthenticatedUser, logout],
  );

  return (
    <AuthSessionContext.Provider value={value}>
      {children}
    </AuthSessionContext.Provider>
  );
}

export function useAuthSession() {
  const context = useContext(AuthSessionContext);
  if (!context) {
    throw new Error("useAuthSession must be used within AuthSessionProvider");
  }
  return context;
}
