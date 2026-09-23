"use client";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";

// ── helpers ───────────────────────────────────────────────────────────────────
async function apiFetch(url, opts = {}) {
  const r = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  const text = await r.text();
  try {
    return text ? JSON.parse(text) : { error: `Request failed (${r.status})` };
  } catch {
    return { error: r.status === 401 ? "Not logged in. Refresh the admin page." : `Request failed (${r.status})` };
  }
}

const LANG_META = {
  sa: { label: "Sanskrit",  flag: "🕉",  devanagari: true  },
  en: { label: "English",   flag: "🇬🇧", devanagari: false },
  ta: { label: "Tamil",     flag: "🇮🇳", devanagari: false },
  hi: { label: "Hindi",     flag: "🇮🇳", devanagari: true  },
  te: { label: "Telugu",    flag: "🇮🇳", devanagari: false },
  kn: { label: "Kannada",   flag: "🇮🇳", devanagari: false },
};

const SUKTA_SECTIONS = ["purusha", "gayatri", "rudram", "suktas"];

// ── main page ─────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [sec, setSec] = useState("dashboard");

  const navItems = [
    { id: "dashboard",     label: "Dashboard" },
    { id: "add-shloka",    label: "Add Shloka" },
    { id: "add-deity",     label: "Add Deity" },
    { id: "sukta-content", label: "Sukta Content" },
    { id: "manage",        label: "Manage Content" },
  ];

  return (
    <>
      <Navbar />
      <div className="adm-wrap">
        <div className="adm-sb">
          <div className="adm-sb-ttl">Admin Panel</div>
          {navItems.map((n) => (
            <div key={n.id} className={`adm-ni${sec === n.id ? " on" : ""}`} onClick={() => setSec(n.id)}>
              {n.label}
            </div>
          ))}
        </div>
        <div className="adm-ct">
          {sec === "dashboard"     && <Dashboard />}
          {sec === "add-shloka"    && <AddShloka />}
          {sec === "add-deity"     && <AddDeity />}
          {sec === "sukta-content" && <SuktaContent />}
          {sec === "manage"        && <ManageContent />}
        </div>
      </div>
    </>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/deities").then((r) => r.json()),
      fetch("/api/shlokas").then((r) => r.json()),
      fetch("/api/stories").then((r) => r.json()),
    ]).then(([deities, shlokas, stories]) => {
      setStats({ deities: deities.length, shlokas: shlokas.length, stories: stories.length });
    });
  }, []);

  return (
    <div className="pe">
      <div className="ser" style={{ fontSize: 32, fontWeight: 400, marginBottom: 6 }}>Dashboard</div>
      <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 26 }}>Krupa content overview</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 36 }}>
        {[
          { l: "Deities",     v: stats?.deities,  c: "var(--gold)" },
          { l: "Shlokas",     v: stats?.shlokas,  c: "var(--maroon)" },
          { l: "Stories",     v: stats?.stories,  c: "#2C7A6B" },
          { l: "Veda Sections",v: 12,             c: "var(--charcoal)" },
        ].map((x) => (
          <div key={x.l} style={{ background: "var(--parchment)", borderRadius: "var(--radius)", padding: 22, border: "1px solid var(--divider)" }}>
            <div className="ser" style={{ fontSize: 34, fontWeight: 300, color: x.c }}>{x.v ?? "–"}</div>
            <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: ".08em", textTransform: "uppercase", marginTop: 3 }}>{x.l}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: "16px 22px", background: "var(--parchment)", borderRadius: "var(--radius-sm)", border: "1px solid var(--divider)", fontSize: 13, color: "var(--charcoal-soft)", lineHeight: 1.7 }}>
        <strong>Quick actions:</strong> Use the sidebar to add shlokas, deities, or sukta verse content. All changes are saved immediately to the database.
      </div>
    </div>
  );
}

