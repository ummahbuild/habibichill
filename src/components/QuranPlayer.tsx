import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

const surahList = [
  { id: "1", name: "Al-Fatiha", desc: "The Opening", verses: 7 },
  { id: "36", name: "Ya-Sin", desc: "Heart of the Quran", verses: 83 },
  { id: "55", name: "Ar-Rahman", desc: "The Most Merciful", verses: 78 },
  { id: "56", name: "Al-Waqi'ah", desc: "The Inevitable", verses: 96 },
  { id: "67", name: "Al-Mulk", desc: "The Sovereignty", verses: 30 },
  { id: "73", name: "Al-Muzzammil", desc: "The Enshrouded One", verses: 20 },
  { id: "93", name: "Ad-Duha", desc: "The Morning Hours", verses: 11 },
  { id: "94", name: "Ash-Sharh", desc: "The Relief", verses: 8 },
  { id: "112", name: "Al-Ikhlas", desc: "Sincerity", verses: 4 },
  { id: "113", name: "Al-Falaq", desc: "The Daybreak", verses: 5 },
  { id: "114", name: "An-Nas", desc: "Mankind", verses: 6 },
];

const reciters = [
  { id: "ar.alafasy", name: "Mishary Alafasy", short: "Alafasy" },
  { id: "ar.abdulbasitmurattal", name: "Abdul Basit (Murattal)", short: "Abdul Basit" },
  { id: "ar.abdurrahmaansudais", name: "Abdurrahman As-Sudais", short: "As-Sudais" },
  { id: "ar.hudhaify", name: "Ali Al-Hudhaify", short: "Al-Hudhaify" },
  { id: "ar.minshawi", name: "Mohamed Al-Minshawi", short: "Al-Minshawi" },
  { id: "ar.muhammadayyoub", name: "Muhammad Ayyub", short: "M. Ayyub" },
];

const getAudioUrl = (surahId: string, reciterId: string) =>
  `https://cdn.islamic.network/quran/audio-surah/128/${reciterId}/${surahId}.mp3`;

interface QuranPlayerProps {
  currentSurahId: string;
  onChangeSurah: (id: string) => void;
  onClose: () => void;
}

