// app/api/vedas/[slug]/route.js
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const section = await db.vedaSection.findUnique({ where: { slug: (await params).slug } });
  if (!section) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Get distinct languages available for this section
  const langRows = await db.vedaSectionContent.findMany({
    where: { sectionId: section.id },
    distinct: ["languageCode"],
    select: { languageCode: true },
    orderBy: { languageCode: "asc" },
  });

  return NextResponse.json({
    ...section,
    availableLanguages: langRows.map((r) => r.languageCode),
  });
}
