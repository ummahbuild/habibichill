import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { useEscapeKey } from "@/hooks/use-keyboard-shortcuts";

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
  },
  {
    instruction: "Breathe Deeply",
    icon: "🌊",
    desc: "Breathe with the circle. Inhale as it grows, exhale as it shrinks. This activates your parasympathetic nervous system and calms the body.",
    hadithSource: "Based on Islamic principle of self-control",
    hadithFull: "Deep breathing is a scientifically proven calming technique that aligns with the Islamic emphasis on self-regulation. The Qur'an says: \"Verily, in the remembrance of Allah do hearts find rest.\" (13:28)",
    hadithLink: "https://quran.com/13/28",
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
    hadithFull: "The Prophet ﷺ said: \"If one of you becomes angry while standing, let him sit down. If his anger leaves him, well and good; otherwise let him lie down.\" This physical change helps disrupt the physiological escalation of anger by lowering the body and reducing aggressive readiness.",
    hadithLink: "https://sunnah.com/abudawud:4782",
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
    hadithFull: "Two men abused each other in the presence of the Prophet ﷺ and one of them became very angry — his face turned red. The Prophet ﷺ said: \"I know a word which, if he were to say it, what he feels would go away. If he said: 'A'ūdhu billāhi min ash-Shayṭān ir-Rajīm' (I seek refuge in Allah from the accursed Shaytan), what he feels would go away.\"",
    hadithLink: "https://sunnah.com/bukhari:6115",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3",
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
    hadithFull: "The Prophet ﷺ said: \"Indeed anger is from Shaytan, and indeed Shaytan was created from fire, and fire is only extinguished with water. So when one of you becomes angry, let him perform wudu.\" The cooling effect of water on the skin has both physical and spiritual benefits — it calms the nervous system and reminds us of purification.",
    hadithLink: "https://sunnah.com/abudawud:4784",
  },
];

const emojis = ["😐", "😠", "😡", "🤬", "😤"];

interface EmergencyFlowProps {
  onClose: () => void;
}

