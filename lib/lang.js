// lib/lang.js — read the visitor's chosen language (server components only)
import { cookies } from "next/headers";
import { normLang, tr } from "./i18n";

export async function getLang() {
  const c = await cookies();
  return normLang(c.get("lang")?.value);
}

export async function getT() {
  const lang = await getLang();
  return { lang, t: tr(lang) };
}
