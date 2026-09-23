// app/api/deities/route.js
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { safe } from "@/lib/api";

export async function GET() {
  const deities = await db.deity.findMany({
    where: { deletedAt: null },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(deities);
}

export const POST = safe(async (req) => {
  const body = await req.json();
  const deity = await db.deity.create({
    data: {
      slug: body.name.toLowerCase().replace(/\s+/g, "-"),
      name: body.name,
      epithet: body.epithet || "",
      symbol: body.symbol || "✦",
      color: body.color || "#8A6B2C",
      description: body.description || "",
      nameTa: body.nameTa || "",
      epithetTa: body.epithetTa || "",
      descriptionTa: body.descriptionTa || "",
    },
  });
  return NextResponse.json(deity, { status: 201 });
});
