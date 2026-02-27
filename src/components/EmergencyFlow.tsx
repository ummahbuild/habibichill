import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { useEscapeKey } from "@/hooks/use-keyboard-shortcuts";
import HadithTooltip from "@/components/HadithTooltip";
import wuduHands from "@/assets/wudu-hands.png";
import wuduMouth from "@/assets/wudu-mouth.png";
import wuduArms from "@/assets/wudu-arms.png";
import wuduHead from "@/assets/wudu-head.png";
import wuduFeet from "@/assets/wudu-feet.png";

interface StepData {
  instruction: string;
  icon: string;
  arabic?: string;
  transliteration?: string;
  translation?: string;
  desc: string;
  hadithSource?: string;
  hadithBook?: string;
  hadithNarrator?: string;
  hadithFull?: string;
  hadithLink?: string;
  audioUrl?: string;
  inlineTool?: "silence" | "breathing" | "wudu";
  verifyType?: "time" | "steps" | "action";
  verifyMinSeconds?: number;
}

const steps: StepData[] = [
  {
    instruction: "Stay Silent",
    icon: "🤫",
    desc: "The Prophet ﷺ said: \"If one of you becomes angry, let him be silent.\"",
    hadithSource: "Musnad Ahmad 1/329",
    hadithBook: "Musnad Ahmad",
    hadithNarrator: "Narrated by Ibn Abbas (رضي الله عنه)",
    hadithFull: "The Prophet ﷺ said: \"If any of you becomes angry, let him keep silent.\" He repeated it three times, emphasizing the importance of restraining the tongue during anger as words spoken in rage are often regretted.",
    hadithLink: "https://sunnah.com/adab/57/1",
    inlineTool: "silence",
    verifyType: "time",
    verifyMinSeconds: 30,
  },
  {
    instruction: "Breathe Deeply",
    icon: "🌊",
    desc: "Breathe with the circle. Inhale as it grows, exhale as it shrinks. This activates your parasympathetic nervous system and calms the body.",
    hadithSource: "Based on Islamic principle of self-control",
    hadithFull: "Deep breathing is a scientifically proven calming technique that aligns with the Islamic emphasis on self-regulation. The Qur'an says: \"Verily, in the remembrance of Allah do hearts find rest.\" (13:28)",
    hadithLink: "https://quran.com/13/28",
    inlineTool: "breathing",
    verifyType: "time",
    verifyMinSeconds: 16,
  },
  {
    instruction: "Change Position",
    icon: "🧘",
    arabic: "إِذَا غَضِبَ أَحَدُكُمْ وَهُوَ قَائِمٌ فَلْيَجْلِسْ",
    transliteration: "Idhā ghaḍiba aḥadukum wa huwa qā'imun falyajlis",
    translation: "If one of you becomes angry while standing, let him sit down",
    desc: "If the anger goes away, fine; otherwise let him lie down.",
    hadithSource: "Sunan Abu Dawud 4782",
    hadithBook: "Sunan Abu Dawud",
    hadithNarrator: "Narrated by Abu Dharr al-Ghifari (رضي الله عنه)",
    hadithFull: "The Prophet ﷺ said: \"If one of you becomes angry while standing, let him sit down. If his anger leaves him, well and good; otherwise let him lie down.\"",
    hadithLink: "https://sunnah.com/abudawud:4782",
    verifyType: "action",
  },
  {
    instruction: "Seek Refuge in Allah",
    icon: "🤲",
    arabic: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
    transliteration: "A'ūdhu billāhi min ash-Shayṭān ir-Rajīm",
    translation: "I seek refuge in Allah from the accursed Shaytan",
    desc: "The Prophet ﷺ taught that anger is from Shaytan, and seeking refuge in Allah extinguishes it.",
    hadithSource: "Sahih al-Bukhari 3282, Sahih Muslim 2610",
    hadithBook: "Sahih al-Bukhari & Sahih Muslim",
    hadithNarrator: "Narrated by Sulaiman bin Surd (رضي الله عنه)",
    hadithFull: "Two men abused each other in the presence of the Prophet ﷺ and one of them became very angry — his face turned red. The Prophet ﷺ said: \"I know a word which, if he were to say it, what he feels would go away. If he said: 'A'ūdhu billāhi min ash-Shayṭān ir-Rajīm', what he feels would go away.\"",
    hadithLink: "https://sunnah.com/bukhari:6115",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3",
    verifyType: "action",
  },
  {
    instruction: "Make Wudu",
    icon: "💧",
    arabic: "إِنَّ الْغَضَبَ مِنَ الشَّيْطَانِ وَإِنَّ الشَّيْطَانَ خُلِقَ مِنَ النَّارِ",
    transliteration: "Innal-ghaḍaba min ash-Shayṭān, wa innash-Shayṭāna khuliqa min an-nār",
    translation: "Indeed anger is from Shaytan, and indeed Shaytan was created from fire",
    desc: "And fire is extinguished with water, so when one of you becomes angry, let him make wudu.",
    hadithSource: "Sunan Abu Dawud 4784",
    hadithBook: "Sunan Abu Dawud",
    hadithNarrator: "Narrated by Atiyyah as-Sa'di (رضي الله عنه)",
    hadithFull: "The Prophet ﷺ said: \"Indeed anger is from Shaytan, and indeed Shaytan was created from fire, and fire is only extinguished with water. So when one of you becomes angry, let him perform wudu.\"",
    hadithLink: "https://sunnah.com/abudawud:4784",
    inlineTool: "wudu",
    verifyType: "steps",
  },
];

