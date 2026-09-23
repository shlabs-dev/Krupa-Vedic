// lib/db.js — database access using Node's built-in SQLite (node:sqlite, Node 22.13+).
// No Prisma engine, no OpenSSL, no native packages — works on any host that runs Node 22.
// Supports the Prisma-style calls this app uses: findMany / findFirst / findUnique /
// create / update / upsert / count / delete with where, include, select, orderBy, take, distinct.
import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { ASHTOTHARA_NAMES } from "./ashtotharaData.js";

// ── schema: tables, typed columns and relations ─────────────────────────────
const MODELS = {
  deity: {
    table: "deities", pk: ["id"], bools: ["isFeatured"], dates: ["createdAt", "updatedAt", "deletedAt"],
    rel: {
      shlokas:    { model: "shlokaDeityMap", many: true, from: "id", to: "deityId" },
      stories:    { model: "storyDeityMap",  many: true, from: "id", to: "deityId" },
      ashtothara: { model: "ashtothara",     from: "id", to: "deityId" },
    },
  },
  shloka: {
    table: "shlokas", pk: ["id"], bools: ["isPublished", "isFeatured"], dates: ["createdAt", "updatedAt", "deletedAt"],
    rel: { deities: { model: "shlokaDeityMap", many: true, from: "id", to: "shlokaId" } },
  },
  shlokaDeityMap: {
    table: "shloka_deity_map", pk: ["shlokaId", "deityId"], bools: ["isPrimary"], dates: [],
    rel: {
      shloka: { model: "shloka", from: "shlokaId", to: "id" },
      deity:  { model: "deity",  from: "deityId",  to: "id" },
    },
  },
  vedaSection: {
    table: "veda_sections", pk: ["id"], bools: ["isSukta"], dates: ["createdAt"],
    rel: { contents: { model: "vedaSectionContent", many: true, from: "id", to: "sectionId" } },
  },
  vedaSectionContent: {
    table: "veda_section_content", pk: ["id"], bools: [], dates: ["createdAt", "updatedAt"],
    rel: { section: { model: "vedaSection", from: "sectionId", to: "id" } },
  },
  ashtothara: {
    table: "ashtotharas", pk: ["id"], bools: [], dates: ["createdAt", "updatedAt"],
    rel: {
      deity: { model: "deity", from: "deityId", to: "id" },
      names: { model: "ashtotharaName", many: true, from: "id", to: "ashtotharaId" },
    },
  },
  ashtotharaName: {
    table: "ashtothara_names", pk: ["id"], bools: [], dates: [],
    rel: { ashtothara: { model: "ashtothara", from: "ashtotharaId", to: "id" } },
  },
  story: {
    table: "stories", pk: ["id"], bools: ["isPublished"], dates: ["createdAt", "updatedAt"],
    rel: { deities: { model: "storyDeityMap", many: true, from: "id", to: "storyId" } },
  },
  storyDeityMap: {
    table: "story_deity_map", pk: ["storyId", "deityId"], bools: [], dates: [],
    rel: {
      story: { model: "story", from: "storyId", to: "id" },
      deity: { model: "deity", from: "deityId", to: "id" },
    },
  },
};

// ── connection (opened lazily; first run copies the bundled starter database) ─
function openDb() {
  if (globalThis.__krupaSqlite) return globalThis.__krupaSqlite;
  const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), "data", "krupa.db");
  const seedPath = process.env.SEED_DB_PATH || path.join(process.cwd(), "prisma", "dev.db");
  let file = dbPath;
  try {
    if (!fs.existsSync(dbPath)) {
      fs.mkdirSync(path.dirname(dbPath), { recursive: true });
      fs.copyFileSync(seedPath, dbPath);
    }
  } catch (e) {
    console.warn(`[db] could not create ${dbPath} (${e.message}); using ${seedPath} directly`);
    file = seedPath;
  }
  const conn = new DatabaseSync(file);
  conn.exec("PRAGMA foreign_keys = ON;");
  runContentUpdates(conn);
  globalThis.__krupaSqlite = conn;
  return conn;
}

// ── one-time content updates (run once per database, on first start after upload) ─
// Bump CONTENT_VERSION when lib/ashtotharaData.js changes, so live sites pick it up.
const CONTENT_VERSION = 2;

