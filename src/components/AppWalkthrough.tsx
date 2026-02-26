import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const screens = [
  {
    id: "emergency",
    title: "Tap When Angry",
    desc: "One tap activates the Sunnah calming protocol",
    emoji: "🔥",
    mockup: (
      <div className="flex flex-col items-center gap-3 py-6">
        <div className="text-5xl animate-pulse-gentle">🔥</div>
        <div className="rounded-2xl bg-destructive px-8 py-3 text-sm font-bold text-destructive-foreground shadow-lg">
          I'm Angry
        </div>
        <p className="text-[10px] text-muted-foreground mt-2">Emergency protocol activates instantly</p>
      </div>
    ),
  },
  {
    id: "protocol",
    title: "Follow the Protocol",
    desc: "Step-by-step Sunnah guidance to calm down",
    emoji: "🌊",
    mockup: (
      <div className="flex flex-col gap-2 py-4 px-2">
        {["Say A'udhu billah", "Change your position", "Make Wudu", "Stay silent"].map((step, i) => (
          <div key={step} className="flex items-center gap-2 rounded-xl border border-border bg-card p-2.5">
            <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${i === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              {i === 0 ? "✓" : i + 1}
            </div>
            <span className="text-xs font-medium text-card-foreground">{step}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "quran",
    title: "Quran & Dhikr",
    desc: "Listen to calming recitations or count your dhikr",
    emoji: "📖",
    mockup: (
      <div className="flex flex-col gap-3 py-4 px-2">
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
          <span className="text-xl">🌿</span>
          <div className="flex-1">
            <p className="text-xs font-semibold text-card-foreground">Surah Ar-Rahman</p>
            <p className="text-[10px] text-muted-foreground">The Most Merciful</p>
          </div>
          <div className="flex gap-1">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-[10px]">📜</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-[10px] text-primary-foreground">▶</span>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-3">
          <span className="text-xl">📿</span>
          <div className="flex-1">
            <p className="text-xs font-semibold text-card-foreground">Dhikr Counter</p>
            <p className="text-[10px] text-muted-foreground">SubhanAllah × 33</p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">33</div>
        </div>
      </div>
    ),
  },
  {
    id: "track",
    title: "Track Your Growth",
    desc: "Monitor your sabr streaks and emotional mastery",
    emoji: "📊",
    mockup: (
      <div className="flex flex-col gap-3 py-4 px-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-border bg-card p-3 text-center">
            <p className="text-2xl font-bold text-primary">7</p>
            <p className="text-[10px] text-muted-foreground">Day Streak 🔥</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3 text-center">
            <p className="text-2xl font-bold text-secondary">85%</p>
            <p className="text-[10px] text-muted-foreground">Sabr Score</p>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-3">
          <p className="mb-2 text-[10px] font-semibold text-card-foreground">This Week</p>
          <div className="flex items-end gap-1">
            {[40, 60, 30, 80, 70, 90, 85].map((h, i) => (
              <div key={i} className="flex-1 rounded-t bg-primary/70" style={{ height: `${h * 0.5}px` }} />
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "recommend",
    title: "Personalized For You",
    desc: "AI-powered recommendations based on your triggers and mood",
    emoji: "✨",
    mockup: (
      <div className="flex flex-col gap-2 py-4 px-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">✨ Recommended for You</p>
        {[
          { emoji: "☀️", name: "Surah Ad-Duha", reason: "You're feeling low — this brings comfort" },
          { emoji: "💪", name: "Hadith on Strength", reason: "For patience in family matters" },
          { emoji: "🤲", name: "Dua of Yunus", reason: "A dua for relief during difficulty" },
        ].map((r) => (
          <div key={r.name} className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 p-2.5">
            <span className="text-lg">{r.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-card-foreground">{r.name}</p>
              <p className="text-[9px] text-muted-foreground truncate">{r.reason}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
];

const AppWalkthrough = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % screens.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const screen = screens[current];

  return (
    <section className="container mx-auto px-4 py-16" aria-label="App walkthrough demo">
      <h2 className="mb-4 text-center font-heading text-3xl font-bold text-foreground">
        See It In Action
      </h2>
      <p className="mb-12 text-center text-muted-foreground">
        A complete anger management system in your pocket
      </p>

      <div className="mx-auto flex max-w-4xl flex-col items-center gap-10 md:flex-row md:gap-16">
        {/* Phone mockup */}
        <div className="relative mx-auto w-[260px] shrink-0">
          <div className="rounded-[2.5rem] border-4 border-foreground/10 bg-card p-3 shadow-calm">
            {/* Notch */}
            <div className="mx-auto mb-2 h-5 w-24 rounded-full bg-foreground/10" />
            {/* Screen */}
            <div className="min-h-[320px] overflow-hidden rounded-2xl bg-background">
              <div className="border-b border-border bg-card px-3 py-2">
                <p className="text-center text-[10px] font-semibold text-card-foreground">HabibiChill</p>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={screen.id}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35 }}
                  className="px-2"
                >
                  {screen.mockup}
                </motion.div>
              </AnimatePresence>
            </div>
            {/* Home indicator */}
            <div className="mx-auto mt-2 h-1 w-20 rounded-full bg-foreground/10" />
          </div>
        </div>

        {/* Steps */}
        <div className="flex flex-1 flex-col gap-3">
          {screens.map((s, i) => (
            <motion.button
              key={s.id}
              onClick={() => setCurrent(i)}
              className={`flex items-start gap-4 rounded-2xl border p-4 text-left transition-all ${
                i === current
                  ? "border-primary bg-primary/5 shadow-calm"
                  : "border-border bg-card hover:border-primary/30"
              }`}
              whileTap={{ scale: 0.98 }}
            >
              <span className="mt-0.5 text-2xl">{s.emoji}</span>
              <div>
                <h3 className={`font-heading text-sm font-semibold ${i === current ? "text-primary" : "text-card-foreground"}`}>
                  {s.title}
                </h3>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
              {i === current && (
                <motion.div
                  className="ml-auto mt-1 h-2 w-2 rounded-full bg-primary"
                  layoutId="walkthrough-dot"
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AppWalkthrough;
