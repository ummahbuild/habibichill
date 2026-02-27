import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/habibichill-logo.png";
import { useApp } from "@/context/AppContext";
import { blogPosts } from "@/data/blogPosts";
import AppWalkthrough from "@/components/AppWalkthrough";
import ArabicTooltip from "@/components/ArabicTooltip";
import HadithTooltip from "@/components/HadithTooltip";
import SiteFooter from "@/components/SiteFooter";

const features = [
  { emoji: "🔥", title: "Emergency Calm", desc: "Instant Sunnah-based anger protocol when you need it most" },
  { emoji: "📿", title: "Dhikr & Quran", desc: "Calming recitations and remembrance at your fingertips" },
  { emoji: "📊", title: "Track Progress", desc: "Sabr streaks, forgiveness levels, and spiritual rewards", hasSabr: true },
  { emoji: "🧠", title: "Learn & Prevent", desc: "Daily training rooted in Imam Ghazali's teachings" },
];

const researchStats = [
  {
    stat: "1 in 5",
    title: "Mental Health Burden",
    desc: "Globally, approximately 1 in 5 people experience a mental health condition each year, with anger and emotional dysregulation as significant contributing factors.",
    emoji: "🧠",
    sourceUrl: "https://www.who.int/news-room/fact-sheets/detail/mental-disorders",
    sourceLabel: "WHO — Mental Disorders Fact Sheet (2022)",
  },
  {
    stat: "30%",
    title: "Domestic Violence Link",
    desc: "The WHO estimates that roughly 30% of women worldwide have experienced intimate partner violence, with uncontrolled anger identified as a primary behavioral risk factor.",
    emoji: "🏠",
    sourceUrl: "https://www.who.int/news-room/fact-sheets/detail/violence-against-women",
    sourceLabel: "WHO — Violence Against Women (2024)",
  },
  {
    stat: "48%",
    title: "Youth Discrimination Stress",
    desc: "48% of American Muslim youth report experiencing discrimination, contributing to stress, identity conflict, and emotional dysregulation.",
    emoji: "🧑‍🎓",
    sourceUrl: "https://www.ispu.org/american-muslim-poll-2022/",
    sourceLabel: "ISPU — American Muslim Poll (2022)",
  },
  {
    stat: "2×",
    title: "Fasting & Irritability",
    desc: "Research shows that Ramadan fasting can double self-reported irritability due to hypoglycemia, dehydration, and disrupted sleep patterns.",
    emoji: "🌙",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/25714825/",
    sourceLabel: "PubMed — Fasting & Mood Changes (2015)",
  },
  {
    stat: "41%",
    title: "Online Hostility Exposure",
    desc: "41% of American adults have experienced online harassment, with religious identity being a significant factor. Religious debates frequently escalate into hostility.",
    emoji: "💬",
    sourceUrl: "https://www.pewresearch.org/internet/2021/01/13/the-state-of-online-harassment/",
    sourceLabel: "Pew Research — Online Harassment (2021)",
  },
  {
    stat: "Only 33%",
    title: "Treatment Gap",
    desc: "Only 33% of Muslim Americans experiencing psychological distress seek professional help, citing stigma, cultural barriers, and lack of faith-based resources.",
    emoji: "📉",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/26354332/",
    sourceLabel: "PubMed — Muslim Mental Health Help-Seeking (2015)",
  },
  {
    stat: "67%",
    title: "Marriage & Anger",
    desc: "Anger and communication breakdown are cited in approximately 67% of marital dissatisfaction cases, making emotional regulation a critical relationship skill.",
    emoji: "💑",
    sourceUrl: "https://www.gottman.com/blog/the-four-horsemen-recognizing-criticism-contempt-defensiveness-and-stonewalling/",
    sourceLabel: "Gottman Institute — The Four Horsemen",
  },
];

