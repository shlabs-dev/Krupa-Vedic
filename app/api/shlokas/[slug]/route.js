// app/api/shlokas/[slug]/route.js
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { safe } from "@/lib/api";

export async function GET(req, { params }) {
  const shloka = await db.shloka.findUnique({
    where: { slug: (await params).slug },
    include: { deities: { include: { deity: true }, where: { isPrimary: true } } },
  });
  if (!shloka) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({
    ...shloka,
    tags: JSON.parse(shloka.tags || "[]"),
    deity: shloka.deities[0]?.deity ?? null,
  });
}

export const PATCH = safe(async (req, { params }) => {
  const body = await req.json();
  const shloka = await db.shloka.update({
    where: { slug: (await params).slug },
    data: {
      ...(body.title && { title: body.title }),
      ...(body.category && { category: body.category }),
      ...(body.sanskrit && { sanskrit: body.sanskrit }),
      ...(body.transliteration && { transliteration: body.transliteration }),
      ...(body.meaning && { meaning: body.meaning }),
      ...(body.benefits && { benefits: body.benefits }),
      ...(body.tags && { tags: JSON.stringify(body.tags) }),
      ...(body.titleTa !== undefined && { titleTa: body.titleTa }),
      ...(body.meaningTa !== undefined && { meaningTa: body.meaningTa }),
      ...(body.benefitsTa !== undefined && { benefitsTa: body.benefitsTa }),
    },
  });
  return NextResponse.json(shloka);
});

export const DELETE = safe(async (req, { params }) => {
  await db.shloka.update({
    where: { slug: (await params).slug },
    data: { deletedAt: new Date() },
  });
  return NextResponse.json({ ok: true });
});
