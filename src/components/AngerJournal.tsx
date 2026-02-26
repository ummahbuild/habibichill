import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { useEscapeKey } from "@/hooks/use-keyboard-shortcuts";

interface AngerJournalProps {
  onClose: () => void;
}

const triggers = ["Work stress", "Family dispute", "Online argument", "Traffic", "Parenting", "Relationship", "Financial", "Other"];

const AngerJournal = ({ onClose }: AngerJournalProps) => {
  useEscapeKey(onClose);
  const { addAngerEntry } = useApp();
  const [step, setStep] = useState(0);
  const [trigger, setTrigger] = useState("");
  const [situation, setSituation] = useState("");
  const [controlled, setControlled] = useState<boolean | null>(null);
  const [intensity, setIntensity] = useState(3);
  const [reflection, setReflection] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSubmit = () => {
    addAngerEntry({
      trigger: trigger || "Unspecified",
      situation: situation || trigger,
      intensity,
      controlled: controlled ?? false,
      reflection,
    });
    setSaved(true);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:text-foreground" aria-label="Close">✕</button>

      <div className="w-full max-w-sm px-4">
        {/* Progress indicators */}
        {!saved && (
          <div className="mb-6 flex gap-1">
            {[0, 1, 2, 3].map((s) => (
              <div key={s} className={`h-1.5 flex-1 rounded-full transition-all ${s <= step ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 0 && !saved && (
            <motion.div key="trigger" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center">
              <h2 className="mb-2 font-heading text-2xl font-bold text-foreground">Journal Entry</h2>
              <p className="mb-6 text-sm text-muted-foreground">What triggered your anger?</p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {triggers.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTrigger(t)}
                    className={`rounded-xl border p-3 text-sm font-medium transition-all ${
                      trigger === t ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(1)} disabled={!trigger} className="mt-2 w-full rounded-xl bg-primary px-6 py-3 font-heading font-semibold text-primary-foreground disabled:opacity-40 transition-all hover:scale-105 active:scale-95">
                Next
              </button>
            </motion.div>
          )}

          {step === 1 && !saved && (
            <motion.div key="situation" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center">
              <h2 className="mb-2 font-heading text-2xl font-bold text-foreground">What happened?</h2>
              <p className="mb-4 text-sm text-muted-foreground">Describe the situation briefly</p>
              <textarea
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                placeholder="e.g. Got into an argument with my spouse about..."
                className="mb-4 w-full rounded-xl border border-border bg-card p-4 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
              />
              <h3 className="mb-3 text-sm font-medium text-foreground">How intense was it?</h3>
              <div className="flex justify-center gap-2 mb-4">
                {["😐", "😠", "😡", "🤬", "😤"].map((e, i) => (
                  <button
                    key={i}
                    onClick={() => setIntensity(i + 1)}
                    className={`rounded-xl border p-3 text-2xl transition-all ${intensity === i + 1 ? "border-primary bg-primary/10 scale-110" : "border-border bg-card"}`}
                  >
                    {e}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setStep(0)} className="flex-1 rounded-xl border border-border bg-card py-3 text-sm font-medium text-foreground">Back</button>
                <button onClick={() => setStep(2)} className="flex-1 rounded-xl bg-primary py-3 font-heading font-semibold text-primary-foreground transition-all hover:scale-105 active:scale-95">
                  Next
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && !saved && (
            <motion.div key="control" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center">
              <h2 className="mb-2 font-heading text-2xl font-bold text-foreground">Did you control it?</h2>
              <p className="mb-6 text-sm text-muted-foreground">Be honest — this is for your growth</p>
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => setControlled(true)}
                  className={`flex-1 rounded-xl border p-4 text-center transition-all ${controlled === true ? "border-success bg-success/10 scale-105" : "border-border bg-card"}`}
                >
                  <span className="text-3xl block mb-1">✅</span>
                  <span className="text-sm font-medium text-foreground">Yes, Alhamdulillah</span>
                </button>
                <button
                  onClick={() => setControlled(false)}
                  className={`flex-1 rounded-xl border p-4 text-center transition-all ${controlled === false ? "border-warning bg-warning/5 scale-105" : "border-border bg-card"}`}
                >
                  <span className="text-3xl block mb-1">⚠️</span>
                  <span className="text-sm font-medium text-foreground">Not this time</span>
                </button>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setStep(1)} className="flex-1 rounded-xl border border-border bg-card py-3 text-sm font-medium text-foreground">Back</button>
                <button onClick={() => setStep(3)} disabled={controlled === null} className="flex-1 rounded-xl bg-primary py-3 font-heading font-semibold text-primary-foreground disabled:opacity-40 transition-all hover:scale-105 active:scale-95">
                  Next
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && !saved && (
            <motion.div key="reflect" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center">
              <h2 className="mb-2 font-heading text-2xl font-bold text-foreground">Reflect</h2>
              <p className="mb-4 text-sm text-muted-foreground">What would the Prophet ﷺ do in this situation?</p>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="What would you do differently next time?"
                className="mb-4 w-full rounded-xl border border-border bg-card p-4 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                rows={4}
              />
              <div className="flex gap-2">
                <button onClick={() => setStep(2)} className="flex-1 rounded-xl border border-border bg-card py-3 text-sm font-medium text-foreground">Back</button>
                <button onClick={handleSubmit} className="flex-1 rounded-xl bg-primary py-3 font-heading font-semibold text-primary-foreground transition-all hover:scale-105 active:scale-95">
                  Save {controlled ? "· +10 SP" : ""}
                </button>
              </div>
            </motion.div>
          )}

          {saved && (
            <motion.div key="saved" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <motion.span
                className="mb-4 block text-6xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                {controlled ? "🌟" : "📝"}
              </motion.span>
              <h2 className="mb-2 font-heading text-2xl font-bold text-foreground">
                {controlled ? "MashaAllah! Entry Saved" : "Entry Saved"}
              </h2>
              <p className="mb-4 text-sm text-muted-foreground">
                {controlled
                  ? "You controlled your anger. The Prophet ﷺ said the strong person is the one who controls himself."
                  : "Every moment is a chance to grow. Keep striving — Allah loves those who try."}
              </p>
              {controlled && (
                <div className="mb-6 rounded-xl bg-primary/10 p-4">
                  <span className="text-xl font-bold text-primary">+10 Sabr Points 🌟</span>
                </div>
              )}
              <p className="mb-6 text-xs text-muted-foreground italic">
                "{controlled ? "Those who restrain anger and forgive people — Allah loves the doers of good." : "Indeed, Allah is with the patient."}"
                <br />
                <a href={controlled ? "https://quran.com/3/134" : "https://quran.com/2/153"} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                  {controlled ? "Qur'an 3:134" : "Qur'an 2:153"}
                </a>
              </p>
              <button
                onClick={onClose}
                className="w-full rounded-xl bg-primary px-6 py-3 font-heading font-semibold text-primary-foreground transition-all hover:scale-105 active:scale-95"
              >
                Done
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AngerJournal;
