import { Link } from "react-router-dom";
import { blogPosts } from "@/data/blogPosts";
import EcosystemProductsSection from "@/components/EcosystemProductsSection";
import MarketingNav from "@/components/MarketingNav";
import SiteFooter from "@/components/SiteFooter";
import { ummahBuildMeta } from "@/data/ummahProducts";
import { usePageSeo } from "@/hooks/use-page-seo";

const corePillars = [
  {
    title: "Emergency Calm Protocol",
    detail: "Step-by-step Sunnah actions in the exact moment of anger: silence, isti'adhah, posture shift, and wudu.",
  },
  {
    title: "Faith-Based Daily Tools",
    detail: "Dhikr, Qur'an recitation, breathing, and reflection tools designed for practical emotional regulation.",
  },
  {
    title: "Progress That You Can See",
    detail: "Mood trends, anger triggers, and Sabr progress tracking to turn effort into consistent improvement.",
  },
];

const problemPoints = [
  "Anger harms relationships, decision-making, and spiritual focus when unmanaged.",
  "Many Muslims know Islamic guidance exists, but not what to do in the moment of escalation.",
  "Most wellness apps are generic and disconnected from Qur'an, Sunnah, and Muslim context.",
];

const featuredInsights = blogPosts.slice(0, 4).map((post) => ({
  slug: post.slug,
  title: post.title,
  excerpt: post.excerpt,
  category: post.category,
  emoji: post.emoji,
}));

const PitchPage = () => {
  usePageSeo({
    title: "HabibiChill Pitch — Muslim Anger Management App | Ummah Build",
    description:
      "Quick pitch for HabibiChill: a faith-grounded anger management app using Qur'an, Sunnah, and Islamic psychology. Free, private, real-time emotional mastery for Muslims.",
    path: "/pitch",
    keywords: ["habibichill pitch", "muslim anger app", "ummah build", "islamic emotional wellness"],
  });

  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />

      <header className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Quick Pitch</p>
          <h1 className="mx-auto mb-4 max-w-3xl font-heading text-4xl font-extrabold leading-tight text-foreground md:text-5xl">
            HabibiChill helps Muslims turn anger into disciplined, reward-driven action.
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            A practical emotional mastery app rooted in Qur'an, Sunnah, and Islamic psychology. Free, private, and usable in real-time when emotions run high.
          </p>
        </div>
      </header>

      <main className="container mx-auto space-y-14 px-4 py-14">
        <section className="rounded-3xl border border-border bg-card p-7">
          <h2 className="mb-4 font-heading text-2xl font-bold text-foreground">The Problem</h2>
          <ul className="space-y-2 text-muted-foreground">
            {problemPoints.map((point) => (
              <li key={point} className="rounded-lg bg-background px-4 py-3">
                {point}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-5 font-heading text-2xl font-bold text-foreground">The Solution</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {corePillars.map((pillar) => (
              <article key={pillar.title} className="rounded-2xl border border-border bg-card p-5">
                <h3 className="mb-2 font-heading text-lg font-semibold text-card-foreground">{pillar.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{pillar.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-5 font-heading text-2xl font-bold text-foreground">Proof & Content From Our Blog</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {featuredInsights.map((item) => (
              <Link
                key={item.slug}
                to={`/blogs/${item.slug}`}
                className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                    {item.category}
                  </span>
                </div>
                <h3 className="mb-1 font-heading text-base font-bold text-card-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-7">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">{ummahBuildMeta.motto}</p>
          <h2 className="mb-3 font-heading text-2xl font-bold text-foreground">Part of {ummahBuildMeta.name}</h2>
          <p className="mb-4 text-muted-foreground">{ummahBuildMeta.description}</p>
          <Link to="/products" className="text-sm font-semibold text-primary underline hover:text-primary/80">
            Explore the full product ecosystem →
          </Link>
        </section>

        <section className="rounded-3xl border border-border bg-gradient-calm p-8 text-center">
          <p className="mx-auto mb-6 max-w-2xl text-lg text-muted-foreground">
            HabibiChill gives Muslims a real-time, faith-grounded system to regulate anger and build long-term emotional discipline.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/" className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">
              Open HabibiChill
            </Link>
            <Link to="/guides" className="rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground">
              Read Guides
            </Link>
          </div>
        </section>
      </main>

      <EcosystemProductsSection title="Sibling Products in the Ecosystem" limit={4} />

      <SiteFooter />
    </div>
  );
};

export default PitchPage;
