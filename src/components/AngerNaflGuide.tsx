import { useState } from "react";
import { useApp } from "@/context/AppContext";

/** Hadith: "The expiation for every quarrel is two rak'ahs" — graded hasan by al-Albani (Sahihah 1789). */
export const ANGER_NAFL_HADITH = {
  arabic: "تَكْفِيرُ كُلِّ لِحَاءٍ رَكْعَتَانِ",
  transliteration: "Takfīru kulli liḥā'in rakʿatān",
  english: "The expiation for every quarrel is two rak'ahs.",
  narrator: "Abu Hurayrah (رضي الله عنه)",
  source: "Graded hasan by al-Albani — Silsilah as-Sahihah 1789",
  link: "https://hadithanswers.com/the-expiation-for-a-quarrel/",
  note: "Scholars recommend making wudu first (which cools anger), then praying two rak'ahs.",
};

interface AngerNaflGuideProps {
  /** Compact for emergency inline; full for Prayer modal */
  variant?: "full" | "compact";
  onComplete?: () => void;
  className?: string;
}

/**
 * Guided 2-rak'ah sunnah after anger / argument.
 * Sequence: intention → (wudu reminder) → pray → mark done.
 */
const AngerNaflGuide = ({ variant = "full", onComplete, className }: AngerNaflGuideProps) => {
  const { logActivity, addSabrPoints } = useApp();
  const [done, setDone] = useState(false);
  const [checked, setChecked] = useState({ wudu: false, prayed: false });
  const isCompact = variant === "compact";

  const handleComplete = () => {
    if (done) return;
    logActivity("nafl", "2 rakʿahs after anger/argument");
    addSabrPoints(5);
    setDone(true);
    onComplete?.();
  };

  const canComplete = checked.prayed;

  return (
    <div className={className}>
      {!isCompact && (
        <div className="mb-3 text-center">
          <p className="mb-1 text-3xl" aria-hidden>
            🤲
          </p>
          <h3 className="font-heading text-base font-bold text-foreground">2 Rakʿahs After Anger</h3>
          <p className="text-xs text-muted-foreground">Sunnah expiation after a quarrel or heated moment</p>
        </div>
      )}

      <div className="mb-3 rounded-xl border border-border bg-gradient-calm p-3 text-left">
        <p className="mb-1 font-arabic text-lg leading-relaxed text-foreground" dir="rtl">
          {ANGER_NAFL_HADITH.arabic}
        </p>
        <p className="mb-1 text-xs font-medium italic text-primary">{ANGER_NAFL_HADITH.transliteration}</p>
        <p className="mb-2 text-sm text-muted-foreground">"{ANGER_NAFL_HADITH.english}"</p>
        <p className="text-[10px] text-muted-foreground">
          {ANGER_NAFL_HADITH.narrator} —{" "}
          <a href={ANGER_NAFL_HADITH.link} target="_blank" rel="noopener noreferrer" className="text-primary underline">
            {ANGER_NAFL_HADITH.source}
          </a>
        </p>
      </div>

      <p className="mb-3 text-left text-xs leading-relaxed text-muted-foreground">{ANGER_NAFL_HADITH.note}</p>

      <div className="mb-3 space-y-2 text-left">
        <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-border bg-card p-3 transition-colors hover:bg-muted/40">
          <input
            type="checkbox"
            checked={checked.wudu}
            onChange={(e) => setChecked((c) => ({ ...c, wudu: e.target.checked }))}
            className="mt-0.5 h-4 w-4 accent-primary"
          />
          <span>
            <span className="block text-sm font-medium text-foreground">Make wudu (recommended)</span>
            <span className="text-[10px] text-muted-foreground">Anger is from Shaytan (fire) — water cools it</span>
          </span>
        </label>
        <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-border bg-card p-3 transition-colors hover:bg-muted/40">
          <input
            type="checkbox"
            checked={checked.prayed}
            onChange={(e) => setChecked((c) => ({ ...c, prayed: e.target.checked }))}
            className="mt-0.5 h-4 w-4 accent-primary"
          />
          <span>
            <span className="block text-sm font-medium text-foreground">Pray two rakʿahs</span>
            <span className="text-[10px] text-muted-foreground">
              Intention: seeking Allah’s pleasure and expiating harsh words
            </span>
          </span>
        </label>
      </div>

      {done ? (
        <div className="rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-center">
          <p className="text-sm font-semibold text-success">✓ Logged · +5 Sabr Points</p>
          <p className="text-[10px] text-muted-foreground">May Allah accept it</p>
        </div>
      ) : (
        <button
          type="button"
          disabled={!canComplete}
          onClick={handleComplete}
          className={`w-full rounded-xl py-3 text-sm font-semibold transition-all ${
            canComplete
              ? "bg-primary text-primary-foreground shadow-calm hover:scale-[1.01] active:scale-95"
              : "cursor-not-allowed bg-muted text-muted-foreground"
          }`}
        >
          {isCompact ? "I prayed 2 rakʿahs ✓" : "Mark 2 rakʿahs complete"}
        </button>
      )}
    </div>
  );
};

export default AngerNaflGuide;
