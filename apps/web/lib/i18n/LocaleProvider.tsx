"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import type { Locale } from "@/types";
import { dictionary } from "./dictionary";

const STORAGE_KEY = "locale";
const listeners = new Set<() => void>();

function readLocale(): Locale {
  return window.localStorage.getItem(STORAGE_KEY) === "ja" ? "ja" : "en";
}

function getServerSnapshot(): Locale {
  return "en";
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function writeLocale(next: Locale) {
  window.localStorage.setItem(STORAGE_KEY, next);
  document.documentElement.lang = next;
  for (const listener of listeners) listener();
}

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: (typeof dictionary)["en"];
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(subscribe, readLocale, getServerSnapshot);

  const setLocale = useCallback((next: Locale) => writeLocale(next), []);
  const toggleLocale = useCallback(() => writeLocale(readLocale() === "en" ? "ja" : "en"), []);

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, setLocale, toggleLocale, t: dictionary[locale] }),
    [locale, setLocale, toggleLocale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
