// app/api/shlokas/route.js
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { safe } from "@/lib/api";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const deitySlug = searchParams.get("deity");
  const search = searchParams.get("search");
  const featured = searchParams.get("featured");

  const where = {
    deletedAt: null,
    isPublished: true,
    ...(category && { category }),
    ...(featured === "true" && { isFeatured: true }),
    ...(search && {
      OR: [
        { title: { contains: search } },
        { sanskrit: { contains: search } },
      ],
    }),
    ...(deitySlug && {
      deities: { some: { deity: { slug: deitySlug } } },
    }),
  };

  const shlokas = await db.shloka.findMany({
    where,
    include: { deities: { include: { deity: true }, where: { isPrimary: true } } },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(
    shlokas.map((s) => ({
      ...s,
      tags: JSON.parse(s.tags || "[]"),
      deity: s.deities[0]?.deity ?? null,
    }))
  );
}

export const POST = safe(async (req) => {
  const body = await req.json();
  const shloka = await db.shloka.create({
    data: {
      slug: body.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      title: body.title,
      category: body.category,
      sanskrit: body.sanskrit,
      transliteration: body.transliteration,
      meaning: body.meaning,
      benefits: body.benefits || "",
      titleTa: body.titleTa || "",
      meaningTa: body.meaningTa || "",
      benefitsTa: body.benefitsTa || "",
      tags: JSON.stringify(body.tags || []),
    },
  });
  if (body.deityId) {
    await db.shlokaDeityMap.create({
      data: { shlokaId: shloka.id, deityId: body.deityId, isPrimary: true },
    });
  }
  return NextResponse.json(shloka, { status: 201 });
});
