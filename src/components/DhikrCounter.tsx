import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const dhikrs = [
  { arabic: "سُبْحَانَ اللَّهِ", english: "SubhanAllah", meaning: "Glory be to Allah", target: 33 },
  { arabic: "الْحَمْدُ لِلَّهِ", english: "Alhamdulillah", meaning: "All praise is due to Allah", target: 33 },
  { arabic: "اللَّهُ أَكْبَرُ", english: "Allahu Akbar", meaning: "Allah is the Greatest", target: 34 },
];

interface DhikrCounterProps {
  onClose: () => void;
}

const DhikrCounter = ({ onClose }: DhikrCounterProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [counts, setCounts] = useState([0, 0, 0]);

  const current = dhikrs[activeIndex];
  const count = counts[activeIndex];
  const progress = Math.min(count / current.target, 1);
  const totalDone = counts.reduce((a, b) => a + b, 0);
  const totalTarget = dhikrs.reduce((a, d) => a + d.target, 0);

  useEffect(() => {
    // Auto-advance when target reached
    if (count >= current.target && activeIndex < dhikrs.length - 1) {
      const timeout = setTimeout(() => setActiveIndex(activeIndex + 1), 600);
      return () => clearTimeout(timeout);
    }
  }, [count, activeIndex, current.target]);

  const increment = () => {
    setCounts((prev) => {
      const next = [...prev];
      next[activeIndex]++;
      return next;
    });
  };

  const reset = () => setCounts([0, 0, 0]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:text-foreground" aria-label="Close">✕</button>

      <div className="w-full max-w-sm px-4 text-center">
        {/* Tabs */}
        <div className="mb-6 flex gap-2 justify-center">
          {dhikrs.map((d, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                activeIndex === i ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {d.english} {counts[i] >= d.target && "✓"}
            </button>
          ))}
        </div>

        {/* Current dhikr */}
        <AnimatePresence mode="wait">
          <motion.div key={activeIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <p className="mb-2 font-arabic text-3xl leading-relaxed text-foreground" dir="rtl">{current.arabic}</p>
            <p className="mb-1 text-sm font-medium text-foreground">{current.english}</p>
            <p className="mb-6 text-xs text-muted-foreground">{current.meaning}</p>
          </motion.div>
        </AnimatePresence>

        {/* Tap circle */}
        <motion.button
          onClick={increment}
          className="relative mx-auto mb-6 flex h-40 w-40 items-center justify-center rounded-full border-4 border-primary/30 bg-primary/5 transition-colors hover:bg-primary/10"
          whileTap={{ scale: 0.95 }}
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
      </div>
    </motion.div>
  );
};

export default DhikrCounter;
