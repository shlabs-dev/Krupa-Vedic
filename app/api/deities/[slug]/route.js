// app/api/deities/[slug]/route.js
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const deity = await db.deity.findUnique({
    where: { slug: (await params).slug },
    include: {
      shlokas: { include: { shloka: true }, where: { shloka: { deletedAt: null } } },
      ashtothara: { include: { names: { orderBy: { num: "asc" } } } },
    },
  });
  if (!deity) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(deity);
}
