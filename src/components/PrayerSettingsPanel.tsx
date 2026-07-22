import { useState } from "react";
import { MapPin, Search } from "lucide-react";
import { useApp } from "@/context/AppContext";
import {
  CALCULATION_METHODS,
  PRAYER_EMOJIS,
  PRAYER_NAMES,
  clampOffset,
  formatOffsetLabel,
  getMethodLabel,
  type PrayerName,
} from "@/data/prayerMethods";

interface PrayerSettingsPanelProps {
  compact?: boolean;
  onOpenPrayer?: () => void;
  /** Called after location/method changes so parent can refetch times */
  onSettingsChanged?: () => void;
}

const PrayerSettingsPanel = ({ compact = false, onOpenPrayer, onSettingsChanged }: PrayerSettingsPanelProps) => {
  const { prayerSettings, updatePrayerSettings } = useApp();
  const [citySearch, setCitySearch] = useState(prayerSettings.city || "");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [showAllMethods, setShowAllMethods] = useState(false);

  const popularMethodIds = [2, 3, 4, 1, 5, 13, 15];
  const methodsToShow = showAllMethods
    ? CALCULATION_METHODS
    : CALCULATION_METHODS.filter((m) => popularMethodIds.includes(m.id));

  const setMsg = (type: "ok" | "err", text: string) => {
    setMessage({ type, text });
    window.setTimeout(() => setMessage(null), 3500);
  };

  const detectLocation = async () => {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("https://ipapi.co/json/");
      if (!res.ok) throw new Error("location failed");
      const data = await res.json();
      if (!data.latitude || !data.longitude) throw new Error("no coords");
      updatePrayerSettings({
        latitude: data.latitude,
        longitude: data.longitude,
        city: data.city || "",
        country: data.country_name || "",
        autoDetect: true,
      });
      setCitySearch(data.city || "");
      setMsg("ok", `Location set to ${data.city || "your area"}`);
      onSettingsChanged?.();
    } catch {
      setMsg("err", "Couldn’t detect location. Search a city instead.");
    } finally {
      setBusy(false);
    }
  };

  const searchCity = async () => {
    const q = citySearch.trim();
    if (!q) {
      setMsg("err", "Enter a city name first.");
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch(
        `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(q)}&country=&method=${prayerSettings.method}`,
      );
      const data = await res.json();
      if (!data.data?.timings || !data.data?.meta) throw new Error("not found");
      updatePrayerSettings({
        latitude: data.data.meta.latitude,
        longitude: data.data.meta.longitude,
        city: q,
        country: "",
        autoDetect: false,
      });
      setMsg("ok", `Times will use ${q}`);
      onSettingsChanged?.();
    } catch {
      setMsg("err", `No prayer times found for “${q}”. Try another city.`);
    } finally {
      setBusy(false);
    }
  };

  const setMethod = (method: number) => {
    if (method === prayerSettings.method) return;
    updatePrayerSettings({ method });
    setMsg("ok", `Method: ${getMethodLabel(method, true)}`);
    onSettingsChanged?.();
  };

  const setOffset = (prayer: PrayerName, delta: number) => {
    const current = prayerSettings.offsets?.[prayer] || 0;
    const next = clampOffset(current + delta);
    updatePrayerSettings({ offsets: { [prayer]: next } });
    onSettingsChanged?.();
  };

  const resetOffsets = () => {
    updatePrayerSettings({
      offsets: { Fajr: 0, Dhuhr: 0, Asr: 0, Maghrib: 0, Isha: 0 },
    });
    setMsg("ok", "Time adjustments cleared");
    onSettingsChanged?.();
  };

  const hasOffsets = Object.values(prayerSettings.offsets || {}).some((v) => v && v !== 0);

  return (
    <div className={`space-y-4 ${compact ? "" : ""}`}>
      {/* Location */}
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="mb-1 text-sm font-medium text-foreground">Location</p>
        <p className="mb-3 text-xs text-muted-foreground">
          {prayerSettings.city
            ? `${prayerSettings.city}${prayerSettings.country ? `, ${prayerSettings.country}` : ""}`
            : "Not set — detect or search a city"}
        </p>
        <button
          type="button"
          disabled={busy}
          onClick={detectLocation}
          className="mb-3 flex w-full items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 p-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-primary/10 disabled:opacity-60"
        >
          <MapPin className="h-4 w-4 text-primary" />
          {busy ? "Working…" : "Auto-detect my location"}
        </button>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Search city</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={citySearch}
            onChange={(e) => setCitySearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchCity()}
            placeholder="e.g. London, Dubai, Jakarta"
            className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            aria-label="Search city for prayer times"
          />
          <button
            type="button"
            disabled={busy}
            onClick={searchCity}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground disabled:opacity-60"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Calculation method */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-foreground">Calculation method</p>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
            {getMethodLabel(prayerSettings.method, true)}
          </span>
        </div>
        <p className="mb-3 text-[11px] text-muted-foreground">
          Different councils use different Fajr/Isha angles. Pick the one your mosque uses.
        </p>
        <div className="flex flex-wrap gap-1.5">
          {methodsToShow.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMethod(m.id)}
              className={`rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
                prayerSettings.method === m.id
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              {m.short}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setShowAllMethods((v) => !v)}
          className="mt-2 text-[11px] font-medium text-primary hover:underline"
        >
          {showAllMethods ? "Show fewer methods" : "Show all methods"}
        </button>
        <select
          value={prayerSettings.method}
          onChange={(e) => setMethod(Number(e.target.value))}
          className="mt-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          aria-label="Calculation method"
        >
          {CALCULATION_METHODS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      {/* Minute offsets */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-medium text-foreground">Fine-tune times</p>
          {hasOffsets && (
            <button type="button" onClick={resetOffsets} className="text-[11px] font-medium text-primary hover:underline">
              Reset
            </button>
          )}
        </div>
        <p className="mb-3 text-[11px] text-muted-foreground">
          Match your local mosque (±60 min). Double-tap a time in Prayer to adjust quickly.
        </p>
        <div className="space-y-2">
          {PRAYER_NAMES.map((name) => {
            const offset = prayerSettings.offsets?.[name] || 0;
            return (
              <div key={name} className="flex items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-2">
                <span className="text-sm" aria-hidden>
                  {PRAYER_EMOJIS[name]}
                </span>
                <span className="min-w-0 flex-1 text-xs font-medium text-foreground">{name}</span>
                <span className="w-16 text-center text-[10px] text-muted-foreground">{formatOffsetLabel(offset)}</span>
                <button
                  type="button"
                  onClick={() => setOffset(name, -1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-sm font-bold text-foreground hover:bg-muted"
                  aria-label={`Minus one minute for ${name}`}
                >
                  −
                </button>
                <button
                  type="button"
                  onClick={() => setOffset(name, 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-sm font-bold text-foreground hover:bg-muted"
                  aria-label={`Plus one minute for ${name}`}
                >
                  +
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {message && (
        <p
          className={`rounded-lg px-3 py-2 text-xs ${
            message.type === "ok" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
          }`}
          role="status"
        >
          {message.text}
        </p>
      )}

      {onOpenPrayer && (
        <button
          type="button"
          onClick={onOpenPrayer}
          className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-calm"
        >
          Open prayer times
        </button>
      )}
    </div>
  );
};

export default PrayerSettingsPanel;
