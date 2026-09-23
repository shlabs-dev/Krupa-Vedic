// app/api/vedas/route.js
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const sections = await db.vedaSection.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(sections);
}
