import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getT } from "@/lib/lang";
import { pick, term } from "@/lib/i18n";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { DeityTabs } from "./DeityTabs";

export async function generateMetadata({ params }) {
  const deity = await db.deity.findUnique({ where: { slug: (await params).slug } });
  const { lang } = await getT();
  return { title: `${deity ? pick(deity, "name", lang) : "Deity"} — Krupa` };
}

export default async function DeityPage({ params }) {
  const deity = await db.deity.findUnique({
    where: { slug: (await params).slug },
    include: {
      shlokas: {
        include: { shloka: true },
        where: { shloka: { deletedAt: null, isPublished: true } },
      },
      ashtothara: true,
    },
  });
  if (!deity) notFound();
  const { lang, t } = await getT();

  const shlokas = deity.shlokas.map((m) => ({
    ...m.shloka,
    tags: JSON.parse(m.shloka.tags || "[]"),
  }));

  return (
    <>
      <Navbar />
      {/* Hero */}
      <div className="dp-hero">
        <div style={{ position: "relative", zIndex: 2, maxWidth: 560 }}>
          <div style={{ display: "inline-block", padding: "4px 15px", borderRadius: "100px", background: "var(--gold-pale)", color: "var(--gold)", fontSize: 10, letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 18 }}>
            {pick(deity, "epithet", lang)}
          </div>
          <div className="dp-name ser">{pick(deity, "name", lang)}</div>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--charcoal-soft)", fontWeight: 300, maxWidth: 480, marginBottom: 24 }}>
            {pick(deity, "description", lang)}
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/deities" className="btn">{t("deity.all")}</Link>
            {deity.ashtothara && (
              <Link href={`/ashtotharas/${deity.slug}`} className="btn-g" style={{ border: "1px solid var(--parchment-deep)" }}>
                {t("deity.names108")}
              </Link>
            )}
          </div>
        </div>
        <div className="dp-bg">{deity.symbol}</div>
      </div>

      {/* Tabs */}
      <div className="sec">
        <DeityTabs deity={deity} shlokas={shlokas} />
      </div>

      <Footer />
    </>
  );
}

// Always read fresh data from the database (admin edits show immediately)
export const dynamic = "force-dynamic";
