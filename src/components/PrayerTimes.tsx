import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, Settings, Check, ChevronDown } from "lucide-react";
import { localDateStr } from "@/lib/utils";
import ModalShell from "@/components/ModalShell";
import AngerNaflGuide from "@/components/AngerNaflGuide";
import PrayerSettingsPanel from "@/components/PrayerSettingsPanel";
import {
  PRAYER_NAMES,
  PRAYER_EMOJIS,
  applyOffset,
  clampOffset,
  formatOffsetLabel,
  getMethodLabel,
  parseTimeToMinutes,
  type PrayerName,
} from "@/data/prayerMethods";

interface ApiPrayerTimes {
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

const DOUBLE_TAP_MS = 320;

const PrayerTimesComponent = ({ onClose }: PrayerTimesProps) => {
  const { prayerSettings, updatePrayerSettings, prayerLog, logPrayer, activityLog } = useApp();
  const [rawTimes, setRawTimes] = useState<ApiPrayerTimes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showJournal, setShowJournal] = useState<PrayerName | null>(null);
  const [journalNote, setJournalNote] = useState("");
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [showNaflGuide, setShowNaflGuide] = useState(false);
  const [adjustPrayer, setAdjustPrayer] = useState<PrayerName | null>(null);
  const [hintPulse, setHintPulse] = useState(false);

  const fetchIdRef = useRef(0);
  const lastTapRef = useRef<{ name: PrayerName; at: number } | null>(null);

  const todayStr = localDateStr();
  const todayPrayers = prayerLog.filter((p) => p.date.slice(0, 10) === todayStr);
  const isPrayerDone = (name: string) => todayPrayers.some((p) => p.prayer === name);

  const todayActivities = activityLog.filter((a) => a.date.slice(0, 10) === todayStr);
  const toolLabels: Record<string, string> = {
    breathing: "🌊 Breathing",
    silence: "🤫 Silence",
    wudu: "💧 Wudu",
    dhikr: "📿 Dhikr",
    reading: "📜 Quran Reading",
    quran_listen: "🎧 Quran Listening",
    learning: "🧠 Learning",
    nafl: "🤲 2 Rakʿahs",
  };

  // Apply per-prayer offsets for display / current-next logic
  const prayerTimes = useMemo(() => {
    if (!rawTimes) return null;
    const offsets = prayerSettings.offsets || {};
    return {
      ...rawTimes,
      Fajr: applyOffset(rawTimes.Fajr, offsets.Fajr),
      Dhuhr: applyOffset(rawTimes.Dhuhr, offsets.Dhuhr),
      Asr: applyOffset(rawTimes.Asr, offsets.Asr),
      Maghrib: applyOffset(rawTimes.Maghrib, offsets.Maghrib),
      Isha: applyOffset(rawTimes.Isha, offsets.Isha),
    };
  }, [rawTimes, prayerSettings.offsets]);

  const fetchPrayerTimes = useCallback(async (lat: number, lng: number, method: number) => {
    const id = ++fetchIdRef.current;
    setLoading(true);
    setError(null);
    try {
      const today = new Date();
      const dateStr = `${String(today.getDate()).padStart(2, "0")}-${String(today.getMonth() + 1).padStart(2, "0")}-${today.getFullYear()}`;
      const res = await fetch(
        `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lng}&method=${method}`,
      );
      if (!res.ok) throw new Error("network");
      const data = await res.json();
      if (id !== fetchIdRef.current) return; // stale response
      if (data.data?.timings) {
        setRawTimes({
          Fajr: data.data.timings.Fajr,
          Dhuhr: data.data.timings.Dhuhr,
          Asr: data.data.timings.Asr,
          Maghrib: data.data.timings.Maghrib,
          Isha: data.data.timings.Isha,
          Sunrise: data.data.timings.Sunrise,
          Sunset: data.data.timings.Sunset,
        });
        setError(null);
      } else {
        setError("Couldn’t load prayer times for this location.");
      }
    } catch {
      if (id !== fetchIdRef.current) return;
      setError("Network error loading prayer times. Check connection or try another city.");
    } finally {
      if (id === fetchIdRef.current) setLoading(false);
    }
  }, []);

  const refreshFromSettings = useCallback(() => {
    if (prayerSettings.latitude != null && prayerSettings.longitude != null) {
      void fetchPrayerTimes(prayerSettings.latitude, prayerSettings.longitude, prayerSettings.method);
    }
  }, [prayerSettings.latitude, prayerSettings.longitude, prayerSettings.method, fetchPrayerTimes]);

