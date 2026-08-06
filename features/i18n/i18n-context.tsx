"use client";

import { createContext, useContext, useMemo } from "react";
import type { AppLanguage, MessageKey } from "./messages";
import { messages } from "./messages";

type I18nContextValue = {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  t: (key: MessageKey) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const value = useMemo<I18nContextValue>(
    () => ({
      language: "en",
      setLanguage: () => undefined,
      t: (key) => messages.en[key],
    }),
    [],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}
