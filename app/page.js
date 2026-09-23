import Link from "next/link";
import { db } from "@/lib/db";
import { getT } from "@/lib/lang";
import { pick, term, mantra } from "@/lib/i18n";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { OmIcon } from "@/components/OmIcon";

// Server component — data fetched at request time
async function getData() {
  const [deities, shlokas] = await Promise.all([
    db.deity.findMany({ where: { deletedAt: null }, orderBy: { sortOrder: "asc" }, take: 4 }),
    db.shloka.findMany({
      where: { isPublished: true, isFeatured: true, deletedAt: null },
      include: { deities: { include: { deity: true }, where: { isPrimary: true } } },
      take: 3,
    }),
  ]);
  return { deities, shlokas };
}

const CATEGORIES = [
  { icon: "☀",  cat: "Morning Chants" },
  { icon: "🛡", cat: "Protection Mantras" },
  { icon: "📿", cat: "Wisdom Shlokas" },
  { icon: "🧘", cat: "Meditation Mantras" },
];

export default async function HomePage() {
  const { deities, shlokas } = await getData();
  const { lang, t } = await getT();

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="hero">
        <div className="hero-pat" />
        <div className="hero-om"><OmIcon size={70} /></div>
        <p className="hero-ey">{t("home.eyebrow")}</p>
        <h1 className="hero-h1"><em>Vedic</em><br />Path</h1>
        <p className="hero-sub">{t("home.sub")}</p>
        <p className="hero-mnt dev">{t("home.heroMantra")}</p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 0 }}>
          <Link href="/shlokas" className="btn">{t("home.exploreShlokas")}</Link>
          <Link href="/deities" className="btn-g">{t("home.browseDeities")}</Link>
        </div>
      </section>

      {/* CATEGORIES */}
      <div className="sec-full">
        <div className="sec-in">
          <div className="sec-hd">
            <p className="sec-lbl">{t("home.intentionLbl")}</p>
            <h2 className="sec-ttl ser">{t("home.intentionTtl")}</h2>
          </div>
          <div className="cat-grid">
            {CATEGORIES.map((c) => (
              <Link key={c.cat} href={`/shlokas?category=${encodeURIComponent(c.cat)}`} style={{ textDecoration: "none" }}>
                <div className="cat-pill">
                  <div style={{ fontSize: 28, marginBottom: 9 }}>{c.icon}</div>
                  <div className="ser" style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>{term(lang, c.cat)}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>{t(`cat.${c.cat}.desc`)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURED DEITIES */}
      <div className="sec">
        <div className="sec-hd">
          <div className="div-ln" />
          <p className="sec-lbl">{t("home.divineLbl")}</p>
          <h2 className="sec-ttl ser">{t("home.featuredDeities")}</h2>
          <p className="sec-dsc">{t("home.featuredDsc")}</p>
        </div>
        <div className="deity-grid">
          {deities.map((d) => (
            <Link key={d.id} href={`/deities/${d.slug}`} className="deity-card">
              <div className="dc-img" style={{ background: `linear-gradient(135deg,${d.color}18,${d.color}30)` }}>
                <span style={{ fontSize: 64 }}>{d.symbol}</span>
              </div>
              <div className="dc-body">
                <div className="dc-name ser">{pick(d, "name", lang)}</div>
                <div className="dc-ep">{pick(d, "epithet", lang)}</div>
                <div className="dc-desc">{pick(d, "description", lang).substring(0, 80)}…</div>
              </div>
            </Link>
          ))}
        </div>
        <div style={{ marginTop: 24, textAlign: "center" }}>
          <Link href="/deities" className="btn-g" style={{ border: "1px solid var(--divider)" }}>{t("home.viewAllDeities")}</Link>
        </div>
      </div>

      {/* FEATURED SHLOKAS */}
      <div className="sec-full">
        <div className="sec-in">
          <div className="sec-hd">
            <div className="div-ln" />
            <p className="sec-lbl">{t("home.versesLbl")}</p>
            <h2 className="sec-ttl ser">{t("home.popularShlokas")}</h2>
          </div>
          <div className="sh-grid">
            {shlokas.map((s) => {
              const deity = s.deities[0]?.deity;
              const tags = JSON.parse(s.tags || "[]");
              return (
                <Link key={s.id} href={`/shlokas/${s.slug}`} className="sh-card">
                  <span className="sh-tag">{term(lang, s.category)}</span>
                  <div className="sh-ttl ser">{pick(s, "title", lang)}</div>
                  <div className="sh-prev dev">{mantra(s.sanskrit.split("\n")[0], lang)}</div>
                  {deity && <div style={{ marginTop: 12, fontSize: 11, color: "var(--muted)", letterSpacing: ".06em" }}>— {pick(deity, "name", lang)}</div>}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ASHTOTHARA TEASER */}
      <div className="sec">
        <div style={{ background: "var(--parchment)", borderRadius: "var(--radius)", padding: 44, border: "1px solid var(--divider)", display: "flex", alignItems: "center", gap: 36, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <p className="sec-lbl">{t("home.namesLbl")}</p>
            <h2 className="sec-ttl ser" style={{ marginBottom: 10 }}>{t("ashto.ttl1")}<br />{t("ashto.ttl2")}</h2>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--muted)", fontWeight: 300, marginBottom: 22 }}>
              {t("home.namesDsc")}
            </p>
            <Link href="/ashtotharas" className="btn">{t("home.exploreNames")}</Link>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {deities.map((d) => (
              <Link key={d.id} href={`/ashtotharas/${d.slug}`}
                style={{ width: 68, height: 68, borderRadius: "50%", background: `linear-gradient(135deg,${d.color}1A,${d.color}38)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, border: `1px solid ${d.color}28`, textDecoration: "none" }}>
                {d.symbol}
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