const quotesData = [
  {
    type: "Quran" as const,
    arabic: "وَالْكَاظِمِينَ الْغَيْظَ وَالْعَافِينَ عَنِ النَّاسِ ۗ وَاللَّهُ يُحِبُّ الْمُحْسِنِينَ",
    translation: "Those who restrain anger and forgive people — Allah loves the doers of good.",
    reference: "Qur'an 3:134",
    sourceUrl: "https://quran.com/3/134",
    context: "This ayah describes the qualities of the muttaqeen (God-conscious). Restraining anger is placed alongside charity, and those who do so are called muhsineen — people of excellence. Allah explicitly states His love for them.",
  },
  {
    type: "Sunnah" as const,
    arabic: "لَا تَغْضَبْ",
    translation: "Do not become angry.",
    reference: "Sahih al-Bukhari 6116",
    sourceUrl: "https://sunnah.com/bukhari:6116",
    context: "A man asked the Prophet ﷺ for advice repeatedly, and each time he said 'Do not become angry.' This shows anger management is central to Islam — more important than any other single piece of advice the Prophet ﷺ could give.",
  },
  {
    type: "Quran" as const,
    arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation: "Indeed, with hardship comes ease.",
    reference: "Qur'an 94:6",
    sourceUrl: "https://quran.com/94/6",
    context: "Surah Ash-Sharh was revealed to comfort the Prophet ﷺ during difficulty. The repetition of this promise (v5 and v6) emphasizes its certainty — relief is guaranteed alongside every hardship.",
  },
  {
    type: "Sunnah" as const,
    arabic: "لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ",
    translation: "The strong person is not the one who can wrestle others down. The strong person is the one who controls himself when angry.",
    reference: "Sahih al-Bukhari 6114",
    sourceUrl: "https://sunnah.com/bukhari:6114",
    context: "The Prophet ﷺ redefined strength — not as physical power, but as emotional mastery. In a culture that valued wrestling and combat, this was revolutionary. True strength is sabr (patience) in the moment of anger.",
  },
  {
    type: "Quran" as const,
    arabic: "ادْفَعْ بِالَّتِي هِيَ أَحْسَنُ فَإِذَا الَّذِي بَيْنَكَ وَبَيْنَهُ عَدَاوَةٌ كَأَنَّهُ وَلِيٌّ حَمِيمٌ",
    translation: "Repel evil with that which is better; then the one who was your enemy will become a devoted friend.",
    reference: "Qur'an 41:34",
    sourceUrl: "https://quran.com/41/34",
    context: "This ayah teaches the most powerful conflict resolution strategy — responding to hostility with kindness. Allah promises that this approach can transform enemies into close friends.",
  },
  {
    type: "Sunnah" as const,
    arabic: "إِذَا غَضِبَ أَحَدُكُمْ فَلْيَسْكُتْ",
    translation: "If one of you becomes angry, let him be silent.",
    reference: "Musnad Ahmad 2136",
    sourceUrl: "https://sunnah.com/ahmad:2136",
    context: "The Prophet ﷺ repeated this three times for emphasis. Silence is the first line of defense against anger. Most regrettable words are spoken in the first 30 seconds of rage — silence prevents lasting damage.",
  },
  {
    type: "Quran" as const,
    arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    translation: "Verily, in the remembrance of Allah do hearts find rest.",
    reference: "Qur'an 13:28",
    sourceUrl: "https://quran.com/13/28",
    context: "This ayah establishes dhikr (remembrance of Allah) as the ultimate remedy for inner turmoil. Modern psychology confirms that mindful repetition calms the nervous system — Islam prescribed this 1400 years ago.",
  },
  {
    type: "Quran" as const,
    arabic: "وَلَمَن صَبَرَ وَغَفَرَ إِنَّ ذَٰلِكَ لَمِنْ عَزْمِ الْأُمُورِ",
    translation: "And whoever is patient and forgives — indeed, that is of the matters requiring determination.",
    reference: "Qur'an 42:43",
    sourceUrl: "https://quran.com/42/43",
    context: "Allah pairs patience (sabr) with forgiveness ('afw) and calls them 'azm al-umoor — matters of great resolve. This is not passive weakness but active, determined strength. It takes immense courage to forgive.",
  },
  {
    type: "Quran" as const,
    arabic: "خُذِ الْعَفْوَ وَأْمُرْ بِالْعُرْفِ وَأَعْرِضْ عَنِ الْجَاهِلِينَ",
    translation: "Show forgiveness, enjoin what is good, and turn away from the ignorant.",
    reference: "Qur'an 7:199",
    sourceUrl: "https://quran.com/7/199",
    context: "This comprehensive ayah gives three commands in one: forgive people's shortcomings, promote good, and disengage from pointless arguments. It is the Quranic formula for emotional intelligence.",
  },
  {
    type: "Sunnah" as const,
    arabic: "إِذَا غَضِبَ أَحَدُكُمْ وَهُوَ قَائِمٌ فَلْيَجْلِسْ",
    translation: "If any of you becomes angry and he is standing, let him sit down, so his anger will go away. If it does not go away, let him lie down.",
    reference: "Sunan Abu Dawud 4782",
    sourceUrl: "https://sunnah.com/abudawud:4782",
    context: "The Prophet ﷺ prescribed a physical intervention for anger. Modern science confirms: lowering your body reduces blood pressure and cortisol. Lying down activates the parasympathetic nervous system, physically calming rage.",
  },
  {
    type: "Quran" as const,
    arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
    translation: "O you who believe, seek help through patience and prayer. Indeed, Allah is with the patient.",
    reference: "Qur'an 2:153",
    sourceUrl: "https://quran.com/2/153",
    context: "Allah prescribes two remedies for every difficulty: sabr (patience) and salah (prayer). The promise 'Allah is with the patient' means His divine support, guidance, and protection accompany those who endure with faith.",
  },
  {
    type: "Quran" as const,
    arabic: "وَإِمَّا يَنزَغَنَّكَ مِنَ الشَّيْطَانِ نَزْغٌ فَاسْتَعِذْ بِاللَّهِ ۚ إِنَّهُ سَمِيعٌ عَلِيمٌ",
    translation: "And if an evil suggestion comes to you from Satan, then seek refuge in Allah. Indeed, He is Hearing and Knowing.",
    reference: "Qur'an 7:200",
    sourceUrl: "https://quran.com/7/200",
    context: "This ayah directly commands seeking refuge in Allah when Shaytan provokes anger. The Prophet ﷺ taught this as the first step in the anger protocol — saying A'ūdhu billāh neutralizes Shaytan's influence.",
  },
];

