import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WuduStep {
  title: string;
  arabic?: string;
  transliteration?: string;
  desc: string;
  icon: string;
  sunnah?: string;
  sunnahLink?: string;
  tips?: string;
}

const wuduSteps: WuduStep[] = [
  {
    title: "Intention (Niyyah)",
    arabic: "نَوَيْتُ الْوُضُوءَ",
    transliteration: "Nawaytu al-wuḍū'",
    desc: "Make the intention in your heart to perform wudu for the sake of Allah. The intention does not need to be spoken aloud — it is in the heart.",
    icon: "🤲",
    sunnah: "\"Actions are judged by intentions.\" — Sahih al-Bukhari 1",
    sunnahLink: "https://sunnah.com/bukhari:1",
    tips: "The intention distinguishes between washing for cleanliness and performing wudu as an act of worship.",
  },
  {
    title: "Say Bismillah",
    arabic: "بِسْمِ اللَّهِ",
    transliteration: "Bismillāh",
    desc: "Say 'Bismillah' (In the name of Allah) before beginning. This is recommended (mustahabb) by the majority of scholars.",
    icon: "🗣️",
    sunnah: "\"There is no wudu for the one who does not mention the name of Allah.\" — Sunan Abu Dawud 101",
    sunnahLink: "https://sunnah.com/abudawud:101",
  },
  {
    title: "Wash Hands (×3)",
    desc: "Wash both hands up to the wrists three times. Start with the right hand, then the left. Ensure water reaches between the fingers.",
    icon: "🖐️",
    sunnah: "The Prophet ﷺ used to wash his hands three times at the start of wudu. — Sahih al-Bukhari 159",
    sunnahLink: "https://sunnah.com/bukhari:159",
    tips: "Interlock your fingers to ensure water passes between them. Remove rings if they prevent water from reaching the skin.",
  },
  {
    title: "Rinse Mouth (×3)",
    arabic: "الْمَضْمَضَة",
    transliteration: "Al-Maḍmaḍah",
    desc: "Take a handful of water, swirl it thoroughly around the mouth, then spit it out. Repeat three times.",
    icon: "👄",
    sunnah: "The Prophet ﷺ used to rinse his mouth and nose with the same handful of water. — Sahih al-Bukhari 191",
    sunnahLink: "https://sunnah.com/bukhari:191",
  },
  {
    title: "Sniff & Blow Nose (×3)",
    arabic: "الاِسْتِنْشَاق",
    transliteration: "Al-Istinshāq",
    desc: "Sniff water gently into the nostrils using the right hand, then blow it out using the left hand. Repeat three times.",
    icon: "👃",
    sunnah: "\"When one of you performs wudu, let him sniff water into his nose and then blow it out.\" — Sahih Muslim 237",
    sunnahLink: "https://sunnah.com/muslim:237",
    tips: "Be gentle — don't sniff too hard. Use the left hand to blow the water out.",
  },
  {
    title: "Wash Face (×3)",
    desc: "Wash the entire face three times — from the hairline to the chin vertically, and from ear to ear horizontally. Ensure water covers every part including the eyebrows.",
    icon: "😊",
    tips: "Run your wet fingers through your beard if you have one (khilāl). This is sunnah.",
  },
  {
    title: "Wash Arms (×3)",
    desc: "Wash the right arm from fingertips to the elbow (inclusive) three times, then repeat with the left arm. Ensure water covers every part.",
    icon: "💪",
    sunnah: "The Prophet ﷺ used to wash his arms up to and including the elbows. — Sahih Muslim 246",
    sunnahLink: "https://sunnah.com/muslim:246",
    tips: "Don't forget the elbow — it must be included in the washing. Rotate the arm to cover all sides.",
  },
  {
    title: "Wipe Head (×1)",
    arabic: "الْمَسْح",
    transliteration: "Al-Masḥ",
    desc: "Wet both hands and wipe over the entire head once — starting from the forehead to the back of the head, then back to the front.",
    icon: "🧑",
    sunnah: "The Prophet ﷺ wiped his head from the front to the back and then back again. — Sahih al-Bukhari 185",
    sunnahLink: "https://sunnah.com/bukhari:185",
    tips: "This is done only once, unlike the other washing steps. Use fresh water for this.",
  },
  {
    title: "Wipe Ears (×1)",
    desc: "Using the same wetness from wiping the head, insert the index fingers into the ear openings and wipe the backs of the ears with the thumbs.",
    icon: "👂",
    sunnah: "\"The ears are part of the head.\" — Sunan Abu Dawud 134",
    sunnahLink: "https://sunnah.com/abudawud:134",
  },
  {
    title: "Wash Feet (×3)",
    desc: "Wash the right foot up to and including the ankle three times, then the left foot. Ensure water reaches between the toes.",
    icon: "🦶",
    sunnah: "The Prophet ﷺ said: \"Woe to the heels from the Hellfire!\" — Sahih al-Bukhari 165",
    sunnahLink: "https://sunnah.com/bukhari:165",
    tips: "Use the little finger of the left hand to wash between the toes. Don't neglect the heels and ankles.",
  },
  {
    title: "Dua After Wudu",
    arabic: "أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
    transliteration: "Ash-hadu an lā ilāha illallāhu waḥdahu lā sharīka lah, wa ash-hadu anna Muḥammadan 'abduhu wa rasūluh",
    desc: "I testify that there is no god but Allah alone, with no partner, and I testify that Muhammad is His servant and messenger.",
    icon: "✨",
    sunnah: "\"Whoever performs wudu and says this, the eight gates of Paradise are opened for him.\" — Sahih Muslim 234",
    sunnahLink: "https://sunnah.com/muslim:234",
  },
];