// ── ADD SHLOKA ────────────────────────────────────────────────────────────────
function AddShloka() {
  const [deities, setDeities] = useState([]);
  const [form, setForm]       = useState({ title: "", category: "Morning Chants", sanskrit: "", transliteration: "", meaning: "", benefits: "", tags: "", deityId: "", titleTa: "", meaningTa: "", benefitsTa: "" });
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState("");

  useEffect(() => {
    fetch("/api/deities").then((r) => r.json()).then(setDeities);
  }, []);

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const save = async () => {
    if (!form.title || !form.sanskrit) return setToast("Title and Sanskrit are required.");
    setSaving(true);
    const res = await apiFetch("/api/shlokas", {
      method: "POST",
      body: JSON.stringify({
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        deityId: form.deityId || undefined,
      }),
    });
    setSaving(false);
    if (res.id) {
      setToast("✓ Shloka saved!");
      setForm({ title: "", category: "Morning Chants", sanskrit: "", transliteration: "", meaning: "", benefits: "", tags: "", deityId: "", titleTa: "", meaningTa: "", benefitsTa: "" });
    } else setToast(res?.error || "Error saving shloka.");
    setTimeout(() => setToast(""), 3000);
  };

  const CATEGORIES = ["Morning Chants", "Protection Mantras", "Wisdom Shlokas", "Meditation Mantras"];

  return (
    <div className="pe">
      <div className="ser" style={{ fontSize: 32, fontWeight: 400, marginBottom: 6 }}>Add New Shloka</div>
      <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 22 }}>Add a sacred verse to the library</div>
      <div style={{ maxWidth: 600 }}>
        <div className="form-grp">
          <label className="form-lbl">Shloka Title *</label>
          <input className="form-inp" value={form.title} onChange={f("title")} placeholder="e.g. Gayatri Mantra" />
        </div>
        <div className="form-g2">
          <div className="form-grp">
            <label className="form-lbl">Category</label>
            <select className="form-inp" style={{ appearance: "none" }} value={form.category} onChange={f("category")}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-grp">
            <label className="form-lbl">Associated Deity</label>
            <select className="form-inp" style={{ appearance: "none" }} value={form.deityId} onChange={f("deityId")}>
              <option value="">— Select deity —</option>
              {deities.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
        </div>
        <div className="form-grp">
          <label className="form-lbl">Sanskrit (Devanagari) *</label>
          <textarea className="form-inp form-ta dev" placeholder="ॐ …" value={form.sanskrit} onChange={f("sanskrit")} style={{ fontSize: 18 }} />
        </div>
        <div className="form-grp">
          <label className="form-lbl">Transliteration</label>
          <textarea className="form-inp form-ta" placeholder="IAST romanisation…" value={form.transliteration} onChange={f("transliteration")} />
        </div>
        <div className="form-grp">
          <label className="form-lbl">English Meaning</label>
          <textarea className="form-inp form-ta" placeholder="Translation…" value={form.meaning} onChange={f("meaning")} />
        </div>
        <div className="form-grp">
          <label className="form-lbl">Benefits of Chanting</label>
          <textarea className="form-inp" style={{ minHeight: 70, resize: "vertical" }} placeholder="Spiritual benefits…" value={form.benefits} onChange={f("benefits")} />
        </div>
        <div style={{ margin: "8px 0 18px", padding: "16px 18px 4px", borderRadius: "var(--radius-sm)", border: "1px dashed var(--gold)", background: "var(--parchment)" }}>
          <div style={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 12 }}>தமிழ் · Tamil version (optional; English is shown if left empty)</div>
          <div className="form-grp">
            <label className="form-lbl">Title in Tamil</label>
            <input className="form-inp" value={form.titleTa} onChange={f("titleTa")} placeholder="எ.கா. காயத்ரி மந்திரம்" />
          </div>
          <div className="form-grp">
            <label className="form-lbl">Meaning in Tamil</label>
            <textarea className="form-inp form-ta" value={form.meaningTa} onChange={f("meaningTa")} placeholder="தமிழ் பொருள்…" />
          </div>
          <div className="form-grp">
            <label className="form-lbl">Benefits in Tamil</label>
            <textarea className="form-inp" style={{ minHeight: 70, resize: "vertical" }} value={form.benefitsTa} onChange={f("benefitsTa")} placeholder="ஜபிப்பதன் பலன்கள்…" />
          </div>
        </div>
        <div className="form-grp">
          <label className="form-lbl">Tags (comma separated)</label>
          <input className="form-inp" placeholder="Protection, Healing, Morning" value={form.tags} onChange={f("tags")} />
        </div>
        <button className="btn" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save Shloka"}</button>
      </div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

