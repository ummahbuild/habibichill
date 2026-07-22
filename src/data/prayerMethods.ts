export const PRAYER_NAMES = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
export type PrayerName = (typeof PRAYER_NAMES)[number];

export const PRAYER_EMOJIS: Record<PrayerName, string> = {
  Fajr: "🌅",
  Dhuhr: "☀️",
  Asr: "🌤️",
  Maghrib: "🌅",
  Isha: "🌙",
};

export const CALCULATION_METHODS = [
  { id: 1, name: "University of Islamic Sciences, Karachi", short: "Karachi" },
  { id: 2, name: "Islamic Society of North America (ISNA)", short: "ISNA" },
  { id: 3, name: "Muslim World League (MWL)", short: "MWL" },
  { id: 4, name: "Umm Al-Qura University, Makkah", short: "Umm Al-Qura" },
  { id: 5, name: "Egyptian General Authority of Survey", short: "Egypt" },
  { id: 7, name: "Institute of Geophysics, University of Tehran", short: "Tehran" },
  { id: 8, name: "Gulf Region", short: "Gulf" },
  { id: 9, name: "Kuwait", short: "Kuwait" },
  { id: 10, name: "Qatar", short: "Qatar" },
  { id: 11, name: "Majlis Ugama Islam Singapura", short: "Singapore" },
  { id: 12, name: "UOIF (France)", short: "France" },
  { id: 13, name: "Diyanet İşleri Başkanlığı (Turkey)", short: "Turkey" },
  { id: 14, name: "Spiritual Administration of Muslims of Russia", short: "Russia" },
  { id: 15, name: "Moonsighting Committee", short: "Moonsighting" },
] as const;

export const getMethodLabel = (id: number, short = false) => {
  const method = CALCULATION_METHODS.find((m) => m.id === id);
  if (!method) return short ? `Method ${id}` : `Calculation method ${id}`;
  return short ? method.short : method.name;
};

/** Parse "HH:MM" (optionally with seconds) → minutes from midnight, or null if invalid. */
export const parseTimeToMinutes = (t: string): number | null => {
  const match = t.trim().match(/^(\d{1,2}):(\d{2})(?::\d{2})?/);
  if (!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (!Number.isFinite(h) || !Number.isFinite(m) || h > 23 || m > 59) return null;
  return h * 60 + m;
};

export const minutesToTime = (total: number): string => {
  const day = 24 * 60;
  const normalized = ((total % day) + day) % day;
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

export const clampOffset = (n: unknown): number => {
  const num = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(num)) return 0;
  return Math.max(-60, Math.min(60, Math.round(num)));
};

export const applyOffset = (timeStr: string, offsetMin = 0): string => {
  const base = parseTimeToMinutes(timeStr);
  if (base == null) return timeStr.slice(0, 5);
  return minutesToTime(base + clampOffset(offsetMin));
};

export type PrayerOffsets = Partial<Record<PrayerName, number>>;

export const formatOffsetLabel = (offset = 0) => {
  if (!offset) return "On time";
  return offset > 0 ? `+${offset} min` : `${offset} min`;
};
