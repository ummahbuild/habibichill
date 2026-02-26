import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEscapeKey } from "@/hooks/use-keyboard-shortcuts";

const phases = [
  { label: "Inhale", duration: 4, arabic: "بِسْمِ اللَّهِ", english: "In the name of Allah" },
  { label: "Hold", duration: 4, arabic: "سُبْحَانَ اللَّهِ", english: "Glory be to Allah" },
  { label: "Exhale", duration: 6, arabic: "الْحَمْدُ لِلَّهِ", english: "All praise to Allah" },
  { label: "Hold", duration: 2, arabic: "اللَّهُ أَكْبَرُ", english: "Allah is the Greatest" },
];

interface BreathingExerciseProps {
  onClose: () => void;
}

const BreathingExercise = ({ onClose }: BreathingExerciseProps) => {
  useEscapeKey(onClose);
  const [started, setStarted] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(phases[0].duration);
  const [totalCycles] = useState(5);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const phase = phases[phaseIndex];
  const done = cycleCount >= totalCycles;

  useEffect(() => {
    if (!started || done) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // Move to next phase
          const nextPhaseIndex = (phaseIndex + 1) % phases.length;
          if (nextPhaseIndex === 0) {
            setCycleCount((c) => c + 1);
          }
          setPhaseIndex(nextPhaseIndex);
          return phases[nextPhaseIndex].duration;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [started, phaseIndex, done]);

  const scaleMap: Record<string, number[]> = {
    Inhale: [0.6, 1.3],
    Hold: [1.3, 1.3],
    Exhale: [1.3, 0.6],
  };
  const scale = scaleMap[phase.label] || [1, 1];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button
        onClick={() => { if (intervalRef.current) clearInterval(intervalRef.current); onClose(); }}
        className="absolute right-4 top-4 z-10 rounded-full p-2 text-muted-foreground hover:text-foreground"
        aria-label="Close"
      >
        ✕
      </button>

      <div className="w-full max-w-sm px-4 text-center">
        <AnimatePresence mode="wait">
          {!started && !done && (
            <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <span className="mb-4 block text-5xl">🌊</span>
              <h2 className="mb-2 font-heading text-2xl font-bold text-foreground">Breathing Exercise</h2>
              <p className="mb-2 text-sm text-muted-foreground">Combine deep breathing with dhikr for maximum calm</p>
              <div className="mb-6 rounded-2xl bg-gradient-calm border border-border p-4">
                <p className="text-sm text-foreground">
                  <strong>4-4-6-2 technique:</strong> Inhale 4s → Hold 4s → Exhale 6s → Hold 2s
                </p>
                <p className="mt-2 text-xs text-muted-foreground">{totalCycles} cycles · ~{Math.ceil(totalCycles * 16 / 60)} minutes</p>
              </div>
              <button
                onClick={() => setStarted(true)}
                className="w-full rounded-xl bg-primary py-4 font-heading font-semibold text-primary-foreground transition-all hover:scale-105 active:scale-95"
              >
                Begin
              </button>
            </motion.div>
          )}

          {started && !done && (
            <motion.div key="breathing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="mb-2 text-xs text-muted-foreground">Cycle {cycleCount + 1} of {totalCycles}</p>
              <div className="mb-2 flex gap-1 justify-center">
                {Array.from({ length: totalCycles }).map((_, i) => (
                  <div key={i} className={`h-1.5 w-8 rounded-full transition-all ${i < cycleCount ? "bg-primary" : i === cycleCount ? "bg-primary/50" : "bg-muted"}`} />
                ))}
              </div>

              {/* Breathing orb */}
              <div className="relative mx-auto my-8 flex h-52 w-52 items-center justify-center">
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary/10 border-2 border-primary/30"
                  animate={{ scale }}
                  transition={{ duration: phase.duration, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute inset-6 rounded-full bg-primary/20"
                  animate={{ scale }}
                  transition={{ duration: phase.duration, ease: "easeInOut", delay: 0.1 }}
                />
                <div className="relative z-10 flex flex-col items-center">
                  <p className="font-heading text-xl font-bold text-primary">{phase.label}</p>
                  <p className="font-heading text-3xl font-bold text-foreground">{secondsLeft}</p>
                </div>
              </div>

              {/* Dhikr for this phase */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={phaseIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mb-6"
                >
                  <p className="font-arabic text-2xl leading-relaxed text-foreground" dir="rtl">{phase.arabic}</p>
                  <p className="mt-1 text-sm text-muted-foreground italic">{phase.english}</p>
                </motion.div>
              </AnimatePresence>

              <button
                onClick={() => { if (intervalRef.current) clearInterval(intervalRef.current); setCycleCount(totalCycles); }}
                className="rounded-xl border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                End Early
              </button>
            </motion.div>
          )}

          {done && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <motion.span
                className="mb-4 block text-6xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                ✨
              </motion.span>
              <h2 className="mb-2 font-heading text-2xl font-bold text-foreground">Beautiful!</h2>
              <p className="mb-4 text-sm text-muted-foreground">You completed {totalCycles} breathing cycles with dhikr.</p>
              <div className="mb-6 rounded-2xl bg-gradient-calm border border-border p-4">
                <p className="mb-1 font-arabic text-lg leading-relaxed text-foreground" dir="rtl">أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ</p>
                <p className="mb-1 text-sm text-muted-foreground italic">"Verily, in the remembrance of Allah do hearts find rest."</p>
                <a href="https://quran.com/13/28" target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline">Qur'an 13:28 →</a>
              </div>
              <button
                onClick={onClose}
                className="w-full rounded-xl bg-primary py-4 font-heading font-semibold text-primary-foreground transition-all hover:scale-105 active:scale-95"
              >
                Done
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default BreathingExercise;
