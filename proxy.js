// proxy.js — protects /admin and all write API calls with a password.
// Browser shows a login popup: username "admin", password = ADMIN_PASSWORD from .env
import { NextResponse } from "next/server";

export function proxy(req) {
  const { pathname } = req.nextUrl;
  const isAdminPage = pathname.startsWith("/admin");
  const isWriteApi =
    pathname.startsWith("/api/") && !["GET", "HEAD", "OPTIONS"].includes(req.method);

  if (!isAdminPage && !isWriteApi) return NextResponse.next();

  const expected = process.env.ADMIN_PASSWORD;
  // No password set → admin is open (turn protection back on by setting ADMIN_PASSWORD)
  if (!expected) return NextResponse.next();
  const header = req.headers.get("authorization") || "";
  if (header.startsWith("Basic ")) {
    const [user, pass] = atob(header.slice(6)).split(":");
    if (user === "admin" && pass === expected) return NextResponse.next();
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Krupa Admin"' },
  });
}

export const config = { matcher: ["/admin/:path*", "/api/:path*"] };
