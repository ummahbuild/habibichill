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
  onOpenDhikr: () => void;
  onOpenWudu: () => void;
  onOpenJournal: () => void;
  onOpenSituations: () => void;
}

const HomeTab = ({ onPlayQuran, onOpenDhikr, onOpenWudu, onOpenJournal, onOpenSituations }: HomeTabProps) => {
  const { sabrPoints, streak, angerLog } = useApp();
  const todayWisdom = wisdoms[Math.floor(Date.now() / 86400000) % wisdoms.length];
  const controlled = angerLog.filter((e) => e.controlled).length;
  const total = angerLog.length;
  const controlRate = total > 0 ? Math.round((controlled / total) * 100) : 0;

  const quickTools = [
    { emoji: "📿", label: "Dhikr", action: onOpenDhikr, color: "bg-primary/10" },
    { emoji: "📖", label: "Quran", action: () => onPlayQuran("55"), color: "bg-success/10" },
    { emoji: "💧", label: "Wudu", action: onOpenWudu, color: "bg-accent/10" },
    { emoji: "📓", label: "Journal", action: onOpenJournal, color: "bg-secondary/10" },
    { emoji: "🎯", label: "Situations", action: onOpenSituations, color: "bg-warning/10" },
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

      {/* Stats Row */}
      <div className="mb-5 grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-border bg-card p-3 text-center">
          <p className="font-heading text-2xl font-bold text-primary">{sabrPoints}</p>
          <p className="text-[10px] text-muted-foreground">Sabr Points</p>
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
        <div className="grid grid-cols-5 gap-2">
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

      {/* Daily Wisdom */}
      <div className="mb-5 rounded-2xl bg-gradient-calm border border-border p-4">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Daily Wisdom</p>
        <p className="mb-2 font-arabic text-xl leading-relaxed text-foreground" dir="rtl">{todayWisdom.arabic}</p>
        <p className="mb-2 text-sm text-muted-foreground italic">"{todayWisdom.english}"</p>
        <a href={todayWisdom.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline">
          {todayWisdom.ref} →
        </a>
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

      {/* Quick Play */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <h2 className="mb-2 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">🎧 Quick Listen</h2>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: "55", name: "Ar-Rahman", emoji: "🌿" },
            { id: "94", name: "Ash-Sharh", emoji: "💚" },
            { id: "93", name: "Ad-Duha", emoji: "☀️" },
            { id: "67", name: "Al-Mulk", emoji: "🛡️" },
          ].map((s) => (
            <motion.button
              key={s.id}
              onClick={() => onPlayQuran(s.id)}
              className="flex items-center gap-2 rounded-xl border border-border bg-background p-2.5 text-left transition-colors hover:bg-muted"
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-lg">{s.emoji}</span>
              <span className="text-xs font-medium text-foreground">{s.name}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeTab;
