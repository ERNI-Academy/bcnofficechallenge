"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { AppLanguage, MessageKey } from "./messages";
import { messages } from "./messages";

const APP_LANG_STORAGE_KEY = "bcnofficechallenge_app_lang";

type I18nContextValue = {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  t: (key: MessageKey) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function detectDefaultLanguage(): AppLanguage {
  const candidates = navigator.languages && navigator.languages.length > 0
    ? navigator.languages
    : [navigator.language];
  const normalized = candidates.map((lang) => lang.toLowerCase());
  return normalized.some((lang) => lang.startsWith("es")) ? "es" : "en";
}

type I18nProviderProps = {
  children: React.ReactNode;
};

export function I18nProvider({ children }: I18nProviderProps) {
  const [language, setLanguageState] = useState<AppLanguage>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(APP_LANG_STORAGE_KEY);
    if (stored === "es" || stored === "en") {
      setLanguageState(stored);
      return;
    }

    const detected = detectDefaultLanguage();
    setLanguageState(detected);
  }, []);

  function setLanguage(lang: AppLanguage) {
    setLanguageState(lang);
    window.localStorage.setItem(APP_LANG_STORAGE_KEY, lang);
  }

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      setLanguage,
      t: (key) => messages[language][key],
    }),
    [language],
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

