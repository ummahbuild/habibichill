import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Share2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Verse {
  number: number;
  arabic: string;
  translation: string;
  transliteration: string;
}

interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

const SurahPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [verses, setVerses] = useState<Verse[]>([]);
  const [meta, setMeta] = useState<SurahMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchSurah = useCallback(async (surahId: string) => {
    setLoading(true);
    setError(false);
    try {
      const [arabicRes, translationRes, translitRes] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/surah/${surahId}/quran-uthmani`),
        fetch(`https://api.alquran.cloud/v1/surah/${surahId}/en.sahih`),
        fetch(`https://api.alquran.cloud/v1/surah/${surahId}/en.transliteration`),
      ]);
      const [arabicData, translationData, translitData] = await Promise.all([
        arabicRes.json(),
        translationRes.json(),
        translitRes.json(),
      ]);

      if (arabicData.data && translationData.data) {
        setMeta({
          number: arabicData.data.number,
          name: arabicData.data.name,
          englishName: arabicData.data.englishName,
          englishNameTranslation: arabicData.data.englishNameTranslation,
          numberOfAyahs: arabicData.data.numberOfAyahs,
          revelationType: arabicData.data.revelationType,
        });

        const combined: Verse[] = arabicData.data.ayahs.map((ayah: any, i: number) => ({
          number: ayah.numberInSurah,
          arabic: ayah.text,
          translation: translationData.data.ayahs[i]?.text || "",
          transliteration: translitData.data?.ayahs?.[i]?.text || "",
        }));
        setVerses(combined);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (id) fetchSurah(id);
  }, [id, fetchSurah]);

  const handleShare = async () => {
    const url = window.location.href;
    const title = meta ? `Surah ${meta.englishName} — ${meta.englishNameTranslation}` : "Surah";
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied!");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading surah...</p>
        </div>
      </div>
    );
  }

  if (error || !meta) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background gap-4">
        <p className="text-muted-foreground">Could not load surah.</p>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <div className="text-center">
            <h1 className="text-sm font-bold text-foreground">{meta.englishName}</h1>
            <p className="text-[10px] text-muted-foreground">{meta.englishNameTranslation} · {meta.numberOfAyahs} verses</p>
          </div>
          <button
            onClick={handleShare}
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Share surah"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </motion.header>

      {/* Surah name banner */}
      <div className="mx-auto max-w-2xl px-4 py-6 text-center">
        <p className="font-arabic text-3xl leading-relaxed text-foreground">{meta.name}</p>
        <p className="mt-1 text-xs text-muted-foreground">{meta.revelationType} · Surah {meta.number}</p>
      </div>

      {/* Bismillah */}
      {meta.number !== 1 && meta.number !== 9 && (
        <div className="mx-auto max-w-2xl px-4 pb-4 text-center">
          <p className="font-arabic text-xl text-primary/80">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</p>
          <p className="mt-1 text-[11px] italic text-muted-foreground">Bismillāhir-Raḥmānir-Raḥīm</p>
        </div>
      )}

      {/* Verses */}
      <div className="mx-auto max-w-2xl px-4 pb-20">
        {verses.map((v) => (
          <motion.div
            key={v.number}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: Math.min(v.number * 0.02, 0.5) }}
            className="border-b border-border/50 py-5"
          >
            <div className="mb-1 flex items-start justify-between">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                {v.number}
              </span>
            </div>
            <p className="mt-2 text-right font-arabic text-xl leading-[2.2] text-foreground" dir="rtl">
              {v.arabic}
            </p>
            {v.transliteration && (
              <p className="mt-2 text-sm italic text-muted-foreground leading-relaxed">
                {v.transliteration}
              </p>
            )}
            <p className="mt-1.5 text-sm text-foreground/80 leading-relaxed">
              {v.translation}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Footer share */}
      <div className="mx-auto max-w-2xl px-4 pb-10 text-center">
        <Button variant="outline" onClick={handleShare} className="gap-2">
          <Share2 className="h-4 w-4" />
          Share this Surah
        </Button>
      </div>
    </div>
  );
};

export default SurahPage;
