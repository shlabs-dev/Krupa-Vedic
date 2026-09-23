"use client";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { useLang } from "@/components/LangProvider";

const SIDEBAR = [
  { group: { en: "The Four Vedas", ta: "நான்கு வேதங்கள்" }, items: [
    { id: "overview",    icon: "📜", en: ["Overview", "Introduction to the four Vedas"],    ta: ["கண்ணோட்டம்", "நான்கு வேதங்களின் அறிமுகம்"] },
    { id: "rigveda",     icon: "🔥", en: ["Rigveda", "Hymns · 10,552 mantras"],             ta: ["ரிக் வேதம்", "துதிகள் · 10,552 மந்திரங்கள்"] },
    { id: "yajurveda",   icon: "🕯", en: ["Yajurveda", "Rituals · 1,875 verses"],           ta: ["யஜுர் வேதம்", "சடங்குகள் · 1,875 பாடல்கள்"] },
    { id: "samaveda",    icon: "🎵", en: ["Samaveda", "Melodies · 1,875 chants"],           ta: ["சாம வேதம்", "இசை · 1,875 கீதங்கள்"] },
    { id: "atharvaveda", icon: "🌿", en: ["Atharvaveda", "Healing · 5,977 mantras"],        ta: ["அதர்வண வேதம்", "நலம் · 5,977 மந்திரங்கள்"] },
  ]},
  { group: { en: "Hymns & Mantras", ta: "துதிகளும் மந்திரங்களும்" }, items: [
    { id: "suktas",  icon: "✨", en: ["Suktas", "Hymns of praise"],                          ta: ["சூக்தங்கள்", "துதிப் பாடல்கள்"] },
    { id: "rudram",  icon: "☽",  en: ["Sri Rudram", "Namakam & Chamakam"],                   ta: ["ஸ்ரீ ருத்ரம்", "நமகம் & சமகம்"] },
    { id: "purusha", icon: "🌌", en: ["Purusha Sukta", "RV 10.90 — Cosmic being"],           ta: ["புருஷ சூக்தம்", "ரி.வே 10.90 — பிரபஞ்ச புருஷன்"] },
    { id: "gayatri", icon: "☀",  en: ["Gayatri Mantra", "The great illuminating mantra"],    ta: ["காயத்ரி மந்திரம்", "ஒளியூட்டும் மகா மந்திரம்"] },
  ]},
  { group: { en: "Vedanta", ta: "வேதாந்தம்" }, items: [
    { id: "upanishads", icon: "🧘", en: ["Upanishads", "Philosophical conclusions"], ta: ["உபநிடதங்கள்", "தத்துவ முடிவுகள்"] },
    { id: "aranyakas",  icon: "🌳", en: ["Aranyakas", "Forest treatises"],           ta: ["ஆரண்யகங்கள்", "வன நூல்கள்"] },
    { id: "brahmanas",  icon: "📿", en: ["Brahmanas", "Ritual commentaries"],        ta: ["பிராமணங்கள்", "சடங்கு விளக்கவுரைகள்"] },
  ]},
];

const LANG_META = {
  sa: { label: "Sanskrit", flag: "🕉" },
  en: { label: "English",  flag: "🇬🇧" },
  ta: { label: "தமிழ் (Tamil)", flag: "🇮🇳" },
  hi: { label: "Hindi",    flag: "🇮🇳" },
  te: { label: "Telugu",   flag: "🇮🇳" },
  kn: { label: "Kannada",  flag: "🇮🇳" },
};

