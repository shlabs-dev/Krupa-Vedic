import Link from "next/link";
import { db } from "@/lib/db";
import { getT } from "@/lib/lang";
import { pick, term } from "@/lib/i18n";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export async function generateMetadata() {
  const { t } = await getT();
  return { title: `${t("nav.ashtotharas")} — Krupa` };
}

export default async function AshtotharasPage() {
  const deities = await db.deity.findMany({
    where: { deletedAt: null, ashtothara: { isNot: null } },
    orderBy: { sortOrder: "asc" },
    include: { ashtothara: { select: { id: true, title: true } } },
  });
  const { lang, t } = await getT();

  return (
    <>
      <Navbar />
      <div className="ashto-page">
        <div className="ashto-hero">
          <div className="ashto-hero-pat" />
          <p className="sec-lbl" style={{ position: "relative" }}>{t("ashto.lbl")}</p>
          <h1 className="ser" style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(32px,5vw,58px)", fontWeight: 300, color: "var(--charcoal)", marginBottom: 8, position: "relative", lineHeight: 1.1 }}>
            {t("ashto.ttl1")}<br /><em style={{ fontStyle: "italic", color: "var(--gold)" }}>{t("ashto.ttl2")}</em>
          </h1>
          <p className="ser" style={{ fontSize: 18, fontStyle: "italic", color: "var(--muted)", fontWeight: 300, position: "relative" }}>
            {t("ashto.tagline")}
          </p>
        </div>

        <div className="sec">
          <div className="sec-hd">
            <div className="div-ln" />
            <p className="sec-lbl">{t("ashto.selectLbl")}</p>
            <h2 className="sec-ttl ser">{t("ashto.selectTtl")}</h2>
            <p className="sec-dsc">{t("ashto.selectDsc")}</p>
          </div>
          <div className="deity-grid">
            {deities.map((d) => (
              <Link key={d.id} href={`/ashtotharas/${d.slug}`} className="deity-card">
                <div className="dc-img" style={{ background: `linear-gradient(135deg,${d.color}18,${d.color}30)` }}>
                  <span style={{ fontSize: 64 }}>{d.symbol}</span>
                </div>
                <div className="dc-body">
                  <div className="dc-name ser">{pick(d, "name", lang)}</div>
                  <div className="dc-ep">{pick(d, "epithet", lang)}</div>
                  <div style={{ fontSize: 11, color: "var(--gold)", marginTop: 6, letterSpacing: ".06em" }}>{t("ashto.available")}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

// Always read fresh data from the database (admin edits show immediately)
export const dynamic = "force-dynamic";