const EmergencyFlow = ({ onClose }: EmergencyFlowProps) => {
  const { addAngerEntry } = useApp();
  useEscapeKey(onClose);
  const [phase, setPhase] = useState<"intensity" | "steps" | "checkin" | "reward">("intensity");
  const [intensity, setIntensity] = useState(3);
  const [currentStep, setCurrentStep] = useState(0);
  const [showHadithDetail, setShowHadithDetail] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleIntensitySelect = (level: number) => {
    setIntensity(level);
    setPhase("steps");
  };

  const nextStep = () => {
    // Stop any playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setShowHadithDetail(false);
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setPhase("checkin");
    }
  };

  const playAudio = (url: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.play().catch(() => {});
  };

  const handleCheckin = (feeling: number) => {
    if (feeling <= 2) {
      setPhase("reward");
      addAngerEntry({ trigger: "Emergency", intensity, controlled: true, situation: "Emergency flow" });
    } else {
      setCurrentStep(0);
      setPhase("steps");
    }
  };

  const step = steps[currentStep];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-background/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button
        onClick={() => {
          if (audioRef.current) audioRef.current.pause();
          onClose();
        }}
        className="absolute right-4 top-4 z-10 rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Close"
      >
        ✕
      </button>

      <div className="w-full max-w-sm px-4 py-8">
        <AnimatePresence mode="wait">
          {phase === "intensity" && (
            <motion.div key="intensity" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
              <h2 className="mb-2 font-heading text-2xl font-bold text-foreground">How angry are you?</h2>
              <p className="mb-8 text-sm text-muted-foreground">Tap to select your level</p>
              <div className="flex justify-center gap-3">
                {emojis.map((e, i) => (
                  <button
                    key={i}
                    onClick={() => handleIntensitySelect(i + 1)}
                    className="rounded-2xl border border-border bg-card p-4 text-4xl transition-all hover:scale-110 hover:shadow-calm active:scale-95"
                    aria-label={`Anger level ${i + 1}`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {phase === "steps" && (
            <motion.div key={`step-${currentStep}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="text-center">
              {/* Progress */}
              <div className="mb-4 flex gap-1">
                {steps.map((_, i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= currentStep ? "bg-primary" : "bg-muted"}`} />
                ))}
              </div>

              <div className="mb-2 text-sm text-muted-foreground">Step {currentStep + 1} of {steps.length}</div>
              <span className="mb-4 block text-6xl">{step.icon}</span>
              <h2 className="mb-3 font-heading text-3xl font-bold text-foreground">{step.instruction}</h2>

              {/* Arabic with transliteration and translation */}
              {step.arabic && (
                <div className="mb-4 rounded-2xl bg-gradient-calm border border-border p-4">
                  <p className="mb-2 font-arabic text-2xl leading-relaxed text-foreground" dir="rtl">{step.arabic}</p>
                  {step.transliteration && (
                    <p className="mb-1 text-sm font-medium text-primary italic">{step.transliteration}</p>
                  )}
                  {step.translation && (
                    <p className="text-sm text-muted-foreground">"{step.translation}"</p>
                  )}
                  {step.audioUrl && (
                    <button
                      onClick={() => playAudio(step.audioUrl!)}
                      className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-all hover:bg-primary/20 active:scale-95"
                    >
                      🔊 Listen to Recitation
                    </button>
                  )}
                </div>
              )}

              <p className="mb-4 text-sm text-muted-foreground">{step.desc}</p>

              {/* Breathing circle for step 2 */}
              {currentStep === 1 && (
                <div className="mx-auto mb-6 flex flex-col items-center justify-center">
                  <motion.div
                    className="rounded-full bg-primary/20 border-2 border-primary"
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    style={{ width: 120, height: 120 }}
                  />
                  <motion.p
                    className="mt-3 text-sm font-medium text-primary"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    Breathe...
                  </motion.p>
                </div>
              )}

              {/* Hadith source - always visible */}
              {step.hadithSource && (
                <div className="mb-4">
                  <button
                    onClick={() => setShowHadithDetail(!showHadithDetail)}
                    className="inline-flex items-center gap-1 rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    📚 {step.hadithSource} {showHadithDetail ? "▲" : "▼"}
                  </button>

                  <AnimatePresence>
                    {showHadithDetail && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2 rounded-xl border border-border bg-card p-4 text-left">
                          {step.hadithNarrator && (
                            <p className="mb-1 text-xs font-semibold text-primary">{step.hadithNarrator}</p>
                          )}
                          {step.hadithBook && (
                            <p className="mb-2 text-xs text-muted-foreground">{step.hadithBook}</p>
                          )}
                          <p className="text-sm text-foreground leading-relaxed">{step.hadithFull}</p>
                          {step.hadithLink && (
                            <a
                              href={step.hadithLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 inline-block text-xs text-primary underline"
                            >
                              View full hadith on Sunnah.com →
                            </a>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              <button
                onClick={nextStep}
                className="mt-2 w-full rounded-xl bg-primary px-6 py-4 font-heading font-semibold text-primary-foreground shadow-calm transition-all hover:scale-105 active:scale-95"
              >
                {currentStep < steps.length - 1 ? "Next Step" : "How do you feel?"}
              </button>
            </motion.div>
          )}

          {phase === "checkin" && (
            <motion.div key="checkin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
              <h2 className="mb-2 font-heading text-2xl font-bold text-foreground">How do you feel now?</h2>
              <p className="mb-8 text-sm text-muted-foreground">Still angry? We can go again.</p>
              <div className="flex justify-center gap-3">
                {emojis.map((e, i) => (
                  <button key={i} onClick={() => handleCheckin(i + 1)} className="rounded-2xl border border-border bg-card p-4 text-4xl transition-all hover:scale-110 active:scale-95">
                    {e}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {phase === "reward" && (
            <motion.div key="reward" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <motion.span
                className="mb-4 block text-6xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                🌟
              </motion.span>
              <h2 className="mb-2 font-heading text-2xl font-bold text-foreground">You controlled your anger!</h2>
              <div className="mb-4 rounded-2xl bg-gradient-calm border border-border p-4">
                <p className="mb-2 font-arabic text-lg leading-relaxed text-foreground" dir="rtl">
                  لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ
                </p>
                <p className="mb-1 text-sm font-medium text-primary italic">
                  Laysal-shadīdu biṣ-ṣur'ah, innamash-shadīdul-ladhī yamliku nafsahū 'indal-ghaḍab
                </p>
                <p className="mb-2 text-sm text-muted-foreground italic">
                  "The strong person is not the one who can wrestle, but the one who controls himself at the time of anger."
                </p>
                <p className="text-xs text-muted-foreground">
                  Narrated by Abu Hurayrah (رضي الله عنه) —{" "}
                  <a href="https://sunnah.com/bukhari:6114" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                    Sahih al-Bukhari 6114
                  </a>
                </p>
              </div>
              <div className="my-6 rounded-xl bg-primary/10 p-4">
                <span className="text-2xl font-bold text-primary">+10 Sabr Points 🌟</span>
              </div>
              <button
                onClick={onClose}
                className="w-full rounded-xl bg-primary px-6 py-4 font-heading font-semibold text-primary-foreground shadow-calm transition-all hover:scale-105 active:scale-95"
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

export default EmergencyFlow;
