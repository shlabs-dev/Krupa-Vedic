// app/api/stories/route.js
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { safe } from "@/lib/api";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "kids_story";
  const stories = await db.story.findMany({
    where: { isPublished: true, contentType: type },
    orderBy: { createdAt: "desc" },
    include: { deities: { include: { deity: true } } },
  });
  return NextResponse.json(stories);
}

export const POST = safe(async (req) => {
  const body = await req.json();
  const story = await db.story.create({
    data: {
      slug: body.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      title: body.title,
      emoji: body.emoji || "📖",
      contentType: body.contentType || "kids_story",
      preview: body.preview,
      body: body.body || "",
      titleTa: body.titleTa || "",
      previewTa: body.previewTa || "",
      bodyTa: body.bodyTa || "",
    },
  });
  return NextResponse.json(story, { status: 201 });
});
