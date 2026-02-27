import { useApp } from "@/context/AppContext";

/** Returns user-facing labels that adapt based on Muslim / non-Muslim mode. */
export const useTerminology = () => {
  const { onboardingData } = useApp();
  const islamic = onboardingData.isMuslim !== false; // default true

  return {
    islamic,
    sabr: islamic ? "Sabr" : "Patience",
    sabrPoints: islamic ? "Sabr Points" : "Patience Points",
    dhikr: islamic ? "Dhikr" : "Mantra",
    wudu: islamic ? "Wudu" : "Cool Down",
    sunnah: islamic ? "Sunnah" : "Protocol",
    dua: islamic ? "Dua" : "Affirmation",
    quran: islamic ? "Quran" : "Scripture",
    quranSunnah: islamic ? "Quran & Sunnah" : "Guidance & Wisdom",
  };
};
