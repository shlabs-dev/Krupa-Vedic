import { db } from "@/lib/db";
import { getT } from "@/lib/lang";
import { pick, term } from "@/lib/i18n";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export async function generateMetadata() {
  const { t } = await getT();
  return { title: `${t("nav.kids")} — VedicPath` };
}

export default async function KidsPage() {
  const stories = await db.story.findMany({
    where: { isPublished: true, contentType: "kids_story" },
    orderBy: { createdAt: "asc" },
  });
  const { lang, t } = await getT();

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 64 }}>
        <div className="sec">
          <div className="sec-hd">
            <div className="div-ln" />
            <p className="sec-lbl">{t("kids.lbl")}</p>
            <h1 className="sec-ttl ser">{t("kids.ttl")}</h1>
            <p className="sec-dsc">{t("kids.dsc")}</p>
          </div>
          <div className="kids-grid">
            {stories.map((s) => (
              <div key={s.id} className="kids-card pe">
                <div style={{ fontSize: 48, marginBottom: 16 }}>{s.emoji}</div>
                <div className="ser" style={{ fontSize: 20, fontWeight: 500, marginBottom: 9 }}>{pick(s, "title", lang)}</div>
                <div style={{ fontSize: 12, lineHeight: 1.7, color: "var(--muted)", marginBottom: 20 }}>{pick(s, "preview", lang)}</div>
                {pick(s, "body", lang) ? (
                  <details style={{ textAlign: "left" }}>
                    <summary className="btn btn-sm" style={{ cursor: "pointer", listStyle: "none", display: "inline-block" }}>
                      {t("kids.read")}
                    </summary>
                    <div style={{ marginTop: 20, fontSize: 13, lineHeight: 1.9, color: "var(--charcoal-soft)", whiteSpace: "pre-line" }}>
                      {pick(s, "body", lang)}
                    </div>
                  </details>
                ) : (
                  <button className="btn btn-sm">{t("kids.soon")}</button>
                )}
              </div>
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
