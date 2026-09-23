"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useLang } from "./LangProvider";

export function LangToggle() {
  const { lang } = useLang();
  const router = useRouter();
  const [pending, start] = useTransition();

  const set = (l) => {
    if (l === lang) return;
    document.cookie = `lang=${l}; path=/; max-age=31536000; samesite=lax`;
    start(() => router.refresh());
  };

  return (
    <div className="lang-tog" style={{ opacity: pending ? 0.6 : 1 }} role="group" aria-label="Language">
      <button className={lang === "en" ? "on" : ""} onClick={() => set("en")} aria-pressed={lang === "en"}>EN</button>
      <button className={lang === "ta" ? "on" : ""} onClick={() => set("ta")} aria-pressed={lang === "ta"}>தமிழ்</button>
    </div>
  );
}