function runContentUpdates(conn) {
  conn.exec(`CREATE TABLE IF NOT EXISTS "app_meta" ("key" TEXT PRIMARY KEY, "value" TEXT NOT NULL)`);
  const row = conn.prepare(`SELECT "value" FROM "app_meta" WHERE "key" = 'content_version'`).get();
  const current = row ? Number(row.value) : 1;
  if (current >= CONTENT_VERSION) return;

  conn.exec("BEGIN");
  try {
    // Full 108 names for each deity in lib/ashtotharaData.js
    for (const [slug, names] of Object.entries(ASHTOTHARA_NAMES)) {
      const a = conn.prepare(`SELECT a."id" FROM "ashtotharas" a JOIN "deities" d ON d."id" = a."deityId" WHERE d."slug" = ?`).get(slug);
      if (!a) continue;
      conn.prepare(`DELETE FROM "ashtothara_names" WHERE "ashtotharaId" = ?`).run(a.id);
      const ins = conn.prepare(`INSERT INTO "ashtothara_names" ("id","ashtotharaId","num","nameDevanagari","transliteration","meaning","meaningTa") VALUES (?,?,?,?,?,?,?)`);
      for (const n of names) {
        ins.run("c" + crypto.randomBytes(12).toString("hex").slice(0, 24), a.id, n.num, n.nameDevanagari, n.transliteration, n.meaning, n.meaningTa);
      }
    }
    conn.prepare(`INSERT OR REPLACE INTO "app_meta" ("key","value") VALUES ('content_version', ?)`).run(String(CONTENT_VERSION));
    conn.exec("COMMIT");
    console.log(`[db] content updated to version ${CONTENT_VERSION}`);
  } catch (e) {
    conn.exec("ROLLBACK");
    console.error("[db] content update failed:", e.message);
  }
}

const columnCache = {};
function columns(model) {
  const { table } = MODELS[model];
  if (!columnCache[table]) {
    columnCache[table] = new Set(openDb().prepare(`PRAGMA table_info("${table}")`).all().map((c) => c.name));
  }
  return columnCache[table];
}

export class DbError extends Error {
  constructor(message, code) { super(message); this.code = code; }
}

// ── value conversion ────────────────────────────────────────────────────────
function fromRow(model, raw) {
  const m = MODELS[model];
  const r = { ...raw };
  for (const b of m.bools) if (b in r) r[b] = r[b] === null ? null : Boolean(r[b]);
  for (const d of m.dates) if (d in r && r[d] !== null) r[d] = new Date(typeof r[d] === "number" ? r[d] : Date.parse(r[d]));
  return r;
}
function toSql(v) {
  if (v instanceof Date) return v.getTime();
  if (typeof v === "boolean") return v ? 1 : 0;
  return v;
}
const cmpVal = (v) => (v instanceof Date ? v.getTime() : v);

// ── reading ─────────────────────────────────────────────────────────────────
function loadAll(model, cache) {
  if (!cache[model]) {
    cache[model] = openDb().prepare(`SELECT * FROM "${MODELS[model].table}"`).all().map((r) => fromRow(model, r));
  }
  return cache[model];
}

function related(model, row, name, cache) {
  const r = MODELS[model].rel[name];
  const rows = loadAll(r.model, cache).filter((o) => o[r.to] === row[r.from]);
  return r.many ? rows : rows[0] ?? null;
}

function scalarMatch(val, cond) {
  if (cond === undefined) return true;
  if (cond === null) return val === null || val === undefined;
  if (cond instanceof Date || typeof cond !== "object") return cmpVal(val) === cmpVal(cond);
  const v = cmpVal(val);
  for (const [op, x] of Object.entries(cond)) {
    const c = cmpVal(x);
    if (op === "equals" && !scalarMatch(val, x)) return false;
    if (op === "not" && scalarMatch(val, x)) return false;
    if (op === "in" && !x.map(cmpVal).includes(v)) return false;
    if (op === "notIn" && x.map(cmpVal).includes(v)) return false;
    if (op === "contains" && !String(v ?? "").toLowerCase().includes(String(x).toLowerCase())) return false;
    if (op === "startsWith" && !String(v ?? "").startsWith(x)) return false;
    if (op === "endsWith" && !String(v ?? "").endsWith(x)) return false;
    if (op === "lt" && !(v < c)) return false;
    if (op === "lte" && !(v <= c)) return false;
    if (op === "gt" && !(v > c)) return false;
    if (op === "gte" && !(v >= c)) return false;
  }
  return true;
}

