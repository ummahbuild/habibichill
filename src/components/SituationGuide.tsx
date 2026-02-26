import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEscapeKey } from "@/hooks/use-keyboard-shortcuts";

const situations = [
  {
    id: "marriage",
    emoji: "💑",
    title: "Marriage Conflict",
    steps: [
      "Take a pause — walk to another room if needed",
      "Make wudu to cool your body and spirit",
      "Remember: \"The best of you are those who are best to their families\" — Tirmidhi",
      "Speak only when calm. The Prophet ﷺ never raised his voice at his wives",
      "If you were wrong, apologize sincerely. Forgiveness is strength.",
    ],
    ayah: { arabic: "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنْفُسِكُمْ أَزْوَاجًا لِتَسْكُنُوا إِلَيْهَا", english: "And among His signs is that He created for you spouses from among yourselves, that you may find tranquility in them.", ref: "Qur'an 30:21", link: "https://quran.com/30/21" },
    hadith: { text: "\"The best of you are those who are best to their families, and I am the best of you to my family.\"", source: "Tirmidhi 3895", link: "https://sunnah.com/tirmidhi:3895" },
  },
  {
    id: "online",
    emoji: "💬",
    title: "Online Argument",
    steps: [
      "Close the app or tab immediately",
      "Say 'A'udhu billahi min ash-shaytan ir-rajeem'",
      "Wait at least 10 minutes before responding",
      "Ask yourself: Will this matter in a year?",
      "If you must respond, be brief and kind. Silence is gold.",
    ],
    ayah: { arabic: "خُذِ الْعَفْوَ وَأْمُرْ بِالْعُرْفِ وَأَعْرِضْ عَنِ الْجَاهِلِينَ", english: "Show forgiveness, enjoin what is good, and turn away from the ignorant.", ref: "Qur'an 7:199", link: "https://quran.com/7/199" },
    hadith: { text: "\"Whoever believes in Allah and the Last Day, let him speak good or remain silent.\"", source: "Bukhari 6018", link: "https://sunnah.com/bukhari:6018" },
  },
  {
    id: "family",
    emoji: "👨‍👩‍👧‍👦",
    title: "Family Dispute",
    steps: [
      "Lower your voice — even if others raise theirs",
      "Change your physical position (sit or lie down)",
      "Remember your parents' rights even when they frustrate you",
      "Make dua for patience and guidance",
      "Seek reconciliation. Ties of kinship are sacred.",
    ],
    ayah: { arabic: "وَقَضَىٰ رَبُّكَ أَلَّا تَعْبُدُوا إِلَّا إِيَّاهُ وَبِالْوَالِدَيْنِ إِحْسَانًا", english: "Your Lord has decreed that you worship none but Him, and be good to your parents.", ref: "Qur'an 17:23", link: "https://quran.com/17/23" },
    hadith: { text: "\"He is not one of us who does not show mercy to our young ones and respect to our elders.\"", source: "Tirmidhi 1920", link: "https://sunnah.com/tirmidhi:1920" },
  },
  {
    id: "workplace",
    emoji: "💼",
    title: "Workplace Stress",
    steps: [
      "Step away from the situation — take a short walk",
      "Perform dhikr silently: SubhanAllah, Alhamdulillah, Allahu Akbar",
      "Remember: Your rizq (provision) is from Allah, not your boss",
      "Respond with professionalism; don't let anger dictate your career",
      "Make dua for ease: 'Allahumma la sahla illa ma ja'altahu sahla'",
    ],
    ayah: { arabic: "وَمَنْ يَتَّقِ اللَّهَ يَجْعَلْ لَهُ مَخْرَجًا وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ", english: "And whoever fears Allah — He will make for him a way out. And will provide for him from where he does not expect.", ref: "Qur'an 65:2-3", link: "https://quran.com/65/2-3" },
    hadith: { text: "\"None of you should wish for death because of a difficulty that has befallen him.\"", source: "Bukhari 5671", link: "https://sunnah.com/bukhari:5671" },
  },
  {
    id: "parenting",
    emoji: "👶",
    title: "Parenting Frustration",
    steps: [
      "Take 3 deep breaths before reacting",
      "Remember they are an amanah (trust) from Allah",
      "Lower yourself to their eye level before speaking",
      "Use gentle words — the Prophet ﷺ never hit a child",
      "Make dua: 'Rabbi hab li min ladunka dhurriyyatan tayyibah'",
    ],
    ayah: { arabic: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ", english: "Our Lord, grant us from our spouses and offspring comfort to our eyes.", ref: "Qur'an 25:74", link: "https://quran.com/25/74" },
    hadith: { text: "\"He is not one of us who does not show mercy to our young ones.\"", source: "Tirmidhi 1920", link: "https://sunnah.com/tirmidhi:1920" },
  },
  {
    id: "traffic",
    emoji: "🚗",
    title: "Traffic / Road Rage",
    steps: [
      "Say 'SubhanAllah' — this is a test of patience",
      "Play calming Quran recitation in the car",
      "Remember: Arriving late is better than never arriving",
      "Don't honk aggressively or make gestures",
      "Use this time for dhikr — turn frustration into worship",
    ],
    ayah: { arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", english: "Indeed, with hardship comes ease.", ref: "Qur'an 94:6", link: "https://quran.com/94/6" },
    hadith: { text: "\"The strong person is not the one who can overpower others. The strong person is the one who controls himself when he is angry.\"", source: "Bukhari 6114", link: "https://sunnah.com/bukhari:6114" },
  },
];

interface SituationGuideProps {
  onClose: () => void;
}

const SituationGuide = ({ onClose }: SituationGuideProps) => {
  useEscapeKey(onClose);
  const [selected, setSelected] = useState<string | null>(null);
  const situation = situations.find((s) => s.id === selected);

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-y-auto bg-background/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button onClick={onClose} className="absolute right-4 top-4 z-10 rounded-full p-2 text-muted-foreground hover:text-foreground" aria-label="Close">✕</button>

      <div className="mx-auto w-full max-w-sm px-4 py-12">
        <AnimatePresence mode="wait">
          {!selected ? (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="mb-2 text-center font-heading text-2xl font-bold text-foreground">What's the situation?</h2>
              <p className="mb-6 text-center text-sm text-muted-foreground">Get tailored guidance based on your context</p>
              <div className="grid grid-cols-2 gap-3">
                {situations.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelected(s.id)}
                    className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 transition-all hover:shadow-calm active:scale-95"
                  >
                    <span className="text-3xl">{s.emoji}</span>
                    <span className="text-sm font-medium text-foreground">{s.title}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <button onClick={() => setSelected(null)} className="mb-4 text-sm text-primary hover:underline">← Back</button>
              <div className="mb-4 text-center">
                <span className="text-4xl">{situation!.emoji}</span>
                <h2 className="mt-2 font-heading text-2xl font-bold text-foreground">{situation!.title}</h2>
              </div>

              {/* Steps */}
              <div className="mb-6 flex flex-col gap-2">
                {situation!.steps.map((step, i) => (
                  <div key={i} className="flex gap-3 rounded-xl border border-border bg-card p-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{i + 1}</span>
                    <p className="text-sm text-foreground">{step}</p>
                  </div>
                ))}
              </div>

              {/* Ayah */}
              <div className="mb-4 rounded-2xl bg-gradient-calm border border-border p-4">
                <p className="mb-2 font-arabic text-lg leading-relaxed text-foreground" dir="rtl">{situation!.ayah.arabic}</p>
                <p className="mb-2 text-sm text-muted-foreground italic">"{situation!.ayah.english}"</p>
                <a href={situation!.ayah.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline">{situation!.ayah.ref} →</a>
              </div>

              {/* Hadith */}
              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="mb-2 text-sm text-foreground italic">{situation!.hadith.text}</p>
                <a href={situation!.hadith.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline">{situation!.hadith.source} →</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SituationGuide;
