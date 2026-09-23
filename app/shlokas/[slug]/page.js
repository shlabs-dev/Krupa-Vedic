"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { useLang } from "@/components/LangProvider";

export default function ShlokaReaderPage() {
  const { slug } = useParams();
  const [shloka, setShloka] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState("1x");
  const [loop, setLoop] = useState(false);
  const { lang, t, pick, term, mantra } = useLang();
  const isTa = lang === "ta";

  useEffect(() => {
    fetch(`/api/shlokas/${slug}`)
      .then((r) => r.json())
      .then((d) => { setShloka(d); setLoading(false); });
  }, [slug]);

  if (loading) return (
    <>
      <Navbar />
      <div style={{ paddingTop: 64 }}>
        <div className="sh-reader">
          <div className="skel skel-h" style={{ width: "60%", marginBottom: 8 }} />
          <div className="skel skel-s" />
          <div className="skel skel-b" />
          <div className="skel skel-b" />
        </div>
      </div>
    </>
  );

  if (!shloka || shloka.error) return (
    <>
      <Navbar />
      <div style={{ paddingTop: 120, textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>📿</div>
        <div className="ser" style={{ fontSize: 28, color: "var(--muted)" }}>{t("shlokas.notFound")}</div>
        <Link href="/shlokas" className="btn" style={{ marginTop: 24, display: "inline-flex" }}>{t("shlokas.back")}</Link>
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 64, background: "var(--ivory)" }}>
        <div className="sh-reader pe">
          <Link href="/shlokas" className="bk">{t("shlokas.back")}</Link>

          {shloka.deity && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 15px", borderRadius: "100px", background: "var(--gold-pale)", color: "var(--gold)", fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 20 }}>
              <span>{shloka.deity.symbol}</span><span>{pick(shloka.deity, "name")}</span>
            </div>
          )}

          <h1 className="ser" style={{ fontSize: 44, fontWeight: 300, lineHeight: 1.1, marginBottom: 40, color: "var(--charcoal)" }}>{pick(shloka, "title")}</h1>

          {/* Audio Player */}
          <div className="audio-pl">
            <button className="ap-btn" onClick={() => setPlaying(!playing)}>{playing ? "⏸" : "▶"}</button>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="ser" style={{ fontSize: 16, color: "var(--ivory)" }}>{pick(shloka, "title")}</div>
              <div style={{ fontSize: 10, color: "rgba(250,247,242,.35)", letterSpacing: ".1em", textTransform: "uppercase", marginTop: 2 }}>
                {pick(shloka.deity, "name")} · {t("shlokas.sacredChant")}
              </div>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
              <div className="ap-bar"><div className="ap-prog" style={{ width: playing ? "45%" : "0%" }} /></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 10, color: "rgba(250,247,242,.25)" }}>0:00</span>
                <span style={{ fontSize: 10, color: "rgba(250,247,242,.25)" }}>–:––</span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {["0.75x", "1x", "1.25x"].map((s) => (
                <button key={s} className={`ap-ctrl${speed === s ? " on" : ""}`} onClick={() => setSpeed(s)}>{s}</button>
              ))}
              <button className={`ap-ctrl${loop ? " on" : ""}`} onClick={() => setLoop(!loop)}>
                {loop ? "🔁 108" : "🔁"}
              </button>
            </div>
          </div>

          {/* Mantra — Tamil letters in Tamil mode, Devanagari in English mode */}
          <div className="sh-blk">
            <div className="sh-blk-lbl">{t("shlokas.mantra")}</div>
            {isTa
              ? <p className="mantra-ta">{mantra(shloka.sanskrit)}</p>
              : <p className="dev" style={{ fontSize: 22, lineHeight: 2, color: "var(--charcoal)", whiteSpace: "pre-line" }}>{shloka.sanskrit}</p>}
          </div>

          {/* Transliteration (English mode only) */}
          {!isTa && <div className="sh-blk">
            <div className="sh-blk-lbl">{t("shlokas.translit")}</div>
            <p className="ser" style={{ fontSize: 18, fontStyle: "italic", lineHeight: 1.8, color: "var(--charcoal-soft)", whiteSpace: "pre-line", fontWeight: 300 }}>{shloka.transliteration}</p>
          </div>}

          {/* Meaning */}
          <div className="sh-blk">
            <div className="sh-blk-lbl">{isTa ? t("shlokas.meaning") : "English Meaning"}</div>
            <p style={{ fontSize: 15, lineHeight: 1.9, color: "var(--charcoal-soft)", fontWeight: 300 }}>{pick(shloka, "meaning")}</p>
          </div>

          {/* Benefits */}
          {pick(shloka, "benefits") && (
            <div className="sh-blk">
              <div className="sh-blk-lbl">{t("shlokas.benefits")}</div>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--muted)", fontWeight: 300, borderLeft: "3px solid var(--gold)", paddingLeft: 18 }}>{pick(shloka, "benefits")}</p>
            </div>
          )}

          {/* Tags */}
          <div className="tag-row">
            {shloka.tags.map((tg) => <span key={tg} className="tag">{term(tg)}</span>)}
          </div>
        </div>
      </div>
    </>
  );
}