// ── ADD DEITY ─────────────────────────────────────────────────────────────────
function AddDeity() {
  const [form, setForm]  = useState({ name: "", epithet: "", symbol: "", color: "#8A6B2C", description: "", nameTa: "", epithetTa: "", descriptionTa: "" });
  const [saving, setSaving] = useState(false);
  const [toast, setToast]   = useState("");

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const save = async () => {
    if (!form.name || !form.description) return setToast("Name and description are required.");
    setSaving(true);
    const res = await apiFetch("/api/deities", { method: "POST", body: JSON.stringify(form) });
    setSaving(false);
    if (res.id) {
      setToast("✓ Deity added!");
      setForm({ name: "", epithet: "", symbol: "", color: "#8A6B2C", description: "", nameTa: "", epithetTa: "", descriptionTa: "" });
    } else setToast(res?.error || "Error adding deity.");
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <div className="pe">
      <div className="ser" style={{ fontSize: 32, fontWeight: 400, marginBottom: 6 }}>Add New Deity</div>
      <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 22 }}>Expand the divine pantheon</div>
      <div style={{ maxWidth: 560 }}>
        {[["name", "Deity Name *", "e.g. Rama"], ["epithet", "Epithet", "e.g. Prince of Ayodhya"], ["symbol", "Symbol / Emoji", "e.g. 🏹"]].map(([k, lbl, ph]) => (
          <div key={k} className="form-grp">
            <label className="form-lbl">{lbl}</label>
            <input className="form-inp" placeholder={ph} value={form[k]} onChange={f(k)} />
          </div>
        ))}
        <div className="form-grp">
          <label className="form-lbl">Accent Color</label>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input type="color" value={form.color} onChange={f("color")} style={{ width: 44, height: 38, border: "1px solid var(--divider)", borderRadius: 8, cursor: "pointer", padding: 2 }} />
            <input className="form-inp" value={form.color} onChange={f("color")} style={{ flex: 1 }} placeholder="#8A6B2C" />
          </div>
        </div>
        <div className="form-grp">
          <label className="form-lbl">Description *</label>
          <textarea className="form-inp form-ta" value={form.description} onChange={f("description")} placeholder="Brief description of the deity…" />
        </div>
        <div style={{ margin: "8px 0 18px", padding: "16px 18px 4px", borderRadius: "var(--radius-sm)", border: "1px dashed var(--gold)", background: "var(--parchment)" }}>
          <div style={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 12 }}>தமிழ் · Tamil version (optional; English is shown if left empty)</div>
          <div className="form-g2">
            <div className="form-grp">
              <label className="form-lbl">Name in Tamil</label>
              <input className="form-inp" value={form.nameTa} onChange={f("nameTa")} placeholder="எ.கா. ராமர்" />
            </div>
            <div className="form-grp">
              <label className="form-lbl">Epithet in Tamil</label>
              <input className="form-inp" value={form.epithetTa} onChange={f("epithetTa")} placeholder="எ.கா. அயோத்தியின் இளவரசர்" />
            </div>
          </div>
          <div className="form-grp">
            <label className="form-lbl">Description in Tamil</label>
            <textarea className="form-inp form-ta" value={form.descriptionTa} onChange={f("descriptionTa")} placeholder="தெய்வத்தைப் பற்றிய சுருக்கமான விளக்கம்…" />
          </div>
        </div>
        <button className="btn" onClick={save} disabled={saving}>{saving ? "Saving…" : "Add Deity"}</button>
      </div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

