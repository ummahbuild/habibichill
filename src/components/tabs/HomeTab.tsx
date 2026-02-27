import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { useApp, AngerEntry } from "@/context/AppContext";
import { useTerminology } from "@/hooks/use-terminology";
import { useIsMobile } from "@/hooks/use-mobile";
import ReferenceTooltip from "@/components/ReferenceTooltip";
import ArabicTooltip from "@/components/ArabicTooltip";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const wisdoms = [
  { arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", english: "Indeed, with hardship comes ease.", ref: "Qur'an 94:6", link: "https://quran.com/94/6" },
  { arabic: "وَاصْبِرْ فَإِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ", english: "Be patient, for Allah does not waste the reward of those who do good.", ref: "Qur'an 11:115", link: "https://quran.com/11/115" },
  { arabic: "خُذِ الْعَفْوَ وَأْمُرْ بِالْعُرْفِ وَأَعْرِضْ عَنِ الْجَاهِلِينَ", english: "Show forgiveness, enjoin what is good, and turn away from the ignorant.", ref: "Qur'an 7:199", link: "https://quran.com/7/199" },
  { arabic: "وَلَمَن صَبَرَ وَغَفَرَ إِنَّ ذَٰلِكَ لَمِنْ عَزْمِ الْأُمُورِ", english: "And whoever is patient and forgives — indeed, that is of the matters requiring resolve.", ref: "Qur'an 42:43", link: "https://quran.com/42/43" },
  { arabic: "ادْفَعْ بِالَّتِي هِيَ أَحْسَنُ فَإِذَا الَّذِي بَيْنَكَ وَبَيْنَهُ عَدَاوَةٌ كَأَنَّهُ وَلِيٌّ حَمِيمٌ", english: "Repel evil with that which is better; then the one between whom and you there was enmity will become a devoted friend.", ref: "Qur'an 41:34", link: "https://quran.com/41/34" },
  { arabic: "وَالْكَاظِمِينَ الْغَيْظَ وَالْعَافِينَ عَنِ النَّاسِ", english: "Those who restrain their anger and pardon people.", ref: "Qur'an 3:134", link: "https://quran.com/3/134" },
  { arabic: "وَإِذَا مَا غَضِبُوا هُمْ يَغْفِرُونَ", english: "And when they are angry, they forgive.", ref: "Qur'an 42:37", link: "https://quran.com/42/37" },
  { arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", english: "Verily, in the remembrance of Allah do hearts find rest.", ref: "Qur'an 13:28", link: "https://quran.com/13/28" },
  { arabic: "وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ", english: "Seek help through patience and prayer.", ref: "Qur'an 2:45", link: "https://quran.com/2/45" },
  { arabic: "فَاصْبِرْ صَبْرًا جَمِيلًا", english: "So be patient with a beautiful patience.", ref: "Qur'an 70:5", link: "https://quran.com/70/5" },
  { arabic: "وَلَا تَسْتَوِي الْحَسَنَةُ وَلَا السَّيِّئَةُ", english: "Good and evil are not equal. Repel evil with what is better.", ref: "Qur'an 41:34", link: "https://quran.com/41/34" },
  { arabic: "رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا", english: "Our Lord, pour upon us patience and plant firmly our feet.", ref: "Qur'an 2:250", link: "https://quran.com/2/250" },
  { arabic: "وَمَا يُلَقَّاهَا إِلَّا الَّذِينَ صَبَرُوا", english: "None is granted this except those who are patient.", ref: "Qur'an 41:35", link: "https://quran.com/41/35" },
  { arabic: "إِنَّمَا يُوَفَّى الصَّابِرُونَ أَجْرَهُم بِغَيْرِ حِسَابٍ", english: "The patient will be given their reward without account.", ref: "Qur'an 39:10", link: "https://quran.com/39/10" },
  { arabic: "وَعَسَىٰ أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ", english: "Perhaps you hate a thing and it is good for you.", ref: "Qur'an 2:216", link: "https://quran.com/2/216" },
  { arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا اصْبِرُوا وَصَابِرُوا وَرَابِطُوا", english: "O you who believe, persevere and endure and remain stationed.", ref: "Qur'an 3:200", link: "https://quran.com/3/200" },
  { arabic: "وَبَشِّرِ الصَّابِرِينَ", english: "And give good tidings to the patient.", ref: "Qur'an 2:155", link: "https://quran.com/2/155" },
  { arabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا", english: "Allah does not burden a soul beyond that it can bear.", ref: "Qur'an 2:286", link: "https://quran.com/2/286" },
  { arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", english: "Whoever relies upon Allah — then He is sufficient for him.", ref: "Qur'an 65:3", link: "https://quran.com/65/3" },
  { arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا إِنَّ مَعَ الْعُسْرِ يُسْرًا", english: "For indeed, with hardship comes ease. Indeed, with hardship comes ease.", ref: "Qur'an 94:5-6", link: "https://quran.com/94/5-6" },
  { arabic: "وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِّلْمُؤْمِنِينَ", english: "We send down the Quran as a healing and mercy for the believers.", ref: "Qur'an 17:82", link: "https://quran.com/17/82" },
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
  onOpenPrayer: () => void;
}

// ─── Expanded Entry Detail ───
const EntryDetail = ({ entry, onClose }: { entry: AngerEntry; onClose: () => void }) => {
  const formatDuration = (s?: number) => {
    if (!s) return "—";
    if (s < 60) return `${s}s`;
    return `${Math.floor(s / 60)}m ${s % 60}s`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <div className="mt-2 rounded-xl border border-border bg-card p-4 text-left">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">{entry.trigger}</h3>
          <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground">✕</button>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="rounded-lg border border-border bg-background p-2">
            <p className="text-[10px] text-muted-foreground">Intensity</p>
            <p className="text-sm font-bold text-foreground">{"😐😠😡🤬😤"[entry.intensity - 1]} {entry.intensity}/5</p>
          </div>
          <div className="rounded-lg border border-border bg-background p-2">
            <p className="text-[10px] text-muted-foreground">Outcome</p>
            <p className="text-sm font-bold">{entry.controlled ? <span className="text-success">Controlled ✅</span> : <span className="text-warning">Lost control ⚠️</span>}</p>
          </div>
          <div className="rounded-lg border border-border bg-background p-2">
            <p className="text-[10px] text-muted-foreground">Duration</p>
            <p className="text-sm font-bold text-foreground">{formatDuration(entry.durationSeconds)}</p>
          </div>
          <div className="rounded-lg border border-border bg-background p-2">
            <p className="text-[10px] text-muted-foreground">Time</p>
            <p className="text-sm font-bold text-foreground">{new Date(entry.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
          </div>
        </div>

        {entry.situation && entry.situation !== "Emergency flow" && (
          <div className="mb-2">
            <p className="text-[10px] font-semibold uppercase text-muted-foreground">Situation</p>
            <p className="text-xs text-foreground">{entry.situation}</p>
          </div>
        )}

        {entry.tacticsUsed && entry.tacticsUsed.length > 0 && (
          <div className="mb-2">
            <p className="text-[10px] font-semibold uppercase text-muted-foreground">Tactics Used</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {entry.tacticsUsed.map((t) => (
                <span key={t} className="rounded-md bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">{t}</span>
              ))}
            </div>
          </div>
        )}

        {entry.reflection && (
          <div>
            <p className="text-[10px] font-semibold uppercase text-muted-foreground">Reflection</p>
            <p className="text-xs text-foreground italic">"{entry.reflection}"</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const HomeTab = ({ onPlayQuran, onNavigateToRead, onOpenDhikr, onOpenWudu, onOpenJournal, onOpenSituations, onOpenSilenceTimer, onOpenBreathing, onOpenPrayer }: HomeTabProps) => {
  const { sabrPoints, streak, angerLog, moodLog, addMoodEntry } = useApp();
  const t = useTerminology();
  const isMobile = useIsMobile();
  const todayIndex = Math.floor(Date.now() / 86400000) % wisdoms.length;
  const [wisdomIndex, setWisdomIndex] = useState(todayIndex);
  const [wisdomDir, setWisdomDir] = useState(0); // -1 left, 1 right for animation direction
  const currentWisdom = wisdoms[wisdomIndex];
  const wisdomDate = new Date(Date.now() - (todayIndex - wisdomIndex) * 86400000);
  const controlled = angerLog.filter((e) => e.controlled).length;
  const total = angerLog.length;
  const controlRate = total > 0 ? Math.round((controlled / total) * 100) : 0;

  const todayMoods = moodLog.filter((e) => e.date.slice(0, 10) === new Date().toISOString().slice(0, 10));
  const latestTodayMood = todayMoods.length > 0 ? todayMoods[0] : null;
  const last7Moods = moodLog.slice(0, 7);
  const [moodNote, setMoodNote] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [showQuranMenu, setShowQuranMenu] = useState(false);
  const [showMoodHistory, setShowMoodHistory] = useState(false);
  const [statPopup, setStatPopup] = useState<string | null>(null); // for mobile tap-to-popup

  const quickTools = [
    { emoji: "🕌", label: "Prayer", action: onOpenPrayer, color: "bg-primary/10" },
    { emoji: "📿", label: t.dhikr, action: onOpenDhikr, color: "bg-primary/10" },
    { emoji: "💧", label: t.wudu, action: onOpenWudu, color: "bg-accent/10" },
    { emoji: "🤫", label: "Silence", action: onOpenSilenceTimer, color: "bg-secondary/10" },
    { emoji: "🌊", label: "Breathe", action: onOpenBreathing, color: "bg-warning/10" },
    { emoji: "📓", label: "Journal", action: onOpenJournal, color: "bg-destructive/10" },
    { emoji: "🎯", label: "Guides", action: onOpenSituations, color: "bg-muted" },
  ];

  // Wisdom swipe & nav helpers
  const goWisdomPrev = useCallback(() => {
    setWisdomDir(-1);
    setWisdomIndex((prev) => (prev - 1 + wisdoms.length) % wisdoms.length);
  }, []);
  const goWisdomNext = useCallback(() => {
    setWisdomDir(1);
    setWisdomIndex((prev) => (prev + 1) % wisdoms.length);
  }, []);

  const handleWisdomSwipe = useCallback((_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 50) {
      if (info.offset.x > 0) goWisdomPrev();
      else goWisdomNext();
    }
  }, [goWisdomPrev, goWisdomNext]);

  const greetings = () => {
    const hour = new Date().getHours();
    if (hour < 5) return "Assalamu Alaikum 🌙";
    if (hour < 12) return "Good Morning ☀️";
    if (hour < 17) return "Good Afternoon 🌤️";
    if (hour < 21) return "Good Evening 🌅";
    return "Assalamu Alaikum 🌙";
  };

  const handleEntryClick = (id: string) => {
    setExpandedEntry((prev) => (prev === id ? null : id));
  };

  // Stat popup data
  const statData: Record<string, { title: string; desc: string }> = {
    sabr: { title: "Patience Rewards", desc: `Earn +10 points each time you control your anger using the CHILL flow. The Prophet ﷺ said the strong person controls themselves in anger. You have ${sabrPoints} points.` },
    control: { title: "Anger Control Rate", desc: `Percentage of anger episodes where you successfully controlled yourself (${controlled}/${total} logged). Higher is better — aim for 80%+.` },
    rank: { title: "Your Rank", desc: sabrPoints < 50 ? "🌱 Beginner (0–49 SP) → Keep using the CHILL flow to level up to Student!" : sabrPoints < 150 ? "📚 Student (50–149 SP) → You're building habits. Practitioner rank at 150 SP." : sabrPoints < 300 ? "⭐ Practitioner (150–299 SP) → Impressive self-control! Master rank at 300 SP." : "👑 Master (300+ SP) → You've achieved mastery over anger. Keep inspiring others!" },
  };

  // Anger-relevant surahs for quick read gallery
  const angerSurahs = [
    { id: 55, name: "Ar-Rahman", arabic: "الرحمن", emoji: "🌿", benefit: "Gratitude & peace" },
    { id: 94, name: "Ash-Sharh", arabic: "الشرح", emoji: "💚", benefit: "Ease after hardship" },
    { id: 93, name: "Ad-Duha", arabic: "الضحى", emoji: "☀️", benefit: "Comfort in distress" },
    { id: 67, name: "Al-Mulk", arabic: "الملك", emoji: "🛡️", benefit: "Protection" },
    { id: 36, name: "Ya-Sin", arabic: "يس", emoji: "❤️", benefit: "Heart of Quran" },
    { id: 1, name: "Al-Fatiha", arabic: "الفاتحة", emoji: "📖", benefit: "Complete healing" },
  ];

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
              onClick={() => { addMoodEntry(i + 1, moodNote || undefined); setMoodNote(""); setShowNoteInput(false); }}
              className={`flex flex-1 flex-col items-center gap-1 rounded-xl p-2 transition-all ${
                latestTodayMood?.mood === i + 1 ? "bg-primary/10 border border-primary/30 scale-105" : "border border-transparent hover:bg-muted"
              }`}
              whileTap={{ scale: 0.9 }}
            >
              <span className="text-2xl">{emoji}</span>
              <span className="text-[9px] text-muted-foreground">{moodLabels[i]}</span>
            </motion.button>
          ))}
        </div>
        {/* Toggle note input */}
        <label className="mt-3 flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" checked={showNoteInput} onChange={(e) => setShowNoteInput(e.target.checked)} className="h-4 w-4 rounded accent-primary" />
          <span className="text-xs text-muted-foreground">Add a note — what's on your mind?</span>
        </label>
        <AnimatePresence>
          {showNoteInput && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
              <input type="text" value={moodNote} onChange={(e) => setMoodNote(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && moodNote.trim()) { e.preventDefault(); } }}
                placeholder="Type a note, then tap an emoji to check in"
                className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                autoFocus
              />
            </motion.div>
          )}
        </AnimatePresence>
        {last7Moods.length > 1 && (
          <div className="mt-3 flex items-center gap-1">
            <button onClick={() => setShowMoodHistory(true)} className="text-[10px] text-primary font-medium mr-1 hover:underline cursor-pointer">Recent:</button>
            {last7Moods.map((entry, i) => (
              <Tooltip key={i}>
                <TooltipTrigger asChild>
                  <span className="text-sm cursor-default">
                    {moodEmojis[entry.mood - 1]}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[200px]">
                  <p className="text-xs font-medium">{moodLabels[entry.mood - 1]} · {new Date(entry.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                  {entry.note && <p className="text-xs text-muted-foreground italic mt-0.5">"{entry.note}"</p>}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        )}
        {/* Full Mood History Dialog */}
        <Dialog open={showMoodHistory} onOpenChange={setShowMoodHistory}>
          <DialogContent className="max-h-[70vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Mood History</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              {moodLog.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No mood entries yet</p>
              ) : (
                moodLog.map((entry) => (
                  <div key={entry.id} className="flex items-start gap-3 rounded-xl border border-border bg-background p-3">
                    <span className="text-2xl">{moodEmojis[entry.mood - 1]}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{moodLabels[entry.mood - 1]}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(entry.date).toLocaleDateString([], { month: "short", day: "numeric" })} · {new Date(entry.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      {entry.note && <p className="text-xs text-muted-foreground italic mt-0.5">"{entry.note}"</p>}
                      {entry.timeOfDay && <span className="text-[9px] text-muted-foreground capitalize">{entry.timeOfDay}</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Row — tooltip on desktop, tap popup on mobile */}
      <div className="mb-5 grid grid-cols-3 gap-2">
        {[
          { key: "sabr", value: sabrPoints, color: "text-primary", label: t.islamic ? <ArabicTooltip term="sabr">Sabr</ArabicTooltip> : "Patience", suffix: " Points" },
          { key: "control", value: `${controlRate}%`, color: "text-success", label: "Control Rate", suffix: "" },
          { key: "rank", value: sabrPoints < 50 ? "🌱" : sabrPoints < 150 ? "📚" : sabrPoints < 300 ? "⭐" : "👑", color: "text-foreground", label: sabrPoints < 50 ? "Beginner" : sabrPoints < 150 ? "Student" : sabrPoints < 300 ? "Practitioner" : "Master", suffix: "" },
        ].map((stat) => {
          const card = (
            <motion.div
              key={stat.key}
              onClick={() => isMobile && setStatPopup(stat.key)}
              className="rounded-xl border border-border bg-card p-3 text-center cursor-help active:scale-95 transition-transform"
              whileTap={{ scale: 0.95 }}
            >
              <p className={`font-heading text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-[10px] text-muted-foreground">{stat.label}{stat.suffix}</p>
            </motion.div>
          );
          // Desktop: hover tooltip. Mobile: tap opens dialog
          if (isMobile) return <div key={stat.key}>{card}</div>;
          return (
            <Tooltip key={stat.key}>
              <TooltipTrigger asChild>{card}</TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-[200px] text-center">
                <p className="text-xs font-medium">{statData[stat.key].title}</p>
                <p className="text-[10px] text-muted-foreground">{statData[stat.key].desc}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
      {/* Mobile stat popup */}
      <Dialog open={!!statPopup} onOpenChange={(open) => !open && setStatPopup(null)}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle className="text-base">{statPopup && statData[statPopup]?.title}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground leading-relaxed">{statPopup && statData[statPopup]?.desc}</p>
        </DialogContent>
      </Dialog>

      {/* Quick Tools */}
      <div className="mb-5">
        <h2 className="mb-2 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">Quick Tools</h2>
        <div className="grid grid-cols-4 gap-2">
          {/* Quran dual button */}
          <div className="relative">
            <motion.button
              onClick={() => setShowQuranMenu(!showQuranMenu)}
              className="flex w-full flex-col items-center gap-1 rounded-xl border border-border bg-success/10 p-2.5 transition-all hover:shadow-calm"
              whileTap={{ scale: 0.92 }}
            >
              <span className="text-xl">📖</span>
              <span className="text-[10px] font-medium text-card-foreground">Quran</span>
            </motion.button>
            <AnimatePresence>
              {showQuranMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.95 }}
                  className="absolute left-0 right-0 top-full z-20 mt-1 rounded-xl border border-border bg-card p-1.5 shadow-lg"
                >
                  <button
                    onClick={() => { onPlayQuran("55"); setShowQuranMenu(false); }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    🎧 Listen
                  </button>
                  <button
                    onClick={() => { onNavigateToRead(55); setShowQuranMenu(false); }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    📜 Read
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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

      {/* Daily Wisdom — swipeable on mobile */}
      <div className="mb-5 rounded-2xl bg-gradient-calm border border-border p-4 overflow-hidden">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Daily Wisdom</p>
          <p className="text-[10px] text-muted-foreground">
            {wisdomDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            {wisdomIndex === todayIndex && " · Today"}
          </p>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={wisdomIndex}
            initial={{ opacity: 0, x: wisdomDir * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: wisdomDir * -60 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            drag={isMobile ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.3}
            onDragEnd={handleWisdomSwipe}
            className="touch-pan-y"
          >
            <p className="mb-2 font-arabic text-xl leading-relaxed text-foreground" dir="rtl">{currentWisdom.arabic}</p>
            <p className="mb-2 text-sm text-muted-foreground italic">"{currentWisdom.english}"</p>
            <ReferenceTooltip reference={currentWisdom.ref} arabic={currentWisdom.arabic} english={currentWisdom.english} link={currentWisdom.link}>
              <a href={currentWisdom.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline">{currentWisdom.ref} →</a>
            </ReferenceTooltip>
          </motion.div>
        </AnimatePresence>
        <div className="mt-3 flex items-center justify-between">
          <button onClick={goWisdomPrev} className="rounded-lg px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors">← Previous</button>
          <div className="flex gap-1">
            {wisdoms.slice(
              Math.max(0, wisdomIndex - 3),
              Math.min(wisdoms.length, wisdomIndex + 4)
            ).map((_, i) => {
              const idx = Math.max(0, wisdomIndex - 3) + i;
              return <div key={idx} className={`h-1 rounded-full transition-all ${idx === wisdomIndex ? "w-4 bg-primary" : "w-1.5 bg-border"}`} />;
            })}
          </div>
          <button onClick={goWisdomNext} className="rounded-lg px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors">Next →</button>
        </div>
        {isMobile && (
          <p className="mt-2 text-center text-[9px] text-muted-foreground/50">Swipe left or right for more</p>
        )}
      </div>

      {/* Recent activity — expandable on double click */}
      {angerLog.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">Recent</h2>
            <p className="text-[9px] text-muted-foreground">Tap to expand</p>
          </div>
          <div className="flex flex-col gap-1.5">
            {angerLog.slice(0, 3).map((entry) => (
              <div key={entry.id}>
                <motion.button
                  onClick={() => handleEntryClick(entry.id)}
                  className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition-all ${
                    entry.controlled ? "border-success/20 bg-success/5" : "border-warning/20 bg-warning/5"
                  } ${expandedEntry === entry.id ? "ring-1 ring-primary/30" : ""}`}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{entry.trigger}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(entry.date).toLocaleDateString()} · {new Date(entry.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      {entry.tacticsUsed && entry.tacticsUsed.length > 0 && ` · ${entry.tacticsUsed.length} tactics`}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {entry.durationSeconds && <span className="text-[10px] text-muted-foreground">{entry.durationSeconds < 60 ? `${entry.durationSeconds}s` : `${Math.floor(entry.durationSeconds / 60)}m`}</span>}
                    <span className="text-sm">{entry.controlled ? "✅" : "⚠️"}</span>
                    <span className={`text-[10px] transition-transform ${expandedEntry === entry.id ? "rotate-180" : ""}`}>▼</span>
                  </div>
                </motion.button>
                <AnimatePresence>
                  {expandedEntry === entry.id && <EntryDetail entry={entry} onClose={() => setExpandedEntry(null)} />}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Quran — Read Gallery */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <h2 className="mb-2 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">📖 Quran for Anger & Peace</h2>
        <div className="grid grid-cols-2 gap-2">
          {angerSurahs.map((s) => (
            <div key={s.id} className="flex items-center gap-2 rounded-xl border border-border bg-background p-2.5">
              <span className="text-lg">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <span className="block text-xs font-medium text-foreground truncate">{s.name}</span>
                <span className="block text-[9px] text-muted-foreground">{s.benefit}</span>
              </div>
              <div className="flex gap-1">
                <motion.button onClick={() => onNavigateToRead(s.id)} className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-[10px] transition-colors hover:bg-muted" whileTap={{ scale: 0.9 }} aria-label={`Read ${s.name}`}>📜</motion.button>
                <motion.button onClick={() => onPlayQuran(String(s.id))} className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-[10px] text-primary-foreground" whileTap={{ scale: 0.9 }} aria-label={`Listen ${s.name}`}>▶</motion.button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeTab;
