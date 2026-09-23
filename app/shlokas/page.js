import { db } from "@/lib/db";
import { getT } from "@/lib/lang";
import { pick, term } from "@/lib/i18n";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ShlokasList } from "./ShlokasList";

export async function generateMetadata() {
  const { t } = await getT();
  return { title: `${t("nav.shlokas")} — Krupa` };
}

export default async function ShlokaPage({ searchParams }) {
  const category = (await searchParams)?.category || null;

  const shlokas = await db.shloka.findMany({
    where: { isPublished: true, deletedAt: null },
    include: { deities: { include: { deity: true }, where: { isPrimary: true } } },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });

  const formatted = shlokas.map((s) => ({
    ...s,
    tags: JSON.parse(s.tags || "[]"),
    deity: s.deities[0]?.deity ?? null,
  }));

  const categories = [...new Set(formatted.map((s) => s.category))];
  const { t } = await getT();

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 64 }}>
        <div className="sec">
          <div className="sec-hd">
            <div className="div-ln" />
            <p className="sec-lbl">{t("shlokas.lbl")}</p>
            <h1 className="sec-ttl ser">{t("shlokas.ttl")}</h1>
            <p className="sec-dsc">{t("shlokas.dsc")}</p>
          </div>
          <ShlokasList shlokas={formatted} categories={categories} initialCategory={category} />
        </div>
      </div>
      <Footer />
    </>
  );
}

// Always read fresh data from the database (admin edits show immediately)
export const dynamic = "force-dynamic";
