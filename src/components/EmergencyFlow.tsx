import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";

const steps = [
  { instruction: "Stay Silent", icon: "🤫", desc: "The Prophet ﷺ said: \"If one of you becomes angry, let him be silent.\"", hadithLink: "https://sunnah.com/adab/57/1" },
  { instruction: "Breathe Deeply", icon: "🌊", desc: "Breathe with the circle. Inhale as it grows, exhale as it shrinks.", hadithLink: null },
  { instruction: "Change Position", icon: "🧘", desc: "\"If angry while standing, sit down. If still angry, lie down.\"", hadithLink: "https://sunnah.com/abudawud/43/165" },
  { instruction: "Seek Refuge", icon: "🤲", desc: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ", hadithLink: "https://sunnah.com/bukhari/59/10" },
  { instruction: "Make Wudu", icon: "💧", desc: "\"Anger comes from Shaytan, and Shaytan was created from fire. Fire is extinguished with water, so make wudu.\"", hadithLink: "https://sunnah.com/abudawud/43/166" },
];

const emojis = ["😐", "😠", "😡", "🤬", "😤"];

interface EmergencyFlowProps {
  onClose: () => void;
}

const EmergencyFlow = ({ onClose }: EmergencyFlowProps) => {
  const { addAngerEntry } = useApp();
  const [phase, setPhase] = useState<"intensity" | "steps" | "checkin" | "reward">("intensity");
  const [intensity, setIntensity] = useState(3);
  const [currentStep, setCurrentStep] = useState(0);
  const [finalFeeling, setFinalFeeling] = useState(1);

  const handleIntensitySelect = (level: number) => {
    setIntensity(level);
    setPhase("steps");
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setPhase("checkin");
    }
  };

  const handleCheckin = (feeling: number) => {
    setFinalFeeling(feeling);
    if (feeling <= 2) {
      setPhase("reward");
      addAngerEntry({ trigger: "Emergency", intensity, controlled: true, situation: "Emergency flow" });
    } else {
      // Restart
      setCurrentStep(0);
      setPhase("steps");
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Close"
      >
        ✕
      </button>

      <div className="w-full max-w-sm px-4">
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
              <div className="mb-2 text-sm text-muted-foreground">Step {currentStep + 1} of {steps.length}</div>
              <span className="mb-4 block text-6xl">{steps[currentStep].icon}</span>
              <h2 className="mb-3 font-heading text-3xl font-bold text-foreground">{steps[currentStep].instruction}</h2>
              <p className={`mb-6 text-muted-foreground ${steps[currentStep].instruction === "Seek Refuge" ? "font-arabic text-2xl leading-relaxed" : ""}`}>
                {steps[currentStep].desc}
              </p>

              {currentStep === 1 && (
                <div className="mx-auto mb-6 flex items-center justify-center">
                  <motion.div
                    className="rounded-full bg-primary/20 border-2 border-primary"
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    style={{ width: 120, height: 120 }}
                  />
                </div>
              )}

              {steps[currentStep].hadithLink && (
                <a href={steps[currentStep].hadithLink!} target="_blank" rel="noopener noreferrer" className="mb-4 inline-block text-sm text-primary underline">
                  View hadith source →
                </a>
              )}

              <button
                onClick={nextStep}
                className="mt-4 w-full rounded-xl bg-primary px-6 py-4 font-heading font-semibold text-primary-foreground shadow-calm transition-all hover:scale-105 active:scale-95"
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
              <p className="mb-4 text-muted-foreground italic">
                "The strong person is not the one who can wrestle, but the one who controls himself at the time of anger."
              </p>
              <p className="mb-2 text-sm text-muted-foreground">
                — <a href="https://sunnah.com/bukhari/78/141" target="_blank" rel="noopener noreferrer" className="text-primary underline">Sahih al-Bukhari</a>
              </p>
              <div className="my-6 rounded-xl bg-gradient-calm p-4">
                <span className="text-2xl font-bold text-primary">+10 Sabr Points</span>
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
