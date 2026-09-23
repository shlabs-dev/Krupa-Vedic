// lib/i18n.js — English / Tamil text for the whole site.
// To change any Tamil wording, edit the "ta" section below.

import { toTamil } from "./tamilScript";

export const LANGS = ["en", "ta"];

const en = {
  // nav / footer
  "nav.home": "Home", "nav.deities": "Deities", "nav.shlokas": "Shlokas", "nav.ashtotharas": "Ashtotharas",
  "nav.vedas": "Vedas", "nav.kids": "For Kids", "nav.admin": "Admin",
  "footer.tag": "Ancient Wisdom · Digital Sanctuary",
  "footer.copy": "A digital temple library",
  "site.title": "VedicPath — Ancient Wisdom for Modern Minds",
  "site.desc": "A digital sanctuary of Shlokas, Vedas, Ashtotharas and sacred knowledge.",

  // home
  "home.eyebrow": "Ancient Wisdom for Modern Minds",
  "home.sub": "A digital sanctuary of sacred knowledge",
  "home.exploreShlokas": "Explore Shlokas →", "home.browseDeities": "Browse Deities",
  "home.intentionLbl": "Explore by Intention", "home.intentionTtl": "Begin Your Journey",
  "home.divineLbl": "Divine Presences", "home.featuredDeities": "Featured Deities",
  "home.featuredDsc": "Each deity embodies a cosmic principle, a facet of the infinite.",
  "home.viewAllDeities": "View All Deities →",
  "home.versesLbl": "Sacred Verses", "home.popularShlokas": "Popular Shlokas",
  "home.namesLbl": "108 Sacred Names",
  "home.namesDsc": "Recite the 108 divine names of each deity — a complete spiritual offering. Each name reveals a facet of the infinite.",
  "home.exploreNames": "Explore 108 Names →",
  "cat.Morning Chants.desc": "Begin your day with sacred mantras",
  "cat.Protection Mantras.desc": "Shields of divine light",
  "cat.Wisdom Shlokas.desc": "Ancient knowledge for seekers",
  "cat.Meditation Mantras.desc": "Deepen your inner practice",

  // deities
  "deities.lbl": "Divine Pantheon", "deities.ttl": "Explore the Deities",
  "deities.dsc": "Discover the divine forces that have inspired billions across millennia.",
  "deity.all": "← All Deities", "deity.names108": "108 Names →",
  "deity.tab.about": "About", "deity.tab.shlokas": "Shlokas", "deity.tab.symbolism": "Symbolism",
  "deity.about": "About {name}",
  "deity.aboutMore": "Worshipped across traditions, {name} represents one of the fundamental cosmic forces in the Vedic and Puranic traditions. Devotees offer prayers, flowers, and incense while chanting sacred shlokas dedicated to this divine form.",
  "deity.ashtoLbl": "Ashtottara Shatanamavali",
  "deity.ashtoDsc": "Explore the 108 sacred names of {name} — each name a divine attribute.",
  "deity.viewNames": "View 108 Names →",
  "deity.noShlokas": "More shlokas for {name} coming soon.",
  "deity.symTtl": "Sacred Symbolism",
  "deity.symDsc": "carries deep cosmological meaning, representing the divine attributes of {name}.",
  "deity.symPre": "The symbol",

  // shlokas
  "shlokas.lbl": "Sacred Library", "shlokas.ttl": "All Shlokas",
  "shlokas.dsc": "Ancient verses for every moment of your day.",
  "shlokas.search": "Search shlokas, Sanskrit, deity…", "shlokas.all": "All",
  "shlokas.none": "No shlokas found", "shlokas.notFound": "Shloka not found",
  "shlokas.back": "← Back to Shlokas", "shlokas.sacredChant": "Sacred Chant",
  "shlokas.sanskrit": "Sanskrit", "shlokas.translit": "Transliteration",
  "shlokas.meaning": "English Meaning", "shlokas.benefits": "Benefits of Chanting",
  "shlokas.mantra": "Sanskrit", "home.heroMantra": "ॐ नमः शिवाय",
  "vedas.mantra": "Mantra", "vedas.porul": "Meaning",

  // ashtotharas
  "ashto.lbl": "108 Sacred Names", "ashto.ttl1": "Ashtottara", "ashto.ttl2": "Shatanamavali",
  "ashto.tagline": "The divine names that reveal the infinite",
  "ashto.selectLbl": "Select a Deity", "ashto.selectTtl": "Deity Ashtotharas",
  "ashto.selectDsc": "Each set of 108 names is a complete spiritual practice. Choose a deity to begin.",
  "ashto.available": "108 Names Available →", "ashto.allDeities": "← All Deities",
  "ashto.count": "{n} of 108 names",
  "ashto.remaining": "Remaining {n} names being compiled with care.",

  // kids
  "kids.lbl": "Young Seekers", "kids.ttl": "Stories for Children",
  "kids.dsc": "Ancient wisdom told through stories children will love and remember forever.",
  "kids.read": "Read Story ▾", "kids.soon": "Coming Soon",

  // vedas
  "vedas.texts": "Vedic Texts", "vedas.library": "Vedic Library", "vedas.hymn": "✦ Sacred Hymn",
  "vedas.notFound": "Section not found.", "vedas.verse": "Verse",
  "vedas.compiling": "✦ Verse content for this section is being compiled. Use the Admin panel to add content in any language.",
};