  useEffect(() => {
    if (prayerSettings.latitude == null || prayerSettings.longitude == null) {
      // Keep attempting location setup only when missing coords
      const setup = async () => {
        if (!prayerSettings.autoDetect) {
          setLoading(false);
          setShowSettings(true);
          setError("Set your location to see prayer times.");
          return;
        }
        setLoading(true);
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
            return;
          }
        } catch {
          /* fall through */
        }
        setLoading(false);
        setShowSettings(true);
        setError("Set your location to see prayer times.");
      };
      void setup();
      return;
    }

    void fetchPrayerTimes(prayerSettings.latitude, prayerSettings.longitude, prayerSettings.method);
  }, [
    prayerSettings.latitude,
    prayerSettings.longitude,
    prayerSettings.method,
    prayerSettings.autoDetect,
    fetchPrayerTimes,
    updatePrayerSettings,
  ]);

  useEffect(() => {
    // Soft hint once per session
    try {
      if (!sessionStorage.getItem("hc-prayer-dbltap-hint")) {
        setHintPulse(true);
        sessionStorage.setItem("hc-prayer-dbltap-hint", "1");
        const t = window.setTimeout(() => setHintPulse(false), 5000);
        return () => clearTimeout(t);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const getCurrentPrayer = (): { current: PrayerName | null; next: PrayerName | null } => {
    if (!prayerTimes) return { current: null, next: null };
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const times = PRAYER_NAMES.map((n) => ({
      name: n,
      min: parseTimeToMinutes(prayerTimes[n]) ?? 0,
    }));
    let current: PrayerName | null = null;
    let next: PrayerName | null = null;
    for (let i = times.length - 1; i >= 0; i--) {
      if (nowMin >= times[i].min) {
        current = times[i].name;
        next = i < times.length - 1 ? times[i + 1].name : "Fajr";
        break;
      }
    }
    if (!current) {
      current = null;
      next = "Fajr";
    }
    return { current, next };
  };

  const { current: currentPrayer, next: nextPrayer } = getCurrentPrayer();

  const handleMarkPrayer = (prayer: PrayerName) => {
    if (isPrayerDone(prayer)) return;
    setShowJournal(prayer);
    setJournalNote("");
    const recent = [...new Set(todayActivities.map((a) => a.type).filter((t) => t !== "prayer" && t !== "mood_checkin"))];
    setSelectedTools(recent);
  };

  const submitPrayerLog = () => {
    if (!showJournal) return;
    logPrayer(showJournal, journalNote || undefined, selectedTools.length ? selectedTools : undefined);
    setShowJournal(null);
  };

  const toggleTool = (tool: string) => {
    setSelectedTools((prev) => (prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]));
  };

  const openAdjust = (name: PrayerName) => {
    setAdjustPrayer(name);
    setHintPulse(false);
  };

  const handleTimeInteraction = (name: PrayerName, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const now = Date.now();
    const last = lastTapRef.current;
    if (last && last.name === name && now - last.at < DOUBLE_TAP_MS) {
      lastTapRef.current = null;
      openAdjust(name);
      return;
    }
    lastTapRef.current = { name, at: now };
  };

  const adjustOffset = (delta: number) => {
    if (!adjustPrayer) return;
    const current = prayerSettings.offsets?.[adjustPrayer] || 0;
    updatePrayerSettings({ offsets: { [adjustPrayer]: clampOffset(current + delta) } });
  };

  return (
    <ModalShell onClose={onClose} title="Prayer Times" className="bg-background" labelledById="prayer-modal-title">
      <div className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <h1 id="prayer-modal-title" className="font-heading text-lg font-bold text-foreground">
            🕌 Prayer Times
          </h1>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Prayer settings"
              aria-expanded={showSettings}
            >
              <Settings className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-4 py-4">
        <button
          type="button"
          onClick={() => setShowSettings(!showSettings)}
          className="mb-3 flex w-full items-center gap-2 rounded-xl border border-border bg-card p-3 text-left transition-colors hover:bg-muted/50"
        >
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm text-foreground">
              {prayerSettings.city
                ? `${prayerSettings.city}${prayerSettings.country ? `, ${prayerSettings.country}` : ""}`
                : "Set your location"}
            </span>
            <span className="block text-[10px] text-muted-foreground">
              {getMethodLabel(prayerSettings.method, true)} · tap to change method & times
            </span>
          </span>
          <ChevronDown className={`h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform ${showSettings ? "rotate-180" : ""}`} />
        </button>

        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-4 overflow-hidden"
            >
              <PrayerSettingsPanel onSettingsChanged={refreshFromSettings} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 2 rakʿah quick action */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setShowNaflGuide((v) => !v)}
            className={`flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition-colors ${
              showNaflGuide
                ? "border-primary/40 bg-primary/10"
                : "border-border bg-card hover:border-primary/30 hover:bg-muted/40"
            }`}
            aria-expanded={showNaflGuide}
          >
            <span className="text-2xl" aria-hidden>
              🤲
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-foreground">Angry or argued?</span>
              <span className="block text-[11px] text-muted-foreground">Pray 2 rakʿahs — sunnah expiation for a quarrel</span>
            </span>
            <span className="text-xs font-semibold text-primary">{showNaflGuide ? "Hide" : "Start"}</span>
          </button>
          <AnimatePresence>
            {showNaflGuide && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-2 rounded-2xl border border-border bg-card p-4">
                  <AngerNaflGuide variant="full" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {hintPulse && prayerTimes && (
          <p className="mb-3 rounded-lg bg-primary/10 px-3 py-2 text-center text-[11px] text-primary">
            Tip: double-tap a prayer time to adjust minutes or calculation method
          </p>
        )}

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-sm text-muted-foreground">Loading prayer times...</p>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="mb-4 rounded-2xl border border-border bg-card p-6 text-center">
            <p className="mb-3 text-sm text-muted-foreground">{error}</p>
            <button
              type="button"
              onClick={() => setShowSettings(true)}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Open settings
            </button>
          </div>
        )}

        {prayerTimes && !loading && (
          <div className="space-y-2">
            {nextPrayer && (
              <div className="mb-4 rounded-2xl border border-primary/30 bg-primary/5 p-4 text-center">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
                  Next Prayer{nextPrayer === "Fajr" && currentPrayer === "Isha" ? " (tomorrow)" : ""}
                </p>
                <p className="mb-0.5 text-2xl">{PRAYER_EMOJIS[nextPrayer]}</p>
                <p className="font-heading text-lg font-bold text-foreground">{nextPrayer}</p>
                <p className="text-sm text-muted-foreground">{prayerTimes[nextPrayer]}</p>
              </div>
            )}

            {PRAYER_NAMES.map((name) => {
              const done = isPrayerDone(name);
              const isCurrent = name === currentPrayer;
              const isNext = name === nextPrayer;
              const timeStr = prayerTimes[name];
              const offset = prayerSettings.offsets?.[name] || 0;
              const now = new Date();
              const nowMin = now.getHours() * 60 + now.getMinutes();
              const prayerMin = parseTimeToMinutes(timeStr) ?? 0;
              const isPast = nowMin > prayerMin && !isCurrent;

              return (
                <div
                  key={name}
                  className={`flex w-full items-center gap-2 rounded-xl border p-2.5 transition-all ${
                    done
                      ? "border-success/30 bg-success/5"
                      : isCurrent
                        ? "border-primary/30 bg-primary/5"
                        : isNext
                          ? "border-accent/30 bg-accent/5"
                          : isPast
                            ? "border-border bg-muted/30 opacity-80"
                            : "border-border bg-card"
                  }`}
                >
                  <span className="pl-1 text-xl" aria-hidden>
                    {PRAYER_EMOJIS[name]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-semibold ${isCurrent ? "text-primary" : "text-foreground"}`}>
                      {name}
                      {isCurrent && <span className="ml-2 text-[10px] font-normal text-primary">Current</span>}
                    </p>
                    {/* Double-tap / double-click target */}
                    <button
                      type="button"
                      onClick={(e) => handleTimeInteraction(name, e)}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        openAdjust(name);
                      }}
                      className="group inline-flex items-center gap-1 rounded-md px-1 py-0.5 text-left text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      aria-label={`${name} at ${timeStr}. Double-tap to adjust time or calculation method`}
                      title="Double-tap to adjust"
                    >
                      <span className="font-medium tabular-nums text-foreground/80 group-hover:text-foreground">{timeStr}</span>
                      {offset !== 0 && (
                        <span className="text-[9px] text-primary">{formatOffsetLabel(offset)}</span>
                      )}
                      <span className="text-[9px] opacity-0 transition-opacity group-hover:opacity-70">✎</span>
                    </button>
                  </div>
                  {done ? (
                    <div className="flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1.5">
                      <Check className="h-3.5 w-3.5 text-success" />
                      <span className="text-[10px] font-medium text-success">Done</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleMarkPrayer(name)}
                      className="shrink-0 rounded-full bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground touch-target"
                      aria-label={`Mark ${name} as prayed`}
                    >
                      Mark ✓
                    </button>
                  )}
                </div>
              );
            })}

            <div className="mt-4 rounded-2xl border border-border bg-card p-4 text-center">
              <p className="text-sm font-medium text-foreground">Today: {todayPrayers.length}/5 prayers logged</p>
              <div className="mt-2 flex justify-center gap-2">
                {PRAYER_NAMES.map((name) => (
                  <span key={name} className={`text-lg ${isPrayerDone(name) ? "" : "opacity-20"}`} title={name}>
                    {PRAYER_EMOJIS[name]}
                  </span>
                ))}
              </div>
              {todayPrayers.length === 5 && (
                <p className="mt-2 text-xs font-medium text-success">MashaAllah! All prayers completed today 🎉</p>
              )}
            </div>

            {prayerLog.length > 0 && (
              <div className="mt-4">
                <h2 className="mb-2 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Recent Prayer Log
                </h2>
                <div className="space-y-1.5">
                  {prayerLog.slice(0, 10).map((entry) => (
                    <div key={entry.id} className="flex items-center gap-2 rounded-lg border border-border bg-card p-2.5">
                      <span className="text-sm">{PRAYER_EMOJIS[entry.prayer as PrayerName] || "🕌"}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-foreground">{entry.prayer}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(entry.date).toLocaleDateString()} ·{" "}
                          {new Date(entry.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      {entry.journalNote && <span className="text-[10px] text-muted-foreground">📝</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Double-tap adjust dialog */}
      <Dialog open={!!adjustPrayer} onOpenChange={(open) => !open && setAdjustPrayer(null)}>
        <DialogContent className="z-[100] max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {adjustPrayer && PRAYER_EMOJIS[adjustPrayer]} Adjust {adjustPrayer}
            </DialogTitle>
          </DialogHeader>
          {adjustPrayer && (
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-muted/40 p-4 text-center">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Displayed time</p>
                <p className="font-heading text-3xl font-bold tabular-nums text-foreground">
                  {prayerTimes?.[adjustPrayer] || "--:--"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatOffsetLabel(prayerSettings.offsets?.[adjustPrayer] || 0)}
                  {rawTimes && (prayerSettings.offsets?.[adjustPrayer] || 0) !== 0 && (
                    <> · calculated {applyOffset(rawTimes[adjustPrayer], 0)}</>
                  )}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">Shift minutes</p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => adjustOffset(-5)}
                    className="rounded-xl border border-border px-3 py-2 text-xs font-semibold hover:bg-muted"
                  >
                    −5
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustOffset(-1)}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-border text-lg font-bold hover:bg-muted"
                  >
                    −
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustOffset(1)}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-border text-lg font-bold hover:bg-muted"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustOffset(5)}
                    className="rounded-xl border border-border px-3 py-2 text-xs font-semibold hover:bg-muted"
                  >
                    +5
                  </button>
                </div>
                {(prayerSettings.offsets?.[adjustPrayer] || 0) !== 0 && (
                  <button
                    type="button"
                    onClick={() => updatePrayerSettings({ offsets: { [adjustPrayer]: 0 } })}
                    className="mt-2 w-full text-center text-[11px] text-primary hover:underline"
                  >
                    Reset this prayer to calculated time
                  </button>
                )}
              </div>

              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">Calculation method</p>
                <select
                  value={prayerSettings.method}
                  onChange={(e) => {
                    updatePrayerSettings({ method: Number(e.target.value) });
                    // effect will refetch
                  }}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {[
                    { id: 2, name: "ISNA" },
                    { id: 3, name: "Muslim World League" },
                    { id: 4, name: "Umm Al-Qura, Makkah" },
                    { id: 1, name: "Karachi" },
                    { id: 5, name: "Egypt" },
                    { id: 13, name: "Turkey (Diyanet)" },
                    { id: 15, name: "Moonsighting Committee" },
                    { id: 8, name: "Gulf Region" },
                    { id: 7, name: "Tehran" },
                    { id: 9, name: "Kuwait" },
                    { id: 10, name: "Qatar" },
                    { id: 11, name: "Singapore" },
                    { id: 12, name: "France (UOIF)" },
                    { id: 14, name: "Russia" },
                  ].map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1.5 text-[10px] text-muted-foreground">Changing method updates all prayer times.</p>
              </div>

              <button
                type="button"
                onClick={() => setAdjustPrayer(null)}
                className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Done
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Prayer Journal Dialog */}
      <Dialog open={!!showJournal} onOpenChange={(open) => !open && setShowJournal(null)}>
        <DialogContent className="z-[100] max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {showJournal && PRAYER_EMOJIS[showJournal]} Mark {showJournal} as Prayed
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Quick reflection (optional)</label>
              <textarea
                value={journalNote}
                onChange={(e) => setJournalNote(e.target.value)}
                placeholder="How did you feel? Did it help with your emotions?"
                className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                rows={3}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Tools used today</label>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(toolLabels).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleTool(key)}
                    className={`rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-all ${
                      selectedTools.includes(key)
                        ? "border border-primary/30 bg-primary/10 text-primary"
                        : "border border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowJournal(null)}
                className="flex-1 rounded-lg border border-border py-2.5 text-sm text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitPrayerLog}
                className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground"
              >
                Log Prayer ✓
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ModalShell>
  );
};

export default PrayerTimesComponent;
