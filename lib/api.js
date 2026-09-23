// lib/api.js — turns server errors into clear JSON messages instead of empty 500s
import { NextResponse } from "next/server";

export function safe(handler) {
  return async (...args) => {
    try {
      return await handler(...args);
    } catch (e) {
      console.error(e);
      if (e.code === "P2002")
        return NextResponse.json({ error: "An item with this name already exists. Use a different name." }, { status: 409 });
      if (e.code === "P2025")
        return NextResponse.json({ error: "Item not found." }, { status: 404 });
      return NextResponse.json({ error: e.message || "Server error" }, { status: 500 });
    }
  };
}
