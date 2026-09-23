import Link from "next/link";
import { db } from "@/lib/db";
import { getT } from "@/lib/lang";
import { pick, term } from "@/lib/i18n";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export async function generateMetadata() {
  const { t } = await getT();
  return { title: `${t("nav.deities")} — VedicPath` };
}

export default async function DeitiesPage() {
  const deities = await db.deity.findMany({
    where: { deletedAt: null },
    orderBy: { sortOrder: "asc" },
  });
  const { lang, t } = await getT();

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 64 }}>
        <div className="sec">
          <div className="sec-hd">
            <div className="div-ln" />
            <p className="sec-lbl">{t("deities.lbl")}</p>
            <h1 className="sec-ttl ser">{t("deities.ttl")}</h1>
            <p className="sec-dsc">{t("deities.dsc")}</p>
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
                  <div className="dc-desc">{pick(d, "description", lang).substring(0, 90)}…</div>
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
