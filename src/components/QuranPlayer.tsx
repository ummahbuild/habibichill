import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const surahList = [
  { id: "1", name: "Al-Fatiha", desc: "The Opening", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/1.mp3" },
  { id: "36", name: "Ya-Sin", desc: "Heart of the Quran", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/36.mp3" },
  { id: "55", name: "Ar-Rahman", desc: "The Most Merciful", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/55.mp3" },
  { id: "56", name: "Al-Waqi'ah", desc: "The Inevitable", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/56.mp3" },
  { id: "67", name: "Al-Mulk", desc: "The Sovereignty", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/67.mp3" },
  { id: "73", name: "Al-Muzzammil", desc: "The Enshrouded One", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/73.mp3" },
  { id: "112", name: "Al-Ikhlas", desc: "Sincerity", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/112.mp3" },
  { id: "113", name: "Al-Falaq", desc: "The Daybreak", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/113.mp3" },
  { id: "114", name: "An-Nas", desc: "Mankind", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/114.mp3" },
];

interface QuranPlayerProps {
  currentSurahId: string;
  onChangeSurah: (id: string) => void;
  onClose: () => void;
}

const QuranPlayer = ({ currentSurahId, onChangeSurah, onClose }: QuranPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [showPicker, setShowPicker] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSurah = surahList.find((s) => s.id === currentSurahId) || surahList[0];
  const currentIndex = surahList.findIndex((s) => s.id === currentSurahId);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentSurah.audioUrl;
      audioRef.current.play().catch(() => setIsPlaying(false));
      setIsPlaying(true);
    }
  }, [currentSurahId, currentSurah.audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    const nextIndex = (currentIndex + 1) % surahList.length;
    onChangeSurah(surahList[nextIndex].id);
  };

  const playPrev = () => {
    const prevIndex = (currentIndex - 1 + surahList.length) % surahList.length;
    onChangeSurah(surahList[prevIndex].id);
  };

  return (
    <>
      <audio
        ref={audioRef}
        onEnded={playNext}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        className="fixed bottom-[4.5rem] left-0 right-0 z-30 border-t border-border bg-card/95 backdrop-blur-md px-4 py-2 safe-area-bottom"
      >
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
                {currentSurah.desc} · Mishary Alafasy
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
            >
              {isPlaying ? "⏸" : "▶"}
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
                <div>
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </motion.div>
    </>
  );
};

export default QuranPlayer;