export default function VedasPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("overview");
  const { lang, t } = useLang();

  return (
    <>
    <Navbar />
    <div className="vedas-wrap">
      {/* SIDEBAR */}
      <div className={`vsb${collapsed ? " col" : ""}`}>
        <div className="vsb-top">
          {!collapsed && <span className="vsb-lbl">{t("vedas.texts")}</span>}
          <button className="vsb-tog" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? "›" : "‹"}
          </button>
        </div>
        <div className="vsb-nav">
          {SIDEBAR.map((grp, gi) => (
            <div key={grp.group.en}>
              {gi > 0 && <div className="vsb-div" />}
              <div className="vsb-grp">{grp.group[lang]}</div>
              {grp.items.map((it) => (
                <div key={it.id}
                  className={`vsb-item${active === it.id ? " on" : ""}`}
                  data-lbl={it[lang][0]}
                  onClick={() => setActive(it.id)}>
                  <span className="vsb-ico">{it.icon}</span>
                  <div className="vsb-txt">
                    <span className="vsb-item-lbl">{it[lang][0]}</span>
                    <span className="vsb-item-sub">{it[lang][1]}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="vc">
        <VedaContent key={active} slug={active} />
      </div>
    </div>
    </>
  );
}

function VedaContent({ slug }) {
  const [meta, setMeta]         = useState(null);
  const [metaLoading, setML]    = useState(true);
  const [lang, setLang]         = useState(null);
  const [verses, setVerses]     = useState([]);
  const [versesLoading, setVL]  = useState(false);
  const { lang: siteLang, t, pick, mantra } = useLang();
  const isTa = siteLang === "ta";
  const [taVerses, setTaVerses] = useState(null); // Tamil mode: [{num, mantra, porul}]

  useEffect(() => {
    setML(true); setMeta(null); setLang(null); setVerses([]);
    fetch(`/api/vedas/${slug}`)
      .then((r) => r.json())
      .then((m) => {
        setMeta(m);
        setML(false);
        const av = m.availableLanguages || [];
        // Tamil site → open the Tamil verses first when they exist
        if (av.length) setLang(siteLang === "ta" && av.includes("ta") ? "ta" : av[0]);
      })
      .catch(() => setML(false));
  }, [slug, siteLang]);

  useEffect(() => {
    if (!isTa || !meta?.isSukta) return;
    const get = (lc) => fetch(`/api/vedas/${slug}/content?lang=${lc}`).then((r) => r.json()).catch(() => []);
    Promise.all([get("sa"), get("ta")]).then(([sa, ta]) => {
      const sArr = Array.isArray(sa) ? sa : [], tArr = Array.isArray(ta) ? ta : [];
      const nums = [...new Set([...sArr, ...tArr].map((v) => v.verseNum))].sort((a, b) => a - b);
      setTaVerses(nums.map((n) => ({
        num: n,
        mantra: sArr.find((v) => v.verseNum === n)?.text || "",
        porul: tArr.find((v) => v.verseNum === n)?.text || "",
      })));
    });
  }, [isTa, slug, meta]);

  useEffect(() => {
    if (isTa || !lang || !meta?.isSukta) return;
    setVL(true); setVerses([]);
    fetch(`/api/vedas/${slug}/content?lang=${lang}`)
      .then((r) => r.json())
      .then((v) => { setVerses(v); setVL(false); })
      .catch(() => setVL(false));
  }, [lang, slug, meta]);

  if (metaLoading) return <SectionSkeleton />;
  if (!meta || meta.error) return <div style={{ color: "var(--muted)", padding: 20 }}>{t("vedas.notFound")}</div>;

  return (
    <div className="pe" style={{ maxWidth: 780 }}>
      <div style={{ marginBottom: 6, fontSize: 11, color: "var(--muted)", letterSpacing: ".2em", textTransform: "uppercase" }}>{t("vedas.library")}</div>

      {meta.isSukta ? (
        <>
          {/* Sukta hero */}
          <div className="sukta-hero">
            <div className="sukta-hero-ref">{pick(meta, "title").split(" ")[0]}</div>
            <div className="sukta-hero-lbl">{t("vedas.hymn")}</div>
            <div className="sukta-hero-title ser">{pick(meta, "title")}</div>
            <div className="sukta-hero-sub">{mantra(pick(meta, "subtitle"))}</div>
            <p className="sukta-hero-intro">{pick(meta, "description")}</p>
          </div>

          {isTa ? (
            taVerses === null ? <VersesSkeleton /> : taVerses.length > 0 ? (
              <div className="verse-list">
                {taVerses.map((v) => (
                  <div key={v.num} className="verse-card">
                    <div className="verse-body">
                      <div className="verse-header">
                        <div className="verse-num">{v.num}</div>
                        <span className="verse-title">{t("vedas.verse")} {v.num}</span>
                      </div>
                      {v.mantra && <>
                        <div className="verse-sec-lbl">{t("vedas.mantra")}</div>
                        <p className="mantra-ta" style={{ fontSize: 19, marginBottom: 12 }}>{mantra(v.mantra)}</p>
                      </>}
                      {v.porul && <>
                        <div className="verse-sec-lbl">{t("vedas.porul")}</div>
                        <p className="verse-porul">{v.porul}</p>
                      </>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ background: "var(--parchment)", borderRadius: "var(--radius-sm)", padding: "20px 24px", border: "1px solid var(--divider)" }}>
                <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7 }}>{t("vedas.compiling")}</p>
              </div>
            )
          ) : meta.availableLanguages?.length > 0 ? (
            <>
              {/* Language selector */}
              <div className="lang-strip">
                {meta.availableLanguages.map((lc) => {
                  const lm = LANG_META[lc] || { label: lc.toUpperCase(), flag: "🌐" };
                  return (
                    <button key={lc} className={`lang-btn${lang === lc ? " on" : ""}`} onClick={() => setLang(lc)}>
                      <span>{lm.flag}</span>{lm.label}
                    </button>
                  );
                })}
              </div>

              {versesLoading ? <VersesSkeleton /> : (
                <div className="verse-list">
                  {verses.map((v) => <VerseCard key={v.verseNum} verse={v} lang={lang} verseWord={t("vedas.verse")} />)}
                </div>
              )}
            </>
          ) : (
            <div style={{ background: "var(--parchment)", borderRadius: "var(--radius-sm)", padding: "20px 24px", border: "1px solid var(--divider)" }}>
              <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.7 }}>
                {t("vedas.compiling")}
              </p>
            </div>
          )}
        </>
      ) : (
        // Prose overview
        <>
          <div className="vc-ttl ser">{pick(meta, "title")}</div>
          <div className="vc-sub">{mantra(pick(meta, "subtitle"))}</div>
          <p className="vc-body">{pick(meta, "description")}</p>
        </>
      )}
    </div>
  );
}

function VerseCard({ verse, lang, verseWord }) {
  const isDev = lang === "sa" || lang === "hi";
  const isTa  = lang === "ta";
  return (
    <div className="verse-card">
      <div className="verse-body">
        <div className="verse-header">
          <div className="verse-num">{verse.verseNum}</div>
          <span className="verse-title">{(LANG_META[lang] || { label: lang }).label} · {verseWord} {verse.verseNum}</span>
        </div>
        <p className={isDev ? "verse-text-sa dev" : isTa ? "verse-text-ta" : "verse-text-en"}>{verse.text}</p>
        {verse.transliteration && <p className="verse-translit">{verse.transliteration}</p>}
      </div>
    </div>
  );
}

function SectionSkeleton() {
  return (
    <div style={{ padding: "4px 0" }}>
      <div className="skel skel-h" style={{ width: "55%", marginBottom: 8 }} />
      <div className="skel skel-s" style={{ marginBottom: 28 }} />
      {[90, 80, 85].map((w, i) => <div key={i} className="skel skel-l" style={{ width: `${w}%` }} />)}
      <div style={{ marginTop: 24 }}>
        <div className="skel skel-b" />
        <div className="skel skel-b" />
      </div>
    </div>
  );
}

function VersesSkeleton() {
  return (
    <div className="verse-list">
      {[1, 2, 3].map((i) => (
        <div key={i} className="verse-card" style={{ padding: "22px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
            <div className="skel" style={{ width: 36, height: 36, borderRadius: "50%" }} />
            <div className="skel" style={{ width: 120, height: 12 }} />
          </div>
          <div className="skel skel-l" style={{ width: "100%" }} />
          <div className="skel skel-l" style={{ width: "88%" }} />
          <div className="skel skel-l" style={{ width: "72%" }} />
        </div>
      ))}
    </div>
  );
}
