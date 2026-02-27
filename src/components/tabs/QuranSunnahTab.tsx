import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import ReferenceTooltip from "@/components/ReferenceTooltip";

interface QuranSunnahTabProps {
  onPlayQuran: (surahId: string) => void;
  initialReadSurah?: number | null;
  onClearInitialRead?: () => void;
  playingSurahId?: string | null;
}

/* ── Surah collection with themes ── */
const surahCollections = [
  {
    title: "🌿 For Calmness & Peace",
    surahs: [
      { id: "55", name: "Ar-Rahman", arabic: "الرحمن", desc: "The Most Merciful — reminds you of Allah's countless blessings", verses: 78, benefit: "Gratitude & inner peace" },
      { id: "93", name: "Ad-Duha", arabic: "الضحى", desc: "The Morning Hours — Allah's comfort during times of distress", verses: 11, benefit: "Comfort in sadness" },
      { id: "94", name: "Ash-Sharh", arabic: "الشرح", desc: "The Relief — 'With hardship comes ease' repeated twice", verses: 8, benefit: "Hope & relief" },
      { id: "36", name: "Ya-Sin", arabic: "يس", desc: "Heart of the Quran — recite for spiritual healing", verses: 83, benefit: "Spiritual healing" },
    ],
  },
  {
    title: "🛡️ For Protection & Refuge",
    surahs: [
      { id: "1", name: "Al-Fatiha", arabic: "الفاتحة", desc: "The Opening — the greatest surah, a cure for the heart", verses: 7, benefit: "Complete healing" },
      { id: "112", name: "Al-Ikhlas", arabic: "الإخلاص", desc: "Sincerity — equals one-third of the Quran", verses: 4, benefit: "Purifying belief" },
      { id: "113", name: "Al-Falaq", arabic: "الفلق", desc: "The Daybreak — seek refuge from all evil", verses: 5, benefit: "Protection from evil" },
      { id: "114", name: "An-Nas", arabic: "الناس", desc: "Mankind — seek refuge from the whisperer", verses: 6, benefit: "Protection from waswas" },
    ],
  },
  {
    title: "💪 For Patience & Strength",
    surahs: [
      { id: "67", name: "Al-Mulk", arabic: "الملك", desc: "The Sovereignty — protection from the punishment of the grave", verses: 30, benefit: "Nightly protection" },
      { id: "56", name: "Al-Waqi'ah", arabic: "الواقعة", desc: "The Inevitable — recite for provision and contentment", verses: 96, benefit: "Provision & wealth" },
      { id: "73", name: "Al-Muzzammil", arabic: "المزمل", desc: "The Enshrouded One — on night prayer and patience", verses: 20, benefit: "Night prayer strength" },
    ],
  },
];

/* ── Hadith on anger ── */
const angerHadiths = [
  { arabic: "لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ", transliteration: "Laysa ash-shadīdu biṣ-ṣur'ah, innamā ash-shadīdu alladhī yamliku nafsahu 'indal-ghaḍab", english: "The strong person is not the one who can overpower others. The strong person is the one who controls himself when he is angry.", narrator: "Abu Hurayrah (رضي الله عنه)", source: "Sahih al-Bukhari 6114", link: "https://sunnah.com/bukhari:6114", theme: "Strength" },
  { arabic: "لاَ تَغْضَبْ", transliteration: "Lā taghḍab", english: "Do not get angry.", narrator: "Abu Hurayrah (رضي الله عنه) — A man asked the Prophet ﷺ for advice, and he repeated this three times.", source: "Sahih al-Bukhari 6116", link: "https://sunnah.com/bukhari:6116", theme: "Advice" },
  { arabic: "إِذَا غَضِبَ أَحَدُكُمْ وَهُوَ قَائِمٌ فَلْيَجْلِسْ فَإِنْ ذَهَبَ عَنْهُ الْغَضَبُ وَإِلاَّ فَلْيَضْطَجِعْ", transliteration: "Idhā ghaḍiba aḥadukum wa huwa qā'imun falyajlis, fa in dhahaba 'anhu al-ghaḍabu wa illā falyaḍṭaji'", english: "If any of you becomes angry and he is standing, let him sit down so his anger will go away. If it does not go away, let him lie down.", narrator: "Abu Dharr (رضي الله عنه)", source: "Sunan Abu Dawud 4782", link: "https://sunnah.com/abudawud:4782", theme: "Action" },
  { arabic: "إِنَّ الْغَضَبَ مِنَ الشَّيْطَانِ وَإِنَّ الشَّيْطَانَ خُلِقَ مِنَ النَّارِ", transliteration: "Innal-ghaḍaba minash-shayṭān, wa innash-shayṭāna khuliqa minan-nār", english: "Anger comes from Shaytan. Shaytan was created from fire, and fire is extinguished only with water. So when any of you becomes angry, let him perform wudu.", narrator: "Atiyyah as-Sa'di (رضي الله عنه)", source: "Sunan Abu Dawud 4784", link: "https://sunnah.com/abudawud:4784", theme: "Wudu" },
  { arabic: "إِذَا غَضِبَ أَحَدُكُمْ فَلْيَسْكُتْ", transliteration: "Idhā ghaḍiba aḥadukum falyaskut", english: "If any of you becomes angry, let him keep silent.", narrator: "Ibn Abbas (رضي الله عنه)", source: "Musnad Ahmad 2136", link: "https://sunnah.com/ahmad:2136", theme: "Silence" },
  { english: "Whoever restrains his anger when he is able to act upon it, Allah will call him before all of creation on the Day of Resurrection and let him choose whichever of the Hoor al-'Ayn he wishes.", narrator: "Mu'adh ibn Anas (رضي الله عنه)", source: "Sunan at-Tirmidhi 2021", link: "https://sunnah.com/tirmidhi:2021", theme: "Reward" },
  { english: "The most beloved of people to Allah are those who are most beneficial to people. The most beloved of deeds to Allah is making a Muslim happy, removing a hardship from him, or paying off a debt for him.", narrator: "Ibn Umar (رضي الله عنه)", source: "al-Mu'jam al-Awsat 6192", link: "https://sunnah.com/search?q=most+beloved+people", theme: "Kindness" },
  { english: "None of you truly believes until he loves for his brother what he loves for himself.", narrator: "Anas ibn Malik (رضي الله عنه)", source: "Sahih al-Bukhari 13", link: "https://sunnah.com/bukhari:13", theme: "Brotherhood" },
];

