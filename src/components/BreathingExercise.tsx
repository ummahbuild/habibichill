import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEscapeKey } from "@/hooks/use-keyboard-shortcuts";

interface Technique {
  name: string;
  emoji: string;
  description: string;
  phases: { label: string; duration: number; arabic: string; english: string }[];
  cycles: number;
}

const techniques: Technique[] = [
  {
    name: "Calm Breathing",
    emoji: "🌊",
    description: "4-4-6-2 technique — deep calm with dhikr",
    phases: [
      { label: "Inhale", duration: 4, arabic: "بِسْمِ اللَّهِ", english: "In the name of Allah" },
      { label: "Hold", duration: 4, arabic: "سُبْحَانَ اللَّهِ", english: "Glory be to Allah" },
      { label: "Exhale", duration: 6, arabic: "الْحَمْدُ لِلَّهِ", english: "All praise to Allah" },
      { label: "Hold", duration: 2, arabic: "اللَّهُ أَكْبَرُ", english: "Allah is the Greatest" },
    ],
    cycles: 5,
  },
  {
    name: "Box Breathing",
    emoji: "📦",
    description: "4-4-4-4 equal rhythm — focus & clarity",
    phases: [
      { label: "Inhale", duration: 4, arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ", english: "There is no god but Allah" },
      { label: "Hold", duration: 4, arabic: "سُبْحَانَ اللَّهِ", english: "Glory be to Allah" },
      { label: "Exhale", duration: 4, arabic: "الْحَمْدُ لِلَّهِ", english: "All praise to Allah" },
      { label: "Hold", duration: 4, arabic: "اللَّهُ أَكْبَرُ", english: "Allah is the Greatest" },
    ],
    cycles: 4,
  },
  {
    name: "Quick Reset",
    emoji: "⚡",
    description: "3-3-5 fast calm — for urgent moments",
    phases: [
      { label: "Inhale", duration: 3, arabic: "أَعُوذُ بِاللَّهِ", english: "I seek refuge in Allah" },
      { label: "Hold", duration: 3, arabic: "سُبْحَانَ اللَّهِ", english: "Glory be to Allah" },
      { label: "Exhale", duration: 5, arabic: "الْحَمْدُ لِلَّهِ", english: "All praise to Allah" },
    ],
    cycles: 3,
  },
  {
    name: "Deep Sabr",
    emoji: "🕊️",
    description: "5-5-8-3 extended — deep relaxation",
    phases: [
      { label: "Inhale", duration: 5, arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", english: "In the name of Allah, Most Gracious, Most Merciful" },
      { label: "Hold", duration: 5, arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", english: "Glory and praise be to Allah" },
      { label: "Exhale", duration: 8, arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ", english: "There is no power except with Allah" },
      { label: "Hold", duration: 3, arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ", english: "Allah is sufficient for us" },
    ],
    cycles: 4,
  },
];

interface BreathingExerciseProps {
  onClose: () => void;
}

const BreathingExercise = ({ onClose }: BreathingExerciseProps) => {
  useEscapeKey(onClose);
  const [selectedTechnique, setSelectedTechnique] = useState<Technique | null>(null);
  const [started, setStarted] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(4);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const phases = selectedTechnique?.phases ?? techniques[0].phases;
  const totalCycles = selectedTechnique?.cycles ?? 5;
  const phase = phases[phaseIndex];
  const done = cycleCount >= totalCycles;

  const startTechnique = (t: Technique) => {
    setSelectedTechnique(t);
    setPhaseIndex(0);
    setCycleCount(0);
    setSecondsLeft(t.phases[0].duration);
    setStarted(true);
  };

  useEffect(() => {
    if (!started || done) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
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
  }, [started, phaseIndex, done, phases]);

  const scaleMap: Record<string, number[]> = {
    Inhale: [0.6, 1.3],
    Hold: [1.3, 1.3],
    Exhale: [1.3, 0.6],
  };
  const scale = scaleMap[phase.label] || [1, 1];

  const cycleDuration = phases.reduce((sum, p) => sum + p.duration, 0);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-background/95 backdrop-blur-sm"
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

      <div className="w-full max-w-sm px-4 py-8 text-center">
        <AnimatePresence mode="wait">
          {!started && !done && (
            <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <span className="mb-4 block text-5xl">🌊</span>
              <h2 className="mb-2 font-heading text-2xl font-bold text-foreground">Breathing Exercise</h2>
              <p className="mb-4 text-sm text-muted-foreground">Choose a technique that fits your moment</p>
              <div className="flex flex-col gap-3">
                {techniques.map((t) => (
                  <motion.button
                    key={t.name}
                    onClick={() => startTechnique(t)}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-all hover:shadow-calm active:scale-[0.98]"
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-3xl">{t.emoji}</span>
                    <div className="flex-1">
                      <p className="font-heading text-sm font-bold text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.description}</p>
                      <p className="mt-1 text-[10px] text-primary">{t.cycles} cycles · ~{Math.ceil(t.cycles * t.phases.reduce((s, p) => s + p.duration, 0) / 60)} min</p>
                    </div>
                    <span className="text-muted-foreground">→</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {started && !done && (
            <motion.div key="breathing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="mb-1 text-[10px] font-medium text-primary">{selectedTechnique?.emoji} {selectedTechnique?.name}</p>
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
              <div className="flex gap-3">
                <button
                  onClick={() => { setStarted(false); setSelectedTechnique(null); setCycleCount(0); setPhaseIndex(0); }}
                  className="flex-1 rounded-xl border border-border bg-card py-4 font-heading font-semibold text-foreground transition-all hover:bg-muted"
                >
                  Try Another
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 rounded-xl bg-primary py-4 font-heading font-semibold text-primary-foreground transition-all hover:scale-105 active:scale-95"
                >
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

export default BreathingExercise;