function matches(model, row, where, cache) {
  if (!where) return true;
  for (const [key, cond] of Object.entries(where)) {
    if (cond === undefined) continue;
    if (key === "AND") { if (![].concat(cond).every((w) => matches(model, row, w, cache))) return false; continue; }
    if (key === "OR")  { if (!cond.some((w) => matches(model, row, w, cache))) return false; continue; }
    if (key === "NOT") { if ([].concat(cond).some((w) => matches(model, row, w, cache))) return false; continue; }
    const rel = MODELS[model].rel[key];
    if (rel) {
      const other = related(model, row, key, cache);
      if (rel.many) {
        if (cond.some  && !other.some((o) => matches(rel.model, o, cond.some, cache))) return false;
        if (cond.every && !other.every((o) => matches(rel.model, o, cond.every, cache))) return false;
        if (cond.none  && other.some((o) => matches(rel.model, o, cond.none, cache))) return false;
      } else if (cond === null) {
        if (other) return false;
      } else if ("isNot" in cond || "is" in cond) {
        if (cond.isNot === null && !other) return false;
        if (cond.is === null && other) return false;
        if (cond.is && (!other || !matches(rel.model, other, cond.is, cache))) return false;
        if (cond.isNot && other && matches(rel.model, other, cond.isNot, cache)) return false;
      } else if (!other || !matches(rel.model, other, cond, cache)) return false;
      continue;
    }
    if (!scalarMatch(row[key], cond)) return false;
  }
  return true;
}

function sortRows(rows, orderBy) {
  if (!orderBy) return rows;
  const keys = [].concat(orderBy).flatMap((o) => Object.entries(o));
  return [...rows].sort((a, b) => {
    for (const [k, dir] of keys) {
      const x = cmpVal(a[k]), y = cmpVal(b[k]);
      if (x === y) continue;
      if (x === null || x === undefined) return 1;
      if (y === null || y === undefined) return -1;
      const r = x < y ? -1 : 1;
      return dir === "desc" ? -r : r;
    }
    return 0;
  });
}

function applyList(model, rows, args, cache) {
  let out = rows.filter((r) => matches(model, r, args.where, cache));
  out = sortRows(out, args.orderBy);
  if (args.distinct) {
    const seen = new Set();
    out = out.filter((r) => {
      const k = JSON.stringify([].concat(args.distinct).map((f) => r[f]));
      if (seen.has(k)) return false;
      seen.add(k); return true;
    });
  }
  if (args.skip) out = out.slice(args.skip);
  if (args.take !== undefined) out = out.slice(0, args.take);
  return out;
}

function shape(model, row, args, cache) {
  if (!row) return null;
  const m = MODELS[model];
  const nested = (name, spec) => {
    const rel = m.rel[name];
    const sub = spec === true ? {} : spec;
    const val = related(model, row, name, cache);
    if (rel.many) return applyList(rel.model, val, sub, cache).map((r) => shape(rel.model, r, sub, cache));
    return val && matches(rel.model, val, sub.where, cache) ? shape(rel.model, val, sub, cache) : null;
  };
  if (args?.select) {
    const out = {};
    for (const [k, v] of Object.entries(args.select)) {
      if (!v) continue;
      out[k] = m.rel[k] ? nested(k, v) : row[k];
    }
    return out;
  }
  const out = { ...row };
  for (const [k, v] of Object.entries(args?.include || {})) if (v) out[k] = nested(k, v);
  return out;
}

// compound unique keys like { sectionId_languageCode_verseNum: {...} } → flat fields
function flatWhere(model, where = {}) {
  const cols = columns(model);
  const out = {};
  for (const [k, v] of Object.entries(where)) {
    if (!cols.has(k) && !MODELS[model].rel[k] && v && typeof v === "object" && k.includes("_") && !["AND", "OR", "NOT"].includes(k)) Object.assign(out, v);
    else out[k] = v;
  }
  return out;
}

// ── writing ─────────────────────────────────────────────────────────────────
function writeError(e) {
  if (/UNIQUE constraint failed|PRIMARY KEY/i.test(e.message)) return new DbError(e.message, "P2002");
  if (/FOREIGN KEY constraint failed/i.test(e.message)) return new DbError(e.message, "P2003");
  return e;
}

