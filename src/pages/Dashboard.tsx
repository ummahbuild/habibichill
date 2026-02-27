import React, { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import HomeTab from "@/components/tabs/HomeTab";
import QuranSunnahTab from "@/components/tabs/QuranSunnahTab";
import LearnTab from "@/components/tabs/LearnTab";
import MeTab from "@/components/tabs/MeTab";
import EmergencyFlow from "@/components/EmergencyFlow";
import QuranPlayer from "@/components/QuranPlayer";
import DhikrCounter from "@/components/DhikrCounter";
import WuduGuide from "@/components/WuduGuide";
import AngerJournal from "@/components/AngerJournal";
import SituationGuide from "@/components/SituationGuide";
import SilenceTimer from "@/components/SilenceTimer";
import BreathingExercise from "@/components/BreathingExercise";
import PwaInstallPrompt from "@/components/PwaInstallPrompt";

const tabs = [
  { id: "home", label: "Home", icon: "🏠" },
  { id: "quran", label: "Quran", icon: "📖" },
  { id: "learn", label: "Learn", icon: "🧠" },
  { id: "me", label: "Me", icon: "👤" },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [showEmergency, setShowEmergency] = useState(false);
  const [playingSurah, setPlayingSurah] = useState<string | null>(null);
  const [showDhikr, setShowDhikr] = useState(false);
  const [showWudu, setShowWudu] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [showSituations, setShowSituations] = useState(false);
  const [showSilenceTimer, setShowSilenceTimer] = useState(false);
  const [showBreathing, setShowBreathing] = useState(false);
  const [initialReadSurah, setInitialReadSurah] = useState<number | null>(null);

  const shortcuts = useMemo(() => [
    { key: "f", handler: () => setShowEmergency(true) },
    { key: "1", handler: () => setActiveTab("home") },
    { key: "2", handler: () => setActiveTab("quran") },
    { key: "3", handler: () => setActiveTab("learn") },
    { key: "4", handler: () => setActiveTab("me") },
  ], []);

  useKeyboardShortcuts(shortcuts);

  return (
    <div className="flex min-h-screen flex-col bg-background pb-32">
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === "home" && (
              <HomeTab
                onPlayQuran={(surahId) => setPlayingSurah(surahId)}
                onNavigateToRead={(surahId) => {
                  setInitialReadSurah(surahId);
                  setActiveTab("quran");
                }}
                onOpenDhikr={() => setShowDhikr(true)}
                onOpenWudu={() => setShowWudu(true)}
                onOpenJournal={() => setShowJournal(true)}
                onOpenSituations={() => setShowSituations(true)}
                onOpenSilenceTimer={() => setShowSilenceTimer(true)}
                onOpenBreathing={() => setShowBreathing(true)}
              />
            )}
            {activeTab === "quran" && (
              <QuranSunnahTab
                onPlayQuran={(surahId) => setPlayingSurah(surahId)}
                initialReadSurah={initialReadSurah}
                onClearInitialRead={() => setInitialReadSurah(null)}
              />
            )}
            {activeTab === "learn" && <LearnTab />}
            {activeTab === "me" && <MeTab />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Quran Player */}
      <AnimatePresence>
        {playingSurah && (
          <QuranPlayer
            currentSurahId={playingSurah}
            onChangeSurah={setPlayingSurah}
            onClose={() => setPlayingSurah(null)}
          />
        )}
      </AnimatePresence>

      {/* Bottom Tab Bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-md safe-area-bottom"
        aria-label="App navigation"
      >
        <div className="mx-auto flex max-w-lg items-center justify-around py-1.5">
          {tabs.map((tab, i) => (
            <React.Fragment key={tab.id}>
              {i === 2 && (
                <div className="relative -mt-7 flex flex-col items-center">
                  <motion.button
                    onClick={() => setShowEmergency(true)}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive text-2xl shadow-lg ring-4 ring-background transition-shadow hover:shadow-xl"
                    whileTap={{ scale: 0.9 }}
                    aria-label="I'm Angry — Start emergency calming protocol"
                  >
                    <span className="animate-pulse-gentle">🔥</span>
                  </motion.button>
                  <span className="mt-0.5 text-[9px] font-bold uppercase tracking-widest text-destructive">Chill</span>
                </div>
              )}
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[10px] font-medium transition-colors ${
                  activeTab === tab.id ? "text-primary" : "text-muted-foreground"
                }`}
                aria-label={tab.label}
                aria-current={activeTab === tab.id ? "page" : undefined}
              >
                <span className={`text-lg transition-transform ${activeTab === tab.id ? "scale-110" : ""}`}>{tab.icon}</span>
                {tab.label}
              </button>
            </React.Fragment>
          ))}
        </div>
      </nav>

      <PwaInstallPrompt />

      <AnimatePresence>
        {showEmergency && <EmergencyFlow onClose={() => setShowEmergency(false)} />}
        {showDhikr && <DhikrCounter onClose={() => setShowDhikr(false)} />}
        {showWudu && <WuduGuide onClose={() => setShowWudu(false)} />}
        {showJournal && <AngerJournal onClose={() => setShowJournal(false)} />}
        {showSituations && <SituationGuide onClose={() => setShowSituations(false)} />}
        {showSilenceTimer && <SilenceTimer onClose={() => setShowSilenceTimer(false)} />}
        {showBreathing && <BreathingExercise onClose={() => setShowBreathing(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
