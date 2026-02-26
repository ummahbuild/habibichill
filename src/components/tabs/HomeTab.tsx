import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";

const wisdoms = [
  { arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", english: "Indeed, with hardship comes ease.", ref: "Qur'an 94:6", link: "https://quran.com/94/6" },
  { arabic: "وَاصْبِرْ فَإِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ", english: "Be patient, for Allah does not waste the reward of those who do good.", ref: "Qur'an 11:115", link: "https://quran.com/11/115" },
  { arabic: "خُذِ الْعَفْوَ وَأْمُرْ بِالْعُرْفِ وَأَعْرِضْ عَنِ الْجَاهِلِينَ", english: "Show forgiveness, enjoin what is good, and turn away from the ignorant.", ref: "Qur'an 7:199", link: "https://quran.com/7/199" },
  { arabic: "وَلَمَن صَبَرَ وَغَفَرَ إِنَّ ذَٰلِكَ لَمِنْ عَزْمِ الْأُمُورِ", english: "And whoever is patient and forgives — indeed, that is of the matters requiring resolve.", ref: "Qur'an 42:43", link: "https://quran.com/42/43" },
  { arabic: "ادْفَعْ بِالَّتِي هِيَ أَحْسَنُ فَإِذَا الَّذِي بَيْنَكَ وَبَيْنَهُ عَدَاوَةٌ كَأَنَّهُ وَلِيٌّ حَمِيمٌ", english: "Repel evil with that which is better; then the one between whom and you there was enmity will become a devoted friend.", ref: "Qur'an 41:34", link: "https://quran.com/41/34" },
];

interface HomeTabProps {
  onPlayQuran: (surahId: string) => void;
}

const quranSurahs = [
  { id: "55", name: "Surah Ar-Rahman", desc: "The Most Merciful" },
  { id: "67", name: "Surah Al-Mulk", desc: "The Sovereignty" },
  { id: "36", name: "Surah Ya-Sin", desc: "Heart of the Quran" },
  { id: "1", name: "Surah Al-Fatiha", desc: "The Opening" },
  { id: "112", name: "Surah Al-Ikhlas", desc: "Sincerity" },
];

const quickTools = [
  { emoji: "📿", label: "Dhikr" },
  { emoji: "📖", label: "Quran" },
  { emoji: "💧", label: "Wudu" },
  { emoji: "📓", label: "Journal" },
];

const HomeTab = ({ onPlayQuran }: HomeTabProps) => {
  const { sabrPoints, streak } = useApp();
  const todayWisdom = wisdoms[Math.floor(Date.now() / 86400000) % wisdoms.length];

  return (
    <div className="container mx-auto max-w-lg px-4 pt-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold text-foreground">Assalamu Alaikum</h1>
          <p className="text-sm text-muted-foreground">How are you feeling today?</p>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-secondary/20 px-3 py-1 text-sm font-medium text-secondary">
          🔥 {streak} day streak
        </div>
      </div>

      {/* Sabr Score */}
      <div className="mb-6 rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Your Sabr Score</p>
            <p className="font-heading text-3xl font-bold text-primary">{sabrPoints}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Level</p>
            <p className="font-heading text-lg font-semibold text-foreground">
              {sabrPoints < 50 ? "Beginner" : sabrPoints < 150 ? "Student" : sabrPoints < 300 ? "Practitioner" : "Master"}
            </p>
          </div>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.min((sabrPoints % 100), 100)}%` }} />
        </div>
      </div>

      {/* Quick Tools */}
      <div className="mb-6">
        <h2 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">Quick Tools</h2>
        <div className="grid grid-cols-4 gap-3">
          {quickTools.map((tool) => (
            <button key={tool.label} className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card p-3 transition-all hover:shadow-calm active:scale-95">
              <span className="text-2xl">{tool.emoji}</span>
              <span className="text-xs font-medium text-card-foreground">{tool.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Daily Wisdom */}
      <div className="mb-6 rounded-2xl bg-gradient-calm border border-border p-5">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Daily Wisdom</p>
        <p className="mb-2 font-arabic text-xl leading-relaxed text-foreground" dir="rtl">{todayWisdom.arabic}</p>
        <p className="mb-2 text-sm text-muted-foreground italic">"{todayWisdom.english}"</p>
        <a href={todayWisdom.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline">
          {todayWisdom.ref} — View on Quran.com →
        </a>
      </div>

      {/* Calm Quran - now with in-app player */}
      <div className="mb-6 rounded-2xl border border-border bg-card p-4">
        <h2 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">Quick Play — Calming Quran</h2>
        <div className="flex flex-col gap-2">
          {quranSurahs.map((s) => (
            <button
              key={s.id}
              onClick={() => onPlayQuran(s.id)}
              className="flex items-center justify-between rounded-xl border border-border bg-background p-3 transition-colors hover:bg-muted text-left"
            >
              <div>
                <p className="text-sm font-medium text-foreground">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm">▶</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeTab;
