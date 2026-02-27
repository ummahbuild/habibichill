import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, MapPin, Search, Settings, Check, ChevronDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const PRAYER_NAMES = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
const PRAYER_EMOJIS: Record<string, string> = { Fajr: "🌅", Dhuhr: "☀️", Asr: "🌤️", Maghrib: "🌅", Isha: "🌙" };

const CALCULATION_METHODS = [
  { id: 1, name: "University of Islamic Sciences, Karachi" },
  { id: 2, name: "Islamic Society of North America (ISNA)" },
  { id: 3, name: "Muslim World League (MWL)" },
  { id: 4, name: "Umm Al-Qura University, Makkah" },
  { id: 5, name: "Egyptian General Authority of Survey" },
  { id: 7, name: "Institute of Geophysics, University of Tehran" },
  { id: 8, name: "Gulf Region" },
  { id: 9, name: "Kuwait" },
  { id: 10, name: "Qatar" },
  { id: 11, name: "Majlis Ugama Islam Singapura" },
  { id: 12, name: "UOIF (France)" },
  { id: 13, name: "Diyanet İşleri Başkanlığı (Turkey)" },
  { id: 14, name: "Spiritual Administration of Muslims of Russia" },
  { id: 15, name: "Moonsighting Committee" },
];

interface PrayerTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  Sunrise: string;
  Sunset: string;
}

interface PrayerTimesProps {
  onClose: () => void;
}