function scalarData(model, data) {
  const cols = columns(model);
  const out = {};
  for (const [k, v] of Object.entries(data || {})) {
    if (v === undefined) continue;
    if (!cols.has(k)) {
      if (MODELS[model].rel[k]) throw new DbError(`Nested writes for "${k}" are not supported`, "P2009");
      continue;
    }
    out[k] = toSql(v);
  }
  return out;
}

function pkWhere(model, row) {
  return Object.fromEntries(MODELS[model].pk.map((k) => [k, row[k]]));
}

function insert(model, data) {
  const cols = columns(model);
  const row = scalarData(model, data);
  const now = Date.now();
  if (cols.has("id") && !row.id) row.id = "c" + crypto.randomBytes(12).toString("hex").slice(0, 24);
  if (cols.has("createdAt") && row.createdAt === undefined) row.createdAt = now;
  if (cols.has("updatedAt") && row.updatedAt === undefined) row.updatedAt = now;
  const keys = Object.keys(row);
  const sql = `INSERT INTO "${MODELS[model].table}" (${keys.map((k) => `"${k}"`).join(",")}) VALUES (${keys.map(() => "?").join(",")})`;
  try { openDb().prepare(sql).run(...keys.map((k) => row[k])); }
  catch (e) { throw writeError(e); }
  return pkWhere(model, row);
}

function updateRow(model, existing, data) {
  const cols = columns(model);
  const set = scalarData(model, data);
  if (cols.has("updatedAt") && set.updatedAt === undefined) set.updatedAt = Date.now();
  const keys = Object.keys(set);
  const pk = pkWhere(model, existing);
  if (keys.length) {
    const sql = `UPDATE "${MODELS[model].table}" SET ${keys.map((k) => `"${k}" = ?`).join(", ")} WHERE ${Object.keys(pk).map((k) => `"${k}" = ?`).join(" AND ")}`;
    try { openDb().prepare(sql).run(...keys.map((k) => set[k]), ...Object.values(pk).map(toSql)); }
    catch (e) { throw writeError(e); }
  }
  return { ...pk, ...Object.fromEntries(Object.entries(set).filter(([k]) => MODELS[model].pk.includes(k))) };
}

// ── model API ───────────────────────────────────────────────────────────────
function modelApi(model) {
  const findFirst = async (args = {}) => {
    const cache = {};
    const where = flatWhere(model, args.where);
    const row = applyList(model, loadAll(model, cache), { ...args, where, take: 1 }, cache)[0];
    return shape(model, row, args, cache);
  };
  const reread = (pk, args) => findFirst({ where: pk, include: args.include, select: args.select });

  return {
    findMany: async (args = {}) => {
      const cache = {};
      return applyList(model, loadAll(model, cache), args, cache).map((r) => shape(model, r, args, cache));
    },
    findFirst,
    findUnique: findFirst,
    findUniqueOrThrow: async (args) => {
      const r = await findFirst(args);
      if (!r) throw new DbError("Record not found", "P2025");
      return r;
    },
    count: async (args = {}) => {
      const cache = {};
      return loadAll(model, cache).filter((r) => matches(model, r, args.where, cache)).length;
    },
    create: async (args) => reread(insert(model, args.data), args),
    update: async (args) => {
      const existing = await findFirst({ where: args.where });
      if (!existing) throw new DbError("Record to update not found", "P2025");
      return reread(updateRow(model, existing, args.data), args);
    },
    upsert: async (args) => {
      const existing = await findFirst({ where: args.where });
      if (existing) return reread(updateRow(model, existing, args.update), args);
      const flat = flatWhere(model, args.where);
      const scalarWhere = Object.fromEntries(Object.entries(flat).filter(([, v]) => v === null || typeof v !== "object"));
      return reread(insert(model, { ...scalarWhere, ...args.create }), args);
    },
    delete: async (args) => {
      const existing = await findFirst({ where: args.where });
      if (!existing) throw new DbError("Record to delete not found", "P2025");
      const pk = pkWhere(model, existing);
      openDb().prepare(`DELETE FROM "${MODELS[model].table}" WHERE ${Object.keys(pk).map((k) => `"${k}" = ?`).join(" AND ")}`).run(...Object.values(pk).map(toSql));
      return existing;
    },
  };
}

export const db = Object.fromEntries(Object.keys(MODELS).map((m) => [m, modelApi(m)]));
export default db;
