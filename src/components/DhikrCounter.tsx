import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const dhikrs = [
  {
    arabic: "سُبْحَانَ اللَّهِ",
    english: "SubhanAllah",
    meaning: "Glory be to Allah",
    target: 33,
    reward: "A tree is planted for you in Paradise for every SubhanAllah.",
    rewardSource: "Tirmidhi 3464",
    rewardLink: "https://sunnah.com/tirmidhi:3464",
  },
  {
    arabic: "الْحَمْدُ لِلَّهِ",
    english: "Alhamdulillah",
    meaning: "All praise is due to Allah",
    target: 33,
    reward: "Alhamdulillah fills the scales of good deeds.",
    rewardSource: "Sahih Muslim 223",
    rewardLink: "https://sunnah.com/muslim:223",
  },
  {
    arabic: "اللَّهُ أَكْبَرُ",
    english: "Allahu Akbar",
    meaning: "Allah is the Greatest",
    target: 34,
    reward: "Saying SubhanAllah, Alhamdulillah, and Allahu Akbar 33 times after each prayer — whoever does this, their sins will be forgiven even if they were as much as the foam of the sea.",
    rewardSource: "Sahih Muslim 597",
    rewardLink: "https://sunnah.com/muslim:597",
  },
];

interface DhikrCounterProps {
  onClose: () => void;
}

const DhikrCounter = ({ onClose }: DhikrCounterProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [counts, setCounts] = useState<number[]>(() => {
    const saved = localStorage.getItem("hc-dhikr-counts");
    return saved ? JSON.parse(saved) : [0, 0, 0];
  });
  const [showReward, setShowReward] = useState(false);
  const [completed, setCompleted] = useState(false);

  const current = dhikrs[activeIndex];
  const count = counts[activeIndex];
  const progress = Math.min(count / current.target, 1);
  const totalDone = counts.reduce((a, b) => a + b, 0);
  const totalTarget = dhikrs.reduce((a, d) => a + d.target, 0);
  const allComplete = dhikrs.every((d, i) => counts[i] >= d.target);

  // Save counts to localStorage
  useEffect(() => {
    localStorage.setItem("hc-dhikr-counts", JSON.stringify(counts));
  }, [counts]);

  useEffect(() => {
    // Auto-advance when target reached
    if (count >= current.target && activeIndex < dhikrs.length - 1) {
      const timeout = setTimeout(() => setActiveIndex(activeIndex + 1), 800);
      return () => clearTimeout(timeout);
    }
    // Show completion screen
    if (allComplete && !completed) {
      const timeout = setTimeout(() => setCompleted(true), 500);
      return () => clearTimeout(timeout);
    }
  }, [count, activeIndex, current.target, allComplete, completed]);

  const increment = () => {
    setCounts((prev) => {
      const next = [...prev];
      next[activeIndex]++;
      return next;
    });
  };

  const reset = () => {
    setCounts([0, 0, 0]);
    setCompleted(false);
    setActiveIndex(0);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:text-foreground" aria-label="Close">✕</button>

      <div className="w-full max-w-sm px-4 text-center">
        <AnimatePresence mode="wait">
          {completed ? (
            <motion.div key="complete" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <motion.span
                className="mb-4 block text-6xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                ✨
              </motion.span>
              <h2 className="mb-2 font-heading text-2xl font-bold text-foreground">SubhanAllah!</h2>
              <p className="mb-4 text-sm text-muted-foreground">You completed all 100 adhkār</p>
              <div className="mb-4 rounded-2xl bg-gradient-calm border border-border p-4">
                <p className="text-sm text-foreground italic">
                  "Whoever says SubhanAllah 33 times, Alhamdulillah 33 times, and Allahu Akbar 34 times after each prayer — their sins will be forgiven even if they were as much as the foam of the sea."
                </p>
                <a href="https://sunnah.com/muslim:597" target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs text-primary underline">
                  Sahih Muslim 597 →
                </a>
              </div>
              <div className="flex gap-2">
                <button onClick={reset} className="flex-1 rounded-xl border border-border bg-card py-3 text-sm font-medium text-foreground hover:bg-muted">
                  Start Again
                </button>
                <button onClick={onClose} className="flex-1 rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground transition-all hover:scale-105 active:scale-95">
                  Done
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="counter" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="mb-4 font-heading text-lg font-bold text-foreground">Dhikr Counter</h1>

              {/* Tabs */}
              <div className="mb-4 flex gap-2 justify-center">
                {dhikrs.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => { setActiveIndex(i); setShowReward(false); }}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                      activeIndex === i ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {d.english} {counts[i] >= d.target ? "✓" : `${counts[i]}`}
                  </button>
                ))}
              </div>

              {/* Current dhikr */}
              <AnimatePresence mode="wait">
                <motion.div key={activeIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <p className="mb-2 font-arabic text-3xl leading-relaxed text-foreground" dir="rtl">{current.arabic}</p>
                  <p className="mb-1 text-sm font-medium text-foreground">{current.english}</p>
                  <p className="mb-4 text-xs text-muted-foreground">{current.meaning}</p>
                </motion.div>
              </AnimatePresence>

              {/* Tap circle */}
              <motion.button
                onClick={increment}
                className="relative mx-auto mb-4 flex h-40 w-40 items-center justify-center rounded-full border-4 border-primary/30 bg-primary/5 transition-colors hover:bg-primary/10"
                whileTap={{ scale: 0.92 }}
                aria-label="Tap to count"
              >
                {/* Progress ring */}
                <svg className="absolute inset-0 -rotate-90" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r="74" fill="none" stroke="hsl(var(--primary) / 0.15)" strokeWidth="6" />
                  <circle
                    cx="80" cy="80" r="74" fill="none" stroke="hsl(var(--primary))" strokeWidth="6"
                    strokeDasharray={`${progress * 465} 465`}
                    strokeLinecap="round"
                    className="transition-all duration-300"
                  />
                </svg>
                <div>
                  <p className="font-heading text-4xl font-bold text-primary">{count}</p>
                  <p className="text-xs text-muted-foreground">/ {current.target}</p>
                </div>
              </motion.button>

              {/* Completed indicator */}
              {count >= current.target && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-2 text-sm font-medium text-success"
                >
                  ✓ Completed!
                </motion.p>
              )}

              {/* Hadith reward toggle */}
              <button
                onClick={() => setShowReward(!showReward)}
                className="mb-4 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                📚 Reward for this dhikr {showReward ? "▲" : "▼"}
              </button>
              <AnimatePresence>
                {showReward && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mb-4 rounded-xl border border-border bg-card p-3 text-left">
                      <p className="text-xs text-foreground italic">{current.reward}</p>
                      <a href={current.rewardLink} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-xs text-primary underline">
                        {current.rewardSource} →
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Total */}
              <p className="mb-4 text-sm text-muted-foreground">Total: {totalDone} / {totalTarget}</p>

              <div className="flex gap-2">
                <button onClick={reset} className="flex-1 rounded-xl border border-border bg-card py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                  Reset
                </button>
                <button onClick={onClose} className="flex-1 rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground transition-all hover:scale-105 active:scale-95">
                  Done
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default DhikrCounter;
