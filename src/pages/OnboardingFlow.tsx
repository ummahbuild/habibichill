import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import logo from "@/assets/habibichill-logo.png";

const triggers = ["Marriage/Relationship", "Online Arguments", "Family Disputes", "Workplace Stress", "Traffic/Road Rage", "Parenting", "Other"];

const OnboardingFlow = () => {
  const { setAppState, setOnboardingData } = useApp();
  const [step, setStep] = useState(0);
  const [isMuslim, setIsMuslim] = useState(true);
  const [trigger, setTrigger] = useState("");
  const [notifs, setNotifs] = useState(true);

  const finish = () => {
    setOnboardingData({ topTrigger: trigger, reciter: "", notifications: notifs, isMuslim });
    setAppState("app");
  };

  const slides = [
    // Welcome
    <div key="welcome" className="flex flex-col items-center text-center">
      <img src={logo} alt="HabibiChill" className="mb-6 h-32 w-32 rounded-3xl object-cover shadow-glow" />
      <h1 className="mb-2 font-heading text-3xl font-bold text-foreground">Welcome to HabibiChill</h1>
      <p className="text-lg text-gradient-gold font-heading font-semibold">Turn anger into reward</p>
    </div>,
    // Mode selection
    <div key="mode" className="flex flex-col items-center text-center">
      <span className="mb-4 text-6xl">🌍</span>
      <h2 className="mb-2 font-heading text-2xl font-bold text-foreground">Choose Your Experience</h2>
      <p className="mb-6 text-sm text-muted-foreground">We'll tailor the language and content for you</p>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={() => setIsMuslim(true)}
          className={`rounded-2xl border p-4 text-left transition-all ${
            isMuslim
              ? "border-primary bg-primary/10 shadow-calm"
              : "border-border bg-card hover:border-primary/50"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">🕌</span>
            <div>
              <p className="font-heading font-bold text-foreground">Muslim</p>
              <p className="text-xs text-muted-foreground">Full Islamic experience with Qur'an, Sunnah, dhikr, and Arabic terms</p>
            </div>
          </div>
        </button>
        <button
          onClick={() => setIsMuslim(false)}
          className={`rounded-2xl border p-4 text-left transition-all ${
            !isMuslim
              ? "border-primary bg-primary/10 shadow-calm"
              : "border-border bg-card hover:border-primary/50"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">🌱</span>
            <div>
              <p className="font-heading font-bold text-foreground">Non-Muslim / Secular</p>
              <p className="text-xs text-muted-foreground">Same tools, English-only labels. No Arabic terminology.</p>
            </div>
          </div>
        </button>
      </div>
    </div>,
    // Problem
    <div key="problem" className="flex flex-col items-center text-center">
      <span className="mb-4 text-6xl">😤</span>
      <h2 className="mb-3 font-heading text-2xl font-bold text-foreground">Anger Affects Us All</h2>
      <p className="max-w-sm text-muted-foreground">
        {isMuslim
          ? "But Islam has a complete solution — a 1400-year-old system for emotional mastery rooted in Qur'an and Sunnah."
          : "This app gives you a proven step-by-step system for emotional mastery — combining ancient wisdom with modern psychology."}
      </p>
    </div>,
    // How it works
    <div key="how" className="flex flex-col items-center text-center">
      <h2 className="mb-6 font-heading text-2xl font-bold text-foreground">How It Works</h2>
      <div className="flex flex-col gap-4 text-left">
        {[
          { emoji: "🔴", text: "Tap \"I'm Angry\" when anger rises" },
          { emoji: "🌊", text: isMuslim ? "Follow guided Sunnah calming protocol" : "Follow guided calming protocol" },
          { emoji: "📈", text: isMuslim ? "Track progress & earn spiritual rewards" : "Track progress & earn patience rewards" },
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl bg-card p-4 border border-border">
            <span className="text-2xl">{s.emoji}</span>
            <p className="font-medium text-card-foreground">{s.text}</p>
          </div>
        ))}
      </div>
    </div>,
    // Trigger selection
    <div key="trigger" className="flex flex-col items-center text-center">
      <h2 className="mb-2 font-heading text-2xl font-bold text-foreground">What triggers your anger most?</h2>
      <p className="mb-6 text-sm text-muted-foreground">We'll personalize your experience</p>
      <div className="flex flex-wrap justify-center gap-2">
        {triggers.map((t) => (
          <button
            key={t}
            onClick={() => setTrigger(t)}
            className={`rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
              trigger === t
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-card-foreground hover:border-primary/50"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <button onClick={() => setStep(step + 1)} className="mt-4 text-xs text-muted-foreground hover:text-foreground">
        Skip this step →
      </button>
    </div>,
    // Ready
    <div key="ready" className="flex flex-col items-center text-center">
      <span className="mb-4 text-6xl">🌟</span>
      <h2 className="mb-3 font-heading text-2xl font-bold text-foreground">Your Journey Begins Now</h2>
      <p className="mb-2 text-muted-foreground">
        {isMuslim
          ? "May Allah grant you sabr and inner peace."
          : "May you find patience and inner peace."}
      </p>
      <label className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
        <input type="checkbox" checked={notifs} onChange={(e) => setNotifs(e.target.checked)} className="rounded accent-primary" />
        Enable daily reminders
      </label>
    </div>,
  ];

  const isLast = step === slides.length - 1;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Progress */}
        <div className="mb-8 flex justify-center gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i <= step ? "w-8 bg-primary" : "w-4 bg-border"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="min-h-[320px] flex items-center justify-center"
          >
            {slides[step]}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex justify-between">
          {step > 0 ? (
            <button onClick={() => setStep(step - 1)} className="rounded-xl px-6 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Back
            </button>
          ) : (
            <div />
          )}
          <button
            onClick={isLast ? finish : () => setStep(step + 1)}
            className="rounded-xl bg-primary px-8 py-3 font-heading font-semibold text-primary-foreground shadow-calm transition-all hover:scale-105 active:scale-95"
          >
            {isLast ? "Enter HabibiChill" : "Continue"}
          </button>
        </div>

        {!isLast && (
          <button onClick={finish} className="mt-4 w-full text-center text-sm text-muted-foreground hover:text-foreground">
            Skip onboarding →
          </button>
        )}
      </div>
    </div>
  );
};

export default OnboardingFlow;
