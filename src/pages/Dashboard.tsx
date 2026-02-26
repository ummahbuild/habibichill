import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HomeTab from "@/components/tabs/HomeTab";
import LearnTab from "@/components/tabs/LearnTab";
import TrackTab from "@/components/tabs/TrackTab";
import ProfileTab from "@/components/tabs/ProfileTab";
import EmergencyFlow from "@/components/EmergencyFlow";
import QuranPlayer from "@/components/QuranPlayer";

const tabs = [
  { id: "home", label: "Home", icon: "🏠" },
  { id: "learn", label: "Learn", icon: "📖" },
  { id: "track", label: "Track", icon: "📊" },
  { id: "profile", label: "Profile", icon: "👤" },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [showEmergency, setShowEmergency] = useState(false);
  const [playingSurah, setPlayingSurah] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen flex-col bg-background pb-28">
      <main className="flex-1">
        {activeTab === "home" && <HomeTab onPlayQuran={(surahId) => setPlayingSurah(surahId)} />}
        {activeTab === "learn" && <LearnTab />}
        {activeTab === "track" && <TrackTab />}
        {activeTab === "profile" && <ProfileTab />}
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
        <div className="mx-auto flex max-w-lg items-center justify-around py-2">
          {tabs.map((tab, i) => (
            <React.Fragment key={tab.id}>
              {i === 2 && (
                /* Center emergency button */
                <div className="relative -mt-8">
                  <motion.button
                    onClick={() => setShowEmergency(true)}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive text-3xl shadow-lg ring-4 ring-background transition-shadow hover:shadow-xl"
                    whileTap={{ scale: 0.9 }}
                    aria-label="I'm Angry — Start emergency calming protocol"
                  >
                    <span className="animate-pulse-gentle">🔥</span>
                  </motion.button>
                </div>
              )}
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                  activeTab === tab.id ? "text-primary" : "text-muted-foreground"
                }`}
                aria-label={tab.label}
                aria-current={activeTab === tab.id ? "page" : undefined}
              >
                <span className="text-xl">{tab.icon}</span>
                {tab.label}
              </button>
            </React.Fragment>
          ))}
        </div>
      </nav>

      <AnimatePresence>
        {showEmergency && <EmergencyFlow onClose={() => setShowEmergency(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
