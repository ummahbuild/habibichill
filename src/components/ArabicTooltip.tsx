import { useState, useRef, useEffect, ReactNode } from "react";

interface ArabicWord {
  word: string;
  arabic?: string;
  meaning: string;
  root?: string;
}

const ARABIC_GLOSSARY: Record<string, ArabicWord> = {
  sabr: { word: "Sabr", arabic: "صَبْر", meaning: "Patience, perseverance, and steadfastness in the face of difficulty. One of the highest virtues in Islam.", root: "ص-ب-ر" },
  tawbah: { word: "Tawbah", arabic: "تَوْبَة", meaning: "Repentance — turning back to Allah with sincere regret and intention to change.", root: "ت-و-ب" },
  dhikr: { word: "Dhikr", arabic: "ذِكْر", meaning: "Remembrance of Allah through phrases, prayers, and contemplation.", root: "ذ-ك-ر" },
  wudu: { word: "Wudu", arabic: "وُضُوء", meaning: "Ritual ablution — washing specific body parts before prayer as an act of purification.", root: "و-ض-أ" },
  sunnah: { word: "Sunnah", arabic: "سُنَّة", meaning: "The practices, sayings, and teachings of Prophet Muhammad ﷺ. The second source of Islamic law.", root: "س-ن-ن" },
  hadith: { word: "Hadith", arabic: "حَدِيث", meaning: "A recorded saying, action, or approval of Prophet Muhammad ﷺ.", root: "ح-د-ث" },
  taqwa: { word: "Taqwa", arabic: "تَقْوَى", meaning: "God-consciousness, piety, and mindfulness of Allah in all actions.", root: "و-ق-ي" },
  dua: { word: "Du'a", arabic: "دُعَاء", meaning: "Supplication — personal prayer and calling upon Allah for needs and guidance.", root: "د-ع-و" },
  istighfar: { word: "Istighfar", arabic: "اسْتِغْفَار", meaning: "Seeking forgiveness from Allah. A powerful act of spiritual healing.", root: "غ-ف-ر" },
  ghayb: { word: "Ghayb", arabic: "غَيْب", meaning: "The unseen — matters beyond human perception known only to Allah." },
  niyyah: { word: "Niyyah", arabic: "نِيَّة", meaning: "Intention — the inner purpose behind any act of worship.", root: "ن-و-ي" },
  shaytan: { word: "Shaytan", arabic: "شَيْطَان", meaning: "Satan, the devil — the enemy of mankind who incites evil and anger.", root: "ش-ط-ن" },
  bismillah: { word: "Bismillah", arabic: "بِسْمِ اللَّهِ", meaning: "In the name of Allah — said before beginning any action." },
  alhamdulillah: { word: "Alhamdulillah", arabic: "الْحَمْدُ لِلَّهِ", meaning: "All praise is due to Allah — an expression of gratitude." },
  ummah: { word: "Ummah", arabic: "أُمَّة", meaning: "The global Muslim community, united by faith.", root: "أ-م-م" },
  khushu: { word: "Khushu'", arabic: "خُشُوع", meaning: "Humble focus and devotion, especially in prayer.", root: "خ-ش-ع" },
  hilm: { word: "Hilm", arabic: "حِلْم", meaning: "Forbearance, gentleness, and self-restraint — the opposite of anger.", root: "ح-ل-م" },
  afu: { word: "'Afu", arabic: "عَفْو", meaning: "Pardon, forgiveness — to overlook and let go of wrongdoing.", root: "ع-ف-و" },
  rahma: { word: "Rahmah", arabic: "رَحْمَة", meaning: "Mercy and compassion — one of Allah's greatest attributes.", root: "ر-ح-م" },
};

interface ArabicTooltipProps {
  term: string; // key in glossary
  children: ReactNode;
}

const ArabicTooltip = ({ term, children }: ArabicTooltipProps) => {
  const [show, setShow] = useState(false);
  const [above, setAbove] = useState(true);
  const ref = useRef<HTMLSpanElement>(null);
  const entry = ARABIC_GLOSSARY[term.toLowerCase()];

  useEffect(() => {
    if (show && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setAbove(rect.top > 180);
    }
  }, [show]);

  if (!entry) return <>{children}</>;

  return (
    <span
      ref={ref}
      className="relative inline cursor-help"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onTouchStart={() => setShow((s) => !s)}
    >
      <span className="border-b border-dashed border-primary/40">{children}</span>
      {show && (
        <div
          className={`absolute z-50 left-1/2 -translate-x-1/2 w-64 rounded-xl border border-border bg-popover p-3 shadow-lg ${
            above ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{entry.word}</span>
            {entry.root && <span className="text-[9px] text-muted-foreground font-mono">Root: {entry.root}</span>}
          </div>
          {entry.arabic && (
            <p className="font-arabic text-lg text-foreground mb-1" dir="rtl">{entry.arabic}</p>
          )}
          <p className="text-xs text-muted-foreground leading-relaxed">{entry.meaning}</p>
        </div>
      )}
    </span>
  );
};

export { ArabicTooltip, ARABIC_GLOSSARY };
export default ArabicTooltip;
