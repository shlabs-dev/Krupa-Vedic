"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { OmIcon } from "./OmIcon";
import { LangToggle } from "./LangToggle";
import { useLang } from "./LangProvider";

const links = [
  { k: "nav.deities",     href: "/deities" },
  { k: "nav.shlokas",     href: "/shlokas" },
  { k: "nav.ashtotharas", href: "/ashtotharas" },
  { k: "nav.vedas",       href: "/vedas" },
  { k: "nav.kids",        href: "/kids" },
  { k: "nav.admin",       href: "/admin" },
];

export function Navbar() {
  const path = usePathname();
  const { t } = useLang();
  return (
    <nav className="nav">
      <Link href="/" className="nav-logo">
        <OmIcon size={30} />
        VedicPath
      </Link>
      <div className="nav-right">
        <div className="nav-links">
          {links.map((x) => (
            <Link key={x.href} href={x.href}
              className={`nl${path.startsWith(x.href) ? " on" : ""}`}>
              {t(x.k)}
            </Link>
          ))}
        </div>
        <LangToggle />
      </div>
    </nav>
  );
}
