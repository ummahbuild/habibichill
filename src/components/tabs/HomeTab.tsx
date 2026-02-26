import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import ReferenceTooltip from "@/components/ReferenceTooltip";
import ArabicTooltip from "@/components/ArabicTooltip";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

const wisdoms = [
  { arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", english: "Indeed, with hardship comes ease.", ref: "Qur'an 94:6", link: "https://quran.com/94/6" },
  { arabic: "وَاصْبِرْ فَإِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ", english: "Be patient, for Allah does not waste the reward of those who do good.", ref: "Qur'an 11:115", link: "https://quran.com/11/115" },
  { arabic: "خُذِ الْعَفْوَ وَأْمُرْ بِالْعُرْفِ وَأَعْرِضْ عَنِ الْجَاهِلِينَ", english: "Show forgiveness, enjoin what is good, and turn away from the ignorant.", ref: "Qur'an 7:199", link: "https://quran.com/7/199" },
  { arabic: "وَلَمَن صَبَرَ وَغَفَرَ إِنَّ ذَٰلِكَ لَمِنْ عَزْمِ الْأُمُورِ", english: "And whoever is patient and forgives — indeed, that is of the matters requiring resolve.", ref: "Qur'an 42:43", link: "https://quran.com/42/43" },
  { arabic: "ادْفَعْ بِالَّتِي هِيَ أَحْسَنُ فَإِذَا الَّذِي بَيْنَكَ وَبَيْنَهُ عَدَاوَةٌ كَأَنَّهُ وَلِيٌّ حَمِيمٌ", english: "Repel evil with that which is better; then the one between whom and you there was enmity will become a devoted friend.", ref: "Qur'an 41:34", link: "https://quran.com/41/34" },
  { arabic: "وَالْكَاظِمِينَ الْغَيْظَ وَالْعَافِينَ عَنِ النَّاسِ", english: "Those who restrain their anger and pardon people.", ref: "Qur'an 3:134", link: "https://quran.com/3/134" },
  { arabic: "وَإِذَا مَا غَضِبُوا هُمْ يَغْفِرُونَ", english: "And when they are angry, they forgive.", ref: "Qur'an 42:37", link: "https://quran.com/42/37" },
];

const moodEmojis = ["😊", "🙂", "😐", "😟", "😢"];
const moodLabels = ["Great", "Good", "Okay", "Low", "Struggling"];

interface HomeTabProps {
  onPlayQuran: (surahId: string) => void;
  onNavigateToRead: (surahId: number) => void;
  onOpenDhikr: () => void;
  onOpenWudu: () => void;
  onOpenJournal: () => void;
  onOpenSituations: () => void;
  onOpenSilenceTimer: () => void;
  onOpenBreathing: () => void;
}

const HomeTab = ({ onPlayQuran, onNavigateToRead, onOpenDhikr, onOpenWudu, onOpenJournal, onOpenSituations, onOpenSilenceTimer, onOpenBreathing }: HomeTabProps) => {
  const { sabrPoints, streak, angerLog, moodLog, addMoodEntry } = useApp();
  const todayIndex = Math.floor(Date.now() / 86400000) % wisdoms.length;
  const [wisdomIndex, setWisdomIndex] = useState(todayIndex);
  const currentWisdom = wisdoms[wisdomIndex];
  const wisdomDate = new Date(Date.now() - (todayIndex - wisdomIndex) * 86400000);
  const controlled = angerLog.filter((e) => e.controlled).length;
  const total = angerLog.length;
  const controlRate = total > 0 ? Math.round((controlled / total) * 100) : 0;

  const todayMoods = moodLog.filter((e) => e.date.slice(0, 10) === new Date().toISOString().slice(0, 10));
  const latestTodayMood = todayMoods.length > 0 ? todayMoods[0] : null;
  const last7Moods = moodLog.slice(0, 7);
  const [moodNote, setMoodNote] = useState("");

  const quickTools = [
    { emoji: "📿", label: "Dhikr", action: onOpenDhikr, color: "bg-primary/10" },
    { emoji: "📖", label: "Quran", action: () => onPlayQuran("55"), color: "bg-success/10" },
    { emoji: "💧", label: "Wudu", action: onOpenWudu, color: "bg-accent/10" },
    { emoji: "🤫", label: "Silence", action: onOpenSilenceTimer, color: "bg-secondary/10" },
    { emoji: "🌊", label: "Breathe", action: onOpenBreathing, color: "bg-warning/10" },
    { emoji: "📓", label: "Journal", action: onOpenJournal, color: "bg-destructive/10" },
    { emoji: "🎯", label: "Guides", action: onOpenSituations, color: "bg-muted" },
  ];

  const greetings = () => {
    const hour = new Date().getHours();
    if (hour < 5) return "Assalamu Alaikum 🌙";
    if (hour < 12) return "Good Morning ☀️";
    if (hour < 17) return "Good Afternoon 🌤️";
    if (hour < 21) return "Good Evening 🌅";
    return "Assalamu Alaikum 🌙";
  };

  return (
    <div className="container mx-auto max-w-lg px-4 pt-6 pb-8">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold text-foreground">{greetings()}</h1>
          <p className="text-sm text-muted-foreground">How are you feeling today?</p>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-secondary/20 px-3 py-1 text-sm font-medium text-secondary">
          🔥 {streak}
        </div>
      </div>

      {/* Daily Mood Check-in */}
      <div className="mb-5 rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {latestTodayMood ? `Mood Check-in (${todayMoods.length} today)` : "How are you feeling?"}
          </p>
          {todayMoods.length > 0 && (
            <span className="text-[9px] text-muted-foreground">
              Last: {new Date(todayMoods[0].date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </div>
        <div className="flex justify-between gap-1">
          {moodEmojis.map((emoji, i) => (
            <motion.button
              key={i}
              onClick={() => {
                addMoodEntry(i + 1, moodNote || undefined);
                setMoodNote("");
              }}
              className={`flex flex-1 flex-col items-center gap-1 rounded-xl p-2 transition-all ${
                latestTodayMood?.mood === i + 1
                  ? "bg-primary/10 border border-primary/30 scale-105"
                  : "border border-transparent hover:bg-muted"
              }`}
              whileTap={{ scale: 0.9 }}
            >
              <span className="text-2xl">{emoji}</span>
              <span className="text-[9px] text-muted-foreground">{moodLabels[i]}</span>
            </motion.button>
          ))}
        </div>
        <input
          type="text"
          value={moodNote}
          onChange={(e) => setMoodNote(e.target.value)}
          placeholder="What's on your mind? (optional)"
          className="mt-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
        {last7Moods.length > 1 && (
          <div className="mt-3 flex items-center gap-1">
            <span className="text-[10px] text-muted-foreground mr-1">Recent:</span>
            {last7Moods.map((entry, i) => (
              <span key={i} className="text-sm" title={`${new Date(entry.date).toLocaleString()}${entry.note ? ` — ${entry.note}` : ""}`}>
                {moodEmojis[entry.mood - 1]}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="mb-5 grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-border bg-card p-3 text-center">
          <p className="font-heading text-2xl font-bold text-primary">{sabrPoints}</p>
          <p className="text-[10px] text-muted-foreground"><ArabicTooltip term="sabr">Sabr</ArabicTooltip> Points</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3 text-center">
          <p className="font-heading text-2xl font-bold text-success">{controlRate}%</p>
          <p className="text-[10px] text-muted-foreground">Control Rate</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3 text-center">
          <p className="font-heading text-2xl font-bold text-foreground">
            {sabrPoints < 50 ? "🌱" : sabrPoints < 150 ? "📚" : sabrPoints < 300 ? "⭐" : "👑"}
          </p>
          <p className="text-[10px] text-muted-foreground">
            {sabrPoints < 50 ? "Beginner" : sabrPoints < 150 ? "Student" : sabrPoints < 300 ? "Practitioner" : "Master"}
          </p>
        </div>
      </div>

      {/* Quick Tools */}
      <div className="mb-5">
        <h2 className="mb-2 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">Quick Tools</h2>
        <div className="grid grid-cols-4 gap-2">
          {quickTools.map((tool) => (
            <motion.button
              key={tool.label}
              onClick={tool.action}
              className={`flex flex-col items-center gap-1 rounded-xl border border-border ${tool.color} p-2.5 transition-all hover:shadow-calm`}
              whileTap={{ scale: 0.92 }}
            >
              <span className="text-xl">{tool.emoji}</span>
              <span className="text-[10px] font-medium text-card-foreground">{tool.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Daily Wisdom — swipeable */}
      <div className="mb-5 rounded-2xl bg-gradient-calm border border-border p-4">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Daily Wisdom</p>
          <p className="text-[10px] text-muted-foreground">
            {wisdomDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            {wisdomIndex === todayIndex && " · Today"}
          </p>
        </div>
        <p className="mb-2 font-arabic text-xl leading-relaxed text-foreground" dir="rtl">{currentWisdom.arabic}</p>
        <p className="mb-2 text-sm text-muted-foreground italic">"{currentWisdom.english}"</p>
        <ReferenceTooltip
          reference={currentWisdom.ref}
          arabic={currentWisdom.arabic}
          english={currentWisdom.english}
          link={currentWisdom.link}
        >
          <a href={currentWisdom.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline">
            {currentWisdom.ref} →
          </a>
        </ReferenceTooltip>
        <div className="mt-3 flex items-center justify-between">
          <button
            onClick={() => setWisdomIndex((wisdomIndex - 1 + wisdoms.length) % wisdoms.length)}
            className="rounded-lg px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
          >
            ← Previous
          </button>
          <div className="flex gap-1">
            {wisdoms.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all ${i === wisdomIndex ? "w-4 bg-primary" : "w-1.5 bg-border"}`} />
            ))}
          </div>
          <button
            onClick={() => setWisdomIndex((wisdomIndex + 1) % wisdoms.length)}
            className="rounded-lg px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Recent activity mini */}
      {angerLog.length > 0 && (
        <div className="mb-5">
          <h2 className="mb-2 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">Recent</h2>
          <div className="flex flex-col gap-1.5">
            {angerLog.slice(0, 3).map((entry) => (
              <div key={entry.id} className={`flex items-center justify-between rounded-xl border p-3 ${entry.controlled ? "border-success/20 bg-success/5" : "border-warning/20 bg-warning/5"}`}>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{entry.trigger}</p>
                  <p className="text-[10px] text-muted-foreground">{new Date(entry.date).toLocaleDateString()}</p>
                </div>
                <span className="text-sm">{entry.controlled ? "✅" : "⚠️"}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Quran */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <h2 className="mb-2 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">📖 Quick Quran</h2>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: "55", name: "Ar-Rahman", emoji: "🌿" },
            { id: "94", name: "Ash-Sharh", emoji: "💚" },
            { id: "93", name: "Ad-Duha", emoji: "☀️" },
            { id: "67", name: "Al-Mulk", emoji: "🛡️" },
          ].map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-2 rounded-xl border border-border bg-background p-2.5"
            >
              <span className="text-lg">{s.emoji}</span>
              <span className="flex-1 text-xs font-medium text-foreground">{s.name}</span>
              <div className="flex gap-1">
                <motion.button
                  onClick={() => onNavigateToRead(Number(s.id))}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-[10px] transition-colors hover:bg-muted"
                  whileTap={{ scale: 0.9 }}
                  aria-label={`Read ${s.name}`}
                >
                  📜
                </motion.button>
                <motion.button
                  onClick={() => onPlayQuran(s.id)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-[10px] text-primary-foreground"
                  whileTap={{ scale: 0.9 }}
                  aria-label={`Listen ${s.name}`}
                >
                  ▶
                </motion.button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeTab;
