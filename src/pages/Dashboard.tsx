import React, { useState, useMemo, lazy, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useApp } from "@/context/AppContext";
import HomeTab from "@/components/tabs/HomeTab";
import PwaInstallPrompt from "@/components/PwaInstallPrompt";

// Lazy-load heavy tab content and modals
const QuranSunnahTab = lazy(() => import("@/components/tabs/QuranSunnahTab"));
const LearnTab = lazy(() => import("@/components/tabs/LearnTab"));
const MeTab = lazy(() => import("@/components/tabs/MeTab"));
const EmergencyFlow = lazy(() => import("@/components/EmergencyFlow"));
const QuranPlayer = lazy(() => import("@/components/QuranPlayer"));
const DhikrCounter = lazy(() => import("@/components/DhikrCounter"));
const WuduGuide = lazy(() => import("@/components/WuduGuide"));
const AngerJournal = lazy(() => import("@/components/AngerJournal"));
const SituationGuide = lazy(() => import("@/components/SituationGuide"));
const SilenceTimer = lazy(() => import("@/components/SilenceTimer"));
const BreathingExercise = lazy(() => import("@/components/BreathingExercise"));
const PrayerTimes = lazy(() => import("@/components/PrayerTimes"));

const tabs = [
  { id: "home", label: "Home", icon: "🏠" },
  { id: "quran", label: "Quran", icon: "📖" },
  { id: "learn", label: "Learn", icon: "🧠" },
  { id: "me", label: "Me", icon: "👤" },
];

const TabFallback = () => (
  <div className="flex items-center justify-center py-20">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
  </div>
);

const ModalFallback = () => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    <p className="mt-3 text-sm text-muted-foreground">Loading...</p>
  </div>
);

const Dashboard = () => {
  const { logActivity } = useApp();
  const [activeTab, setActiveTab] = useState("home");
  const [showEmergency, setShowEmergency] = useState(false);
  const [playingSurah, setPlayingSurah] = useState<string | null>(null);
  const [showDhikr, setShowDhikr] = useState(false);
  const [showWudu, setShowWudu] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [showSituations, setShowSituations] = useState(false);
  const [showSilenceTimer, setShowSilenceTimer] = useState(false);
  const [showBreathing, setShowBreathing] = useState(false);
  const [showPrayer, setShowPrayer] = useState(false);
  const [initialReadSurah, setInitialReadSurah] = useState<number | null>(null);

  const shortcuts = useMemo(() => [
    { key: "f", handler: () => setShowEmergency(true) },
    { key: "1", handler: () => setActiveTab("home") },
    { key: "2", handler: () => setActiveTab("quran") },
    { key: "3", handler: () => setActiveTab("learn") },
    { key: "4", handler: () => setActiveTab("me") },
  ], []);

  useKeyboardShortcuts(shortcuts);

  // Activity-logging wrappers
  const handleOpenDhikr = () => { setShowDhikr(true); logActivity("dhikr", "Opened Dhikr Counter"); };
  const handleOpenWudu = () => { setShowWudu(true); logActivity("wudu", "Opened Wudu Guide"); };
  const handleOpenSilence = () => { setShowSilenceTimer(true); logActivity("silence", "Started Silence Timer"); };
  const handleOpenBreathing = () => { setShowBreathing(true); logActivity("breathing", "Started Breathing Exercise"); };
  const handleOpenJournal = () => { setShowJournal(true); };
  const handleOpenSituations = () => { setShowSituations(true); };
  const handleOpenPrayer = () => { setShowPrayer(true); };
  const handlePlayQuran = (surahId: string) => { setPlayingSurah(surahId); logActivity("quran_listen", `Surah ${surahId}`); };
  const handleNavigateToRead = (surahId: number) => {
    setInitialReadSurah(surahId);
    setActiveTab("quran");
    logActivity("reading", `Surah ${surahId}`);
  };

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
                onPlayQuran={handlePlayQuran}
                onNavigateToRead={handleNavigateToRead}
                onOpenDhikr={handleOpenDhikr}
                onOpenWudu={handleOpenWudu}
                onOpenJournal={handleOpenJournal}
                onOpenSituations={handleOpenSituations}
                onOpenSilenceTimer={handleOpenSilence}
                onOpenBreathing={handleOpenBreathing}
                onOpenPrayer={handleOpenPrayer}
              />
            )}
            {activeTab === "quran" && (
              <Suspense fallback={<TabFallback />}>
                <QuranSunnahTab
                  onPlayQuran={handlePlayQuran}
                  initialReadSurah={initialReadSurah}
                  onClearInitialRead={() => setInitialReadSurah(null)}
                  playingSurahId={playingSurah}
                />
              </Suspense>
            )}
            {activeTab === "learn" && (
              <Suspense fallback={<TabFallback />}>
                <LearnTab />
              </Suspense>
            )}
            {activeTab === "me" && (
              <Suspense fallback={<TabFallback />}>
                <MeTab />
              </Suspense>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Quran Player */}
      <AnimatePresence>
        {playingSurah && (
          <Suspense fallback={null}>
            <QuranPlayer
              currentSurahId={playingSurah}
              onChangeSurah={setPlayingSurah}
              onClose={() => setPlayingSurah(null)}
            />
          </Suspense>
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
        {showEmergency && (
          <Suspense fallback={<ModalFallback />}>
            <EmergencyFlow onClose={() => setShowEmergency(false)} />
          </Suspense>
        )}
        {showDhikr && (
          <Suspense fallback={<ModalFallback />}>
            <DhikrCounter onClose={() => setShowDhikr(false)} />
          </Suspense>
        )}
        {showWudu && (
          <Suspense fallback={<ModalFallback />}>
            <WuduGuide onClose={() => setShowWudu(false)} />
          </Suspense>
        )}
        {showJournal && (
          <Suspense fallback={<ModalFallback />}>
            <AngerJournal onClose={() => setShowJournal(false)} />
          </Suspense>
        )}
        {showSituations && (
          <Suspense fallback={<ModalFallback />}>
            <SituationGuide onClose={() => setShowSituations(false)} />
          </Suspense>
        )}
        {showSilenceTimer && (
          <Suspense fallback={<ModalFallback />}>
            <SilenceTimer onClose={() => setShowSilenceTimer(false)} />
          </Suspense>
        )}
        {showBreathing && (
          <Suspense fallback={<ModalFallback />}>
            <BreathingExercise onClose={() => setShowBreathing(false)} />
          </Suspense>
        )}
        {showPrayer && (
          <Suspense fallback={<ModalFallback />}>
            <PrayerTimes onClose={() => setShowPrayer(false)} />
          </Suspense>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
