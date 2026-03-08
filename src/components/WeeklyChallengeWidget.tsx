import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import ShareButtons from "@/components/ShareButtons";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  emoji: string;
  target: number;
  unit: string;
  hadith?: string;
  hadithSource?: string;
  category: "dhikr" | "prayer" | "mood" | "breathing" | "quran" | "silence" | "wudu" | "journal" | "general";
}

const CHALLENGES: Challenge[] = [
  {
    id: "dhikr-7",
    title: "Dhikr Every Day",
    description: "Complete the dhikr counter at least once every day this week",
    emoji: "📿",
    target: 7,
    unit: "days",
    category: "dhikr",
    hadith: "The most beloved deeds to Allah are those done consistently, even if small.",
    hadithSource: "Sahih al-Bukhari 6464",
  },
  {
    id: "prayer-5",
    title: "Full Prayer Day",
    description: "Log all 5 daily prayers in a single day",
    emoji: "🕌",
    target: 5,
    unit: "prayers in one day",
    category: "prayer",
    hadith: "The first thing a person will be asked about on the Day of Judgment is their prayer.",
    hadithSource: "al-Tabarani",
  },
  {
    id: "breathe-5",
    title: "Breathing Master",
    description: "Complete 5 breathing exercises this week",
    emoji: "🌊",
    target: 5,
    unit: "sessions",
    category: "breathing",
  },
  {
    id: "mood-7",
    title: "Mood Awareness",
    description: "Check in with your mood every day this week",
    emoji: "🧠",
    target: 7,
    unit: "days",
    category: "mood",
  },
  {
    id: "quran-5",
    title: "Quran Connection",
    description: "Listen to or read Quran 5 times this week",
    emoji: "📖",
    target: 5,
    unit: "sessions",
    category: "quran",
    hadith: "The best of you are those who learn the Quran and teach it.",
    hadithSource: "Sahih al-Bukhari 5027",
  },
  {
    id: "silence-3",
    title: "Silence Practice",
    description: "Use the silence timer 3 times this week",
    emoji: "🤫",
    target: 3,
    unit: "sessions",
    category: "silence",
    hadith: "If one of you becomes angry, let him be silent.",
    hadithSource: "Musnad Ahmad 2136",
  },
  {
    id: "wudu-5",
    title: "Wudu Warrior",
    description: "Practice wudu 5 times this week",
    emoji: "💧",
    target: 5,
    unit: "times",
    category: "wudu",
    hadith: "Anger comes from Shaytan, and fire is extinguished with water.",
    hadithSource: "Sunan Abu Dawud 4784",
  },
  {
    id: "journal-3",
    title: "Reflection Week",
    description: "Log 3 anger reflections in your journal this week",
    emoji: "📓",
    target: 3,
    unit: "entries",
    category: "journal",
  },
  {
    id: "prayer-35",
    title: "Prayer Streak",
    description: "Log 35 prayers this week (all 5 every day)",
    emoji: "⭐",
    target: 35,
    unit: "prayers",
    category: "prayer",
  },
  {
    id: "combo-3",
    title: "Tool Explorer",
    description: "Use 3 different tools in a single day",
    emoji: "🎯",
    target: 3,
    unit: "unique tools",
    category: "general",
  },
];

function getWeekNumber(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
}

function getWeekStart(): Date {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday
  const start = new Date(now.getFullYear(), now.getMonth(), diff);
  start.setHours(0, 0, 0, 0);
  return start;
}