// Mini wudu steps for inline use
const miniWuduSteps = [
  { title: "Intention", icon: "🤲", desc: "Make intention in your heart", image: null },
  { title: "Bismillah", icon: "🗣️", desc: "Say Bismillah", image: null },
  { title: "Wash Hands ×3", icon: "🖐️", desc: "Wash both hands to wrists", image: wuduHands },
  { title: "Rinse Mouth ×3", icon: "👄", desc: "Swirl water in mouth", image: wuduMouth },
  { title: "Wash Face ×3", icon: "😊", desc: "Hairline to chin, ear to ear", image: null },
  { title: "Wash Arms ×3", icon: "💪", desc: "Fingertips to elbows", image: wuduArms },
  { title: "Wipe Head", icon: "🧑", desc: "Front to back and back", image: wuduHead },
  { title: "Wash Feet ×3", icon: "🦶", desc: "Including ankles & between toes", image: wuduFeet },
];

const breathingPhases = [
  { label: "Inhale", duration: 4, arabic: "بِسْمِ اللَّهِ" },
  { label: "Hold", duration: 4, arabic: "سُبْحَانَ اللَّهِ" },
  { label: "Exhale", duration: 6, arabic: "الْحَمْدُ لِلَّهِ" },
  { label: "Hold", duration: 2, arabic: "اللَّهُ أَكْبَرُ" },
];

const emojis = ["😐", "😠", "😡", "🤬", "😤"];
const tacticOptions = ["Stayed Silent", "Deep Breathing", "Changed Position", "Said A'udhu Billah", "Made Wudu", "Dhikr", "Quran Recitation", "Walked Away", "Made Dua"];

interface EmergencyFlowProps {
  onClose: () => void;
}

