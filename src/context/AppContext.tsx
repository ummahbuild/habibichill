import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type AppState = "landing" | "onboarding" | "app";

interface OnboardingData {
  topTrigger: string;
  reciter: string;
  notifications: boolean;
}

interface AppContextType {
  appState: AppState;
  setAppState: (state: AppState) => void;
  onboardingData: OnboardingData;
  setOnboardingData: (data: OnboardingData) => void;
  sabrPoints: number;
  addSabrPoints: (points: number) => void;
  streak: number;
  angerLog: AngerEntry[];
  addAngerEntry: (entry: Omit<AngerEntry, "id" | "date">) => void;
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
}

export interface AngerEntry {
  id: string;
  date: string;
  trigger: string;
  intensity: number;
  controlled: boolean;
  situation: string;
  reflection?: string;
}

export interface AppSettings {
  fontSize: "small" | "medium" | "large";
  reducedMotion: boolean;
  highContrast: boolean;
  darkMode: boolean;
}

const defaultSettings: AppSettings = {
  fontSize: "medium",
  reducedMotion: false,
  highContrast: false,
  darkMode: false,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [appState, setAppStateInternal] = useState<AppState>(() => {
    const saved = localStorage.getItem("hc-app-state");
    return (saved as AppState) || "landing";
  });

  const [onboardingData, setOnboardingDataInternal] = useState<OnboardingData>(() => {
    const saved = localStorage.getItem("hc-onboarding");
    return saved ? JSON.parse(saved) : { topTrigger: "", reciter: "", notifications: false };
  });

  const [sabrPoints, setSabrPoints] = useState(() => {
    return parseInt(localStorage.getItem("hc-sabr-points") || "0");
  });

  const [streak, setStreak] = useState(() => {
    return parseInt(localStorage.getItem("hc-streak") || "0");
  });

  const [angerLog, setAngerLog] = useState<AngerEntry[]>(() => {
    const saved = localStorage.getItem("hc-anger-log");
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem("hc-settings");
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });

  const setAppState = (state: AppState) => {
    setAppStateInternal(state);
    localStorage.setItem("hc-app-state", state);
  };

  const setOnboardingData = (data: OnboardingData) => {
    setOnboardingDataInternal(data);
    localStorage.setItem("hc-onboarding", JSON.stringify(data));
  };

  const addSabrPoints = (points: number) => {
    setSabrPoints((prev) => {
      const next = prev + points;
      localStorage.setItem("hc-sabr-points", String(next));
      return next;
    });
  };

  const addAngerEntry = (entry: Omit<AngerEntry, "id" | "date">) => {
    const newEntry: AngerEntry = {
      ...entry,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };
    setAngerLog((prev) => {
      const next = [newEntry, ...prev];
      localStorage.setItem("hc-anger-log", JSON.stringify(next));
      return next;
    });
    if (entry.controlled) {
      addSabrPoints(10);
      setStreak((prev) => {
        const next = prev + 1;
        localStorage.setItem("hc-streak", String(next));
        return next;
      });
    }
  };

  const updateSettings = (partial: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      localStorage.setItem("hc-settings", JSON.stringify(next));
      return next;
    });
  };

  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settings.darkMode]);

  useEffect(() => {
    const root = document.documentElement;
    const sizes = { small: "14px", medium: "16px", large: "18px" };
    root.style.fontSize = sizes[settings.fontSize];
  }, [settings.fontSize]);

  return (
    <AppContext.Provider
      value={{
        appState,
        setAppState,
        onboardingData,
        setOnboardingData,
        sabrPoints,
        addSabrPoints,
        streak,
        angerLog,
        addAngerEntry,
        settings,
        updateSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
