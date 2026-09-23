// lib/tamilScript.js — writes Sanskrit (Devanagari) mantras in Tamil letters.
// Keeps the Sanskrit pronunciation using Grantha letters (ஜ ஷ ஸ ஹ க்ஷ ஸ்ரீ),
// the same style used in Tamil stotra books.  e.g. "ॐ नमः शिवाय" → "ஓம் நமஹ சிவாய"

const VOWELS = {
  "अ": "அ", "आ": "ஆ", "इ": "இ", "ई": "ஈ", "उ": "உ", "ऊ": "ஊ", "ऋ": "ரு", "ॠ": "ரூ",
  "ऌ": "லு", "ए": "ஏ", "ऐ": "ஐ", "ओ": "ஓ", "औ": "ஔ", "ऎ": "எ", "ऒ": "ஒ",
};
const SIGNS = {
  "ा": "ா", "ि": "ி", "ी": "ீ", "ु": "ு", "ू": "ூ", "ृ": "்ரு", "ॄ": "்ரூ",
  "े": "ே", "ै": "ை", "ो": "ோ", "ौ": "ௌ", "ॆ": "ெ", "ॊ": "ொ",
};
const CONS = {
  "क": "க", "ख": "க", "ग": "க", "घ": "க", "ङ": "ங",
  "च": "ச", "छ": "ச", "ज": "ஜ", "झ": "ஜ", "ञ": "ஞ",
  "ट": "ட", "ठ": "ட", "ड": "ட", "ढ": "ட", "ण": "ண",
  "त": "த", "थ": "த", "द": "த", "ध": "த", "न": "ந",
  "प": "ப", "फ": "ப", "ब": "ப", "भ": "ப", "म": "ம",
  "य": "ய", "र": "ர", "ल": "ல", "व": "வ", "ळ": "ள",
  "श": "ச", "ष": "ஷ", "स": "ஸ", "ह": "ஹ",
};
// Anusvara (ं) becomes the nasal of the following consonant group
const NASAL = {};
for (const c of "कखगघङ") NASAL[c] = "ங்";
for (const c of "चछजझञ") NASAL[c] = "ஞ்";
for (const c of "टठडढण") NASAL[c] = "ண்";
for (const c of "तथदधन") NASAL[c] = "ந்";
const DIGITS = "०१२३४५६७८९";
const VIRAMA = "्";

export function hasDevanagari(text) {
  return /[ऀ-ॿ]/.test(text || "");
}

export function toTamil(text) {
  if (!text) return "";
  const s = text
    .replace(/श्री/g, "\u0000")   // श्री is always written ஸ்ரீ
    .replace(/श्व/g, "स्व")        // विश्व → விஸ்வ (familiar spelling)
    .replace(/़/g, "");      // drop nukta
  let out = "";
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    const next = s[i + 1];
    if (ch === "\u0000") { out += "ஸ்ரீ"; continue; }
    if (ch === "ॐ") { out += "ஓம்"; continue; }
    if (ch === "न") {
      // Tamil spelling: ந at the start of a word or before த (ந்த), otherwise ன
      const prev = s[i - 1];
      const startOfWord = !prev || !/[\u0900-\u097F]/.test(prev);
      const beforeDental = next === VIRAMA && "तथदध".includes(s[i + 2]);
      out += startOfWord || beforeDental ? "ந" : "ன";
      continue;
    }
    if (CONS[ch]) { out += CONS[ch]; continue; }
    if (SIGNS[ch]) { out += SIGNS[ch]; continue; }
    if (VOWELS[ch]) { out += VOWELS[ch]; continue; }
    if (ch === VIRAMA) { out += "்"; continue; }
    if (ch === "ं" || ch === "ँ") {
      out += NASAL[next] || "ம்";
      continue;
    }
    if (ch === "ः") { out += "ஹ"; continue; }
    if (ch === "ऽ") continue;                      // avagraha: silent
    if (ch === "॥") { out += "||"; continue; }
    if (ch === "।") { out += "|"; continue; }
    const d = DIGITS.indexOf(ch);
    if (d >= 0) { out += String(d); continue; }
    out += ch;                                     // spaces, punctuation, Latin, Tamil
  }
  // traditional spellings
  return out.replace(/வினாயக/g, "விநாயக");
}
