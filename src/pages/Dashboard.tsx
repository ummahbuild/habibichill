import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HomeTab from "@/components/tabs/HomeTab";
import QuranSunnahTab from "@/components/tabs/QuranSunnahTab";
import LearnTab from "@/components/tabs/LearnTab";
import TrackTab from "@/components/tabs/TrackTab";
import ProfileTab from "@/components/tabs/ProfileTab";
import EmergencyFlow from "@/components/EmergencyFlow";
import QuranPlayer from "@/components/QuranPlayer";
import DhikrCounter from "@/components/DhikrCounter";
import WuduGuide from "@/components/WuduGuide";
import AngerJournal from "@/components/AngerJournal";
import SituationGuide from "@/components/SituationGuide";

const tabs = [
  { id: "home", label: "Home", icon: "🏠" },
  { id: "quran", label: "Quran", icon: "📖" },
  { id: "learn", label: "Learn", icon: "🧠" },
  { id: "track", label: "Track", icon: "📊" },
  { id: "profile", label: "Profile", icon: "👤" },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [showEmergency, setShowEmergency] = useState(false);
  const [playingSurah, setPlayingSurah] = useState<string | null>(null);
  const [showDhikr, setShowDhikr] = useState(false);
  const [showWudu, setShowWudu] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [showSituations, setShowSituations] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background pb-24">
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
                onOpenDhikr={() => setShowDhikr(true)}
                onOpenWudu={() => setShowWudu(true)}
                onOpenJournal={() => setShowJournal(true)}
                onOpenSituations={() => setShowSituations(true)}
              />
            )}
            {activeTab === "quran" && (
              <QuranSunnahTab onPlayQuran={(surahId) => setPlayingSurah(surahId)} />
            )}
            {activeTab === "learn" && <LearnTab />}
            {activeTab === "track" && <TrackTab />}
            {activeTab === "profile" && <ProfileTab />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Quran Player - sticky above navbar */}
      <AnimatePresence>
        {playingSurah && (
          <QuranPlayer
            currentSurahId={playingSurah}
            onChangeSurah={setPlayingSurah}
            onClose={() => setPlayingSurah(null)}
          />
        )}
      </AnimatePresence>

      {/* Bottom Tab Bar with center emergency button */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-md safe-area-bottom"
        aria-label="App navigation"
      >
        <div className="mx-auto flex max-w-lg items-center justify-around py-1.5">
          {tabs.map((tab, i) => (
            <React.Fragment key={tab.id}>
              {i === 2 && (
                <div className="relative -mt-7">
                  <motion.button
                    onClick={() => setShowEmergency(true)}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive text-2xl shadow-lg ring-4 ring-background transition-shadow hover:shadow-xl"
                    whileTap={{ scale: 0.9 }}
                    aria-label="I'm Angry — Start emergency calming protocol"
                  >
                    <span className="animate-pulse-gentle">🔥</span>
                  </motion.button>
                </div>
              )}
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 text-[10px] font-medium transition-colors ${
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

      <AnimatePresence>
        {showEmergency && <EmergencyFlow onClose={() => setShowEmergency(false)} />}
        {showDhikr && <DhikrCounter onClose={() => setShowDhikr(false)} />}
        {showWudu && <WuduGuide onClose={() => setShowWudu(false)} />}
        {showJournal && <AngerJournal onClose={() => setShowJournal(false)} />}
        {showSituations && <SituationGuide onClose={() => setShowSituations(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
