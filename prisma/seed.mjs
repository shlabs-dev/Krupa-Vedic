// prisma/seed.mjs — re-adds the built-in content (safe to re-run: uses upsert)
import { db } from "../lib/db.js";
import { ASHTOTHARA_NAMES } from "../lib/ashtotharaData.js";

async function main() {
  console.log("🌱 Seeding VedicPath database…");

  // ── DEITIES ────────────────────────────────────────────────────────────────
  const deities = [
    { slug:"shiva",     name:"Shiva",     epithet:"The Cosmic Destroyer",   symbol:"☽", color:"#6B4C8A", isFeatured:true,  sortOrder:1, description:"Lord of time, transformation, and transcendence. The supreme being in Shaivism who creates, protects and transforms the universe." },
    { slug:"vishnu",    name:"Vishnu",    epithet:"The Preserver",           symbol:"✦", color:"#2C5F8A", isFeatured:true,  sortOrder:2, description:"The preserver and protector of the universe, maintaining cosmic order and dharma across all of creation." },
    { slug:"ganesha",   name:"Ganesha",   epithet:"Remover of Obstacles",    symbol:"ॐ", color:"#8A6B2C", isFeatured:true,  sortOrder:3, description:"The elephant-headed deity of beginnings, wisdom, and the remover of obstacles. Worshipped before any new endeavour." },
    { slug:"lakshmi",   name:"Lakshmi",   epithet:"Goddess of Abundance",    symbol:"❈", color:"#8A2C4A", isFeatured:true,  sortOrder:4, description:"Goddess of wealth, fortune, power, beauty, and prosperity. The divine consort of Vishnu." },
    { slug:"saraswati", name:"Saraswati", epithet:"Goddess of Wisdom",       symbol:"♬", color:"#2C7A6B", isFeatured:false, sortOrder:5, description:"Goddess of knowledge, music, art, wisdom, and learning. The consort of Brahma." },
    { slug:"murugan",   name:"Murugan",   epithet:"God of War & Victory",    symbol:"⚔", color:"#6B2C2C", isFeatured:false, sortOrder:6, description:"The Tamil deity of war, victory, and wisdom. Son of Shiva and Parvati, worshipped especially in South India." },
    { slug:"durga",     name:"Durga",     epithet:"The Invincible One",       symbol:"☀", color:"#8A5A2C", isFeatured:false, sortOrder:7, description:"The principal form of the Goddess, embodying the combined powers of all deities. Slayer of Mahishasura." },
    { slug:"krishna",   name:"Krishna",   epithet:"The Divine Flute Player", symbol:"♪", color:"#1A4A7A", isFeatured:false, sortOrder:8, description:"The eighth avatar of Vishnu. Teacher of the Bhagavad Gita, the all-attractive divine cowherd of Vrindavana." },
  ];

  for (const d of deities) {
    await db.deity.upsert({ where:{ slug:d.slug }, update:d, create:d });
  }
  console.log(`  ✓ ${deities.length} deities`);

  // ── SHLOKAS ────────────────────────────────────────────────────────────────
  const shlokaData = [
    { slug:"maha-mrityunjaya", title:"Maha Mrityunjaya Mantra", category:"Protection Mantras", isFeatured:true,
      sanskrit:"ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् ।\nउर्वारुकमिव बन्धनान् मृत्योर्मुक्षीय माऽमृतात् ॥",
      transliteration:"Om tryambakaṃ yajāmahe sugandhiṃ puṣṭivardhanam\nUrvārukamiva bandhanān mṛtyormukṣīya māmṛtāt",
      meaning:"We worship the three-eyed one who is fragrant and nourishes all beings. May He liberate us from death as a ripened cucumber is released from its vine, granting us immortality.",
      benefits:"Chanting 108 times daily wards off untimely death, heals diseases, and grants liberation from the cycle of birth and death.",
      tags:JSON.stringify(["Protection","Liberation","Healing"]), deity:"shiva" },
    { slug:"ganesha-vandana", title:"Ganesha Vandana", category:"Morning Chants", isFeatured:true,
      sanskrit:"वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।\nनिर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥",
      transliteration:"Vakratuṇḍa mahākāya sūryakoṭi samaprabha\nNirvighnaṃ kuru me deva sarvakāryeṣu sarvadā",
      meaning:"O Lord Ganesha, of curved trunk and massive form, with the radiance of a million suns — remove all obstacles from my path in all endeavours, always.",
      benefits:"Recited at the beginning of any new endeavour to remove obstacles and invoke divine blessings.",
      tags:JSON.stringify(["Beginnings","Blessings","Morning"]), deity:"ganesha" },
    { slug:"saraswati-vandana", title:"Saraswati Vandana", category:"Wisdom Shlokas", isFeatured:true,
      sanskrit:"या कुन्देन्दुतुषारहारधवला या शुभ्रवस्त्रावृता\nया वीणावरदण्डमण्डितकरा या श्वेतपद्मासना ।",
      transliteration:"Yā kundendu tuṣārahāra dhavalā yā śubhravāstrāvṛtā\nYā vīṇāvaradaṇḍamaṇḍitakarā yā śvetapadmāsanā",
      meaning:"She who is white as jasmine, the moon, snow, and the garland of pearls; clothed in pure white; whose hands are adorned with the veena; who is seated on a white lotus.",
      benefits:"Recited by students and artists to invoke blessings of the goddess of knowledge.",
      tags:JSON.stringify(["Wisdom","Learning","Arts"]), deity:"saraswati" },
    { slug:"vishnu-sahasranama", title:"Vishnu Sahasranama Opening", category:"Meditation Mantras", isFeatured:false,
      sanskrit:"विश्वं विष्णुर्वषट्कारो भूतभव्यभवत्प्रभुः ।\nभूतकृद्भूतभृद्भावो भूतात्मा भूतभावनः ॥",
      transliteration:"Viśvaṃ viṣṇurvaṣaṭkāro bhūtabhavyabhavat prabhuḥ\nBhūtakṛd bhūtabhṛd bhāvo bhūtātmā bhūtabhāvanaḥ",
      meaning:"He who is the universe itself; the Lord who transcends past, present and future; who creates, sustains and inspires all beings; the very soul of all existence.",
      benefits:"Chanting the thousand names of Vishnu bestows spiritual merit, protection, and liberation.",
      tags:JSON.stringify(["Devotion","Meditation","Universal"]), deity:"vishnu" },
    { slug:"lakshmi-ashtakam", title:"Lakshmi Ashtakam", category:"Morning Chants", isFeatured:false,
      sanskrit:"नमस्तेऽस्तु महामाये श्रीपीठे सुरपूजिते ।\nशङ्खचक्रगदाहस्ते महालक्ष्मि नमोऽस्तु ते ॥",
      transliteration:"Namaste'stu mahāmāye śrīpīṭhe surapūjite\nŚaṅkhacakragadāhaste mahālakṣmi namo'stu te",
      meaning:"Salutations to you, O great illusion, worshipped at the auspicious seat by the gods. O Mahalakshmi, holding conch, discus, and mace — I bow to you.",
      benefits:"Regular recitation invokes abundance, prosperity, and the removal of poverty and misfortune.",
      tags:JSON.stringify(["Prosperity","Abundance","Blessings"]), deity:"lakshmi" },
    { slug:"durga-mangala", title:"Durga Mangala Shloka", category:"Protection Mantras", isFeatured:false,
      sanskrit:"सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके ।\nशरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते ॥",
      transliteration:"Sarvamaṅgalamāṅgalye śive sarvārthasādhike\nŚaraṇye tryambake gauri nārāyaṇi namo'stu te",
      meaning:"O Goddess, auspicious of all auspicious things, fulfiller of all objectives, refuge of all, three-eyed Gauri — salutations to you.",
      benefits:"Recited for protection, overcoming enemies, and invoking divine power in times of difficulty.",
      tags:JSON.stringify(["Protection","Victory","Power"]), deity:"durga" },
  ];

  for (const s of shlokaData) {
    const { deity, ...data } = s;
    const shloka = await db.shloka.upsert({ where:{ slug:s.slug }, update:data, create:data });
    const deityRec = await db.deity.findUnique({ where:{ slug:deity } });
    if (deityRec) {
      await db.shlokaDeityMap.upsert({
        where:{ shlokaId_deityId:{ shlokaId:shloka.id, deityId:deityRec.id } },
        update:{}, create:{ shlokaId:shloka.id, deityId:deityRec.id, isPrimary:true }
      });
    }
  }
  console.log(`  ✓ ${shlokaData.length} shlokas`);

  // ── VEDA SECTIONS ──────────────────────────────────────────────────────────
  const vedaSections = [
    { slug:"overview",    title:"The Four Vedas",    subtitle:"The oldest scriptures of human civilisation", groupName:"The Four Vedas",   icon:"📜", isSukta:false, sortOrder:1, description:"The Vedas are the primary scriptures of Hinduism, revealed to ancient seers during deep meditation. The word Veda derives from the Sanskrit root vid — to know. Together, the four Vedas form the largest body of sacred knowledge ever compiled." },
    { slug:"rigveda",     title:"Rigveda",            subtitle:"ऋग्वेद · 10,552 Mantras",                     groupName:"The Four Vedas",   icon:"🔥", isSukta:false, sortOrder:2, description:"The oldest of the four Vedas, consisting of 10,552 mantras in 1,028 hymns across 10 Mandalas. Addressed primarily to Agni, Indra, Varuna, and Soma." },
    { slug:"yajurveda",   title:"Yajurveda",          subtitle:"यजुर्वेद · Veda of Rituals",                  groupName:"The Four Vedas",   icon:"🕯", isSukta:false, sortOrder:3, description:"Contains prose mantras for Vedic yajnas. Exists in two recensions: Shukla (White) and Krishna (Black) Yajurveda. The Taittiriya Samhita contains Sri Rudram." },
    { slug:"samaveda",    title:"Samaveda",            subtitle:"सामवेद · Veda of Melodies",                   groupName:"The Four Vedas",   icon:"🎵", isSukta:false, sortOrder:4, description:"The Veda of melodies and chants used by Udgatar priests. Nearly all its verses come from the Rigveda but are set to musical notation for liturgical singing." },
    { slug:"atharvaveda", title:"Atharvaveda",         subtitle:"अथर्ववेद · 5,977 Mantras",                   groupName:"The Four Vedas",   icon:"🌿", isSukta:false, sortOrder:5, description:"Contains hymns, spells and incantations for everyday life — healing, prosperity, and protection. The Mundaka, Mandukya, and Prashna Upanishads belong to this Veda." },
    { slug:"suktas",      title:"Vedic Suktas",        subtitle:"सूक्त · Hymns of Praise",                     groupName:"Hymns & Mantras",  icon:"✨", isSukta:false, sortOrder:6, description:"Suktas are structured hymns within the Vedas, each dedicated to a deity or cosmic principle. The most revered suktas are chanted daily in temples and homes." },
    { slug:"rudram",      title:"Sri Rudram",          subtitle:"श्री रुद्रम् · Namakam & Chamakam",           groupName:"Hymns & Mantras",  icon:"☽",  isSukta:true,  sortOrder:7, description:"Sri Rudram is found in the Krishna Yajurveda (Taittiriya Samhita 4.5). It consists of Namakam (salutations) and Chamakam (petitions). The Panchakshara mantra is embedded within it." },
    { slug:"purusha",     title:"Purusha Sukta",       subtitle:"पुरुष सूक्त · Rigveda 10.90",                groupName:"Hymns & Mantras",  icon:"🌌", isSukta:true,  sortOrder:8, description:"The Purusha Sukta describes the cosmic person from whose sacrifice the entire universe emerged. The sun from his eye, the moon from his mind, Indra and Agni from his mouth." },
    { slug:"gayatri",     title:"Gayatri Mantra",      subtitle:"गायत्री मन्त्र · The Mother of All Mantras", groupName:"Hymns & Mantras",  icon:"☀",  isSukta:true,  sortOrder:9, description:"The Gayatri Mantra (Rigveda 3.62.10) is the most sacred mantra of the Vedic tradition. Addressed to Savitr (the divine sun), it is a prayer for divine illumination of the intellect." },
    { slug:"upanishads",  title:"Upanishads",          subtitle:"उपनिषद् · End of the Vedas",                 groupName:"Vedanta",          icon:"🧘", isSukta:false, sortOrder:10, description:"The Upanishads explore the nature of Brahman and Atman. Of 108 Upanishads, 12 principal ones were commented upon by Adi Shankaracharya." },
    { slug:"aranyakas",   title:"Aranyakas",           subtitle:"आरण्यक · Forest Treatises",                   groupName:"Vedanta",          icon:"🌳", isSukta:false, sortOrder:11, description:"Forest texts for those who retired to the forest for meditation. They bridge the ritual Brahmanas and the philosophical Upanishads." },
    { slug:"brahmanas",   title:"Brahmanas",           subtitle:"ब्राह्मण · Ritual Commentaries",              groupName:"Vedanta",          icon:"📿", isSukta:false, sortOrder:12, description:"The Brahmanas provide detailed commentary on Vedic sacrifices and rituals, explaining the meaning and procedure of yajna ceremonies." },
  ];

  for (const vs of vedaSections) {
    await db.vedaSection.upsert({ where:{ slug:vs.slug }, update:vs, create:vs });
  }
  console.log(`  ✓ ${vedaSections.length} veda sections`);

  // ── SUKTA VERSE CONTENT ────────────────────────────────────────────────────
  const purusha = await db.vedaSection.findUnique({ where:{ slug:"purusha" } });
  const gayatri = await db.vedaSection.findUnique({ where:{ slug:"gayatri" } });
  const rudram  = await db.vedaSection.findUnique({ where:{ slug:"rudram"  } });

  const purushaSa = [
    { verseNum:1, text:"सहस्रशीर्षा पुरुषः सहस्राक्षः सहस्रपात् ।\nस भूमिं विश्वतो वृत्वात्यतिष्ठद्दशाङ्गुलम् ॥", transliteration:"Sahasraśīrṣā puruṣaḥ sahasrākṣaḥ sahasrapāt\nSa bhūmiṃ viśvato vṛtvātyatiṣṭhad daśāṅgulam" },
    { verseNum:2, text:"पुरुष एवेदं सर्वं यद्भूतं यच्च भाव्यम् ।\nउतामृतत्वस्येशानो यदन्नेनातिरोहति ॥", transliteration:"Puruṣa evedaṃ sarvaṃ yadbhūtaṃ yacca bhāvyam\nUtāmṛtatvasyeśāno yadannenātirohati" },
    { verseNum:3, text:"एतावानस्य महिमातो ज्यायांश्च पूरुषः ।\nपादोऽस्य विश्वा भूतानि त्रिपादस्यामृतं दिवि ॥", transliteration:"Etāvānasya mahimāto jyāyāṃśca pūruṣaḥ\nPādo'sya viśvā bhūtāni tripādasyāmṛtaṃ divi" },
    { verseNum:4, text:"त्रिपादूर्ध्व उदैत्पुरुषः पादोऽस्येहाभवत्पुनः ।\nततो विष्वङ् व्यक्रामत्साशनानशने अभि ॥", transliteration:"Tripādūrdhva udaitpuruṣaḥ pādo'syehābhavat punaḥ\nTato viṣvaṅ vyakrāmatsāśanānaśane abhi" },
    { verseNum:5, text:"तस्माद्विराळजायत विराजो अधि पूरुषः ।\nस जातो अत्यरिच्यत पश्चाद्भूमिमथो पुरः ॥", transliteration:"Tasmādvirāḷajāyata virājo adhi pūruṣaḥ\nSa jāto atyaricyata paścādbhūmimatho puraḥ" },
    { verseNum:6, text:"यत्पुरुषेण हविषा देवा यज्ञमतन्वत ।\nवसन्तो अस्यासीदाज्यं ग्रीष्म इध्मः शरद्धविः ॥", transliteration:"Yatpuruṣeṇa haviṣā devā yajñamatanvata\nVasanto asyāsīdājyaṃ grīṣma idhmaḥ śaraddhuviḥ" },
    { verseNum:7, text:"सप्तास्यासन् परिधयस्त्रिः सप्त समिधः कृताः ।\nदेवा यद्यज्ञं तन्वाना अबध्नन् पुरुषं पशुम् ॥", transliteration:"Saptāsyāsan paridhayastris sapta samidhah krtāh\nDevā yadyajñaṃ tanvānā abandhnan puruṣaṃ paśum" },
    { verseNum:8, text:"तं यज्ञं बर्हिषि प्रौक्षन् पुरुषं जातमग्रतः ।\nतेन देवा अयजन्त साध्या ऋषयश्च ये ॥", transliteration:"Taṃ yajñaṃ barhiṣi praukṣan puruṣaṃ jātmagrataḥ\nTena devā ayajanta sādhyā ṛṣayaśca ye" },
  ];

  const purushaTa = [
    { verseNum:1, text:"ஆயிரம் தலைகளும், ஆயிரம் கண்களும், ஆயிரம் கால்களும் உடைய புருஷன் — இந்தப் பூமியை எல்லாப் புறமும் சூழ்ந்து, பத்து விரல் அளவு மேலே நிற்கின்றான்.", transliteration:"" },
    { verseNum:2, text:"புருஷனே இந்த அனைத்துமாகும் — கடந்தது, நிகழ்வது, வரவிருப்பது எல்லாம். அவனே அமரத்தன்மையின் அதிபதி; உணவால் வளர்வோர்க்கும் அவனே இறைவன்.", transliteration:"" },
    { verseNum:3, text:"இவ்வளவே அவனது மகிமை; ஆயினும் புருஷன் இதனினும் மேலானவன். உலக உயிர்கள் யாவும் அவனில் ஒரு பாகமே — மூன்று பாகம் சுவர்க்கத்தில் அழியாமல் திகழும்.", transliteration:"" },
    { verseNum:4, text:"மூன்று பாதங்களுடன் மேலே எழுந்த புருஷன், ஒரு பாதம் மீண்டும் இங்கு தோன்றினான். அதிலிருந்தே உயிர் உள்ளவை, உயிர் இல்லாதவை எல்லாவற்றிலும் பரவினான்.", transliteration:"" },
  ];

  const purushaEn = [
    { verseNum:1, text:"The Purusha has a thousand heads, a thousand eyes, a thousand feet. He pervades the earth on all sides, extending ten fingers beyond it.", transliteration:"" },
    { verseNum:2, text:"The Purusha alone is all this — what has been and what shall be. He is the lord of immortality and of all that grows by nourishment.", transliteration:"" },
    { verseNum:3, text:"Such is his greatness, and the Purusha is yet greater than this. One fourth of him is all beings; three fourths is immortal life in heaven.", transliteration:"" },
    { verseNum:4, text:"With three fourths the Purusha rose upward; one fourth was born here again. From there he moves in all directions, permeating all that lives and breathes.", transliteration:"" },
    { verseNum:5, text:"From him Virat was born; from Virat the Purusha arose again. He who was born filled the earth — then exceeded it, forward and back.", transliteration:"" },
    { verseNum:6, text:"When the gods performed a sacrifice with the Purusha as the oblation — spring was the clarified butter, summer the fuel, and autumn the offering.", transliteration:"" },
    { verseNum:7, text:"Seven were the enclosing sticks; thrice seven were the kindling sticks. When the gods, stretching forth the sacrifice, bound the Purusha as the victim.", transliteration:"" },
    { verseNum:8, text:"With the sacrifice the gods worshipped the sacrifice; these were the first ordinances. The mighty ones attained the heights of heaven where the ancient Sadhyas and gods dwell.", transliteration:"" },
  ];

  const gayatriSa = [
    { verseNum:1, text:"ॐ भूर्भुवः स्वः\nतत्सवितुर्वरेण्यं\nभर्गो देवस्य धीमहि\nधियो यो नः प्रचोदयात् ॥", transliteration:"Om bhūrbhuvaḥ svaḥ\nTat saviturvareṇyaṃ\nBhargo devasya dhīmahi\nDhiyo yo naḥ pracodayāt" },
    { verseNum:2, text:"ॐ भूः — भूलोक (पृथ्वी)\nॐ भुवः — भुवर्लोक (अन्तरिक्ष)\nॐ स्वः — स्वर्लोक (स्वर्ग)", transliteration:"Om Bhūḥ — Earth plane\nOm Bhuvaḥ — Intermediate space\nOm Svaḥ — Celestial realm" },
  ];

  const gayatriEn = [
    { verseNum:1, text:"O Divine Mother — our hearts are filled with darkness. Please make this darkness distant from us and promote illumination within us.", transliteration:"" },
    { verseNum:2, text:"We meditate on the divine light of the Sun god Savitr. May he illuminate our intellects and lead us on the righteous path.\n\nWord by word: Tat (that) · Savitur (of the Sun) · Vareṇyam (most excellent) · Bhargo (radiance) · Devasya (divine) · Dhīmahi (we meditate upon) · Dhiyo (intellect) · Yo (which) · Naḥ (our) · Pracodayāt (may inspire)", transliteration:"" },
  ];

  const rudramSa = [
    { verseNum:1, text:"ॐ नमस्ते रुद्र मन्यव उतो त इषवे नमः ।\nनमस्ते अस्तु धन्वने बाहुभ्यामुत ते नमः ॥", transliteration:"Om namaste rudra manyava uto ta iṣave namaḥ\nNameste astu dhanvane bāhubhyāmuta te namaḥ" },
    { verseNum:2, text:"या त इषुः शिवतमा शिवं बभूव ते धनुः ।\nशिवा शरव्या या तव तया नो रुद्र मृडय ॥", transliteration:"Yā ta iṣuḥ śivatamā śivaṃ babhūva te dhanuḥ\nŚivā śaravyā yā tava tayā no rudra mṛḍaya" },
    { verseNum:3, text:"या ते रुद्र शिवा तनूरघोरापापकाशिनी ।\nतया नस्तनुवा शन्तमया गिरिशन्ताभिचाकशीहि ॥", transliteration:"Yā te rudra śivā tanūraghorāpāpakāśinī\nTayā nastanuvā śantamayā giriśantābhicākaśīhi" },
    { verseNum:4, text:"यामिषुं गिरिशन्त हस्ते बिभर्ष्यस्तवे ।\nशिवां गिरित्र तां कुरु मा हिंसीः पुरुषं जगत् ॥", transliteration:"Yāmiṣuṃ giriśanta haste bibharṣyastave\nŚivāṃ giritra tāṃ kuru mā hiṃsīḥ puruṣaṃ jagat" },
  ];

  const rudramEn = [
    { verseNum:1, text:"Salutations to your wrath, O Rudra, and salutations to your arrow. Salutations to your bow and salutations to your two arms.", transliteration:"" },
    { verseNum:2, text:"May your most auspicious arrow be auspicious; may your bow be auspicious. May your quiver, O Rudra, be auspicious — with it, O Rudra, be gracious to us.", transliteration:"" },
    { verseNum:3, text:"That body of yours, O Rudra, which is auspicious, not terrible, not showing evil — with that most benign body, O Dweller of the mountain, look upon us.", transliteration:"" },
    { verseNum:4, text:"O Dweller of the mountain, make auspicious that arrow which you hold in your hand ready to shoot. O Protector of the mountain, do not harm man or beast.", transliteration:"" },
  ];

  // Upsert all verse content
  const verseGroups = [
    { section: purusha, lang:"sa", verses: purushaSa },
    { section: purusha, lang:"en", verses: purushaEn },
    { section: purusha, lang:"ta", verses: purushaTa },
    { section: gayatri, lang:"sa", verses: gayatriSa },
    { section: gayatri, lang:"en", verses: gayatriEn },
    { section: rudram,  lang:"sa", verses: rudramSa  },
    { section: rudram,  lang:"en", verses: rudramEn  },
  ];

  let verseCount = 0;
  for (const { section, lang, verses } of verseGroups) {
    if (!section) continue;
    for (const v of verses) {
      await db.vedaSectionContent.upsert({
        where:{ sectionId_languageCode_verseNum:{ sectionId:section.id, languageCode:lang, verseNum:v.verseNum } },
        update:{ text:v.text, transliteration:v.transliteration },
        create:{ sectionId:section.id, languageCode:lang, verseNum:v.verseNum, text:v.text, transliteration:v.transliteration }
      });
      verseCount++;
    }
  }
  console.log(`  ✓ ${verseCount} sukta verses (${[...new Set(verseGroups.map(g=>g.lang))].join(", ")})`);

  // ── ASHTOTHARAS ────────────────────────────────────────────────────────────
  const ashtoData = [
    { deitySlug:"shiva", title:"Shiva Ashtottara Shatanamavali", intro:"The 108 names of Lord Shiva each reveal a divine attribute of the Mahadeva. Chanting removes ignorance and bestows liberation.",
    },
    { deitySlug:"ganesha", title:"Ganesha Ashtottara Shatanamavali", intro:"Reciting the 108 names of Ganesha before any auspicious undertaking removes obstacles and ensures success. Each name reflects the many virtues of Vighnaharta.",
    },
  ];

  for (const a of ashtoData) {
    const deity = await db.deity.findUnique({ where:{ slug:a.deitySlug } });
    if (!deity) continue;
    let ashto = await db.ashtothara.findUnique({ where:{ deityId:deity.id } });
    if (!ashto) {
      ashto = await db.ashtothara.create({ data:{ deityId:deity.id, title:a.title, intro:a.intro } });
    }
    for (const n of ASHTOTHARA_NAMES[a.deitySlug] || []) {
      await db.ashtotharaName.upsert({
        where:{ ashtotharaId_num:{ ashtotharaId:ashto.id, num:n.num } },
        update:{ nameDevanagari:n.nameDevanagari, transliteration:n.transliteration, meaning:n.meaning, meaningTa:n.meaningTa },
        create:{ ashtotharaId:ashto.id, num:n.num, nameDevanagari:n.nameDevanagari, transliteration:n.transliteration, meaning:n.meaning, meaningTa:n.meaningTa }
      });
    }
  }
  console.log(`  ✓ ${ashtoData.length} ashtotharas seeded`);

  // ── STORIES ────────────────────────────────────────────────────────────────
  const stories = [
    { slug:"ganesha-elephant-head", title:"How Ganesha Got His Elephant Head", emoji:"🐘", contentType:"kids_story", preview:"The story of how young Ganesh was restored by Shiva with the head of a mighty elephant, becoming the beloved guardian of all beginnings...", body:"Once, Goddess Parvati created a boy from the sandalwood paste of her own body and breathed life into him. She named him Ganesha and asked him to guard her door while she bathed.\n\nLord Shiva returned and was stopped by the boy, who did not recognise him. Shiva, angered, severed the boy's head. Parvati was devastated and Shiva, realising his terrible mistake, sent his ganas to bring back the head of the first living being they found — which happened to be an elephant.\n\nShiva placed the elephant's head on Ganesha's body and restored him to life. From that day, Ganesha became the beloved son of Shiva and Parvati, the remover of obstacles, and the first deity worshipped before any auspicious endeavour.", deitySlug:"ganesha" },
    { slug:"krishna-butter-thief", title:"Krishna and the Butter Thief", emoji:"🧈", contentType:"kids_story", preview:"Young Krishna's playful raids on the butter pots of Vrindavana, delighting the hearts of all who saw the divine child at play...", body:"In the village of Vrindavana, the divine child Krishna was known for one thing above all else — his irresistible love for butter.\n\nEvery day, the gopas (cowherd women) would churn milk and store fresh butter in clay pots hung high from the rafters. And every day, little Krishna would find a way to reach them. He would call his friends, stack them up like a human ladder, and together they would break open the pots and share the butter with the monkeys.\n\nWhen the women complained to Yashoda, his mother, Krishna would deny everything with the most innocent face. Yashoda would tie him to a heavy mortar — but Krishna would drag it through the courtyard, knocking down two Arjuna trees, releasing two divine beings trapped within them.\n\nThe whole village smiled, for they knew — this was no ordinary child.", deitySlug:"krishna" },
    { slug:"shiva-ocean-poison", title:"The Ocean of Poison", emoji:"🌊", contentType:"kids_story", preview:"When the great ocean churned and released a deadly poison threatening all creation, Lord Shiva alone stepped forward to drink it...", body:"Long ago, the gods and demons decided to churn the great cosmic ocean to obtain Amrita — the nectar of immortality. They used Mount Mandara as the churning rod and the great serpent Vasuki as the rope.\n\nAs the ocean churned, many treasures arose — the divine physician Dhanvantari, the wish-fulfilling cow Kamadhenu, the goddess Lakshmi. But then came something terrible: Halahala, the deadliest poison in creation. It began to burn the world.\n\nAll creation was threatened. Neither gods nor demons could face it. In desperation, they turned to Lord Shiva.\n\nWithout hesitation, Shiva took the poison into his hand and drank it. His consort Parvati, watching in fear, clutched his throat to stop it from going further into his body. The poison settled in his throat, turning it blue forever.\n\nFrom that day, Shiva is known as Neelakantha — the blue-throated one — and is worshipped as the greatest of all protectors.", deitySlug:"shiva" },
  ];

  for (const s of stories) {
    const { deitySlug, ...data } = s;
    const story = await db.story.upsert({ where:{ slug:s.slug }, update:data, create:data });
    const deity = await db.deity.findUnique({ where:{ slug:deitySlug } });
    if (deity) {
      await db.storyDeityMap.upsert({
        where:{ storyId_deityId:{ storyId:story.id, deityId:deity.id } },
        update:{}, create:{ storyId:story.id, deityId:deity.id }
      });
    }
  }
  console.log(`  ✓ ${stories.length} stories`);

  console.log("\n✅ Database seeded successfully!");
  console.log("   Run: npm run dev\n");
}

main().catch((e) => { console.error(e); process.exit(1); });
