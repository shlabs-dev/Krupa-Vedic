"use client";
import Link from "next/link";
import { useLang } from "./LangProvider";

const links = [
  { k: "nav.home",        href: "/" },
  { k: "nav.deities",     href: "/deities" },
  { k: "nav.shlokas",     href: "/shlokas" },
  { k: "nav.ashtotharas", href: "/ashtotharas" },
  { k: "nav.vedas",       href: "/vedas" },
  { k: "nav.kids",        href: "/kids" },
];

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="footer">
      <div style={{ fontSize: 32, color: "var(--gold)", opacity: 0.7, marginBottom: 16 }}>ॐ</div>
      <div className="ser" style={{ fontSize: 24, color: "var(--ivory)", fontWeight: 300, marginBottom: 8 }}>VedicPath</div>
      <div style={{ fontSize: 12, color: "rgba(250,247,242,.33)", letterSpacing: ".08em", marginBottom: 24 }}>
        {t("footer.tag")}
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 28, flexWrap: "wrap" }}>
        {links.map((x) => (
          <Link key={x.href} href={x.href} className="ft-lnk">{t(x.k)}</Link>
        ))}
      </div>
      <div style={{ fontSize: 10, color: "rgba(250,247,242,.16)" }}>
        © 2025 VedicPath · contact@vedicpath.com · {t("footer.copy")}
      </div>
    </footer>
  );
}
