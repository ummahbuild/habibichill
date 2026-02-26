import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import HomeTab from "@/components/tabs/HomeTab";
import LearnTab from "@/components/tabs/LearnTab";
import TrackTab from "@/components/tabs/TrackTab";
import ProfileTab from "@/components/tabs/ProfileTab";
import EmergencyFlow from "@/components/EmergencyFlow";

const tabs = [
  { id: "home", label: "Home", icon: "🏠" },
  { id: "learn", label: "Learn", icon: "📖" },
  { id: "track", label: "Track", icon: "📊" },
  { id: "profile", label: "Profile", icon: "👤" },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [showEmergency, setShowEmergency] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      <main className="flex-1">
        {activeTab === "home" && <HomeTab onEmergency={() => setShowEmergency(true)} />}
        {activeTab === "learn" && <LearnTab />}
        {activeTab === "track" && <TrackTab />}
        {activeTab === "profile" && <ProfileTab />}
      </main>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-md safe-area-bottom" aria-label="App navigation">
        <div className="mx-auto flex max-w-lg items-center justify-around py-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-0.5 rounded-xl px-4 py-2 text-xs font-medium transition-colors ${
                activeTab === tab.id ? "text-primary" : "text-muted-foreground"
              }`}
              aria-label={tab.label}
              aria-current={activeTab === tab.id ? "page" : undefined}
            >
              <span className="text-xl">{tab.icon}</span>
              {tab.label}
            </button>
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