const PrayerTimesComponent = ({ onClose }: PrayerTimesProps) => {
  const { prayerSettings, updatePrayerSettings, prayerLog, logPrayer, activityLog } = useApp();
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [showJournal, setShowJournal] = useState<typeof PRAYER_NAMES[number] | null>(null);
  const [journalNote, setJournalNote] = useState("");
  const [selectedTools, setSelectedTools] = useState<string[]>([]);

  // Get today's logged prayers
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayPrayers = prayerLog.filter((p) => p.date.slice(0, 10) === todayStr);
  const isPrayerDone = (name: string) => todayPrayers.some((p) => p.prayer === name);

  // Recent tools used today for prefill
  const todayActivities = activityLog.filter((a) => a.date.slice(0, 10) === todayStr);
  const recentTools = [...new Set(todayActivities.map((a) => a.type).filter((t) => t !== "prayer" && t !== "mood_checkin"))];
  const toolLabels: Record<string, string> = {
    breathing: "🌊 Breathing",
    silence: "🤫 Silence",
    wudu: "💧 Wudu",
    dhikr: "📿 Dhikr",
    reading: "📜 Quran Reading",
    quran_listen: "🎧 Quran Listening",
    learning: "🧠 Learning",
  };

  // Auto-detect location on first load
  const detectLocation = useCallback(async () => {
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();
      if (data.latitude && data.longitude) {
        updatePrayerSettings({
          latitude: data.latitude,
          longitude: data.longitude,
          city: data.city || "",
          country: data.country_name || "",
          autoDetect: true,
        });
        return { lat: data.latitude, lng: data.longitude };
      }
    } catch {}
    return null;
  }, [updatePrayerSettings]);

  const fetchPrayerTimes = useCallback(async (lat: number, lng: number, method: number) => {
    setLoading(true);
    setError(false);
    try {
      const today = new Date();
      const dateStr = `${String(today.getDate()).padStart(2, "0")}-${String(today.getMonth() + 1).padStart(2, "0")}-${today.getFullYear()}`;
      const res = await fetch(
        `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lng}&method=${method}`
      );
      const data = await res.json();
      if (data.data?.timings) {
        setPrayerTimes({
          Fajr: data.data.timings.Fajr,
          Dhuhr: data.data.timings.Dhuhr,
          Asr: data.data.timings.Asr,
          Maghrib: data.data.timings.Maghrib,
          Isha: data.data.timings.Isha,
          Sunrise: data.data.timings.Sunrise,
          Sunset: data.data.timings.Sunset,
        });
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const init = async () => {
      if (prayerSettings.latitude && prayerSettings.longitude) {
        await fetchPrayerTimes(prayerSettings.latitude, prayerSettings.longitude, prayerSettings.method);
      } else if (prayerSettings.autoDetect) {
        const loc = await detectLocation();
        if (loc) {
          await fetchPrayerTimes(loc.lat, loc.lng, prayerSettings.method);
        } else {
          setLoading(false);
          setShowSettings(true);
        }
      } else {
        setLoading(false);
        setShowSettings(true);
      }
    };
    init();
  }, [prayerSettings.latitude, prayerSettings.longitude, prayerSettings.method, prayerSettings.autoDetect, fetchPrayerTimes, detectLocation]);

  const searchCity = async () => {
    if (!citySearch.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(citySearch)}&country=&method=${prayerSettings.method}`);
      const data = await res.json();
      if (data.data?.timings && data.data?.meta) {
        updatePrayerSettings({
          latitude: data.data.meta.latitude,
          longitude: data.data.meta.longitude,
          city: citySearch,
          country: "",
          autoDetect: false,
        });
        setPrayerTimes({
          Fajr: data.data.timings.Fajr,
          Dhuhr: data.data.timings.Dhuhr,
          Asr: data.data.timings.Asr,
          Maghrib: data.data.timings.Maghrib,
          Isha: data.data.timings.Isha,
          Sunrise: data.data.timings.Sunrise,
          Sunset: data.data.timings.Sunset,
        });
        setShowSettings(false);
      }
    } catch {}
    setLoading(false);
  };

  // Determine current/next prayer
  const getCurrentPrayer = (): { current: string | null; next: string | null } => {
    if (!prayerTimes) return { current: null, next: null };
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const toMin = (t: string) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };
    const times = PRAYER_NAMES.map((n) => ({ name: n, min: toMin(prayerTimes[n]) }));
    let current: string | null = null;
    let next: string | null = null;
    for (let i = times.length - 1; i >= 0; i--) {
      if (nowMin >= times[i].min) {
        current = times[i].name;
        next = i < times.length - 1 ? times[i + 1].name : null;
        break;
      }
    }
    if (!current) {
      next = times[0].name;
    }
    return { current, next };
  };

  const { current: currentPrayer, next: nextPrayer } = getCurrentPrayer();

  const handleMarkPrayer = (prayer: typeof PRAYER_NAMES[number]) => {
    if (isPrayerDone(prayer)) return;
    setShowJournal(prayer);
    setJournalNote("");
    setSelectedTools(recentTools.slice(0, 3));
  };

  const submitPrayerLog = () => {
    if (!showJournal) return;
    logPrayer(showJournal, journalNote || undefined, selectedTools.length > 0 ? selectedTools : undefined);
    setShowJournal(null);
    setJournalNote("");
    setSelectedTools([]);
  };

  const toggleTool = (tool: string) => {
    setSelectedTools((prev) => prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background overflow-y-auto"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <h1 className="font-heading text-lg font-bold text-foreground">🕌 Prayer Times</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Settings className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-4 py-4">
        {/* Location info - clickable to change */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="mb-4 flex w-full items-center gap-2 rounded-xl border border-border bg-card p-3 text-left hover:bg-muted/50 transition-colors"
        >
          <MapPin className="h-4 w-4 text-primary shrink-0" />
          <span className="text-sm text-foreground flex-1 truncate">
            {prayerSettings.city
              ? `${prayerSettings.city}${prayerSettings.country ? `, ${prayerSettings.country}` : ""}`
              : "Set your location"}
          </span>
          <span className="hidden sm:inline text-[10px] text-muted-foreground mr-1">
            {CALCULATION_METHODS.find((m) => m.id === prayerSettings.method)?.name.split(",")[0] || "ISNA"}
          </span>
          <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform shrink-0 ${showSettings ? "rotate-180" : ""}`} />
        </button>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-4 overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="p-4 space-y-4">
                {/* Auto-detect */}
                <button
                  onClick={async () => {
                    const loc = await detectLocation();
                    if (loc) {
                      await fetchPrayerTimes(loc.lat, loc.lng, prayerSettings.method);
                      setShowSettings(false);
                    }
                  }}
                  className="flex w-full items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 p-3 text-left text-sm font-medium text-foreground hover:bg-primary/10 transition-colors"
                >
                  <MapPin className="h-4 w-4 text-primary" />
                  Auto-detect my location
                </button>

                {/* City search */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Or search by city</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={citySearch}
                      onChange={(e) => setCitySearch(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && searchCity()}
                      placeholder="e.g., London, Dubai, New York"
                      className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <button
                      onClick={searchCity}
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground"
                    >
                      <Search className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Calculation method */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Calculation Method</label>
                  <select
                    value={prayerSettings.method}
                    onChange={(e) => updatePrayerSettings({ method: parseInt(e.target.value) })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {CALCULATION_METHODS.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading/Error */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-sm text-muted-foreground">Loading prayer times...</p>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="rounded-2xl border border-border bg-card p-6 text-center">
            <p className="text-muted-foreground mb-3">Could not load prayer times. Set your location in settings.</p>
            <button onClick={() => setShowSettings(true)} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
              Open Settings
            </button>
          </div>
        )}

        {/* Prayer Times List */}
        {prayerTimes && !loading && (
          <div className="space-y-2">
            {/* Next prayer highlight */}
            {nextPrayer && (
              <div className="mb-4 rounded-2xl border border-primary/30 bg-primary/5 p-4 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-1">Next Prayer</p>
                <p className="text-2xl mb-0.5">{PRAYER_EMOJIS[nextPrayer]}</p>
                <p className="font-heading text-lg font-bold text-foreground">{nextPrayer}</p>
                <p className="text-sm text-muted-foreground">{prayerTimes[nextPrayer as keyof PrayerTimes]}</p>
              </div>
            )}

            {PRAYER_NAMES.map((name) => {
              const done = isPrayerDone(name);
              const isCurrent = name === currentPrayer;
              const isNext = name === nextPrayer;
              const timeStr = prayerTimes[name];
              // Determine if past
              const now = new Date();
              const nowMin = now.getHours() * 60 + now.getMinutes();
              const [h, m] = timeStr.split(":").map(Number);
              const prayerMin = h * 60 + m;
              const isPast = nowMin > prayerMin && !isCurrent;

              return (
                <motion.div
                  key={name}
                  className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${
                    done ? "border-success/30 bg-success/5" :
                    isCurrent ? "border-primary/30 bg-primary/5" :
                    isNext ? "border-accent/30 bg-accent/5" :
                    isPast ? "border-border bg-muted/30 opacity-60" :
                    "border-border bg-card"
                  }`}
                >
                  <span className="text-xl">{PRAYER_EMOJIS[name]}</span>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${isCurrent ? "text-primary" : "text-foreground"}`}>
                      {name}
                      {isCurrent && <span className="ml-2 text-[10px] font-normal text-primary">Current</span>}
                    </p>
                    <p className="text-xs text-muted-foreground">{timeStr}</p>
                  </div>
                  {done ? (
                    <div className="flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1">
                      <Check className="h-3.5 w-3.5 text-success" />
                      <span className="text-[10px] font-medium text-success">Done</span>
                    </div>
                  ) : (
                    <Checkbox
                      checked={false}
                      onCheckedChange={() => handleMarkPrayer(name)}
                      className="h-5 w-5 rounded-md border-2 border-muted-foreground/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                  )}
                </motion.div>
              );
            })}

            {/* Today's summary */}
            <div className="mt-4 rounded-2xl border border-border bg-card p-4 text-center">
              <p className="text-sm font-medium text-foreground">
                Today: {todayPrayers.length}/5 prayers logged
              </p>
              <div className="mt-2 flex justify-center gap-2">
                {PRAYER_NAMES.map((name) => (
                  <span
                    key={name}
                    className={`text-lg ${isPrayerDone(name) ? "" : "opacity-20"}`}
                    title={name}
                  >
                    {PRAYER_EMOJIS[name]}
                  </span>
                ))}
              </div>
              {todayPrayers.length === 5 && (
                <p className="mt-2 text-xs text-success font-medium">MashaAllah! All prayers completed today 🎉</p>
              )}
            </div>

            {/* Recent prayer log */}
            {prayerLog.length > 0 && (
              <div className="mt-4">
                <h2 className="mb-2 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">Recent Prayer Log</h2>
                <div className="space-y-1.5">
                  {prayerLog.slice(0, 10).map((entry) => (
                    <div key={entry.id} className="flex items-center gap-2 rounded-lg border border-border bg-card p-2.5">
                      <span className="text-sm">{PRAYER_EMOJIS[entry.prayer]}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground">{entry.prayer}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(entry.date).toLocaleDateString()} · {new Date(entry.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      {entry.toolsUsed && entry.toolsUsed.length > 0 && (
                        <div className="flex gap-0.5">
                          {entry.toolsUsed.map((t) => (
                            <span key={t} className="text-[10px]">{toolLabels[t]?.slice(0, 2) || "🔧"}</span>
                          ))}
                        </div>
                      )}
                      {entry.journalNote && <span className="text-[10px] text-muted-foreground">📝</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Prayer Journal Dialog */}
      <Dialog open={!!showJournal} onOpenChange={(open) => !open && setShowJournal(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {showJournal && PRAYER_EMOJIS[showJournal]} Mark {showJournal} as Prayed
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Quick journal */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Quick reflection (optional)</label>
              <textarea
                value={journalNote}
                onChange={(e) => setJournalNote(e.target.value)}
                placeholder="How did you feel? Did it help with your emotions?"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                rows={3}
              />
            </div>

            {/* Tools used today — prefilled */}
            {Object.keys(toolLabels).length > 0 && (
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Tools used today</label>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(toolLabels).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => toggleTool(key)}
                      className={`rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-all ${
                        selectedTools.includes(key)
                          ? "bg-primary/10 border border-primary/30 text-primary"
                          : "border border-border text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setShowJournal(null)}
                className="flex-1 rounded-lg border border-border py-2.5 text-sm text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={submitPrayerLog}
                className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground"
              >
                Log Prayer ✓
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default PrayerTimesComponent;
