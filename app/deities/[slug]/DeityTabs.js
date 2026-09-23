"use client";
import { useState } from "react";
import Link from "next/link";
import { useLang } from "@/components/LangProvider";

export function DeityTabs({ deity, shlokas }) {
  const [tab, setTab] = useState("about");
  const { t, pick, term, mantra } = useLang();
  const name = pick(deity, "name");

  return (
    <>
      <div className="tabs">
        {["about", "shlokas", "symbolism"].map((x) => (
          <button key={x} className={`tab-btn${tab === x ? " on" : ""}`} onClick={() => setTab(x)}
            >{t(`deity.tab.${x}`)}</button>
        ))}
      </div>

      {tab === "about" && (
        <div style={{ maxWidth: 620 }}>
          <h3 className="ser" style={{ fontSize: 28, fontWeight: 400, marginBottom: 16 }}>{t("deity.about", { name })}</h3>
          <p style={{ fontSize: 14, lineHeight: 1.9, color: "var(--charcoal-soft)", fontWeight: 300, marginBottom: 14 }}>
            {pick(deity, "description")}
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.9, color: "var(--charcoal-soft)", fontWeight: 300 }}>
            {t("deity.aboutMore", { name })}
          </p>
          {deity.ashtothara && (
            <div style={{ marginTop: 24, padding: "18px 22px", borderRadius: "var(--radius-sm)", background: "var(--parchment)", border: "1px solid var(--divider)" }}>
              <p style={{ fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 6 }}>{t("deity.ashtoLbl")}</p>
              <p style={{ fontSize: 13, color: "var(--charcoal-soft)", lineHeight: 1.7, marginBottom: 12 }}>
                {t("deity.ashtoDsc", { name })}
              </p>
              <Link href={`/ashtotharas/${deity.slug}`} className="btn btn-sm">{t("deity.viewNames")}</Link>
            </div>
          )}
        </div>
      )}

      {tab === "shlokas" && (
        shlokas.length > 0 ? (
          <div className="sh-grid">
            {shlokas.map((s) => (
              <Link key={s.id} href={`/shlokas/${s.slug}`} className="sh-card">
                <span className="sh-tag">{term(s.category)}</span>
                <div className="sh-ttl ser">{pick(s, "title")}</div>
                <div className="sh-prev dev">{mantra(s.sanskrit.split("\n")[0])}</div>
              </Link>
            ))}
          </div>
        ) : (
          <p style={{ color: "var(--muted)", fontSize: 14 }}>{t("deity.noShlokas", { name })}</p>
        )
      )}

      {tab === "symbolism" && (
        <div style={{ maxWidth: 580 }}>
          <h3 className="ser" style={{ fontSize: 28, fontWeight: 400, marginBottom: 16 }}>{t("deity.symTtl")}</h3>
          <p style={{ fontSize: 14, lineHeight: 1.9, color: "var(--charcoal-soft)", fontWeight: 300 }}>
            {t("deity.symPre")} <strong style={{ fontFamily: "serif", fontSize: 20, color: "var(--gold)" }}>{deity.symbol}</strong> {t("deity.symDsc", { name })}
          </p>
        </div>
      )}
    </>
  );
}
