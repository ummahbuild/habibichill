import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type AppState = "landing" | "onboarding" | "app";

interface OnboardingData {
  topTrigger: string;
  reciter: string;
  notifications: boolean;
  isMuslim: boolean;
}

export interface ActivityEntry {
  id: string;
  date: string;
  type: "breathing" | "silence" | "wudu" | "dhikr" | "reading" | "learning" | "mood_checkin" | "prayer" | "quran_listen";
  details?: string;
  durationSeconds?: number;
  journalNote?: string;
}

export interface PrayerEntry {
  id: string;
  date: string;
  prayer: "Fajr" | "Dhuhr" | "Asr" | "Maghrib" | "Isha";
  completed: boolean;
  journalNote?: string;
  toolsUsed?: string[];
}

export interface PrayerSettings {
  latitude: number | null;
  longitude: number | null;
  city: string;
  country: string;
  method: number;
  autoDetect: boolean;
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
  bookmarks: Bookmark[];
  addBookmark: (bookmark: Omit<Bookmark, "id" | "savedAt">) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (contentId: string) => boolean;
  moodLog: MoodEntry[];
  addMoodEntry: (mood: number, note?: string) => void;
  updateMoodEntry: (id: string, mood: number, note?: string) => void;
  deleteMoodEntry: (id: string) => void;
  activityLog: ActivityEntry[];
  logActivity: (type: ActivityEntry["type"], details?: string, durationSeconds?: number) => void;
  prayerLog: PrayerEntry[];
  logPrayer: (prayer: PrayerEntry["prayer"], journalNote?: string, toolsUsed?: string[]) => void;
  prayerSettings: PrayerSettings;
  updatePrayerSettings: (settings: Partial<PrayerSettings>) => void;
}

export interface AngerEntry {
  id: string;
  date: string;
  trigger: string;
  intensity: number;
  controlled: boolean;
  situation: string;
  reflection?: string;
  tacticsUsed?: string[];
  durationSeconds?: number;
}

export interface Bookmark {
  id: string;
  savedAt: string;
  type: "ayah" | "hadith" | "dua";
  contentId: string;
  title: string;
  arabic?: string;
  english: string;
  source: string;
  link?: string;
}

export interface MoodEntry {
  id: string;
  date: string;
  mood: number;
  note?: string;
  timeOfDay?: string;
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

const defaultPrayerSettings: PrayerSettings = {
  latitude: null,
  longitude: null,
  city: "",
  country: "",
  method: 2, // ISNA
  autoDetect: true,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [appState, setAppStateInternal] = useState<AppState>(() => {
    const saved = localStorage.getItem("hc-app-state");
    return (saved as AppState) || "landing";
  });

  const [onboardingData, setOnboardingDataInternal] = useState<OnboardingData>(() => {
    const saved = localStorage.getItem("hc-onboarding");
    return saved ? JSON.parse(saved) : { topTrigger: "", reciter: "", notifications: false, isMuslim: true };
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

  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    const saved = localStorage.getItem("hc-bookmarks");
    return saved ? JSON.parse(saved) : [];
  });

  const [moodLog, setMoodLog] = useState<MoodEntry[]>(() => {
    const saved = localStorage.getItem("hc-mood-log");
    return saved ? JSON.parse(saved) : [];
  });

  const [activityLog, setActivityLog] = useState<ActivityEntry[]>(() => {
    const saved = localStorage.getItem("hc-activity-log");
    return saved ? JSON.parse(saved) : [];
  });

  const [prayerLog, setPrayerLog] = useState<PrayerEntry[]>(() => {
    const saved = localStorage.getItem("hc-prayer-log");
    return saved ? JSON.parse(saved) : [];
  });

  const [prayerSettings, setPrayerSettings] = useState<PrayerSettings>(() => {
    const saved = localStorage.getItem("hc-prayer-settings");
    return saved ? { ...defaultPrayerSettings, ...JSON.parse(saved) } : defaultPrayerSettings;
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

  const addBookmark = (bookmark: Omit<Bookmark, "id" | "savedAt">) => {
    setBookmarks((prev) => {
      if (prev.some((b) => b.contentId === bookmark.contentId)) return prev;
      const next = [{ ...bookmark, id: crypto.randomUUID(), savedAt: new Date().toISOString() }, ...prev];
      localStorage.setItem("hc-bookmarks", JSON.stringify(next));
      return next;
    });
  };

  const removeBookmark = (id: string) => {
    setBookmarks((prev) => {
      const next = prev.filter((b) => b.id !== id);
      localStorage.setItem("hc-bookmarks", JSON.stringify(next));
      return next;
    });
  };

  const isBookmarked = (contentId: string) => bookmarks.some((b) => b.contentId === contentId);

  const addMoodEntry = (mood: number, note?: string) => {
    const now = new Date();
    const hour = now.getHours();
    const timeOfDay = hour < 6 ? "night" : hour < 12 ? "morning" : hour < 17 ? "afternoon" : hour < 21 ? "evening" : "night";
    setMoodLog((prev) => {
      const next = [{ id: crypto.randomUUID(), date: now.toISOString(), mood, note, timeOfDay }, ...prev];
      localStorage.setItem("hc-mood-log", JSON.stringify(next));
      return next;
    });
    // Also log as activity
    logActivity("mood_checkin", `Mood: ${mood}/5${note ? ` — ${note}` : ""}`);
  };

  const updateMoodEntry = (id: string, mood: number, note?: string) => {
    setMoodLog((prev) => {
      const next = prev.map((e) => e.id === id ? { ...e, mood, note } : e);
      localStorage.setItem("hc-mood-log", JSON.stringify(next));
      return next;
    });
  };

  const deleteMoodEntry = (id: string) => {
    setMoodLog((prev) => {
      const next = prev.filter((e) => e.id !== id);
      localStorage.setItem("hc-mood-log", JSON.stringify(next));
      return next;
    });
  };

  const logActivity = (type: ActivityEntry["type"], details?: string, durationSeconds?: number) => {
    setActivityLog((prev) => {
      const entry: ActivityEntry = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        type,
        details,
        durationSeconds,
      };
      const next = [entry, ...prev].slice(0, 500); // Keep last 500
      localStorage.setItem("hc-activity-log", JSON.stringify(next));
      return next;
    });
  };

  const logPrayer = (prayer: PrayerEntry["prayer"], journalNote?: string, toolsUsed?: string[]) => {
    setPrayerLog((prev) => {
      const entry: PrayerEntry = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        prayer,
        completed: true,
        journalNote,
        toolsUsed,
      };
      const next = [entry, ...prev].slice(0, 500);
      localStorage.setItem("hc-prayer-log", JSON.stringify(next));
      return next;
    });
    addSabrPoints(5);
    logActivity("prayer", prayer);
  };

  const updatePrayerSettings = (partial: Partial<PrayerSettings>) => {
    setPrayerSettings((prev) => {
      const next = { ...prev, ...partial };
      localStorage.setItem("hc-prayer-settings", JSON.stringify(next));
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
        bookmarks,
        addBookmark,
        removeBookmark,
        isBookmarked,
        moodLog,
        addMoodEntry,
        updateMoodEntry,
        deleteMoodEntry,
        activityLog,
        logActivity,
        prayerLog,
        logPrayer,
        prayerSettings,
        updatePrayerSettings,
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
