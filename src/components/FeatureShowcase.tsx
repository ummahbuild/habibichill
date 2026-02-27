import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    image: "/blog/feature-home-dashboard.jpg",
    title: "Your Daily Dashboard",
    desc: "Mood check-ins, quick tools, and daily wisdom — all in one place.",
    emoji: "🏠",
    accent: "from-primary/20 to-primary/5",
  },
  {
    image: "/blog/feature-emergency-flow.jpg",
    title: "Emergency Calm Protocol",
    desc: "Step-by-step Sunnah anger protocol when you need it most.",
    emoji: "🔥",
    accent: "from-destructive/20 to-destructive/5",
  },
  {
    image: "/blog/feature-dhikr-counter.jpg",
    title: "Dhikr Counter",
    desc: "Track your remembrance with haptic feedback and progress rings.",
    emoji: "📿",
    accent: "from-secondary/20 to-secondary/5",
  },
  {
    image: "/blog/feature-quran-player.jpg",
    title: "Quran Player",
    desc: "Listen to calming recitations from world-renowned reciters.",
    emoji: "🎧",
    accent: "from-primary/20 to-primary/5",
  },
  {
    image: "/blog/feature-tracking.jpg",
    title: "Progress Tracking",
    desc: "Sabr streaks, intensity trends, and mood analytics.",
    emoji: "📊",
    accent: "from-accent/20 to-accent/5",
  },
  {
    image: "/blog/feature-learn.jpg",
    title: "Learn & Prevent",
    desc: "Lessons rooted in Quran, Sunnah, and Islamic psychology.",
    emoji: "🧠",
    accent: "from-secondary/20 to-secondary/5",
  },
];

const FeatureShowcase = () => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [paused, next]);

  const slide = slides[current];

  return (
    <section
      className="py-16 overflow-hidden"
      aria-label="Feature showcase"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container mx-auto max-w-5xl px-4">
        <h2 className="mb-2 text-center font-heading text-3xl font-bold text-foreground">
          See It In Action
        </h2>
        <p className="mb-10 text-center text-muted-foreground">
          A guided tour of your anger mastery toolkit
        </p>

        <div className="relative rounded-3xl border border-border bg-card overflow-hidden shadow-calm">
          {/* Main display */}
          <div className="relative aspect-[16/10] md:aspect-[16/8] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                {/* Background gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${slide.accent} to-transparent z-10`} />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent z-10" />

                {/* Image */}
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="h-full w-full object-cover object-top"
                  loading="lazy"
                />

                {/* Text overlay */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{slide.emoji}</span>
                    <h3 className="font-heading text-xl md:text-2xl font-bold text-foreground">
                      {slide.title}
                    </h3>
                  </div>
                  <p className="text-sm md:text-base text-muted-foreground max-w-md">
                    {slide.desc}
                  </p>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Progress bar */}
            <div className="absolute top-0 left-0 right-0 z-30 flex gap-1 p-3">
              {slides.map((_, i) => (
                <div key={i} className="flex-1 h-1 rounded-full bg-foreground/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: "0%" }}
                    animate={{
                      width: i === current ? "100%" : i < current ? "100%" : "0%",
                    }}
                    transition={
                      i === current
                        ? { duration: paused ? 99999 : 4, ease: "linear" }
                        : { duration: 0.3 }
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Thumbnail strip */}
          <div className="flex gap-2 p-3 bg-muted/50 overflow-x-auto scrollbar-hide">
            {slides.map((s, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`flex-shrink-0 flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                  i === current
                    ? "bg-primary/10 text-primary border border-primary/30"
                    : "bg-card text-muted-foreground border border-border hover:border-primary/20"
                }`}
              >
                <span>{s.emoji}</span>
                <span className="hidden sm:inline">{s.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureShowcase;