const ta = {
  "nav.home": "முகப்பு", "nav.deities": "தெய்வங்கள்", "nav.shlokas": "ஸ்லோகங்கள்", "nav.ashtotharas": "அஷ்டோத்திரங்கள்",
  "nav.vedas": "வேதங்கள்", "nav.kids": "குழந்தைகளுக்கு", "nav.admin": "நிர்வாகம்",
  "footer.tag": "பண்டைய ஞானம் · டிஜிட்டல் சன்னிதி",
  "footer.copy": "ஒரு டிஜிட்டல் ஆலய நூலகம்",
  "site.title": "VedicPath — நவீன மனங்களுக்கான பண்டைய ஞானம்",
  "site.desc": "ஸ்லோகங்கள், வேதங்கள், அஷ்டோத்திரங்கள் மற்றும் புனித அறிவின் டிஜிட்டல் சன்னிதி.",

  "home.eyebrow": "நவீன மனங்களுக்கான பண்டைய ஞானம்",
  "home.sub": "புனித அறிவின் டிஜிட்டல் சன்னிதி",
  "home.exploreShlokas": "ஸ்லோகங்களைக் காண்க →", "home.browseDeities": "தெய்வங்களைக் காண்க",
  "home.intentionLbl": "நோக்கத்தின்படி தேடுங்கள்", "home.intentionTtl": "உங்கள் பயணத்தைத் தொடங்குங்கள்",
  "home.divineLbl": "தெய்வீகத் திருவுருவங்கள்", "home.featuredDeities": "சிறப்புத் தெய்வங்கள்",
  "home.featuredDsc": "ஒவ்வொரு தெய்வமும் ஒரு பிரபஞ்சத் தத்துவத்தை, எல்லையற்றதன் ஒரு கோணத்தை உள்ளடக்கியது.",
  "home.viewAllDeities": "அனைத்து தெய்வங்களும் →",
  "home.versesLbl": "புனிதப் பாடல்கள்", "home.popularShlokas": "பிரபல ஸ்லோகங்கள்",
  "home.namesLbl": "108 புனித நாமங்கள்",
  "home.namesDsc": "ஒவ்வொரு தெய்வத்தின் 108 திருநாமங்களை ஓதுங்கள் — ஒரு முழுமையான ஆன்மீகக் காணிக்கை. ஒவ்வொரு நாமமும் எல்லையற்றதன் ஒரு கோணத்தை வெளிப்படுத்துகிறது.",
  "home.exploreNames": "108 நாமங்களைக் காண்க →",
  "cat.Morning Chants.desc": "புனித மந்திரங்களுடன் நாளைத் தொடங்குங்கள்",
  "cat.Protection Mantras.desc": "தெய்வீக ஒளியின் கவசங்கள்",
  "cat.Wisdom Shlokas.desc": "தேடுபவர்களுக்கான பண்டைய ஞானம்",
  "cat.Meditation Mantras.desc": "உங்கள் உள்முகப் பயிற்சியை ஆழப்படுத்துங்கள்",

  "deities.lbl": "தெய்வீகக் குழாம்", "deities.ttl": "தெய்வங்களை அறியுங்கள்",
  "deities.dsc": "ஆயிரமாண்டுகளாகக் கோடிக்கணக்கானோருக்கு ஊக்கமளித்த தெய்வீக சக்திகளைக் கண்டறியுங்கள்.",
  "deity.all": "← அனைத்து தெய்வங்கள்", "deity.names108": "108 நாமங்கள் →",
  "deity.tab.about": "பற்றி", "deity.tab.shlokas": "ஸ்லோகங்கள்", "deity.tab.symbolism": "குறியீடு",
  "deity.about": "{name} பற்றி",
  "deity.aboutMore": "பல மரபுகளிலும் வழிபடப்படும் {name}, வேத மற்றும் புராண மரபுகளில் அடிப்படைப் பிரபஞ்ச சக்திகளில் ஒன்றைக் குறிக்கிறார். பக்தர்கள் இந்தத் தெய்வீக வடிவத்திற்கு உரிய புனித ஸ்லோகங்களை ஓதியபடி பிரார்த்தனைகள், மலர்கள், தூபம் ஆகியவற்றைச் சமர்ப்பிக்கின்றனர்.",
  "deity.ashtoLbl": "அஷ்டோத்திர சத நாமாவளி",
  "deity.ashtoDsc": "{name} அவர்களின் 108 புனித நாமங்களை அறியுங்கள் — ஒவ்வொரு நாமமும் ஒரு தெய்வீகப் பண்பு.",
  "deity.viewNames": "108 நாமங்களைக் காண்க →",
  "deity.noShlokas": "{name} அவர்களுக்கான மேலும் ஸ்லோகங்கள் விரைவில்.",
  "deity.symTtl": "புனிதக் குறியீடு",
  "deity.symDsc": "ஆழ்ந்த பிரபஞ்சப் பொருளைக் கொண்டது; {name} அவர்களின் தெய்வீகப் பண்புகளைக் குறிக்கிறது.",
  "deity.symPre": "இந்தக் குறியீடு",

  "shlokas.lbl": "புனித நூலகம்", "shlokas.ttl": "அனைத்து ஸ்லோகங்கள்",
  "shlokas.dsc": "உங்கள் நாளின் ஒவ்வொரு தருணத்திற்குமான பண்டைய பாடல்கள்.",
  "shlokas.search": "ஸ்லோகம், சமஸ்கிருதம், தெய்வம் தேடுங்கள்…", "shlokas.all": "அனைத்தும்",
  "shlokas.none": "ஸ்லோகங்கள் எதுவும் இல்லை", "shlokas.notFound": "ஸ்லோகம் கிடைக்கவில்லை",
  "shlokas.back": "← ஸ்லோகங்களுக்குத் திரும்பு", "shlokas.sacredChant": "புனித ஜபம்",
  "shlokas.sanskrit": "சமஸ்கிருதம்", "shlokas.translit": "ஒலிபெயர்ப்பு",
  "shlokas.meaning": "பொருள்", "shlokas.benefits": "ஜபிப்பதன் பலன்கள்",
  "shlokas.mantra": "மந்திரம்", "home.heroMantra": "ஓம் நமசிவாய",
  "vedas.mantra": "மந்திரம்", "vedas.porul": "பொருள்",

  "ashto.lbl": "108 புனித நாமங்கள்", "ashto.ttl1": "அஷ்டோத்திர", "ashto.ttl2": "சத நாமாவளி",
  "ashto.tagline": "எல்லையற்றதை வெளிப்படுத்தும் தெய்வீக நாமங்கள்",
  "ashto.selectLbl": "ஒரு தெய்வத்தைத் தேர்ந்தெடுங்கள்", "ashto.selectTtl": "தெய்வ அஷ்டோத்திரங்கள்",
  "ashto.selectDsc": "ஒவ்வொரு 108 நாமத் தொகுப்பும் ஒரு முழுமையான ஆன்மீகப் பயிற்சி. தொடங்க ஒரு தெய்வத்தைத் தேர்ந்தெடுங்கள்.",
  "ashto.available": "108 நாமங்கள் உள்ளன →", "ashto.allDeities": "← அனைத்து தெய்வங்கள்",
  "ashto.count": "108 நாமங்களில் {n}",
  "ashto.remaining": "மீதமுள்ள {n} நாமங்கள் கவனத்துடன் தொகுக்கப்பட்டு வருகின்றன.",

  "kids.lbl": "இளம் தேடுபவர்கள்", "kids.ttl": "குழந்தைகளுக்கான கதைகள்",
  "kids.dsc": "குழந்தைகள் விரும்பி என்றும் நினைவில் வைக்கும் கதைகளின் வழியே பண்டைய ஞானம்.",
  "kids.read": "கதையைப் படிக்க ▾", "kids.soon": "விரைவில்",

  "vedas.texts": "வேத நூல்கள்", "vedas.library": "வேத நூலகம்", "vedas.hymn": "✦ புனிதத் துதி",
  "vedas.notFound": "பகுதி கிடைக்கவில்லை.", "vedas.verse": "பாடல்",
  "vedas.compiling": "✦ இந்தப் பகுதிக்கான பாடல்கள் தொகுக்கப்பட்டு வருகின்றன.",
};

