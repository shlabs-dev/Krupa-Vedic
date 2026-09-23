"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useLang } from "@/components/LangProvider";

export function ShlokasList({ shlokas, categories, initialCategory }) {
  const [filter, setFilter] = useState(initialCategory || "All");
  const [search, setSearch] = useState("");
  const { t, pick, term, mantra } = useLang();

  const filtered = useMemo(() =>
    shlokas.filter((s) =>
      (filter === "All" || s.category === filter) &&
      [s.title, s.titleTa, s.sanskrit, mantra(s.sanskrit), s.deity?.name, s.deity?.nameTa]
        .some((v) => (v || "").toLowerCase().includes(search.toLowerCase()))
    ), [shlokas, filter, search]);

  return (
    <>
      <div className="srch">
        <span style={{ color: "var(--muted)" }}>🔍</span>
        <input placeholder={t("shlokas.search")} value={search}
          onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className="filt-row">
        {["All", ...categories].map((c) => (
          <button key={c} className={`fp${filter === c ? " on" : ""}`} onClick={() => setFilter(c)}>{c === "All" ? t("shlokas.all") : term(c)}</button>
        ))}
      </div>
      <div className="sh-grid">
        {filtered.map((s) => (
          <Link key={s.id} href={`/shlokas/${s.slug}`} className="sh-card">
            <span className="sh-tag">{term(s.category)}</span>
            <div className="sh-ttl ser">{pick(s, "title")}</div>
            <div className="sh-prev dev">{mantra(s.sanskrit.split("\n")[0])}</div>
            {s.deity && <div style={{ marginTop: 12, fontSize: 11, color: "var(--muted)", letterSpacing: ".06em" }}>— {pick(s.deity, "name")}</div>}
          </Link>
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 0", color: "var(--muted)" }}>
            <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.3 }}>📿</div>
            <div className="ser" style={{ fontSize: 22 }}>{t("shlokas.none")}</div>
          </div>
        )}
      </div>
    </>
  );
}
