import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const wuduSteps = [
  { title: "Intention (Niyyah)", desc: "Make the intention in your heart to perform wudu for purification.", icon: "🤲" },
  { title: "Say Bismillah", desc: "Begin by saying 'Bismillah' (In the name of Allah).", icon: "🗣️" },
  { title: "Wash Hands (3x)", desc: "Wash both hands up to the wrists three times, starting with the right.", icon: "🖐️" },
  { title: "Rinse Mouth (3x)", desc: "Take water into the mouth, swirl it around, and spit it out three times.", icon: "👄" },
  { title: "Sniff Water (3x)", desc: "Sniff water into the nostrils and blow it out three times.", icon: "👃" },
  { title: "Wash Face (3x)", desc: "Wash the entire face from the hairline to the chin, ear to ear, three times.", icon: "😊" },
  { title: "Wash Arms (3x)", desc: "Wash the right arm from fingertips to elbow three times, then the left.", icon: "💪" },
  { title: "Wipe Head (1x)", desc: "Wet your hands and wipe over the head from front to back and back to front.", icon: "🧑" },
  { title: "Wipe Ears (1x)", desc: "Use wet index fingers to wipe inside the ears and thumbs behind them.", icon: "👂" },
  { title: "Wash Feet (3x)", desc: "Wash the right foot up to the ankle three times, then the left.", icon: "🦶" },
  { title: "Dua After Wudu", desc: "أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ — 'I testify that there is no god but Allah and that Muhammad is His servant and messenger.'", icon: "✨" },
];

interface WuduGuideProps {
  onClose: () => void;
}

const WuduGuide = ({ onClose }: WuduGuideProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const step = wuduSteps[currentStep];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:text-foreground" aria-label="Close">✕</button>

      <div className="w-full max-w-sm px-4 text-center">
        <p className="mb-2 text-sm text-muted-foreground">Step {currentStep + 1} of {wuduSteps.length}</p>

        {/* Progress */}
        <div className="mb-6 flex gap-1">
          {wuduSteps.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= currentStep ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <span className="mb-4 block text-5xl">{step.icon}</span>
            <h2 className="mb-3 font-heading text-2xl font-bold text-foreground">{step.title}</h2>
            <p className={`mb-6 text-muted-foreground ${step.title.includes("Dua") ? "font-arabic text-lg leading-relaxed" : "text-sm"}`}>
              {step.desc}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-2">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="flex-1 rounded-xl border border-border bg-card py-3 text-sm font-medium text-foreground disabled:opacity-30 transition-colors hover:bg-muted"
          >
            Back
          </button>
          {currentStep < wuduSteps.length - 1 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
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