interface WuduGuideProps {
  onClose: () => void;
}

const WuduGuide = ({ onClose }: WuduGuideProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const step = wuduSteps[currentStep];

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-y-auto bg-background/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button onClick={onClose} className="absolute right-4 top-4 z-10 rounded-full p-2 text-muted-foreground hover:text-foreground" aria-label="Close">✕</button>

      <div className="mx-auto w-full max-w-sm px-4 py-12 text-center">
        <h1 className="mb-4 font-heading text-lg font-bold text-foreground">Wudu Guide</h1>
        <p className="mb-2 text-sm text-muted-foreground">Step {currentStep + 1} of {wuduSteps.length}</p>

        {/* Progress */}
        <div className="mb-6 flex gap-1">
          {wuduSteps.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= currentStep ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <span className="mb-4 block text-5xl">{step.icon}</span>
            <h2 className="mb-3 font-heading text-2xl font-bold text-foreground">{step.title}</h2>

            {/* Arabic + transliteration */}
            {step.arabic && (
              <div className="mb-4 rounded-xl bg-gradient-calm border border-border p-3">
                <p className="mb-1 font-arabic text-xl leading-relaxed text-foreground" dir="rtl">{step.arabic}</p>
                {step.transliteration && (
                  <p className="text-xs font-medium text-primary italic">{step.transliteration}</p>
                )}
              </div>
            )}

            <p className="mb-4 text-sm text-muted-foreground leading-relaxed">{step.desc}</p>

            {/* Tips */}
            {step.tips && (
              <div className="mb-4 flex items-start gap-2 rounded-xl border border-secondary/30 bg-secondary/5 p-3 text-left">
                <span className="text-sm">💡</span>
                <p className="text-xs text-foreground">{step.tips}</p>
              </div>
            )}

            {/* Sunnah reference */}
            {step.sunnah && (
              <div className="mb-4">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  📚 Sunnah Reference {showDetails ? "▲" : "▼"}
                </button>
                <AnimatePresence>
                  {showDetails && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 rounded-xl border border-border bg-card p-3 text-left">
                        <p className="text-xs text-foreground italic">{step.sunnah}</p>
                        {step.sunnahLink && (
                          <a href={step.sunnahLink} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-xs text-primary underline">
                            View on Sunnah.com →
                          </a>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-2">
          <button
            onClick={() => { setCurrentStep(Math.max(0, currentStep - 1)); setShowDetails(false); }}
            disabled={currentStep === 0}
            className="flex-1 rounded-xl border border-border bg-card py-3 text-sm font-medium text-foreground disabled:opacity-30 transition-colors hover:bg-muted"
          >
            Back
          </button>
          {currentStep < wuduSteps.length - 1 ? (
            <button
              onClick={() => { setCurrentStep(currentStep + 1); setShowDetails(false); }}
              className="flex-1 rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground transition-all hover:scale-105 active:scale-95"
            >
              Next
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex-1 rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground transition-all hover:scale-105 active:scale-95"
            >
              Done ✨
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default WuduGuide;