// Shloka categories & tags (stored in English in the database)
const taTerms = {
  "Morning Chants": "காலை மந்திரங்கள்", "Protection Mantras": "பாதுகாப்பு மந்திரங்கள்",
  "Wisdom Shlokas": "ஞான ஸ்லோகங்கள்", "Meditation Mantras": "தியான மந்திரங்கள்",
  Protection: "பாதுகாப்பு", Liberation: "முக்தி", Healing: "நலம்", Beginnings: "தொடக்கங்கள்",
  Blessings: "ஆசீர்வாதம்", Morning: "காலை", Wisdom: "ஞானம்", Learning: "கல்வி", Arts: "கலைகள்",
  Devotion: "பக்தி", Meditation: "தியானம்", Universal: "பிரபஞ்சம்", Prosperity: "வளமை",
  Abundance: "செல்வம்", Victory: "வெற்றி", Power: "சக்தி",
};

const DICT = { en, ta };

export function normLang(v) {
  return v === "ta" ? "ta" : "en";
}

/** t(lang)("deity.about", { name: "Shiva" }) */
export function tr(lang) {
  const d = DICT[normLang(lang)];
  return (key, vars) => {
    let s = d[key] ?? en[key] ?? key;
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, v);
    return s;
  };
}

/** Translate a category or tag stored in English */
export function term(lang, word) {
  return normLang(lang) === "ta" ? taTerms[word] || word : word;
}

/** Mantra text: Tamil letters in Tamil mode, original Sanskrit otherwise */
export function mantra(text, lang) {
  return normLang(lang) === "ta" ? toTamil(text) : text || "";
}

/** pick(deity, "name", lang) → deity.nameTa if Tamil and filled, else deity.name */
export function pick(obj, field, lang) {
  if (!obj) return "";
  if (normLang(lang) === "ta" && obj[field + "Ta"]) return obj[field + "Ta"];
  return obj[field] ?? "";
}