const RotatingQuote = () => {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const quote = quotesData[index];

  useEffect(() => {
    if (hovered) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % quotesData.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [hovered]);

  return (
    <section className="bg-gradient-calm py-12 text-center" aria-label="Islamic inspiration">
      <div
        className="container mx-auto px-4 relative"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-2 flex items-center justify-center gap-2">
              <span className={`rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider ${quote.type === "Quran" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"}`}>
                {quote.type === "Quran" ? "📖 Qur'an" : "📿 Sunnah"}
              </span>
            </div>
            <p className="font-arabic text-2xl leading-relaxed text-foreground md:text-3xl" dir="rtl">
              {quote.arabic}
            </p>
            <footer className="mt-4 text-muted-foreground">
              "{quote.translation}"
              <cite className="block text-sm mt-1">
                — {quote.reference} ·{" "}
                <a href={quote.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
                  View Source
                </a>
              </cite>
            </footer>

            {/* Hover context */}
            <AnimatePresence>
              {hovered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 mx-auto max-w-2xl overflow-hidden"
                >
                  <div className="rounded-xl border border-border bg-card p-4 text-left text-sm leading-relaxed text-muted-foreground shadow-calm">
                    <p className="font-semibold text-foreground mb-1">📚 Full Context</p>
                    <p>{quote.context}</p>
                    <a
                      href={quote.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-xs font-medium text-primary underline"
                    >
                      Read on {quote.type === "Quran" ? "Quran.com" : "Sunnah.com"} →
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.blockquote>
        </AnimatePresence>

        {/* Dots */}
        <div className="mt-4 flex items-center justify-center gap-1.5">
          {quotesData.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30"}`}
              aria-label={`Quote ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const BlogCarousel = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let paused = false;
    let animId: number;
    let lastTime = 0;
    
    el.addEventListener("mouseenter", () => { paused = true; });
    el.addEventListener("mouseleave", () => { paused = false; });
    
    const tick = (time: number) => {
      if (!paused && time - lastTime >= 33) { // ~30fps cap
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (el.scrollLeft >= maxScroll) {
          el.scrollLeft = 0;
        } else {
          el.scrollLeft += 1;
        }
        lastTime = time;
      }
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div
      ref={scrollRef}
      className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
      style={{ scrollBehavior: "auto" }}
    >
      {blogPosts.map((post) => (
        <Link
          key={post.slug}
          to={`/blogs/${post.slug}`}
          className="group flex-shrink-0 w-72 rounded-2xl border border-border bg-card p-5 transition-all hover:shadow-calm hover:border-primary/30"
        >
          <div className="mb-2 flex items-center gap-2">
            <span className="text-2xl">{post.emoji}</span>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-primary">
              {post.category}
            </span>
          </div>
          <h3 className="mb-1 font-heading text-sm font-bold text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="mb-2 text-xs text-muted-foreground line-clamp-2">{post.excerpt}</p>
          <span className="text-[10px] text-muted-foreground">{post.readTime} read</span>
        </Link>
      ))}
    </div>
  );
};

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
            className="relative mx-auto mb-8 h-40 w-40 md:h-52 md:w-52"
          >
            {/* Fire side (left) */}
            <div className="absolute inset-0 -left-4 -top-4 animate-fire-glow rounded-3xl opacity-60" />
            {/* Ice side (right) */}
            <div className="absolute inset-0 -right-4 -bottom-4 animate-ice-glow rounded-3xl opacity-60" />
            <img
              src={logo}
              alt="HabibiChill — Turn anger into reward"
              className="relative z-10 mx-auto h-full w-full animate-float object-cover"
              width={208}
              height={208}
              loading="eager"
              fetchPriority="high"
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
            The Muslim Anger & Emotional Mastery App. Manage anger using Qur'an, <ArabicTooltip term="sunnah">Sunnah</ArabicTooltip>, and Islamic psychology — in real time.
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

      {/* Rotating Quran/Sunnah Quote */}
      <RotatingQuote />

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

      {/* App Walkthrough */}
      <AppWalkthrough />

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
          {researchStats.map((item, i) => (
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
                <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="font-heading text-2xl font-extrabold text-primary underline decoration-primary/30 hover:decoration-primary transition-colors">{item.stat}</a>
              </div>
              <h3 className="mb-2 font-heading text-base font-semibold text-card-foreground">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground mb-2">{item.desc}</p>
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-medium text-primary underline decoration-primary/30 hover:decoration-primary transition-colors"
              >
                📎 {item.sourceLabel}
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Blog Carousel */}
      <section className="container mx-auto px-4 py-16" aria-label="Latest articles">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-heading text-3xl font-bold text-foreground">Latest Articles</h2>
          <Link to="/blogs" className="rounded-xl bg-primary/10 px-5 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/20">
            See All Posts →
          </Link>
        </div>
        <BlogCarousel />
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="mb-4 font-heading text-3xl font-bold text-foreground">Ready to Master Your Emotions?</h2>
        <p className="mb-8 text-muted-foreground">Join the movement. Start your <ArabicTooltip term="sabr">sabr</ArabicTooltip> journey today.</p>
        <button
          onClick={() => setAppState("onboarding")}
          className="rounded-2xl bg-primary px-8 py-4 font-heading text-lg font-semibold text-primary-foreground shadow-calm transition-all hover:scale-105 active:scale-95"
        >
          Start Now — Free Forever
        </button>
      </section>

      <SiteFooter />
    </div>
  );
};

export default LandingPage;
