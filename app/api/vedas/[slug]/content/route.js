// app/api/vedas/[slug]/content/route.js
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { safe } from "@/lib/api";

export async function GET(req, { params }) {
  const { searchParams } = new URL(req.url);
  const lang = searchParams.get("lang") || "sa";

  const section = await db.vedaSection.findUnique({ where: { slug: (await params).slug } });
  if (!section) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const verses = await db.vedaSectionContent.findMany({
    where: { sectionId: section.id, languageCode: lang },
    orderBy: { verseNum: "asc" },
    select: { verseNum: true, text: true, transliteration: true },
  });

  return NextResponse.json(verses);
}

export const POST = safe(async (req, { params }) => {
  const body = await req.json();
  const section = await db.vedaSection.findUnique({ where: { slug: (await params).slug } });
  if (!section) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const verse = await db.vedaSectionContent.upsert({
    where: {
      sectionId_languageCode_verseNum: {
        sectionId: section.id,
        languageCode: body.language_code,
        verseNum: parseInt(body.verse_num),
      },
    },
    update: { text: body.text, transliteration: body.transliteration || "" },
    create: {
      sectionId: section.id,
      languageCode: body.language_code,
      verseNum: parseInt(body.verse_num),
      text: body.text,
      transliteration: body.transliteration || "",
    },
  });

  return NextResponse.json(verse, { status: 201 });
});
