import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

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

const getAudioUrl = (surahId: string) =>
  `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surahId}.mp3`;

interface QuranPlayerProps {
  currentSurahId: string;
  onChangeSurah: (id: string) => void;
  onClose: () => void;
}

const QuranPlayer = ({ currentSurahId, onChangeSurah, onClose }: QuranPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSurah = surahList.find((s) => s.id === currentSurahId) || surahList[0];
  const currentIndex = surahList.findIndex((s) => s.id === currentSurahId);

  useEffect(() => {
    if (audioRef.current) {
      setLoading(true);
      setProgress(0);
      audioRef.current.src = getAudioUrl(currentSurahId);
      audioRef.current.load();
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [currentSurahId]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
  };

  const playNext = () => {
    const nextIndex = (currentIndex + 1) % surahList.length;
    onChangeSurah(surahList[nextIndex].id);
  };

  const playPrev = () => {
    const prevIndex = (currentIndex - 1 + surahList.length) % surahList.length;
    onChangeSurah(surahList[prevIndex].id);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && audioRef.current.duration) {
      setProgress(audioRef.current.currentTime / audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !audioRef.current.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = ratio * audioRef.current.duration;
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
        onPlay={() => { setIsPlaying(true); setLoading(false); }}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => {
          setLoading(false);
          if (audioRef.current) setDuration(audioRef.current.duration);
        }}
        onCanPlay={() => setLoading(false)}
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
            onClick={() => setShowPicker(!showPicker)}
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
                {loading ? "Loading..." : `${currentSurah.desc} · Mishary Alafasy`}
                {duration > 0 && !loading && ` · ${formatTime(audioRef.current?.currentTime || 0)} / ${formatTime(duration)}`}
              </p>
            </div>
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
              disabled={loading}
            >
              {loading ? (
                <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>⏳</motion.span>
              ) : isPlaying ? "⏸" : "▶"}
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

        {/* Surah picker */}
        {showPicker && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-2 max-h-48 overflow-y-auto rounded-xl border border-border bg-background p-2"
          >
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
      </motion.div>
    </>
  );
};

export default QuranPlayer;
