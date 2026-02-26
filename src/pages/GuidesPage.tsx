import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/habibichill-logo.png";

const guides = [
  {
    id: "getting-started",
    title: "Getting Started with HabibiChill",
    emoji: "🚀",
    description: "Learn how to set up HabibiChill and personalize it to your needs.",
    steps: [
      {
        title: "Open the App",
        description: "Visit habibichill.com on any device. The app works on mobile, tablet, and desktop. No download or account required.",
        tip: "Add it to your home screen for instant access — it works like a native app!",
      },
      {
        title: "Complete Onboarding",
        description: "Tell us your top anger trigger and preferred Quran reciter. This personalizes your calming protocols and recommendations.",
        tip: "You can skip onboarding and set these later in the Me tab.",
      },
      {
        title: "Explore the Dashboard",
        description: "The home screen shows your daily wisdom, quick actions (Dhikr, Wudu Guide, Breathing), and personalized Quran recommendations.",
        tip: "Use keyboard shortcuts 1-4 to switch tabs quickly on desktop.",
      },
    ],
  },
  {
    id: "emergency-protocol",
    title: "Using the Emergency Anger Protocol",
    emoji: "🔥",
    description: "When anger strikes, HabibiChill guides you through a step-by-step Sunnah-based calming protocol.",
    steps: [
      {
        title: "Tap the Fire Button",
        description: "When you feel anger rising, tap the 🔥 button in the center of the bottom navigation bar. This activates the emergency calming protocol immediately.",
        tip: "Press 'F' on your keyboard for instant access on desktop.",
      },
      {
        title: "Follow the Sunnah Steps",
        description: "The protocol guides you through: saying A'udhu billah, changing your position (sit if standing, lie down if sitting), making Wudu, and staying silent — all based on authentic Hadith.",
        tip: "Each step includes the original Arabic text, translation, and hadith reference.",
      },
      {
        title: "Record & Reflect",
        description: "After calming down, the app asks you to rate your anger level and log what triggered it. This builds your personal anger profile over time.",
        tip: "Review your patterns in the Me tab to identify recurring triggers.",
      },
    ],
  },
  {
    id: "quran-listening",
    title: "Quran Listening & Reading",
    emoji: "📖",
    description: "Access calming Quran recitations and read verses with translation — all cached for offline use.",
    steps: [
      {
        title: "Quick Quran from Home",
        description: "The home screen has a Quick Quran section with curated surahs for emotional healing. Each has a 📜 Read button and ▶ Listen button.",
        tip: "Ar-Rahman, Ash-Sharh, Ad-Duha, and Al-Mulk are specifically chosen for their calming properties.",
      },
      {
        title: "Full Quran Tab",
        description: "Switch to the Quran tab (📖) for the complete library. Browse all 114 surahs, search by name, or filter by Makki/Madani.",
        tip: "Use Space to play/pause and arrow keys to skip tracks when listening.",
      },
      {
        title: "Personalized Recommendations",
        description: "Based on your mood, anger history, and the time of day, the app suggests specific surahs, hadiths, and duas tailored to your current state.",
        tip: "Log your mood regularly to improve recommendation accuracy.",
      },
    ],
  },
  {
    id: "dhikr-counter",
    title: "Dhikr Counter & Remembrance",
    emoji: "📿",
    description: "Use the built-in dhikr counter to track your daily remembrance of Allah.",
    steps: [
      {
        title: "Open the Counter",
        description: "Tap the Dhikr quick action on the home screen. Choose from preset dhikr like SubhanAllah, Alhamdulillah, Allahu Akbar, or create custom ones.",
        tip: "The counter provides haptic feedback (vibration) on supported devices.",
      },
      {
        title: "Complete Your Sets",
        description: "The traditional set is 33 repetitions each of SubhanAllah, Alhamdulillah, and Allahu Akbar. The counter tracks your progress with visual feedback.",
        tip: "Tap anywhere on the screen to increment — no need to aim for a small button.",
      },
      {
        title: "Track Daily Progress",
        description: "Your dhikr counts are saved to your daily log. Over time, you can see your consistency and spiritual growth in the Me tab.",
        tip: "Set daily reminders to build a consistent dhikr habit.",
      },
    ],
  },
  {
    id: "anger-journal",
    title: "Anger Journal & Tracking",
    emoji: "📝",
    description: "Keep a private journal of anger episodes to identify patterns and track your emotional growth.",
    steps: [
      {
        title: "Log Each Episode",
        description: "After an anger episode, tap the Journal quick action. Record what triggered you, how intense it was (1-5), and what coping method you used.",
        tip: "The more episodes you log, the better the app understands your patterns.",
      },
      {
        title: "Review Your Patterns",
        description: "The Me tab shows your anger frequency over time, common triggers, and which coping methods work best for you.",
        tip: "Look for time-of-day patterns — many people find they're more reactive at specific times.",
      },
      {
        title: "Celebrate Progress",
        description: "Track your sabr (patience) streak — consecutive days without losing control. The app rewards spiritual milestones based on Islamic concepts of self-improvement.",
        tip: "Share your milestones with a trusted friend or accountability partner.",
      },
    ],
  },
  {
    id: "wudu-guide",
    title: "Interactive Wudu Guide",
    emoji: "💧",
    description: "A step-by-step visual guide to performing Wudu — the Prophet ﷺ recommended it as an anger remedy.",
    steps: [
      {
        title: "Why Wudu for Anger",
        description: "The Prophet Muhammad ﷺ said: 'Anger comes from Shaytan, and Shaytan was created from fire. Fire is extinguished by water, so when one of you becomes angry, let him perform Wudu.' (Abu Dawud 4784)",
        tip: "Even if you already have Wudu, the physical act of washing has a scientifically-proven calming effect.",
      },
      {
        title: "Follow the Steps",
        description: "The guide walks you through each step of Wudu with clear instructions and illustrations — from the intention (niyyah) through to the dua after completion.",
        tip: "Take your time with each step. The deliberate, slow movements are part of the calming process.",
      },
    ],
  },
  {
    id: "breathing-exercises",
    title: "Islamic Breathing Exercises",
    emoji: "🌬️",
    description: "Guided breathing exercises combined with dhikr for deep relaxation.",
    steps: [
      {
        title: "Start a Session",
        description: "Tap the Breathing quick action on the home screen. The exercise combines 4-7-8 breathing technique with dhikr — inhale while thinking 'SubhanAllah', hold, exhale while thinking 'Alhamdulillah'.",
        tip: "Just 3 cycles of conscious breathing can significantly reduce your heart rate and cortisol levels.",
      },
      {
        title: "Visual Guidance",
        description: "A pulsing circle guides your breath timing. Follow the expand/contract animation for proper breath pacing.",
        tip: "Close your eyes after learning the rhythm for a deeper experience.",
      },
    ],
  },
  {
    id: "offline-use",
    title: "Using HabibiChill Offline",
    emoji: "📱",
    description: "The app works fully offline after your first visit — perfect for moments when you need it most.",
    steps: [
      {
        title: "Install as PWA",
        description: "On mobile: tap 'Add to Home Screen' in your browser menu. On desktop: look for the install icon in the address bar. This gives you app-like access without downloading from an app store.",
        tip: "The PWA version loads faster and works offline automatically.",
      },
      {
        title: "What Works Offline",
        description: "The emergency protocol, dhikr counter, breathing exercises, journal, Wudu guide, and all learned content work without internet. Quran audio and verses are cached after first listen/read.",
        tip: "Listen to your favorite surahs once while online — they'll be available offline after that.",
      },
    ],
  },
];

