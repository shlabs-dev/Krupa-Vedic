// prisma/tamil.mjs — fills Tamil translations for the built-in content.
// Safe to run many times: only fills Tamil fields that are still empty.
// Usage: npm run db:tamil
import fs from "node:fs";
import { db } from "../lib/db.js";
const data = JSON.parse(fs.readFileSync(new URL("./tamil-data.json", import.meta.url), "utf8"));

const onlyEmpty = (row, fields) =>
  Object.fromEntries(Object.entries(fields).filter(([k]) => !row[k]));

async function fill(model, where, fields) {
  const row = await db[model].findFirst({ where });
  if (!row) return 0;
  const data = onlyEmpty(row, fields);
  if (!Object.keys(data).length) return 0;
  await db[model].update({ where: { id: row.id }, data });
  return 1;
}

async function main() {
  let n = 0;
  for (const [slug, f] of Object.entries(data.deities))  n += await fill("deity", { slug }, f);
  for (const [slug, f] of Object.entries(data.shlokas))  n += await fill("shloka", { slug }, f);
  for (const [slug, f] of Object.entries(data.vedas))    n += await fill("vedaSection", { slug }, f);
  for (const [slug, f] of Object.entries(data.stories))  n += await fill("story", { slug }, f);
  for (const [slug, f] of Object.entries(data.ashtotharas)) n += await fill("ashtothara", { deity: { slug } }, f);
  // Tamil meanings (பொருள்) for Veda verses — added only if that verse has none yet
  for (const [slug, verses] of Object.entries(data.verses || {})) {
    const section = await db.vedaSection.findUnique({ where: { slug } });
    if (!section) continue;
    for (const [num, text] of Object.entries(verses)) {
      const key = { sectionId: section.id, languageCode: "ta", verseNum: Number(num) };
      const exists = await db.vedaSectionContent.findFirst({ where: key });
      if (!exists) { await db.vedaSectionContent.create({ data: { ...key, text } }); n++; }
    }
  }
  console.log(`✓ Tamil translations filled for ${n} items`);
}

main().catch((e) => { console.error(e); process.exit(1); });