// ── SUKTA CONTENT MANAGER ─────────────────────────────────────────────────────
function SuktaContent() {
  const [section,   setSection]  = useState("purusha");
  const [lang,      setLang]     = useState("sa");
  const [verseNum,  setVerseNum] = useState("1");
  const [text,      setText]     = useState("");
  const [translit,  setTranslit] = useState("");
  const [saving,    setSaving]   = useState(false);
  const [toast,     setToast]    = useState("");
  const [existing,  setExisting] = useState([]);
  const [exLoading, setExL]      = useState(false);

  // Load existing verses for this section+lang
  useEffect(() => {
    setExL(true); setExisting([]);
    fetch(`/api/vedas/${section}/content?lang=${lang}`)
      .then((r) => r.json())
      .then((v) => { setExisting(Array.isArray(v) ? v : []); setExL(false); })
      .catch(() => setExL(false));
  }, [section, lang]);

  const lm = LANG_META[lang] || { label: lang, devanagari: false };

  const save = async () => {
    if (!text.trim()) return setToast("Verse text is required.");
    setSaving(true);
    const res = await apiFetch(`/api/vedas/${section}/content`, {
      method: "POST",
      body: JSON.stringify({ language_code: lang, verse_num: parseInt(verseNum), text, transliteration: translit }),
    });
    setSaving(false);
    if (res.id || res.sectionId) {
      setToast(`✓ Verse ${verseNum} saved for ${lm.label}`);
      setText(""); setTranslit(""); setVerseNum(String(parseInt(verseNum) + 1));
      // refresh existing
      fetch(`/api/vedas/${section}/content?lang=${lang}`).then((r) => r.json()).then((v) => setExisting(Array.isArray(v) ? v : []));
    } else setToast(res?.error || "Error saving verse.");
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <div className="pe">
      <div className="ser" style={{ fontSize: 32, fontWeight: 400, marginBottom: 4 }}>Sukta Content Manager</div>
      <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24 }}>
        Add verse-by-verse content for suktas. Each language creates a new tab for users automatically.
      </div>

      <div style={{ background: "var(--parchment)", borderRadius: "var(--radius-sm)", padding: "16px 20px", border: "1px solid var(--divider)", marginBottom: 28, display: "flex", gap: 12 }}>
        <span style={{ fontSize: 20, flexShrink: 0 }}>💡</span>
        <span style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.7 }}>
          One row per verse per language. Adding Tamil for Purusha Sukta? Pick <strong>ta</strong> and save each verse — users see a Tamil tab appear instantly. No code changes needed.
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, maxWidth: 680 }}>
        <div className="form-grp">
          <label className="form-lbl">Section</label>
          <select className="form-inp" style={{ appearance: "none" }} value={section} onChange={(e) => setSection(e.target.value)}>
            <option value="purusha">Purusha Sukta</option>
            <option value="gayatri">Gayatri Mantra</option>
            <option value="rudram">Sri Rudram</option>
            <option value="suktas">Suktas (general)</option>
          </select>
        </div>
        <div className="form-grp">
          <label className="form-lbl">Language</label>
          <select className="form-inp" style={{ appearance: "none" }} value={lang} onChange={(e) => setLang(e.target.value)}>
            {Object.entries(LANG_META).map(([code, m]) => (
              <option key={code} value={code}>{m.flag} {m.label} ({code})</option>
            ))}
          </select>
          <div style={{ fontSize: 10, color: "var(--gold)", marginTop: 4 }}>
            {existing.length} verse{existing.length !== 1 ? "s" : ""} already saved for this language
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 680 }}>
        <div className="form-grp" style={{ maxWidth: 140 }}>
          <label className="form-lbl">Verse Number</label>
          <input className="form-inp" type="number" min="1" max="108" value={verseNum} onChange={(e) => setVerseNum(e.target.value)} />
        </div>

        <div className="form-grp">
          <label className="form-lbl">
            Verse Text — {lm.label}
          </label>
          <textarea
            className={`form-inp form-ta${lm.devanagari ? " dev" : ""}`}
            style={{ minHeight: 110, fontSize: lm.devanagari ? 18 : 14 }}
            placeholder={lang === "sa" ? "ॐ … (Devanagari)" : lang === "ta" ? "தமிழ் உரை…" : "Enter verse text…"}
            value={text} onChange={(e) => setText(e.target.value)}
          />
        </div>

        {!["en"].includes(lang) && (
          <div className="form-grp">
            <label className="form-lbl">Transliteration (IAST / Latin) — optional</label>
            <textarea className="form-inp form-ta" style={{ minHeight: 72 }} placeholder="e.g. Sahasraśīrṣā puruṣaḥ…" value={translit} onChange={(e) => setTranslit(e.target.value)} />
          </div>
        )}

        {/* Preview */}
        {text && (
          <div style={{ background: "var(--parchment)", borderRadius: "var(--radius-sm)", padding: "20px 24px", border: "1px solid var(--divider)", marginBottom: 20 }}>
            <div style={{ fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 12 }}>Preview</div>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div className="verse-num">{verseNum}</div>
              <div>
                <p className={lm.devanagari ? "verse-text-sa dev" : lang === "ta" ? "verse-text-ta" : "verse-text-en"} style={{ whiteSpace: "pre-line" }}>{text}</p>
                {translit && <p className="verse-translit">{translit}</p>}
              </div>
            </div>
          </div>
        )}

        <button className="btn" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save Verse"}</button>
        <button className="btn-g" style={{ marginLeft: 8 }} onClick={() => { setText(""); setTranslit(""); }}>Clear</button>
      </div>

      {/* Existing verses table */}
      {existing.length > 0 && (
        <div style={{ marginTop: 40, maxWidth: 680 }}>
          <div style={{ fontSize: 12, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 14 }}>
            Saved verses · {lm.label} ({existing.length})
          </div>
          <table className="adm-tbl">
            <thead><tr><th>#</th><th>Text preview</th><th>Transliteration</th></tr></thead>
            <tbody>
              {existing.map((v) => (
                <tr key={v.verseNum}>
                  <td style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, color: "var(--gold)", width: 40 }}>{v.verseNum}</td>
                  <td className={lm.devanagari ? "dev" : ""} style={{ fontSize: 13 }}>{v.text.substring(0, 60)}{v.text.length > 60 ? "…" : ""}</td>
                  <td style={{ fontSize: 12, color: "var(--muted)", fontStyle: "italic" }}>{v.transliteration?.substring(0, 40) || "–"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

// ── MANAGE CONTENT ────────────────────────────────────────────────────────────
function ManageContent() {
  const [shlokas, setShlokas] = useState([]);
  const [deities, setDeities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast,   setToast]   = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/shlokas").then((r) => r.json()),
      fetch("/api/deities").then((r) => r.json()),
    ]).then(([s, d]) => { setShlokas(s); setDeities(d); setLoading(false); });
  }, []);

  const deleteShloka = async (slug) => {
    if (!confirm("Delete this shloka?")) return;
    await apiFetch(`/api/shlokas/${slug}`, { method: "DELETE" });
    setShlokas((p) => p.filter((s) => s.slug !== slug));
    setToast("Shloka deleted."); setTimeout(() => setToast(""), 2500);
  };

  return (
    <div className="pe">
      <div className="ser" style={{ fontSize: 32, fontWeight: 400, marginBottom: 6 }}>Manage Content</div>
      <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 26 }}>Edit or remove existing content</div>

      {loading ? (
        <div>{[1,2,3].map((i) => <div key={i} className="skel skel-b" style={{ marginBottom: 10 }} />)}</div>
      ) : (
        <table className="adm-tbl">
          <thead><tr><th>Title</th><th>Deity</th><th>Category</th><th>Actions</th></tr></thead>
          <tbody>
            {shlokas.map((s) => (
              <tr key={s.id}>
                <td className="ser" style={{ fontSize: 14 }}>{s.title}</td>
                <td><span className="bdg bdg-g">{s.deity?.name || "–"}</span></td>
                <td style={{ fontSize: 12, color: "var(--muted)" }}>{s.category}</td>
                <td>
                  <button style={{ padding: "3px 11px", borderRadius: "100px", border: "1px solid rgba(139,37,53,.3)", background: "none", fontSize: 11, cursor: "pointer", color: "var(--maroon)" }}
                    onClick={() => deleteShloka(s.slug)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