// ─── Inline Silence Timer (Enhanced) ───
const silenceMotivations = [
  { arabic: "إِذَا غَضِبَ أَحَدُكُمْ فَلْيَسْكُتْ", english: "If any of you becomes angry, let him keep silent.", source: "Musnad Ahmad 2136", link: "https://sunnah.com/ahmad:2136" },
  { arabic: "مَنْ صَمَتَ نَجَا", english: "Whoever is silent is saved.", source: "Tirmidhi 2501", link: "https://sunnah.com/tirmidhi:2501" },
  { english: "Speak good or remain silent.", source: "Bukhari 6018", link: "https://sunnah.com/bukhari:6018" },
  { english: "The believer does not insult, curse, or speak obscenely.", source: "Tirmidhi 1977", link: "https://sunnah.com/tirmidhi:1977" },
  { arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", english: "Indeed, with hardship comes ease.", source: "Qur'an 94:6", link: "https://quran.com/94/6" },
];

const quickSurahsInline = [
  { id: "93", name: "Ad-Duha", emoji: "☀️" },
  { id: "94", name: "Ash-Sharh", emoji: "💚" },
  { id: "112", name: "Al-Ikhlas", emoji: "🕌" },
];

const InlineSilenceTimer = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<"select" | "running" | "done">("select");
  const [totalSeconds, setTotalSeconds] = useState(60);
  const [remaining, setRemaining] = useState(0);
  const [currentMotivation, setCurrentMotivation] = useState(0);
  const [playingSurah, setPlayingSurah] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const start = (secs: number) => {
    setTotalSeconds(secs);
    setRemaining(secs);
    setPhase("running");
    setCurrentMotivation(Math.floor(Math.random() * silenceMotivations.length));
  };

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

  // Rotate motivations
  useEffect(() => {
    if (phase !== "running") return;
    const iv = setInterval(() => {
      setCurrentMotivation((prev) => (prev + 1) % silenceMotivations.length);
    }, 10000);
    return () => clearInterval(iv);
  }, [phase]);

  const playQuran = (surahId: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      if (playingSurah === surahId) { setPlayingSurah(null); return; }
    }
    const url = `https://server8.mp3quran.net/afs/${surahId.padStart(3, "0")}.mp3`;
    const audio = new Audio(url);
    audioRef.current = audio;
    setPlayingSurah(surahId);
    audio.play().catch(() => {});
    audio.onended = () => setPlayingSurah(null);
  };

  const stopAudio = () => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    setPlayingSurah(null);
  };

  const progress = totalSeconds > 0 ? 1 - remaining / totalSeconds : 0;
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  const mot = silenceMotivations[currentMotivation];

  if (phase === "done") {
    stopAudio();
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-success/30 bg-success/5 p-4 text-center">
        <span className="text-3xl">✅</span>
        <p className="mt-1 text-sm font-medium text-foreground">Silence completed!</p>
        <button onClick={onComplete} className="mt-2 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground">
          Continue →
        </button>
      </motion.div>
    );
  }

  if (phase === "running") {
    return (
      <div className="rounded-2xl border border-border bg-card p-4 text-center">
        {/* Circle timer */}
        <div className="relative mx-auto mb-3 h-28 w-28">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
            <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(var(--primary))" strokeWidth="6"
              strokeDasharray={`${progress * 2 * Math.PI * 52} ${2 * Math.PI * 52}`}
              strokeLinecap="round" className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span className="text-xl" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity }}>🤫</motion.span>
            <p className="font-heading text-lg font-bold text-foreground">{formatTime(remaining)}</p>
          </div>
        </div>

        {/* Quran audio */}
        <div className="mb-3 rounded-lg border border-border bg-background p-2">
          <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">🎧 Listen while silent</p>
          <div className="flex gap-1.5 justify-center">
            {quickSurahsInline.map((s) => (
              <button key={s.id} onClick={() => playQuran(s.id)}
                className={`flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium transition-all ${
                  playingSurah === s.id ? "bg-primary text-primary-foreground" : "border border-border text-foreground hover:bg-muted"
                }`}
              >
                {s.emoji} {s.name} {playingSurah === s.id ? "⏸" : "▶"}
              </button>
            ))}
          </div>
          {playingSurah && (
            <div className="mt-1.5 flex items-center justify-center gap-1">
              <motion.div className="h-1 w-1 rounded-full bg-primary" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 0.5, repeat: Infinity }} />
              <motion.div className="h-1 w-1 rounded-full bg-primary" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.15 }} />
              <motion.div className="h-1 w-1 rounded-full bg-primary" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.3 }} />
              <span className="text-[9px] text-primary ml-0.5">Playing...</span>
            </div>
          )}
        </div>

        {/* Rotating motivation */}
        <AnimatePresence mode="wait">
          <motion.div key={currentMotivation} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="mb-3 rounded-xl bg-gradient-calm border border-border p-2.5"
          >
            {mot.arabic && <p className="mb-0.5 font-arabic text-sm leading-relaxed text-foreground" dir="rtl">{mot.arabic}</p>}
            <p className="text-[11px] text-muted-foreground italic">"{mot.english}"</p>
            <a href={mot.link} target="_blank" rel="noopener noreferrer" className="text-[9px] text-primary underline">{mot.source} →</a>
          </motion.div>
        </AnimatePresence>

        {/* Breathing indicator */}
        <motion.div className="mx-auto h-2.5 w-2.5 rounded-full bg-primary" animate={{ scale: [1, 2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 4, repeat: Infinity }} />
        <p className="mt-1 text-[10px] text-muted-foreground">Breathe slowly...</p>

        <button
          onClick={() => { stopAudio(); if (intervalRef.current) clearInterval(intervalRef.current); setPhase("done"); }}
          className="mt-3 rounded-lg border border-border px-4 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
        >
          End Early
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">⏱️ Start Silence Timer</p>
      <div className="grid grid-cols-4 gap-2">
        {[{ l: "30s", s: 30 }, { l: "1m", s: 60 }, { l: "2m", s: 120 }, { l: "5m", s: 300 }].map((d) => (
          <motion.button key={d.s} onClick={() => start(d.s)} whileTap={{ scale: 0.95 }}
            className="rounded-lg border border-border bg-background p-2 text-xs font-bold text-primary hover:bg-muted"
          >
            {d.l}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// ─── Inline Breathing ───
const InlineBreathing = ({ onComplete }: { onComplete: () => void }) => {
  const [started, setStarted] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(breathingPhases[0].duration);
  const [cycles, setCycles] = useState(0);
  const totalCycles = 3;
  const done = cycles >= totalCycles;

  useEffect(() => {
    if (!started || done) return;
    const iv = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          const next = (phaseIdx + 1) % breathingPhases.length;
          if (next === 0) setCycles((c) => c + 1);
          setPhaseIdx(next);
          return breathingPhases[next].duration;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [started, phaseIdx, done]);

  if (done) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-success/30 bg-success/5 p-4 text-center">
        <span className="text-3xl">✅</span>
        <p className="mt-1 text-sm font-medium text-foreground">Breathing complete!</p>
        <button onClick={onComplete} className="mt-2 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground">Continue →</button>
      </motion.div>
    );
  }

  const bp = breathingPhases[phaseIdx];
  const scaleMap: Record<string, number[]> = { Inhale: [0.7, 1.2], Hold: [1.2, 1.2], Exhale: [1.2, 0.7] };
  const scale = scaleMap[bp.label] || [1, 1];

  if (!started) {
    return (
      <div className="rounded-2xl border border-border bg-card p-4 text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">🌊 Breathing Exercise</p>
        <p className="mb-3 text-xs text-muted-foreground">{totalCycles} cycles · 4-4-6-2 technique</p>
        <button onClick={() => setStarted(true)} className="rounded-lg bg-primary px-5 py-2 text-xs font-medium text-primary-foreground">Begin Breathing</button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-4 text-center">
      <p className="mb-1 text-[10px] text-muted-foreground">Cycle {cycles + 1}/{totalCycles}</p>
      <div className="relative mx-auto my-4 flex h-28 w-28 items-center justify-center">
        <motion.div className="absolute inset-0 rounded-full bg-primary/15 border border-primary/30" animate={{ scale }} transition={{ duration: bp.duration, ease: "easeInOut" }} />
        <div className="relative z-10 text-center">
          <p className="font-heading text-sm font-bold text-primary">{bp.label}</p>
          <p className="font-heading text-xl font-bold text-foreground">{secondsLeft}</p>
        </div>
      </div>
      <p className="font-arabic text-lg text-foreground" dir="rtl">{bp.arabic}</p>
      <button onClick={() => setCycles(totalCycles)} className="mt-3 rounded-lg border border-border px-4 py-1.5 text-xs text-muted-foreground hover:bg-muted">End Early</button>
    </div>
  );
};

// ─── Full Wudu Steps for inline use ───
const fullWuduSteps = [
  { title: "Intention (Niyyah)", arabic: "نَوَيْتُ الْوُضُوءَ", transliteration: "Nawaytu al-wuḍū'", desc: "Make the intention in your heart to perform wudu for the sake of Allah.", icon: "🤲", image: null as string | null, sunnah: "Actions are judged by intentions.", sunnahShort: "Bukhari 1", sunnahLink: "https://sunnah.com/bukhari:1", tips: "The intention distinguishes between washing for cleanliness and performing wudu as worship." },
  { title: "Say Bismillah", arabic: "بِسْمِ اللَّهِ", transliteration: "Bismillāh", desc: "Say 'In the name of Allah' before beginning.", icon: "🗣️", image: null as string | null, sunnah: "There is no wudu for the one who does not mention the name of Allah.", sunnahShort: "Abu Dawud 101", sunnahLink: "https://sunnah.com/abudawud:101", tips: null as string | null },
  { title: "Wash Hands (×3)", desc: "Wash both hands up to the wrists three times. Start right, then left. Water must reach between fingers.", icon: "🖐️", image: wuduHands, sunnah: "The Prophet ﷺ used to wash his hands three times.", sunnahShort: "Bukhari 159", sunnahLink: "https://sunnah.com/bukhari:159", tips: "Interlock fingers to ensure water passes between them.", arabic: null as string | null, transliteration: null as string | null },
  { title: "Rinse Mouth (×3)", arabic: "الْمَضْمَضَة", transliteration: "Al-Maḍmaḍah", desc: "Take water, swirl in mouth thoroughly, spit out. Repeat three times.", icon: "👄", image: wuduMouth, sunnah: "The Prophet ﷺ used to rinse his mouth and nose together.", sunnahShort: "Bukhari 191", sunnahLink: "https://sunnah.com/bukhari:191", tips: null as string | null },
  { title: "Sniff & Blow Nose (×3)", arabic: "الاِسْتِنْشَاق", transliteration: "Al-Istinshāq", desc: "Sniff water gently into nostrils (right hand), blow out (left hand).", icon: "👃", image: null as string | null, sunnah: "Let him sniff water into his nose and then blow it out.", sunnahShort: "Muslim 237", sunnahLink: "https://sunnah.com/muslim:237", tips: "Be gentle — don't sniff too hard." },
  { title: "Wash Face (×3)", desc: "Wash entire face — hairline to chin, ear to ear.", icon: "😊", image: null as string | null, sunnah: null as string | null, sunnahShort: null as string | null, sunnahLink: null as string | null, tips: "Run wet fingers through your beard if applicable.", arabic: null as string | null, transliteration: null as string | null },
  { title: "Wash Arms (×3)", desc: "Right arm fingertips to elbow (inclusive) ×3, then left arm.", icon: "💪", image: wuduArms, sunnah: "The Prophet ﷺ washed his arms up to and including the elbows.", sunnahShort: "Muslim 246", sunnahLink: "https://sunnah.com/muslim:246", tips: "Don't forget the elbow — rotate arm to cover all sides.", arabic: null as string | null, transliteration: null as string | null },
  { title: "Wipe Head (×1)", arabic: "الْمَسْح", transliteration: "Al-Masḥ", desc: "Wet hands, wipe from forehead to back of head and back.", icon: "🧑", image: wuduHead, sunnah: "The Prophet ﷺ wiped front to back and back again.", sunnahShort: "Bukhari 185", sunnahLink: "https://sunnah.com/bukhari:185", tips: "Done only once. Use fresh water." },
  { title: "Wipe Ears (×1)", desc: "Insert index fingers into ear openings, wipe backs with thumbs.", icon: "👂", image: null as string | null, sunnah: "The ears are part of the head.", sunnahShort: "Abu Dawud 134", sunnahLink: "https://sunnah.com/abudawud:134", tips: null as string | null, arabic: null as string | null, transliteration: null as string | null },
  { title: "Wash Feet (×3)", desc: "Wash right foot including ankle ×3, then left. Water between toes.", icon: "🦶", image: wuduFeet, sunnah: "Woe to the heels from the Hellfire!", sunnahShort: "Bukhari 165", sunnahLink: "https://sunnah.com/bukhari:165", tips: "Use left pinky to wash between toes. Don't neglect heels.", arabic: null as string | null, transliteration: null as string | null },
  { title: "Dua After Wudu", arabic: "أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ", transliteration: "Ash-hadu an lā ilāha illallāh", desc: "I testify there is no god but Allah alone, and Muhammad is His servant and messenger.", icon: "✨", image: null as string | null, sunnah: "Whoever says this after wudu, the eight gates of Paradise open.", sunnahShort: "Muslim 234", sunnahLink: "https://sunnah.com/muslim:234", tips: null as string | null },
];

// ─── Inline Wudu (Enhanced with full guide) ───
const InlineWudu = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [showSunnah, setShowSunnah] = useState(false);
  const current = fullWuduSteps[step];
  const allDone = completedSteps.size === fullWuduSteps.length;

  const markDone = () => {
    setCompletedSteps((prev) => new Set(prev).add(step));
    setShowSunnah(false);
    if (step < fullWuduSteps.length - 1) {
      setStep(step + 1);
    }
  };

  if (allDone) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-success/30 bg-success/5 p-4 text-center">
        <span className="text-3xl">💧</span>
        <p className="mt-1 text-sm font-medium text-foreground">Wudu complete!</p>
        <div className="mt-2 mb-2 rounded-xl bg-gradient-calm border border-border p-2.5">
          <p className="font-arabic text-sm leading-relaxed text-foreground" dir="rtl">اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ</p>
          <p className="mt-1 text-[10px] text-muted-foreground italic">"O Allah, make me among those who repent and purify themselves."</p>
          <a href="https://sunnah.com/tirmidhi:55" target="_blank" rel="noopener noreferrer" className="text-[9px] text-primary underline">Tirmidhi 55 →</a>
        </div>
        <button onClick={onComplete} className="mt-2 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground">Continue →</button>
      </motion.div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">💧 Wudu Guide — Step {step + 1}/{fullWuduSteps.length}</p>
      
      {/* Progress bar */}
      <div className="mb-3 flex gap-0.5">
        {fullWuduSteps.map((_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${completedSteps.has(i) ? "bg-success" : i === step ? "bg-primary" : "bg-muted"}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }}>
          {/* Image or icon */}
          <div className="flex items-start gap-3 mb-3">
            {current.image ? (
              <img src={current.image} alt={current.title} className="h-16 w-16 rounded-xl object-cover border border-border flex-shrink-0" loading="lazy" />
            ) : (
              <span className="text-3xl flex-shrink-0">{current.icon}</span>
            )}
            <div className="text-left flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">{current.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{current.desc}</p>
            </div>
          </div>

          {/* Arabic if available */}
          {current.arabic && (
            <div className="mb-3 rounded-lg bg-gradient-calm border border-border p-2.5 text-center">
              <p className="font-arabic text-base leading-relaxed text-foreground" dir="rtl">{current.arabic}</p>
              {current.transliteration && <p className="mt-0.5 text-[10px] font-medium text-primary italic">{current.transliteration}</p>}
            </div>
          )}

          {/* Tips */}
          {current.tips && (
            <div className="mb-3 flex items-start gap-1.5 rounded-lg border border-secondary/30 bg-secondary/5 p-2 text-left">
              <span className="text-xs">💡</span>
              <p className="text-[11px] text-foreground">{current.tips}</p>
            </div>
          )}

          {/* Sunnah reference */}
          {current.sunnah && (
            <div className="mb-3 text-center">
              <button onClick={() => setShowSunnah(!showSunnah)} className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors">
                📚 {current.sunnahShort} {showSunnah ? "▲" : "▼"}
              </button>
              <AnimatePresence>
                {showSunnah && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="mt-1.5 rounded-lg border border-border bg-background p-2 text-left">
                      <p className="text-[11px] text-foreground italic">"{current.sunnah}"</p>
                      {current.sunnahLink && <a href={current.sunnahLink} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-[10px] text-primary underline">View source →</a>}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-2">
        <button onClick={() => { setStep(Math.max(0, step - 1)); setShowSunnah(false); }} disabled={step === 0}
          className="flex-1 rounded-lg border border-border py-2 text-xs font-medium text-foreground disabled:opacity-30 hover:bg-muted"
        >Back</button>
        <button onClick={markDone}
          className="flex-1 rounded-lg bg-primary py-2 text-xs font-medium text-primary-foreground transition-all active:scale-95"
        >{step === fullWuduSteps.length - 1 ? "Complete Wudu ✨" : "Done ✓ Next"}</button>
      </div>
    </div>
  );
};

const EmergencyFlow = ({ onClose }: EmergencyFlowProps) => {
  const { addAngerEntry } = useApp();
  useEscapeKey(onClose);
  const [phase, setPhase] = useState<"intensity" | "steps" | "checkin" | "reward" | "journal">("intensity");
  const [intensity, setIntensity] = useState(3);
  const [currentStep, setCurrentStep] = useState(0);
  const [showHadithDetail, setShowHadithDetail] = useState(false);
  const [showInlineTool, setShowInlineTool] = useState(false);
  const [stepCompleted, setStepCompleted] = useState<Set<number>>(new Set());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const stepStartRef = useRef<number>(Date.now());

  // Journal fields
  const [journalTrigger, setJournalTrigger] = useState("");
  const [journalSituation, setJournalSituation] = useState("");
  const [tacticsUsed, setTacticsUsed] = useState<string[]>([]);
  const [journalReflection, setJournalReflection] = useState("");

  const handleIntensitySelect = (level: number) => {
    setIntensity(level);
    setPhase("steps");
    startTimeRef.current = Date.now();
    stepStartRef.current = Date.now();
  };

  const markStepComplete = () => {
    setStepCompleted((prev) => new Set(prev).add(currentStep));
    setShowInlineTool(false);
  };

  const nextStep = () => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    setShowHadithDetail(false);
    setShowInlineTool(false);
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      stepStartRef.current = Date.now();
    } else {
      setPhase("checkin");
    }
  };

  const skipStep = () => {
    nextStep();
  };

  const playAudio = (url: string) => {
    if (audioRef.current) audioRef.current.pause();
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.play().catch(() => {});
  };

  const handleCheckin = (feeling: number) => {
    if (feeling <= 2) setPhase("reward");
    else { setCurrentStep(0); setPhase("steps"); }
  };

  const toggleTactic = (tactic: string) => {
    setTacticsUsed((prev) => prev.includes(tactic) ? prev.filter((t) => t !== tactic) : [...prev, tactic]);
  };

  const handleJournalSave = () => {
    const durationSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
    addAngerEntry({ trigger: journalTrigger || "Emergency", situation: journalSituation || journalTrigger || "Emergency flow", intensity, controlled: true, reflection: journalReflection, tacticsUsed, durationSeconds });
    onClose();
  };

  const handleSkipJournal = () => {
    const durationSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
    addAngerEntry({ trigger: "Emergency", intensity, controlled: true, situation: "Emergency flow", durationSeconds });
    onClose();
  };

  const durationSoFar = Math.round((Date.now() - startTimeRef.current) / 1000);
  const formatDuration = (s: number) => s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`;

  const step = steps[currentStep];
  const isCompleted = stepCompleted.has(currentStep);

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-background/95 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <button onClick={() => { if (audioRef.current) audioRef.current.pause(); onClose(); }} className="absolute right-4 top-4 z-10 rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground" aria-label="Close">✕</button>

      <div className="w-full max-w-sm px-4 py-8">
        <AnimatePresence mode="wait">
          {phase === "intensity" && (
            <motion.div key="intensity" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
              <h2 className="mb-2 font-heading text-2xl font-bold text-foreground">How angry are you?</h2>
              <p className="mb-8 text-sm text-muted-foreground">Tap to select your level</p>
              <div className="flex justify-center gap-3">
                {emojis.map((e, i) => (
                  <button key={i} onClick={() => handleIntensitySelect(i + 1)} className="rounded-2xl border border-border bg-card p-4 text-4xl transition-all hover:scale-110 hover:shadow-calm active:scale-95" aria-label={`Anger level ${i + 1}`}>{e}</button>
                ))}
              </div>
            </motion.div>
          )}

          {phase === "steps" && (
            <motion.div key={`step-${currentStep}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="text-center">
              {/* Progress */}
              <div className="mb-4 flex gap-1">
                {steps.map((_, i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-all ${stepCompleted.has(i) ? "bg-success" : i <= currentStep ? "bg-primary" : "bg-muted"}`} />
                ))}
              </div>

              <div className="mb-2 flex items-center justify-center gap-2">
                <span className="text-sm text-muted-foreground">Step {currentStep + 1} of {steps.length}</span>
                {isCompleted && <span className="rounded-full bg-success/20 px-2 py-0.5 text-[10px] font-bold text-success">✓ Done</span>}
              </div>
              <span className="mb-4 block text-6xl">{step.icon}</span>
              <h2 className="mb-3 font-heading text-3xl font-bold text-foreground">{step.instruction}</h2>

              {step.arabic && (
                <div className="mb-4 rounded-2xl bg-gradient-calm border border-border p-4">
                  <p className="mb-2 font-arabic text-2xl leading-relaxed text-foreground" dir="rtl">{step.arabic}</p>
                  {step.transliteration && <p className="mb-1 text-sm font-medium text-primary italic">{step.transliteration}</p>}
                  {step.translation && <p className="text-sm text-muted-foreground">"{step.translation}"</p>}
                  {step.audioUrl && (
                    <button onClick={() => playAudio(step.audioUrl!)} className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-all hover:bg-primary/20 active:scale-95">
                      🔊 Listen to Recitation
                    </button>
                  )}
                </div>
              )}

              <p className="mb-4 text-sm text-muted-foreground">{step.desc}</p>

              {/* Default breathing animation for step 1 (no inline tool opened) */}
              {currentStep === 1 && !showInlineTool && (
                <div className="mx-auto mb-4 flex flex-col items-center justify-center">
                  <motion.div className="rounded-full bg-primary/20 border-2 border-primary" animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} style={{ width: 100, height: 100 }} />
                  <motion.p className="mt-2 text-sm font-medium text-primary" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 4, repeat: Infinity }}>Breathe...</motion.p>
                </div>
              )}

              {/* Inline Tool */}
              {step.inlineTool && (
                <div className="mb-4">
                  {!showInlineTool && !isCompleted ? (
                    <button onClick={() => setShowInlineTool(true)}
                      className="w-full rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 py-3 text-sm font-medium text-primary transition-all hover:border-primary/50 hover:bg-primary/10"
                    >
                      {step.inlineTool === "silence" && "⏱️ Start Silence Timer"}
                      {step.inlineTool === "breathing" && "🌊 Start Breathing Exercise"}
                      {step.inlineTool === "wudu" && "💧 Start Wudu Guide"}
                    </button>
                  ) : showInlineTool && !isCompleted ? (
                    <AnimatePresence>
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                        {step.inlineTool === "silence" && <InlineSilenceTimer onComplete={markStepComplete} />}
                        {step.inlineTool === "breathing" && <InlineBreathing onComplete={markStepComplete} />}
                        {step.inlineTool === "wudu" && <InlineWudu onComplete={markStepComplete} />}
                      </motion.div>
                    </AnimatePresence>
                  ) : null}
                </div>
              )}

              {/* Hadith detail */}
              {step.hadithSource && (
                <div className="mb-4">
                  <button onClick={() => setShowHadithDetail(!showHadithDetail)} className="inline-flex items-center gap-1 rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
                    📚 {step.hadithSource} {showHadithDetail ? "▲" : "▼"}
                  </button>
                  <AnimatePresence>
                    {showHadithDetail && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="mt-2 rounded-xl border border-border bg-card p-4 text-left">
                          {step.hadithNarrator && <p className="mb-1 text-xs font-semibold text-primary">{step.hadithNarrator}</p>}
                          {step.hadithBook && <p className="mb-2 text-xs text-muted-foreground">{step.hadithBook}</p>}
                          <p className="text-sm text-foreground leading-relaxed">{step.hadithFull}</p>
                          {step.hadithLink && <a href={step.hadithLink} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs text-primary underline">View full hadith on Sunnah.com →</a>}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-2">
                <button onClick={skipStep} className="flex-1 rounded-xl border border-border bg-card py-3 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
                  Skip
                </button>
                <button onClick={nextStep}
                  className={`flex-1 rounded-xl py-3 font-heading font-semibold shadow-calm transition-all hover:scale-105 active:scale-95 ${
                    isCompleted ? "bg-success text-white" : "bg-primary text-primary-foreground"
                  }`}
                >
                  {isCompleted ? "✓ " : ""}{currentStep < steps.length - 1 ? "Next Step" : "How do you feel?"}
                </button>
              </div>
            </motion.div>
          )}

          {phase === "checkin" && (
            <motion.div key="checkin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
              <h2 className="mb-2 font-heading text-2xl font-bold text-foreground">How do you feel now?</h2>
              <p className="mb-4 text-sm text-muted-foreground">
                You completed {stepCompleted.size}/{steps.length} steps. Still angry? We can go again.
              </p>
              <div className="flex justify-center gap-3">
                {emojis.map((e, i) => (
                  <button key={i} onClick={() => handleCheckin(i + 1)} className="rounded-2xl border border-border bg-card p-4 text-4xl transition-all hover:scale-110 active:scale-95">{e}</button>
                ))}
              </div>
            </motion.div>
          )}

          {phase === "reward" && (
            <motion.div key="reward" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <motion.span className="mb-4 block text-6xl" animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 0.5 }}>🌟</motion.span>
              <h2 className="mb-2 font-heading text-2xl font-bold text-foreground">You controlled your anger!</h2>
              <div className="mb-4 rounded-2xl bg-gradient-calm border border-border p-4">
                <p className="mb-2 font-arabic text-lg leading-relaxed text-foreground" dir="rtl">لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ</p>
                <p className="mb-1 text-sm font-medium text-primary italic">Laysal-shadīdu biṣ-ṣur'ah, innamash-shadīdul-ladhī yamliku nafsahū 'indal-ghaḍab</p>
                <p className="mb-2 text-sm text-muted-foreground italic">"The strong person is not the one who can wrestle, but the one who controls himself at the time of anger."</p>
                <p className="text-xs text-muted-foreground">Narrated by Abu Hurayrah (رضي الله عنه) — <a href="https://sunnah.com/bukhari:6114" target="_blank" rel="noopener noreferrer" className="text-primary underline">Sahih al-Bukhari 6114</a></p>
              </div>
              <div className="mb-4 rounded-xl border border-border bg-card p-3">
                <p className="text-xs text-muted-foreground">⏱️ Time to calm down</p>
                <p className="font-heading text-xl font-bold text-primary">{formatDuration(durationSoFar)}</p>
              </div>
              <div className="mb-3 rounded-xl border border-border bg-card p-2">
                <p className="text-[10px] text-muted-foreground mb-1">Steps completed</p>
                <div className="flex justify-center gap-2">
                  {steps.map((s, i) => (
                    <span key={i} className={`text-lg ${stepCompleted.has(i) ? "" : "opacity-30"}`} title={s.instruction}>{s.icon}</span>
                  ))}
                </div>
              </div>
              <div className="my-4 rounded-xl bg-primary/10 p-4">
                <span className="text-2xl font-bold text-primary">+10 Sabr Points 🌟</span>
              </div>
              <div className="flex gap-2">
                <button onClick={handleSkipJournal} className="flex-1 rounded-xl border border-border bg-card py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted">Skip</button>
                <button onClick={() => {
                  // Pre-populate tactics based on completed steps
                  const stepToTactic: Record<number, string> = { 0: "Stayed Silent", 1: "Deep Breathing", 2: "Changed Position", 3: "Said A'udhu Billah", 4: "Made Wudu" };
                  const auto = Array.from(stepCompleted).map((i) => stepToTactic[i]).filter(Boolean);
                  setTacticsUsed(auto);
                  setPhase("journal");
                }} className="flex-1 rounded-xl bg-primary px-6 py-3 font-heading font-semibold text-primary-foreground shadow-calm transition-all hover:scale-105 active:scale-95">📓 Journal This</button>
              </div>
            </motion.div>
          )}

          {phase === "journal" && (
            <motion.div key="journal" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="text-center">
              <h2 className="mb-1 font-heading text-xl font-bold text-foreground">📓 Quick Journal</h2>
              <p className="mb-4 text-xs text-muted-foreground">Log what happened — it helps you grow</p>
              <div className="mb-3 text-left">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">What triggered you?</label>
                <div className="flex flex-wrap gap-1.5">
                  {["Work stress", "Family", "Online", "Traffic", "Parenting", "Relationship", "Other"].map((t) => (
                    <button key={t} onClick={() => setJournalTrigger(t)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${journalTrigger === t ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground"}`}>{t}</button>
                  ))}
                </div>
              </div>
              <div className="mb-3 text-left">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">What happened?</label>
                <textarea value={journalSituation} onChange={(e) => setJournalSituation(e.target.value)} placeholder="Brief description..." className="w-full rounded-xl border border-border bg-card p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary" rows={2} />
              </div>
              <div className="mb-3 text-left">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tactics you used</label>
                <div className="flex flex-wrap gap-1.5">
                  {tacticOptions.map((t) => (
                    <button key={t} onClick={() => toggleTactic(t)} className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all ${tacticsUsed.includes(t) ? "bg-success text-white" : "border border-border bg-card text-foreground"}`}>
                      {tacticsUsed.includes(t) ? "✓ " : ""}{t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-3 rounded-xl border border-border bg-card p-2.5 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">⏱️ Time logged</span>
                <span className="text-sm font-bold text-primary">{formatDuration(Math.round((Date.now() - startTimeRef.current) / 1000))}</span>
              </div>
              <div className="mb-4 text-left">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Reflection (optional)</label>
                <textarea value={journalReflection} onChange={(e) => setJournalReflection(e.target.value)} placeholder="What would you do differently?" className="w-full rounded-xl border border-border bg-card p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary" rows={2} />
              </div>
              <button onClick={handleJournalSave} className="w-full rounded-xl bg-primary px-6 py-3 font-heading font-semibold text-primary-foreground shadow-calm transition-all hover:scale-105 active:scale-95">Save Entry · +10 SP 🌟</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default EmergencyFlow;