const QuranPlayer = ({ currentSurahId, onChangeSurah, onClose }: QuranPlayerProps) => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [showReciterPicker, setShowReciterPicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const [reciter, setReciter] = useState(() =>
    localStorage.getItem("hc-reciter") || "ar.alafasy"
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const togglePlayRef = useRef(() => {});
  const playNextRef = useRef(() => {});
  const playPrevRef = useRef(() => {});

  const currentSurah = surahList.find((s) => s.id === currentSurahId) || surahList[0];
  const currentIndex = surahList.findIndex((s) => s.id === currentSurahId);
  const currentReciter = reciters.find((r) => r.id === reciter) || reciters[0];

  const shortcuts = useMemo(() => [
    { key: " ", handler: () => togglePlayRef.current() },
    { key: "Escape", handler: () => onClose() },
    { key: "ArrowRight", handler: () => playNextRef.current() },
    { key: "ArrowLeft", handler: () => playPrevRef.current() },
  ], [onClose]);

  useKeyboardShortcuts(shortcuts);

  // Initialize audio element once
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.preload = "auto";
      audioRef.current = audio;
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeAttribute("src");
        audioRef.current.load();
      }
    };
  }, []);

  // Update source when surah or reciter changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setLoading(true);
    setProgress(0);
    setAudioError(false);

    const url = getAudioUrl(currentSurahId, reciter);
    audio.src = url;
    audio.load();

    // Attach event handlers
    const onPlay = () => { setIsPlaying(true); setLoading(false); setAudioError(false); };
    const onPause = () => setIsPlaying(false);
    const onEnded = () => playNextRef.current();
    const onTimeUpdate = () => {
      if (audio.duration) setProgress(audio.currentTime / audio.duration);
    };
    const onLoadedMetadata = () => { setLoading(false); setDuration(audio.duration); };
    const onCanPlay = () => setLoading(false);
    const onError = () => { setLoading(false); setAudioError(true); };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("canplay", onCanPlay);
    audio.addEventListener("error", onError);

    // Attempt autoplay — will fail silently if no user gesture
    audio.play().catch(() => setIsPlaying(false));

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("canplay", onCanPlay);
      audio.removeEventListener("error", onError);
    };
  }, [currentSurahId, reciter]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
  }, [isPlaying]);

  const playNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % surahList.length;
    onChangeSurah(surahList[nextIndex].id);
  }, [currentIndex, onChangeSurah]);

  const playPrev = useCallback(() => {
    const prevIndex = (currentIndex - 1 + surahList.length) % surahList.length;
    onChangeSurah(surahList[prevIndex].id);
  }, [currentIndex, onChangeSurah]);

  useEffect(() => { togglePlayRef.current = togglePlay; }, [togglePlay]);
  useEffect(() => { playNextRef.current = playNext; }, [playNext]);
  useEffect(() => { playPrevRef.current = playPrev; }, [playPrev]);


  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !audioRef.current.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = ratio * audioRef.current.duration;
  };

  const handleReciterChange = (reciterId: string) => {
    setReciter(reciterId);
    localStorage.setItem("hc-reciter", reciterId);
    setShowReciterPicker(false);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <audio
        ref={audioRef}
        onEnded={playNext}
        onPause={() => setIsPlaying(false)}
        onPlay={() => { setIsPlaying(true); setLoading(false); setAudioError(false); }}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => {
          setLoading(false);
          if (audioRef.current) setDuration(audioRef.current.duration);
        }}
        onCanPlay={() => setLoading(false)}
        onError={() => { setLoading(false); setAudioError(true); }}
        preload="auto"
      />
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        className="fixed bottom-[4.5rem] left-0 right-0 z-30 border-t border-border bg-card/95 backdrop-blur-md px-4 py-2 safe-area-bottom"
      >
        {/* Progress bar */}
        <div
          className="mx-auto max-w-lg mb-2 h-1.5 cursor-pointer rounded-full bg-muted"
          onClick={handleSeek}
        >
          <div
            className="h-full rounded-full bg-primary transition-all duration-200"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        <div className="mx-auto flex max-w-lg items-center gap-3">
          {/* Info */}
          <button
            onClick={() => { setShowPicker(!showPicker); setShowReciterPicker(false); }}
            className="flex flex-1 items-center gap-3 text-left"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-xl">
              📖
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                Surah {currentSurah.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {audioError ? (
                  <span className="text-destructive">Not available for this reciter</span>
                ) : loading ? "Loading..." : (
                  <>
                    {currentSurah.desc}
                    {duration > 0 && ` · ${formatTime(audioRef.current?.currentTime || 0)} / ${formatTime(duration)}`}
                  </>
                )}
              </p>
            </div>
          </button>

          {/* Reciter name (clickable) */}
          <button
            onClick={() => { setShowReciterPicker(!showReciterPicker); setShowPicker(false); }}
            className="hidden sm:flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-[10px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title="Change reciter"
          >
            🎙 {currentReciter.short}
          </button>

          {/* Read surah page link */}
          <button
            onClick={() => navigate(`/surah/${currentSurahId}`)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Read surah text"
            title="Read surah"
          >
            📜
          </button>

          {/* Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={playPrev}
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Previous surah"
            >
              ⏮
            </button>
            <button
              onClick={togglePlay}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-calm transition-all hover:scale-105 active:scale-95"
              aria-label={isPlaying ? "Pause" : "Play"}
              disabled={loading || audioError}
            >
              {loading ? (
                <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>⏳</motion.span>
              ) : audioError ? "⚠" : isPlaying ? "⏸" : "▶"}
            </button>
            <button
              onClick={playNext}
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Next surah"
            >
              ⏭
            </button>
            <button
              onClick={onClose}
              className="ml-1 flex h-8 w-8 items-center justify-center rounded-full text-xs text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Close player"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Reciter picker */}
        <AnimatePresence>
          {showReciterPicker && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-2 overflow-hidden rounded-xl border border-border bg-background p-2"
            >
              <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Choose Reciter</p>
              {reciters.map((r) => (
                <button
                  key={r.id}
                  onClick={() => handleReciterChange(r.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                    r.id === reciter
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted text-foreground"
                  }`}
                >
                  <span className="text-sm">🎙</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{r.name}</p>
                  </div>
                  {r.id === reciter && (
                    <span className="text-xs text-primary">✓ Active</span>
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Surah picker */}
        <AnimatePresence>
          {showPicker && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-2 max-h-48 overflow-y-auto rounded-xl border border-border bg-background p-2"
            >
              {/* Mobile reciter button */}
              <button
                onClick={() => { setShowReciterPicker(true); setShowPicker(false); }}
                className="mb-2 flex w-full items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-left text-xs text-muted-foreground hover:bg-muted sm:hidden"
              >
                🎙 Reciter: <span className="font-medium text-foreground">{currentReciter.name}</span>
                <span className="ml-auto text-[10px]">Change →</span>
              </button>
              {surahList.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    onChangeSurah(s.id);
                    setShowPicker(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                    s.id === currentSurahId
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted text-foreground"
                  }`}
                >
                  <span className="text-xs font-mono text-muted-foreground w-6">
                    {s.id}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.desc} · {s.verses} verses</p>
                  </div>
                  {s.id === currentSurahId && isPlaying && (
                    <span className="text-xs text-primary">▶ Playing</span>
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default QuranPlayer;
