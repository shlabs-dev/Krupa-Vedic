"use client";
// Makes the chosen language available to client components via useLang()
import { createContext, useContext, useMemo } from "react";
import { tr, pick, term, mantra } from "@/lib/i18n";

const LangCtx = createContext("en");

export function LangProvider({ lang, children }) {
  return <LangCtx.Provider value={lang}>{children}</LangCtx.Provider>;
}

export function useLang() {
  const lang = useContext(LangCtx);
  return useMemo(() => ({
    lang,
    t: tr(lang),
    pick: (obj, field) => pick(obj, field, lang),
    term: (w) => term(lang, w),
    mantra: (s) => mantra(s, lang),
  }), [lang]);
}
