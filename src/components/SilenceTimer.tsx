import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEscapeKey } from "@/hooks/use-keyboard-shortcuts";
import HadithTooltip from "@/components/HadithTooltip";

const motivations = [
  { arabic: "إِذَا غَضِبَ أَحَدُكُمْ فَلْيَسْكُتْ", english: "If any of you becomes angry, let him keep silent.", source: "Musnad Ahmad 2136", link: "https://sunnah.com/ahmad:2136", narrator: "Narrated by Ibn Abbas (رضي الله عنه)" },
  { arabic: "مَنْ صَمَتَ نَجَا", english: "Whoever is silent is saved.", source: "Tirmidhi 2501", link: "https://sunnah.com/tirmidhi:2501", narrator: "Narrated by Abdullah ibn Amr (رضي الله عنه)" },
  { english: "Speak good or remain silent.", source: "Bukhari 6018", link: "https://sunnah.com/bukhari:6018", narrator: "Narrated by Abu Hurayrah (رضي الله عنه)" },
  { english: "The believer does not insult, curse, or speak obscenely.", source: "Tirmidhi 1977", link: "https://sunnah.com/tirmidhi:1977" },
  { english: "A word of kindness is charity.", source: "Bukhari 2989", link: "https://sunnah.com/bukhari:2989" },
  { arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", english: "Indeed, with hardship comes ease.", source: "Qur'an 94:6", link: "https://quran.com/94/6" },
];

const quickSurahs = [
  { id: "93", name: "Ad-Duha", emoji: "☀️" },
  { id: "94", name: "Ash-Sharh", emoji: "💚" },
  { id: "112", name: "Al-Ikhlas", emoji: "🕌" },
  { id: "113", name: "Al-Falaq", emoji: "🌅" },
];

const durations = [
  { label: "1 min", seconds: 60 },
  { label: "2 min", seconds: 120 },
  { label: "5 min", seconds: 300 },
  { label: "10 min", seconds: 600 },
];

interface SilenceTimerProps {
  onClose: () => void;
}

const SilenceTimer = ({ onClose }: SilenceTimerProps) => {
  useEscapeKey(onClose);
  const [phase, setPhase] = useState<"select" | "running" | "done">("select");
  const [totalSeconds, setTotalSeconds] = useState(120);
  const [remaining, setRemaining] = useState(0);
  const [currentMotivation, setCurrentMotivation] = useState(0);
  const [playingSurah, setPlayingSurah] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const progress = totalSeconds > 0 ? 1 - remaining / totalSeconds : 0;

  const startTimer = useCallback((secs: number) => {
    setTotalSeconds(secs);
    setRemaining(secs);
    setPhase("running");
    setCurrentMotivation(Math.floor(Math.random() * motivations.length));
  }, []);

  useEffect(() => {
    if (phase !== "running") return;
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setPhase("done");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [phase]);

  useEffect(() => {
    if (phase !== "running") return;
    const iv = setInterval(() => {
      setCurrentMotivation((prev) => (prev + 1) % motivations.length);
    }, 15000);
    return () => clearInterval(iv);
  }, [phase]);

  const playQuran = (surahId: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      if (playingSurah === surahId) {
        setPlayingSurah(null);
        return;
      }
    }
    const audio = new Audio(`https://cdn.islamic.network/quran/audio/128/ar.alafasy/${surahId === "93" ? "1" : surahId === "94" ? "1" : surahId === "112" ? "1" : "1"}.mp3`);
    // Use full surah audio
    const surahAudioUrl = `https://server8.mp3quran.net/afs/${surahId.padStart(3, "0")}.mp3`;
    const surahAudio = new Audio(surahAudioUrl);
    audioRef.current = surahAudio;
    setPlayingSurah(surahId);
    surahAudio.play().catch(() => {});
    surahAudio.onended = () => setPlayingSurah(null);
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPlayingSurah(null);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const mot = motivations[currentMotivation];
  const circumference = 2 * Math.PI * 120;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-background/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button
        onClick={() => { stopAudio(); if (intervalRef.current) clearInterval(intervalRef.current); onClose(); }}
        className="absolute right-4 top-4 z-10 rounded-full p-2 text-muted-foreground hover:text-foreground"
        aria-label="Close"
      >
        ✕
      </button>

      <div className="w-full max-w-sm px-4 text-center">
        <AnimatePresence mode="wait">
          {phase === "select" && (
            <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <span className="mb-4 block text-5xl">🤫</span>
              <h2 className="mb-2 font-heading text-2xl font-bold text-foreground">Silence Timer</h2>
              <p className="mb-2 text-sm text-muted-foreground">The Prophet ﷺ said:</p>
              <div className="mb-6 rounded-2xl bg-gradient-calm border border-border p-4">
                <HadithTooltip source="Musnad Ahmad 2136" narrator="Narrated by Ibn Abbas (رضي الله عنه)" text="If any of you becomes angry, let him keep silent." link="https://sunnah.com/ahmad:2136">
                  <p className="mb-1 font-arabic text-xl leading-relaxed text-foreground" dir="rtl">إِذَا غَضِبَ أَحَدُكُمْ فَلْيَسْكُتْ</p>
                </HadithTooltip>
                <p className="text-sm text-muted-foreground italic">"If any of you becomes angry, let him keep silent."</p>
              </div>
              <p className="mb-4 text-sm text-muted-foreground">How long do you want to stay silent?</p>
              <div className="grid grid-cols-2 gap-3">
                {durations.map((d) => (
                  <motion.button
                    key={d.seconds}
                    onClick={() => startTimer(d.seconds)}
                    className="rounded-xl border border-border bg-card p-4 text-center transition-all hover:shadow-calm active:scale-95"
                    whileTap={{ scale: 0.95 }}
                  >
                    <p className="font-heading text-2xl font-bold text-primary">{d.label}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {phase === "running" && (
            <motion.div key="running" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="mb-6 text-sm font-medium uppercase tracking-wider text-muted-foreground">Stay Silent</p>

              {/* Circle timer */}
              <div className="relative mx-auto mb-6 h-52 w-52">
                <svg className="absolute inset-0 -rotate-90" viewBox="0 0 220 220">
                  <circle cx="110" cy="110" r="100" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                  <circle cx="110" cy="110" r="100" fill="none" stroke="hsl(var(--primary))" strokeWidth="8"
                    strokeDasharray={`${progress * 2 * Math.PI * 100} ${2 * Math.PI * 100}`}
                    strokeLinecap="round" className="transition-all duration-1000 ease-linear"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span className="text-3xl" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>🤫</motion.span>
                  <p className="mt-1 font-heading text-3xl font-bold text-foreground">{formatTime(remaining)}</p>
                </div>
              </div>

              {/* Quick Quran Audio */}
              <div className="mb-4 rounded-xl border border-border bg-card p-3">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">🎧 Listen to Quran while silent</p>
                <div className="flex gap-2 justify-center flex-wrap">
                  {quickSurahs.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => playQuran(s.id)}
                      className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                        playingSurah === s.id
                          ? "bg-primary text-primary-foreground"
                          : "border border-border bg-background text-foreground hover:bg-muted"
                      }`}
                    >
                      <span>{s.emoji}</span>
                      <span>{s.name}</span>
                      <span>{playingSurah === s.id ? "⏸" : "▶"}</span>
                    </button>
                  ))}
                </div>
                {playingSurah && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 flex items-center justify-center gap-2">
                    <motion.div className="h-1 w-1 rounded-full bg-primary" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 0.5, repeat: Infinity }} />
                    <motion.div className="h-1 w-1 rounded-full bg-primary" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.15 }} />
                    <motion.div className="h-1 w-1 rounded-full bg-primary" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.3 }} />
                    <span className="text-[10px] text-primary ml-1">Playing...</span>
                  </motion.div>
                )}
              </div>

              {/* Rotating motivation */}
              <AnimatePresence mode="wait">
                <motion.div key={currentMotivation} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="mb-4 rounded-2xl bg-gradient-calm border border-border p-3"
                >
                  {mot.arabic && (
                    <p className="mb-1 font-arabic text-base leading-relaxed text-foreground" dir="rtl">{mot.arabic}</p>
                  )}
                  <p className="mb-1 text-xs text-muted-foreground italic">"{mot.english}"</p>
                  <HadithTooltip source={mot.source} narrator={mot.narrator} text={mot.english} link={mot.link}>
                    <a href={mot.link} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary underline">{mot.source} →</a>
                  </HadithTooltip>
                </motion.div>
              </AnimatePresence>

              {/* Breathing indicator */}
              <div className="flex flex-col items-center">
                <motion.div className="h-3 w-3 rounded-full bg-primary" animate={{ scale: [1, 2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
                <p className="mt-2 text-xs text-muted-foreground">Breathe slowly...</p>
              </div>

              <button
                onClick={() => { stopAudio(); if (intervalRef.current) clearInterval(intervalRef.current); setPhase("done"); }}
                className="mt-4 rounded-xl border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                End Early
              </button>
            </motion.div>
          )}

          {phase === "done" && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <motion.span className="mb-4 block text-6xl" animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 0.5 }}>🌟</motion.span>
              <h2 className="mb-2 font-heading text-2xl font-bold text-foreground">Well Done!</h2>
              <p className="mb-4 text-sm text-muted-foreground">You practiced the Sunnah of silence during anger.</p>
              <div className="mb-6 rounded-2xl bg-gradient-calm border border-border p-4">
                <p className="mb-1 font-arabic text-lg leading-relaxed text-foreground" dir="rtl">
                  مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ
                </p>
                <p className="mb-1 text-sm text-muted-foreground italic">"Whoever believes in Allah and the Last Day, let him speak good or remain silent."</p>
                <HadithTooltip source="Sahih al-Bukhari 6018" narrator="Narrated by Abu Hurayrah (رضي الله عنه)" text="Whoever believes in Allah and the Last Day, let him speak good or remain silent." link="https://sunnah.com/bukhari:6018">
                  <a href="https://sunnah.com/bukhari:6018" target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline">Sahih al-Bukhari 6018 →</a>
                </HadithTooltip>
              </div>
              <button
                onClick={() => { stopAudio(); onClose(); }}
                className="w-full rounded-xl bg-primary py-4 font-heading font-semibold text-primary-foreground transition-all hover:scale-105 active:scale-95"
              >
                Return Home
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SilenceTimer;
