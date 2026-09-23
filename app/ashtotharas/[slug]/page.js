import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getT } from "@/lib/lang";
import { pick, term, mantra } from "@/lib/i18n";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export async function generateMetadata({ params }) {
  const deity = await db.deity.findUnique({ where: { slug: (await params).slug } });
  const { lang } = await getT();
  return { title: `${deity ? pick(deity, "name", lang) : ""} — ${lang === "ta" ? "அஷ்டோத்திரம்" : "Ashtothara"} — VedicPath` };
}

export default async function AshtotharaDeityPage({ params }) {
  const deity = await db.deity.findUnique({
    where: { slug: (await params).slug },
    include: {
      ashtothara: { include: { names: { orderBy: { num: "asc" } } } },
    },
  });

  if (!deity || !deity.ashtothara) notFound();
  const { ashtothara } = deity;
  const { lang, t } = await getT();

  return (
    <>
      <Navbar />
      <div className="ashto-page">
        {/* Hero */}
        <div className="ashto-hero">
          <div className="ashto-hero-pat" />
          <p className="sec-lbl" style={{ position: "relative" }}>{t("ashto.lbl")}</p>
          <h1 className="ser" style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(32px,5vw,56px)", fontWeight: 300, color: "var(--charcoal)", marginBottom: 6, position: "relative", lineHeight: 1.1 }}>
            {pick(ashtothara, "title", lang)}
          </h1>
          <p className="ser" style={{ fontSize: 17, fontStyle: "italic", color: "var(--muted)", fontWeight: 300, position: "relative" }}>
            {pick(deity, "epithet", lang)}
          </p>
        </div>

        {/* Deity nav strip */}
        <div className="deity-strip">
          <Link href="/ashtotharas" style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: "100px", border: "1px solid var(--divider)", fontSize: 12, color: "var(--muted)", textDecoration: "none", flexShrink: 0 }}>
            {t("ashto.allDeities")}
          </Link>
        </div>

        {/* Content */}
        <div className="ashto-body pe">
          {/* Intro card */}
          <div className="ashto-intro">
            <div style={{ fontSize: 52, opacity: 0.7, flexShrink: 0 }}>{deity.symbol}</div>
            <div>
              <div className="ser" style={{ fontSize: 24, fontWeight: 400, marginBottom: 7 }}>{pick(ashtothara, "title", lang)}</div>
              <div style={{ fontSize: 13, lineHeight: 1.8, color: "var(--muted)", fontWeight: 300 }}>{pick(ashtothara, "intro", lang)}</div>
              <div style={{ fontSize: 10, color: "var(--gold)", letterSpacing: ".15em", marginTop: 9 }}>
                ✦ {t("ashto.count", { n: ashtothara.names.length })}
              </div>
            </div>
          </div>

          {/* Names grid */}
          <div className="names-grid">
            {ashtothara.names.map((n) => (
              <div key={n.id} className="name-card">
                <div className="nc-num">{n.num}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="dev" style={{ fontSize: lang === "ta" ? 15 : 14, fontWeight: lang === "ta" ? 500 : 400, color: "var(--charcoal)", lineHeight: 1.6, marginBottom: 2 }}>{mantra(n.nameDevanagari, lang)}</div>
                  {lang !== "ta" && <div className="ser" style={{ fontSize: 12, fontStyle: "italic", color: "var(--charcoal-soft)", marginBottom: 2 }}>{n.transliteration}</div>}
                  <div style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.5 }}>{pick(n, "meaning", lang)}</div>
                </div>
              </div>
            ))}
          </div>

          {ashtothara.names.length < 108 && (
            <div style={{ textAlign: "center", padding: "32px 0", color: "var(--muted)", fontSize: 13 }}>
              <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.3 }}>🕉</div>
              {t("ashto.remaining", { n: 108 - ashtothara.names.length })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

// Always read fresh data from the database (admin edits show immediately)
export const dynamic = "force-dynamic";