/* ── Duas for anger & distress ── */
const duas = [
  { title: "Seeking Refuge from Anger", arabic: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ", transliteration: "A'ūdhu billāhi minash-shayṭānir-rajīm", english: "I seek refuge in Allah from the accursed Satan.", when: "When you feel anger rising", source: "Sahih al-Bukhari 6115", link: "https://sunnah.com/bukhari:6115" },
  { title: "Dua for Patience", arabic: "رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا وَانْصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ", transliteration: "Rabbanā afrigh 'alaynā ṣabran wa thabbit aqdāmanā wanṣurnā 'alal-qawmil-kāfirīn", english: "Our Lord, pour upon us patience and plant firmly our feet.", when: "When facing a difficult situation", source: "Qur'an 2:250", link: "https://quran.com/2/250" },
  { title: "Dua for Relief from Distress", arabic: "لَا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ", transliteration: "Lā ilāha illā anta subḥānaka innī kuntu minaẓ-ẓālimīn", english: "There is no god but You, glorified are You. Indeed, I have been of the wrongdoers.", when: "When overwhelmed — the dua of Prophet Yunus (عليه السلام)", source: "Qur'an 21:87", link: "https://quran.com/21/87" },
  { title: "Dua for Ease", arabic: "اللَّهُمَّ لاَ سَهْلَ إِلاَّ مَا جَعَلْتَهُ سَهْلاً وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلاً", transliteration: "Allāhumma lā sahla illā mā ja'altahu sahlā, wa anta taj'alul-ḥazna idhā shi'ta sahlā", english: "O Allah, there is no ease except what You make easy. And You make grief easy if You will.", when: "When things feel impossibly hard", source: "Sahih Ibn Hibban 974", link: "https://sunnah.com/search?q=la+sahla+illa" },
  { title: "Dua for Guidance", arabic: "اللَّهُمَّ اهْدِنِي وَسَدِّدْنِي", transliteration: "Allāhummah-dinī wa saddidnī", english: "O Allah, guide me and keep me on the right path.", when: "When unsure how to respond", source: "Sahih Muslim 2725", link: "https://sunnah.com/muslim:2725" },
];

/* ── Ayahs on anger, patience, forgiveness ── */
const ayahCollections = [
  {
    title: "On Restraining Anger",
    ayahs: [
      { arabic: "وَالْكَاظِمِينَ الْغَيْظَ وَالْعَافِينَ عَنِ النَّاسِ وَاللَّهُ يُحِبُّ الْمُحْسِنِينَ", transliteration: "Wal-kāẓimīnal-ghayẓa wal-'āfīna 'anin-nāsi wallāhu yuḥibbul-muḥsinīn", english: "Those who restrain their anger and pardon people — and Allah loves the doers of good.", ref: "3:134", link: "https://quran.com/3/134" },
      { arabic: "وَإِذَا مَا غَضِبُوا هُمْ يَغْفِرُونَ", transliteration: "Wa idhā mā ghaḍibū hum yaghfirūn", english: "And when they are angry, they forgive.", ref: "42:37", link: "https://quran.com/42/37" },
    ],
  },
  {
    title: "On Patience",
    ayahs: [
      { arabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", transliteration: "Innallāha ma'aṣ-ṣābirīn", english: "Indeed, Allah is with the patient.", ref: "2:153", link: "https://quran.com/2/153" },
      { arabic: "إِنَّمَا يُوَفَّى الصَّابِرُونَ أَجْرَهُم بِغَيْرِ حِسَابٍ", transliteration: "Innamā yuwaffā aṣ-ṣābirūna ajrahum bighayri ḥisāb", english: "The patient will be given their reward without account.", ref: "39:10", link: "https://quran.com/39/10" },
      { arabic: "وَلَمَن صَبَرَ وَغَفَرَ إِنَّ ذَٰلِكَ لَمِنْ عَزْمِ الْأُمُورِ", transliteration: "Wa laman ṣabara wa ghafara inna dhālika lamin 'azmi al-umūr", english: "And whoever is patient and forgives — that is of the matters requiring determination.", ref: "42:43", link: "https://quran.com/42/43" },
    ],
  },
  {
    title: "On Forgiveness",
    ayahs: [
      { arabic: "خُذِ الْعَفْوَ وَأْمُرْ بِالْعُرْفِ وَأَعْرِضْ عَنِ الْجَاهِلِينَ", transliteration: "Khudhil-'afwa wa'mur bil-'urfi wa a'riḍ 'anil-jāhilīn", english: "Show forgiveness, enjoin what is good, and turn away from the ignorant.", ref: "7:199", link: "https://quran.com/7/199" },
      { arabic: "أَلَا تُحِبُّونَ أَن يَغْفِرَ اللَّهُ لَكُمْ", transliteration: "Alā tuḥibbūna an yaghfirallāhu lakum", english: "Do you not wish that Allah should forgive you?", ref: "24:22", link: "https://quran.com/24/22" },
    ],
  },
  {
    title: "On Ease After Hardship",
    ayahs: [
      { arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا · إِنَّ مَعَ الْعُسْرِ يُسْرًا", transliteration: "Fa inna ma'al-'usri yusrā. Inna ma'al-'usri yusrā", english: "For indeed, with hardship comes ease. Indeed, with hardship comes ease.", ref: "94:5-6", link: "https://quran.com/94/5-6" },
      { arabic: "ادْفَعْ بِالَّتِي هِيَ أَحْسَنُ", transliteration: "Idfa' billatī hiya aḥsan", english: "Repel evil with that which is better.", ref: "41:34", link: "https://quran.com/41/34" },
    ],
  },
];

/* ── Verse-by-verse reading data ── */
interface QuranVerse {
  number: number;
  arabic: string;
  translation: string;
}

type SubTab = "listen" | "read" | "sunnah" | "duas" | "ayahs" | "saved";

const readingSurahs = [
  { id: 1, name: "Al-Fatiha", arabic: "الفاتحة", verses: 7 },
  { id: 36, name: "Ya-Sin", arabic: "يس", verses: 83 },
  { id: 55, name: "Ar-Rahman", arabic: "الرحمن", verses: 78 },
  { id: 67, name: "Al-Mulk", arabic: "الملك", verses: 30 },
  { id: 93, name: "Ad-Duha", arabic: "الضحى", verses: 11 },
  { id: 94, name: "Ash-Sharh", arabic: "الشرح", verses: 8 },
  { id: 112, name: "Al-Ikhlas", arabic: "الإخلاص", verses: 4 },
  { id: 113, name: "Al-Falaq", arabic: "الفلق", verses: 5 },
  { id: 114, name: "An-Nas", arabic: "الناس", verses: 6 },
];

const QuranSunnahTab = ({ onPlayQuran, initialReadSurah, onClearInitialRead, playingSurahId }: QuranSunnahTabProps) => {
  const { bookmarks, addBookmark, removeBookmark, isBookmarked, angerLog, moodLog, onboardingData } = useApp();
  const [subTab, setSubTab] = useState<SubTab>(() => initialReadSurah ? "read" : "listen");
  const [expandedHadith, setExpandedHadith] = useState<number | null>(null);
  const [readingSurah, setReadingSurah] = useState<number | null>(initialReadSurah ?? null);
  const [verses, setVerses] = useState<QuranVerse[]>([]);
  const [loadingVerses, setLoadingVerses] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [fontSize, setFontSize] = useState<"sm" | "md" | "lg">("md");
  const [lastPlayed, setLastPlayed] = useState<string | null>(() =>
    localStorage.getItem("hc-last-played-surah")
  );

  // Handle incoming read navigation from other tabs
  useEffect(() => {
    if (initialReadSurah) {
      setSubTab("read");
      setReadingSurah(initialReadSurah);
      onClearInitialRead?.();
    }
  }, [initialReadSurah, onClearInitialRead]);

  // Auto-scroll to currently playing surah in listen tab
  useEffect(() => {
    if (playingSurahId && subTab === "listen") {
      setTimeout(() => {
        const el = document.querySelector(`[data-surah-id="${playingSurahId}"]`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 200);
    }
  }, [playingSurahId, subTab]);

  // --- Personalized Recommendations ---
  const getRecommendations = () => {
    const hour = new Date().getHours();
    const recentTriggers = angerLog.slice(0, 10).map(e => e.trigger.toLowerCase());
    const recentMood = moodLog.length > 0 ? moodLog[0].mood : 3;
    const topTrigger = onboardingData.topTrigger?.toLowerCase() || "";
    const recs: { type: "surah" | "hadith" | "dua"; reason: string; id: string; name: string; emoji: string }[] = [];

    // Mood-based
    if (recentMood >= 4) {
      recs.push({ type: "surah", reason: "You're feeling low — this surah brings comfort", id: "93", name: "Surah Ad-Duha", emoji: "☀️" });
      recs.push({ type: "dua", reason: "A dua for relief during difficult times", id: "dua-relief", name: "Dua of Yunus (AS)", emoji: "🤲" });
    }
    if (recentMood <= 2) {
      recs.push({ type: "surah", reason: "Alhamdulillah — listen in gratitude", id: "55", name: "Surah Ar-Rahman", emoji: "🌿" });
    }

    // Trigger-based
    const hasRelationshipTrigger = recentTriggers.some(t => t.includes("family") || t.includes("marriage") || t.includes("relationship")) || topTrigger.includes("family");
    const hasWorkTrigger = recentTriggers.some(t => t.includes("work") || t.includes("stress")) || topTrigger.includes("work");
    const hasOnlineTrigger = recentTriggers.some(t => t.includes("online") || t.includes("argument")) || topTrigger.includes("online");

    if (hasRelationshipTrigger) {
      recs.push({ type: "hadith", reason: "For patience in family matters", id: "hadith-strength", name: "Hadith on True Strength", emoji: "💪" });
      recs.push({ type: "surah", reason: "For tranquility in relationships", id: "94", name: "Surah Ash-Sharh", emoji: "💚" });
    }
    if (hasWorkTrigger) {
      recs.push({ type: "surah", reason: "For patience during work stress", id: "67", name: "Surah Al-Mulk", emoji: "🛡️" });
      recs.push({ type: "dua", reason: "Ask Allah for ease", id: "dua-ease", name: "Dua for Ease", emoji: "🤲" });
    }
    if (hasOnlineTrigger) {
      recs.push({ type: "hadith", reason: "The Prophet ﷺ said: be silent", id: "hadith-silence", name: "Hadith on Silence", emoji: "🤫" });
    }

    // Time-based
    if (hour >= 20 || hour < 5) {
      recs.push({ type: "surah", reason: "Recommended before sleep", id: "67", name: "Surah Al-Mulk", emoji: "🛡️" });
    }
    if (hour >= 5 && hour < 8) {
      recs.push({ type: "surah", reason: "Start your morning with light", id: "93", name: "Surah Ad-Duha", emoji: "☀️" });
    }

    // Anger frequency
    const recentAnger = angerLog.filter(e => {
      const d = new Date(e.date);
      return Date.now() - d.getTime() < 7 * 86400000;
    });
    if (recentAnger.length >= 3) {
      recs.push({ type: "surah", reason: "You've had a tough week — find peace", id: "55", name: "Surah Ar-Rahman", emoji: "🌿" });
      recs.push({ type: "hadith", reason: "Reminder: the strong restrain anger", id: "hadith-strong", name: "Hadith on Strength", emoji: "💪" });
    }

    // Deduplicate by id
    const seen = new Set<string>();
    return recs.filter(r => {
      if (seen.has(r.id)) return false;
      seen.add(r.id);
      return true;
    }).slice(0, 4);
  };

  const recommendations = getRecommendations();

  const subTabs: { id: SubTab; label: string; emoji: string }[] = [
    { id: "listen", label: "Listen", emoji: "🎧" },
    { id: "read", label: "Read", emoji: "📜" },
    { id: "ayahs", label: "Ayahs", emoji: "📖" },
    { id: "sunnah", label: "Sunnah", emoji: "📚" },
    { id: "duas", label: "Duas", emoji: "🤲" },
    { id: "saved", label: "Saved", emoji: "❤️" },
  ];

  const handlePlayQuran = (surahId: string) => {
    setLastPlayed(surahId);
    localStorage.setItem("hc-last-played-surah", surahId);
    onPlayQuran(surahId);
  };

  const fetchVerses = useCallback(async (surahId: number) => {
    setLoadingVerses(true);
    setVerses([]);
    try {
      const [arabicRes, translationRes] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/surah/${surahId}/ar.alafasy`),
        fetch(`https://api.alquran.cloud/v1/surah/${surahId}/en.sahih`),
      ]);
      const [arabicData, translationData] = await Promise.all([arabicRes.json(), translationRes.json()]);
      if (arabicData.data && translationData.data) {
        const combinedVerses: QuranVerse[] = arabicData.data.ayahs.map((ayah: any, i: number) => ({
          number: ayah.numberInSurah,
          arabic: ayah.text,
          translation: translationData.data.ayahs[i]?.text || "",
        }));
        setVerses(combinedVerses);
      }
    } catch {
      setVerses([]);
    }
    setLoadingVerses(false);
  }, []);

  useEffect(() => {
    if (readingSurah !== null) {
      fetchVerses(readingSurah);
    }
  }, [readingSurah, fetchVerses]);

  const toggleBookmarkAyah = (ayah: { arabic: string; english: string; ref: string; link: string }) => {
    const contentId = `ayah-${ayah.ref}`;
    if (isBookmarked(contentId)) {
      const bm = bookmarks.find((b) => b.contentId === contentId);
      if (bm) removeBookmark(bm.id);
    } else {
      addBookmark({ type: "ayah", contentId, title: `Qur'an ${ayah.ref}`, arabic: ayah.arabic, english: ayah.english, source: `Qur'an ${ayah.ref}`, link: ayah.link });
    }
  };

  const toggleBookmarkHadith = (h: typeof angerHadiths[0], i: number) => {
    const contentId = `hadith-${h.source}`;
    if (isBookmarked(contentId)) {
      const bm = bookmarks.find((b) => b.contentId === contentId);
      if (bm) removeBookmark(bm.id);
    } else {
      addBookmark({ type: "hadith", contentId, title: h.source, arabic: h.arabic, english: h.english, source: h.source, link: h.link });
    }
  };

  const toggleBookmarkDua = (dua: typeof duas[0]) => {
    const contentId = `dua-${dua.source}`;
    if (isBookmarked(contentId)) {
      const bm = bookmarks.find((b) => b.contentId === contentId);
      if (bm) removeBookmark(bm.id);
    } else {
      addBookmark({ type: "dua", contentId, title: dua.title, arabic: dua.arabic, english: dua.english, source: dua.source, link: dua.link });
    }
  };

  const fontSizeClass = fontSize === "sm" ? "text-base" : fontSize === "lg" ? "text-2xl" : "text-xl";
  const translationFontSize = fontSize === "sm" ? "text-xs" : fontSize === "lg" ? "text-base" : "text-sm";

  return (
    <div className="container mx-auto max-w-lg px-4 pt-6 pb-8">
      <h1 className="mb-2 font-heading text-xl font-bold text-foreground">Quran & Sunnah</h1>
      <p className="mb-4 text-sm text-muted-foreground">Your spiritual toolkit for anger management</p>

      {/* Sub-tabs */}
      <div className="mb-6 flex gap-1 rounded-xl bg-muted p-1 overflow-x-auto">
        {subTabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id)}
            className={`flex-1 min-w-0 rounded-lg py-2 text-[10px] font-medium transition-all ${
              subTab === t.id
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="block text-sm">{t.emoji}</span>
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ── Listen Tab ── */}
        {subTab === "listen" && (
          <motion.div key="listen" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* Last played quick resume */}
            {lastPlayed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-5 rounded-2xl border border-primary/20 bg-primary/5 p-4"
              >
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-primary">Continue Listening</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <span className="font-arabic text-lg text-primary">
                      {surahCollections.flatMap(c => c.surahs).find(s => s.id === lastPlayed)?.arabic || "📖"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      Surah {surahCollections.flatMap(c => c.surahs).find(s => s.id === lastPlayed)?.name || `#${lastPlayed}`}
                    </p>
                    <p className="text-xs text-muted-foreground">Mishary Alafasy</p>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => {
                        setSubTab("read");
                        setReadingSurah(Number(lastPlayed));
                      }}
                      className="flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                      whileTap={{ scale: 0.95 }}
                    >
                      📜 Read
                    </motion.button>
                    <motion.button
                      onClick={() => handlePlayQuran(lastPlayed)}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-calm"
                      whileTap={{ scale: 0.9 }}
                    >
                      ▶
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Personalized Recommendations */}
            {recommendations.length > 0 && (
              <div className="mb-5">
                <h2 className="mb-3 font-heading text-sm font-semibold text-foreground">✨ Recommended for You</h2>
                <div className="flex flex-col gap-2">
                  {recommendations.map((rec) => (
                    <motion.button
                      key={rec.id}
                      onClick={() => {
                        if (rec.type === "surah") {
                          handlePlayQuran(rec.id);
                        } else if (rec.type === "hadith") {
                          setSubTab("sunnah");
                        } else {
                          setSubTab("duas");
                        }
                      }}
                      className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-3 text-left transition-all hover:bg-primary/10"
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-xl">{rec.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">{rec.name}</p>
                        <p className="text-[11px] text-muted-foreground">{rec.reason}</p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        {rec.type === "surah" && (
                          <>
                            <span
                              onClick={(e) => { e.stopPropagation(); setSubTab("read"); setReadingSurah(Number(rec.id)); }}
                              className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-[10px] hover:bg-muted cursor-pointer"
                            >📜</span>
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-[10px] text-primary-foreground">▶</span>
                          </>
                        )}
                        {rec.type !== "surah" && (
                          <span className="text-xs text-primary font-medium">View →</span>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">🔍</span>
                <input
                  type="text"
                  placeholder="Search surahs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">✕</button>
                )}
              </div>
            </div>

            {surahCollections.map((collection) => {
              const filteredSurahs = searchQuery
                ? collection.surahs.filter(s =>
                    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    s.arabic.includes(searchQuery) ||
                    s.desc.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                : collection.surahs;

              if (filteredSurahs.length === 0) return null;

              return (
                <div key={collection.title} className="mb-6">
                  <h2 className="mb-3 font-heading text-sm font-semibold text-foreground">{collection.title}</h2>
                  <div className="flex flex-col gap-2">
                    {filteredSurahs.map((s) => (
                      <div
                        key={s.id}
                        data-surah-id={s.id}
                        className={`rounded-xl border bg-card overflow-hidden transition-all hover:shadow-calm ${
                          playingSurahId === s.id ? "border-primary ring-2 ring-primary/20" : lastPlayed === s.id ? "border-primary/30" : "border-border"
                        }`}
                      >
                        <div className="flex items-center gap-3 p-3.5">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                            <span className="font-arabic text-lg text-primary">{s.arabic}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-foreground">Surah {s.name}</p>
                              {playingSurahId === s.id && (
                                <span className="rounded-full bg-primary px-1.5 py-0.5 text-[8px] font-medium text-primary-foreground animate-pulse-gentle">▶ Playing</span>
                              )}
                              {lastPlayed === s.id && playingSurahId !== s.id && (
                                <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[8px] font-medium text-primary">Last played</span>
                              )}
                            </div>
                            <p className="truncate text-xs text-muted-foreground">{s.desc}</p>
                            <div className="mt-1 flex items-center gap-2">
                              <span className="rounded-full bg-accent/30 px-2 py-0.5 text-[9px] font-medium text-accent-foreground">{s.benefit}</span>
                              <span className="text-[10px] text-muted-foreground">{s.verses} ayat</span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1.5 shrink-0">
                            <motion.button
                              onClick={() => handlePlayQuran(s.id)}
                              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs shadow-calm"
                              whileTap={{ scale: 0.9 }}
                              aria-label={`Play Surah ${s.name}`}
                            >
                              ▶
                            </motion.button>
                            <motion.button
                              onClick={() => {
                                setSubTab("read");
                                setReadingSurah(Number(s.id));
                              }}
                              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-muted text-xs transition-colors hover:bg-card"
                              whileTap={{ scale: 0.9 }}
                              aria-label={`Read Surah ${s.name}`}
                            >
                              📜
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* ── Read Tab ── */}
        {subTab === "read" && (
          <motion.div key="read" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {readingSurah === null ? (
              <>
                <p className="mb-4 text-sm text-muted-foreground">Read verse by verse with Arabic text and English translation</p>
                <div className="flex flex-col gap-2">
                  {readingSurahs.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setReadingSurah(s.id)}
                      className="flex items-center gap-3 rounded-xl border border-border bg-card p-3.5 text-left transition-all hover:shadow-calm active:scale-[0.98]"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <span className="font-mono text-sm font-bold text-primary">{s.id}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">{s.name} <span className="font-arabic text-muted-foreground">{s.arabic}</span></p>
                        <p className="text-xs text-muted-foreground">{s.verses} verses</p>
                      </div>
                      <span className="text-xs text-muted-foreground">→</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="mb-4 flex items-center gap-2">
                  <button onClick={() => { setReadingSurah(null); setVerses([]); }} className="text-sm text-primary hover:underline">← Back</button>
                  <div className="flex-1" />
                  {/* Font size controls */}
                  <div className="flex items-center gap-1 rounded-lg border border-border bg-muted p-0.5">
                    {(["sm", "md", "lg"] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => setFontSize(size)}
                        className={`rounded-md px-2 py-1 text-[10px] font-medium transition-all ${
                          fontSize === size ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                        }`}
                      >
                        {size === "sm" ? "A" : size === "md" ? "A+" : "A++"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-heading text-lg font-bold text-foreground">
                    {readingSurahs.find((s) => s.id === readingSurah)?.name}
                    <span className="ml-2 font-arabic text-muted-foreground">{readingSurahs.find((s) => s.id === readingSurah)?.arabic}</span>
                  </h2>
                  <button
                    onClick={() => handlePlayQuran(String(readingSurah))}
                    className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                  >
                    🎧 Listen
                  </button>
                </div>

                {/* Verse count indicator */}
                {verses.length > 0 && (
                  <p className="mb-3 text-xs text-muted-foreground">{verses.length} verses loaded</p>
                )}

                {loadingVerses ? (
                  <div className="flex flex-col items-center gap-3 py-12">
                    <motion.span animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="text-3xl">📖</motion.span>
                    <p className="text-sm text-muted-foreground">Loading verses...</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {/* Bismillah for non-Fatiha surahs */}
                    {readingSurah !== 1 && readingSurah !== 9 && (
                      <div className="rounded-2xl border border-border bg-gradient-calm p-4 text-center">
                        <p className="font-arabic text-xl text-foreground" dir="rtl">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
                        <p className="mt-1 text-xs text-muted-foreground italic">In the name of Allah, the Most Gracious, the Most Merciful</p>
                      </div>
                    )}
                    {verses.map((v) => (
                      <div key={v.number} className="rounded-2xl border border-border bg-card p-4">
                        <div className="mb-2 flex items-start justify-between">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">{v.number}</span>
                          <button
                            onClick={() => {
                              toggleBookmarkAyah({
                                arabic: v.arabic,
                                english: v.translation,
                                ref: `${readingSurah}:${v.number}`,
                                link: `https://quran.com/${readingSurah}/${v.number}`,
                              });
                            }}
                            className="text-sm"
                          >
                            {isBookmarked(`ayah-${readingSurah}:${v.number}`) ? "❤️" : "🤍"}
                          </button>
                        </div>
                        <p className={`mb-3 font-arabic ${fontSizeClass} leading-[2.2] text-foreground`} dir="rtl">{v.arabic}</p>
                        <p className={`${translationFontSize} text-muted-foreground leading-relaxed`}>{v.translation}</p>
                      </div>
                    ))}

                    {/* Navigation between surahs */}
                    {verses.length > 0 && (
                      <div className="flex items-center justify-between pt-4">
                        {(() => {
                          const idx = readingSurahs.findIndex(s => s.id === readingSurah);
                          const prev = idx > 0 ? readingSurahs[idx - 1] : null;
                          const next = idx < readingSurahs.length - 1 ? readingSurahs[idx + 1] : null;
                          return (
                            <>
                              {prev ? (
                                <button
                                  onClick={() => setReadingSurah(prev.id)}
                                  className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
                                >
                                  ← {prev.name}
                                </button>
                              ) : <div />}
                              {next ? (
                                <button
                                  onClick={() => setReadingSurah(next.id)}
                                  className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
                                >
                                  {next.name} →
                                </button>
                              ) : <div />}
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}

        {/* ── Ayahs Tab ── */}
        {subTab === "ayahs" && (
          <motion.div key="ayahs" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {ayahCollections.map((collection) => (
              <div key={collection.title} className="mb-6">
                <h2 className="mb-3 font-heading text-sm font-semibold text-foreground">{collection.title}</h2>
                <div className="flex flex-col gap-3">
                  {collection.ayahs.map((ayah, i) => (
                    <div key={i} className="rounded-2xl bg-gradient-calm border border-border p-4">
                      <div className="mb-2 flex justify-between items-start">
                        <p className="font-arabic text-lg leading-loose text-foreground flex-1" dir="rtl">{ayah.arabic}</p>
                        <button onClick={() => toggleBookmarkAyah(ayah)} className="ml-2 text-sm shrink-0">{isBookmarked(`ayah-${ayah.ref}`) ? "❤️" : "🤍"}</button>
                      </div>
                      <p className="mb-1 text-xs font-medium text-primary italic">{ayah.transliteration}</p>
                      <p className="mb-2 text-sm text-muted-foreground italic">"{ayah.english}"</p>
                      <ReferenceTooltip reference={`Qur'an ${ayah.ref}`} arabic={ayah.arabic} english={ayah.english} link={ayah.link}>
                        <a href={ayah.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline">Qur'an {ayah.ref} →</a>
                      </ReferenceTooltip>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* ── Sunnah Tab ── */}
        {subTab === "sunnah" && (
          <motion.div key="sunnah" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <p className="mb-4 text-sm text-muted-foreground">Authentic Hadiths on anger, patience, and self-control</p>
            <div className="flex flex-col gap-3">
              {angerHadiths.map((h, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden">
                  <button
                    onClick={() => setExpandedHadith(expandedHadith === i ? null : i)}
                    className="flex w-full items-start gap-3 p-4 text-left"
                  >
                    <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${expandedHadith === i ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground leading-relaxed">"{h.english}"</p>
                      <div className="mt-2 flex items-center gap-2 flex-wrap">
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">{h.theme}</span>
                        <span className="text-[10px] text-muted-foreground">{h.source}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <button onClick={(e) => { e.stopPropagation(); toggleBookmarkHadith(h, i); }} className="text-sm">{isBookmarked(`hadith-${h.source}`) ? "❤️" : "🤍"}</button>
                      <span className="text-xs text-muted-foreground">{expandedHadith === i ? "▲" : "▼"}</span>
                    </div>
                  </button>
                  <AnimatePresence>
                    {expandedHadith === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="border-t border-border px-4 pb-4 pt-3">
                          {h.arabic && <p className="mb-2 font-arabic text-base leading-relaxed text-foreground" dir="rtl">{h.arabic}</p>}
                          {h.transliteration && <p className="mb-2 text-xs text-primary italic">{h.transliteration}</p>}
                          <p className="mb-2 text-xs text-muted-foreground">📜 {h.narrator}</p>
                          <ReferenceTooltip reference={h.source} arabic={h.arabic} english={h.english} link={h.link} source={h.narrator}>
                            <a href={h.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary underline">View on Sunnah.com →</a>
                          </ReferenceTooltip>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Duas Tab ── */}
        {subTab === "duas" && (
          <motion.div key="duas" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <p className="mb-4 text-sm text-muted-foreground">Prophetic supplications for moments of anger and distress</p>
            <div className="flex flex-col gap-4">
              {duas.map((dua, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-sm">🤲</span>
                      <h3 className="text-sm font-semibold text-foreground">{dua.title}</h3>
                    </div>
                    <button onClick={() => toggleBookmarkDua(dua)} className="text-sm">{isBookmarked(`dua-${dua.source}`) ? "❤️" : "🤍"}</button>
                  </div>
                  <div className="mb-3 rounded-xl bg-gradient-calm p-3">
                    <p className="mb-1 font-arabic text-lg leading-loose text-foreground" dir="rtl">{dua.arabic}</p>
                    <p className="text-xs font-medium text-primary italic">{dua.transliteration}</p>
                  </div>
                  <p className="mb-2 text-sm text-foreground">"{dua.english}"</p>
                  <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-2">
                    <span className="text-xs">⏰</span>
                    <p className="text-xs text-muted-foreground">{dua.when}</p>
                  </div>
                  <a href={dua.link} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs text-primary underline">{dua.source} →</a>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Saved/Bookmarks Tab ── */}
        {subTab === "saved" && (
          <motion.div key="saved" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {bookmarks.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <span className="text-4xl">🤍</span>
                <p className="text-sm text-muted-foreground">No saved items yet</p>
                <p className="text-xs text-muted-foreground">Tap the heart icon on any ayah, hadith, or dua to save it here</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {bookmarks.map((bm) => (
                  <div key={bm.id} className="rounded-2xl border border-border bg-card p-4">
                    <div className="mb-2 flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary capitalize">{bm.type}</span>
                        <span className="text-xs text-muted-foreground">{bm.source}</span>
                      </div>
                      <button onClick={() => removeBookmark(bm.id)} className="text-sm">❤️</button>
                    </div>
                    {bm.arabic && <p className="mb-2 font-arabic text-base leading-relaxed text-foreground" dir="rtl">{bm.arabic}</p>}
                    <p className="text-sm text-muted-foreground italic">"{bm.english}"</p>
                    {bm.link && <a href={bm.link} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs text-primary underline">{bm.source} →</a>}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuranSunnahTab;
