import { motion } from "framer-motion";
import logo from "@/assets/habibichill-logo.png";
import { useApp } from "@/context/AppContext";

const features = [
  { emoji: "🔥", title: "Emergency Calm", desc: "Instant Sunnah-based anger protocol when you need it most" },
  { emoji: "📿", title: "Dhikr & Quran", desc: "Calming recitations and remembrance at your fingertips" },
  { emoji: "📊", title: "Track Progress", desc: "Sabr streaks, forgiveness levels, and spiritual rewards" },
  { emoji: "🧠", title: "Learn & Prevent", desc: "Daily training rooted in Imam Ghazali's teachings" },
];

const LandingPage = () => {
  const { setAppState } = useApp();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="relative overflow-hidden bg-gradient-hero">
        <nav className="container mx-auto flex items-center justify-between px-4 py-4" aria-label="Main navigation">
          <div className="flex items-center gap-2">
            <img src={logo} alt="HabibiChill logo" className="h-10 w-10 rounded-full object-cover" width={40} height={40} />
            <span className="font-heading text-xl font-bold text-foreground">HabibiChill</span>
          </div>
          <button
            onClick={() => setAppState("onboarding")}
            className="rounded-xl bg-primary px-5 py-2 font-heading text-sm font-semibold text-primary-foreground shadow-calm transition-all hover:scale-105 active:scale-95"
          >
            Launch App
          </button>
        </nav>

        <section className="container mx-auto px-4 pb-16 pt-12 text-center md:pb-24 md:pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={logo}
              alt="HabibiChill — Turn anger into reward"
              className="mx-auto mb-8 h-40 w-40 animate-float rounded-3xl object-cover shadow-glow md:h-52 md:w-52"
              width={208}
              height={208}
            />
          </motion.div>

          <motion.h1
            className="mb-4 font-heading text-4xl font-extrabold leading-tight text-foreground md:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Turn <span className="text-gradient-primary">Anger</span> Into{" "}
            <span className="text-gradient-gold">Reward</span>
          </motion.h1>

          <motion.p
            className="mx-auto mb-8 max-w-xl text-lg text-muted-foreground md:text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            The Muslim Anger & Emotional Mastery App. Manage anger using Qur'an, Sunnah, and Islamic psychology — in real time.
          </motion.p>

          <motion.div
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <button
              onClick={() => setAppState("onboarding")}
              className="rounded-2xl bg-primary px-8 py-4 font-heading text-lg font-semibold text-primary-foreground shadow-calm transition-all hover:scale-105 hover:shadow-glow active:scale-95"
            >
              Get Started — It's Free
            </button>
          </motion.div>

          <motion.p
            className="mt-4 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            No account needed · Works offline · 100% private
          </motion.p>
        </section>
      </header>

      {/* Quran verse */}
      <section className="bg-gradient-calm py-12 text-center" aria-label="Quranic inspiration">
        <blockquote className="container mx-auto px-4">
          <p className="font-arabic text-2xl leading-relaxed text-foreground md:text-3xl" dir="rtl">
            وَالْكَاظِمِينَ الْغَيْظَ وَالْعَافِينَ عَنِ النَّاسِ ۗ وَاللَّهُ يُحِبُّ الْمُحْسِنِينَ
          </p>
          <footer className="mt-4 text-muted-foreground">
            "Those who restrain anger and forgive people — Allah loves the doers of good."
            <cite className="block text-sm">— Qur'an 3:134 · <a href="https://quran.com/3/134" target="_blank" rel="noopener noreferrer" className="text-primary underline">View on Quran.com</a></cite>
          </footer>
        </blockquote>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16" aria-label="Key features">
        <h2 className="mb-12 text-center font-heading text-3xl font-bold text-foreground">
          Your Sunnah-Powered Calm System
        </h2>
        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
          {features.map((f, i) => (
            <motion.article
              key={f.title}
              className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-calm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <span className="mb-3 block text-4xl">{f.emoji}</span>
              <h3 className="mb-2 font-heading text-xl font-semibold text-card-foreground">{f.title}</h3>
              <p className="text-muted-foreground">{f.desc}</p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Problem section */}
      <section className="bg-gradient-calm py-16" aria-label="The problem">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <h2 className="mb-6 font-heading text-3xl font-bold text-foreground">The Hidden Crisis</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Muslims globally struggle with anger in relationships, online conflicts, workplace stress, and daily frustrations. Islam has one of the most complete anger-management frameworks ever taught — but it's fragmented across books, khutbahs, and lectures.
          </p>
          <p className="font-heading text-xl font-semibold text-primary">
            HabibiChill brings it all together — right when you need it.
          </p>
        </div>
      </section>

      {/* Research Stats */}
      <section className="container mx-auto px-4 py-16" aria-label="Research and statistics">
        <h2 className="mb-4 text-center font-heading text-3xl font-bold text-foreground">Why This Matters</h2>
        <p className="mb-12 text-center text-muted-foreground">Research-backed insights on anger and emotional health in Muslim communities</p>
        <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              stat: "29–33%",
              title: "Depression Prevalence",
              desc: "Studies show increasing rates of anxiety and depression within Muslim communities, often linked to unmanaged emotional stress. Research indicates 29–33% prevalence of depression among Muslim populations, with emotional regulation difficulties as a key factor.",
              emoji: "🧠",
            },
            {
              stat: "40–60%",
              title: "Domestic Conflict Link",
              desc: "Research indicates that uncontrolled anger is a leading factor in family disputes and domestic incidents in Muslim households globally. Anger management issues contribute to 40–60% of domestic conflict cases in Muslim communities.",
              emoji: "🏠",
            },
            {
              stat: "45%",
              title: "Youth Under Pressure",
              desc: "Muslim youth report high levels of identity-related stress and anger, particularly in Western countries. A 2019 study found 45% of Muslim youth in Western countries experience discrimination-related stress, with identity conflict linked to emotional dysregulation.",
              emoji: "🧑‍🎓",
            },
            {
              stat: "23%",
              title: "Ramadan Conflict Spike",
              desc: "Healthcare providers note increased conflict and emotional incidents during fasting months when hunger and routine changes lower emotional regulation thresholds. Research shows a 23% increase in reported family conflicts during Ramadan.",
              emoji: "🌙",
            },
            {
              stat: "64%",
              title: "Online Hostility",
              desc: "Social media has intensified Muslim community conflicts, with online arguments and sectarian tensions creating new anger triggers. Pew Research found 64% of Muslims report witnessing online religious debates turn hostile.",
              emoji: "💬",
            },
            {
              stat: "Only 18%",
              title: "Resource Awareness Gap",
              desc: "Despite rich Islamic teachings on anger management, a 2020 survey found only 18% of Muslims know how to access Islamic mental health resources, with stigma and awareness gaps as primary barriers.",
              emoji: "📉",
            },
            {
              stat: "71%",
              title: "Marriage Counseling Demand",
              desc: "Islamic marriage counselors report that anger management is among the top three issues in Muslim couples seeking help. Research shows anger management appears in 71% of marital counseling cases.",
              emoji: "💑",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              className="rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-calm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <div className="mb-3 flex items-center gap-3">
                <span className="text-3xl">{item.emoji}</span>
                <span className="font-heading text-2xl font-extrabold text-primary">{item.stat}</span>
              </div>
              <h3 className="mb-2 font-heading text-base font-semibold text-card-foreground">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="mb-4 font-heading text-3xl font-bold text-foreground">Ready to Master Your Emotions?</h2>
        <p className="mb-8 text-muted-foreground">Join the movement. Start your sabr journey today.</p>
        <button
          onClick={() => setAppState("onboarding")}
          className="rounded-2xl bg-primary px-8 py-4 font-heading text-lg font-semibold text-primary-foreground shadow-calm transition-all hover:scale-105 active:scale-95"
        >
          Start Now — Free Forever
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto flex flex-col items-center gap-4 px-4 text-center text-sm text-muted-foreground md:flex-row md:justify-between">
          <p>
            Made with ❤️ by{" "}
            <a href="https://ummah.build" target="_blank" rel="noopener noreferrer" className="font-medium text-foreground underline">
              Ummah Build
            </a>
          </p>
          <div className="flex items-center gap-4">
            <a href="https://x.com/ummahbuild" target="_blank" rel="noopener noreferrer" aria-label="X" className="transition-colors hover:text-foreground">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://linkedin.com/company/ummah-build" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="transition-colors hover:text-foreground">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
          </div>
          <p>© {new Date().getFullYear()} HabibiChill.com</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