const GuidesPage = () => {
  const [openGuide, setOpenGuide] = useState<string | null>(null);

  useEffect(() => {
    document.title = "User Guides — HabibiChill | How to Use the Muslim Anger Management App";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", "Step-by-step user guides for HabibiChill. Learn how to use the emergency anger protocol, Quran recitations, dhikr counter, anger journal, and more.");

    // JSON-LD HowTo schema
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Use HabibiChill for Anger Management",
      "description": "A complete guide to using HabibiChill, the Muslim anger management app based on Quran and Sunnah.",
      "step": guides.slice(0, 5).map((g, i) => ({
        "@type": "HowToStep",
        "position": i + 1,
        "name": g.title,
        "text": g.description,
      })),
    });
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <nav className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="HabibiChill" className="h-8 w-8 rounded-full object-cover" width={32} height={32} />
            <span className="font-heading text-lg font-bold text-foreground">HabibiChill</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/blogs" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Blog</Link>
            <Link to="/" className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:scale-105">
              Launch App
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="bg-gradient-calm py-12">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            className="mb-3 font-heading text-3xl font-bold text-foreground md:text-4xl"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            📚 User Guides
          </motion.h1>
          <p className="mx-auto max-w-lg text-muted-foreground">
            Everything you need to master HabibiChill and take control of your emotions using Qur'an and Sunnah.
          </p>
        </div>
      </section>

      {/* Guides Grid */}
      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl flex flex-col gap-4">
          {guides.map((guide, i) => {
            const isOpen = openGuide === guide.id;
            return (
              <motion.article
                key={guide.id}
                className="rounded-2xl border border-border bg-card overflow-hidden transition-shadow hover:shadow-calm"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <button
                  onClick={() => setOpenGuide(isOpen ? null : guide.id)}
                  className="flex w-full items-center gap-4 p-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-3xl">{guide.emoji}</span>
                  <div className="flex-1">
                    <h2 className="font-heading text-lg font-semibold text-card-foreground">{guide.title}</h2>
                    <p className="text-sm text-muted-foreground">{guide.description}</p>
                  </div>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    className="text-muted-foreground"
                  >
                    ▼
                  </motion.span>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-border px-5 pb-5 pt-4">
                        <ol className="flex flex-col gap-4">
                          {guide.steps.map((step, si) => (
                            <li key={si} className="flex gap-3">
                              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                                {si + 1}
                              </div>
                              <div>
                                <h3 className="mb-1 font-heading text-sm font-semibold text-card-foreground">{step.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                                {step.tip && (
                                  <p className="mt-2 rounded-xl bg-primary/5 border border-primary/10 px-3 py-2 text-xs text-primary">
                                    💡 {step.tip}
                                  </p>
                                )}
                              </div>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h2 className="mb-4 font-heading text-2xl font-bold text-foreground">Ready to Get Started?</h2>
          <Link
            to="/"
            className="inline-block rounded-2xl bg-primary px-8 py-4 font-heading text-lg font-semibold text-primary-foreground shadow-calm transition-all hover:scale-105 active:scale-95"
          >
            Launch HabibiChill — Free
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto flex flex-col items-center gap-4 px-4 text-center text-sm text-muted-foreground md:flex-row md:justify-between">
          <p>Made with ❤️ by <a href="https://ummah.build" target="_blank" rel="noopener noreferrer" className="font-medium text-foreground underline">Ummah Build</a></p>
          <div className="flex items-center gap-4">
            <Link to="/blogs" className="transition-colors hover:text-foreground">Blog</Link>
            <Link to="/guides" className="transition-colors hover:text-foreground">Guides</Link>
            <Link to="/legal" className="transition-colors hover:text-foreground">Legal</Link>
          </div>
          <p>© {new Date().getFullYear()} HabibiChill.com</p>
        </div>
      </footer>
    </div>
  );
};

export default GuidesPage;
