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
import { clearStoredUser, getStoredUser, setStoredUser } from "./storage";

type AuthSessionContextValue = {
  user: LoggedUser | null;
  ready: boolean;
  isAuthenticated: boolean;
  setAuthenticatedUser: (user: LoggedUser) => void;
  logout: () => Promise<void>;
};

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

type AuthSessionProviderProps = {
  children: React.ReactNode;
};

export function AuthSessionProvider({ children }: AuthSessionProviderProps) {
  const [user, setUser] = useState<LoggedUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(getStoredUser());
    setReady(true);
  }, []);

  const setAuthenticatedUser = useCallback((nextUser: LoggedUser) => {
    setStoredUser(nextUser);
    setUser(nextUser);
  }, []);

  const logout = useCallback(async () => {
    clearStoredUser();
    setUser(null);
    try {
      await fetch("/api/users/logout", {
        method: "POST",
      });
    } catch {
      // Logout should still succeed client-side even if API cleanup fails.
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