function getWeekEnd(): Date {
  const start = getWeekStart();
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

export function useWeeklyChallenges() {
  const { activityLog, prayerLog, moodLog, angerLog, addSabrPoints } = useApp();

  const weekNum = getWeekNumber();
  const weekStart = getWeekStart();
  const weekEnd = getWeekEnd();

  // Pick 2 challenges per week deterministically
  const activeChallenges = useMemo(() => {
    const idx1 = weekNum % CHALLENGES.length;
    const idx2 = (weekNum * 3 + 7) % CHALLENGES.length;
    const picks = [CHALLENGES[idx1]];
    if (idx2 !== idx1) picks.push(CHALLENGES[idx2]);
    else picks.push(CHALLENGES[(idx1 + 1) % CHALLENGES.length]);
    return picks;
  }, [weekNum]);

  // Calculate progress for each challenge
  const challengeProgress = useMemo(() => {
    const weekActivities = activityLog.filter(
      (a) => new Date(a.date) >= weekStart && new Date(a.date) <= weekEnd
    );
    const weekPrayers = prayerLog.filter(
      (p) => new Date(p.date) >= weekStart && new Date(p.date) <= weekEnd
    );
    const weekMoods = moodLog.filter(
      (m) => new Date(m.date) >= weekStart && new Date(m.date) <= weekEnd
    );
    const weekAnger = angerLog.filter(
      (a) => new Date(a.date) >= weekStart && new Date(a.date) <= weekEnd
    );

    return activeChallenges.map((ch) => {
      let current = 0;

      switch (ch.category) {
        case "dhikr": {
          const uniqueDays = new Set(
            weekActivities.filter((a) => a.type === "dhikr").map((a) => a.date.slice(0, 10))
          );
          current = uniqueDays.size;
          break;
        }
        case "prayer": {
          if (ch.id === "prayer-5") {
            // Best single day
            const byDay: Record<string, Set<string>> = {};
            weekPrayers.forEach((p) => {
              const day = p.date.slice(0, 10);
              if (!byDay[day]) byDay[day] = new Set();
              byDay[day].add(p.prayer);
            });
            current = Math.max(0, ...Object.values(byDay).map((s) => s.size));
          } else {
            current = weekPrayers.length;
          }
          break;
        }
        case "breathing":
          current = weekActivities.filter((a) => a.type === "breathing").length;
          break;
        case "mood": {
          const uniqueDays = new Set(weekMoods.map((m) => m.date.slice(0, 10)));
          current = uniqueDays.size;
          break;
        }
        case "quran":
          current = weekActivities.filter(
            (a) => a.type === "quran_listen" || a.type === "reading"
          ).length;
          break;
        case "silence":
          current = weekActivities.filter((a) => a.type === "silence").length;
          break;
        case "wudu":
          current = weekActivities.filter((a) => a.type === "wudu").length;
          break;
        case "journal":
          current = weekAnger.length;
          break;
        case "general": {
          // Unique tool types used today
          const todayStr = new Date().toISOString().slice(0, 10);
          const todayTypes = new Set(
            weekActivities
              .filter((a) => a.date.slice(0, 10) === todayStr)
              .map((a) => a.type)
          );
          current = todayTypes.size;
          break;
        }
      }

      return {
        challenge: ch,
        current: Math.min(current, ch.target),
        completed: current >= ch.target,
      };
    });
  }, [activeChallenges, activityLog, prayerLog, moodLog, angerLog, weekStart, weekEnd]);

  // Track claimed rewards
  const [claimedWeeks] = useState<string[]>(() => {
    const saved = localStorage.getItem("hc-challenge-claimed");
    return saved ? JSON.parse(saved) : [];
  });

  const canClaim = challengeProgress.every((cp) => cp.completed) && !claimedWeeks.includes(String(weekNum));

  const claimReward = () => {
    if (!canClaim) return;
    addSabrPoints(25);
    const next = [...claimedWeeks, String(weekNum)];
    localStorage.setItem("hc-challenge-claimed", JSON.stringify(next));
  };

  const daysLeft = Math.max(0, Math.ceil((weekEnd.getTime() - Date.now()) / (24 * 60 * 60 * 1000)));

  return { activeChallenges, challengeProgress, canClaim, claimReward, daysLeft, weekNum };
}

interface WeeklyChallengeWidgetProps {
  compact?: boolean;
}

const WeeklyChallengeWidget = ({ compact = false }: WeeklyChallengeWidgetProps) => {
  const { challengeProgress, canClaim, claimReward, daysLeft } = useWeeklyChallenges();
  const [showDetail, setShowDetail] = useState(false);
  const [justClaimed, setJustClaimed] = useState(false);

  const allComplete = challengeProgress.every((cp) => cp.completed);

  const handleClaim = () => {
    claimReward();
    setJustClaimed(true);
    setTimeout(() => setJustClaimed(false), 3000);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🏆</span>
          <h3 className="font-heading text-sm font-semibold text-foreground">Weekly Challenge</h3>
        </div>
        <span className="text-[10px] text-muted-foreground">{daysLeft}d left</span>
      </div>

      <div className="space-y-3">
        {challengeProgress.map(({ challenge, current, completed }) => (
          <div key={challenge.id}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-base shrink-0">{challenge.emoji}</span>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{challenge.title}</p>
                  {!compact && (
                    <p className="text-[10px] text-muted-foreground truncate">{challenge.description}</p>
                  )}
                </div>
              </div>
              <span className={`text-[10px] font-semibold shrink-0 ml-2 ${completed ? "text-success" : "text-muted-foreground"}`}>
                {completed ? "✓ Done" : `${current}/${challenge.target}`}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${completed ? "bg-success" : "bg-primary"}`}
                initial={{ width: 0 }}
                animate={{ width: `${(current / challenge.target) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            {!compact && challenge.hadith && (
              <button
                onClick={() => setShowDetail(showDetail === challenge.id ? false : challenge.id as any)}
                className="mt-1 text-[9px] text-primary hover:underline"
              >
                {showDetail === challenge.id ? "Hide hadith ▲" : "View hadith ▼"}
              </button>
            )}
            <AnimatePresence>
              {showDetail === challenge.id && challenge.hadith && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-1.5 rounded-lg border border-border bg-background p-2.5">
                    <p className="text-[10px] text-foreground italic">"{challenge.hadith}"</p>
                    {challenge.hadithSource && (
                      <p className="text-[9px] text-muted-foreground mt-0.5">— {challenge.hadithSource}</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Claim reward */}
      {allComplete && (
        <div className="mt-3 pt-3 border-t border-border text-center">
          {justClaimed ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <span className="text-2xl">🎉</span>
              <p className="text-xs font-semibold text-success mt-1">+25 Sabr Points earned!</p>
              <div className="mt-2 flex justify-center">
                <ShareButtons
                  url="/"
                  title="I completed this week's challenges on HabibiChill! 🏆"
                  text="I completed all weekly challenges on HabibiChill — the Muslim anger management app. Try it free:"
                  compact
                />
              </div>
            </motion.div>
          ) : canClaim ? (
            <motion.button
              onClick={handleClaim}
              className="rounded-xl bg-success px-6 py-2.5 text-xs font-semibold text-success-foreground transition-all hover:scale-105 active:scale-95"
              whileTap={{ scale: 0.95 }}
            >
              🎁 Claim +25 Sabr Points
            </motion.button>
          ) : (
            <p className="text-[10px] text-success font-medium">✓ Reward claimed this week!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default WeeklyChallengeWidget;
