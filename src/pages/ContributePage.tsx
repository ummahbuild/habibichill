import { Link } from "react-router-dom";
import SiteFooter from "@/components/SiteFooter";

const GITHUB_URL = "https://github.com/ummah-build/habibichill";

const ContributePage = () => (
  <div className="min-h-screen bg-background">
    <nav className="border-b border-border bg-card/95 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link to="/" className="font-heading text-lg font-bold text-foreground hover:text-primary transition-colors">
          ← HabibiChill
        </Link>
        <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-all hover:scale-105">
          ⭐ Star on GitHub
        </a>
      </div>
    </nav>

    <main className="container mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-2 font-heading text-3xl font-bold text-foreground">Contributing to HabibiChill 🤝</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Jazāk Allāhu Khayran for your interest! HabibiChill is open source under the <strong className="text-foreground">MIT License</strong>.
      </p>

      {/* Quick Links */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { emoji: "🐛", label: "Report Bug", href: `${GITHUB_URL}/issues/new?template=bug_report.md` },
          { emoji: "💡", label: "Feature Request", href: `${GITHUB_URL}/issues/new?template=feature_request.md` },
          { emoji: "📖", label: "Content Fix", href: `${GITHUB_URL}/issues/new?template=content_improvement.md` },
          { emoji: "🌍", label: "Translate", href: `${GITHUB_URL}/issues/new?template=translation.md` },
        ].map((item) => (
          <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer"
            className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card p-4 text-center transition-all hover:shadow-calm hover:border-primary/30"
          >
            <span className="text-2xl">{item.emoji}</span>
            <span className="text-xs font-medium text-foreground">{item.label}</span>
          </a>
        ))}
      </div>

      {/* How to Contribute */}
      <section className="mb-8">
        <h2 className="mb-3 font-heading text-xl font-semibold text-foreground">How to Contribute</h2>
        <div className="flex flex-col gap-3">
          {[
            { step: "1", title: "Fork & Clone", desc: "Fork the repo on GitHub and clone it locally.", code: "git clone https://github.com/YOUR-USERNAME/habibichill.git" },
            { step: "2", title: "Install & Run", desc: "Install dependencies and start the dev server.", code: "npm install && npm run dev" },
            { step: "3", title: "Create a Branch", desc: "Work on a feature branch with a clear name.", code: "git checkout -b feat/your-feature-name" },
            { step: "4", title: "Submit PR", desc: "Push your changes and open a Pull Request with a clear description." },
          ].map((s) => (
            <div key={s.step} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{s.step}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{s.title}</p>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                  {s.code && <code className="mt-1.5 block rounded-lg bg-muted px-3 py-2 text-[11px] text-foreground break-all">{s.code}</code>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Guidelines */}
      <section className="mb-8">
        <h2 className="mb-3 font-heading text-xl font-semibold text-foreground">Guidelines</h2>
        <div className="flex flex-col gap-2">
          {[
            { icon: "📖", title: "Islamic Content", desc: "All Quranic refs must link to Quran.com. Hadith must include narrator, source, number, and Sunnah.com link. No unverified content." },
            { icon: "🎨", title: "Code Style", desc: "TypeScript strict mode. Use Tailwind semantic tokens (text-foreground, bg-card). Keep components < 200 lines. Use framer-motion for animations." },
            { icon: "📱", title: "Mobile First", desc: "All features must work on mobile. Test in both light and dark mode. Ensure proper touch targets (min 44px)." },
            { icon: "♿", title: "Accessibility", desc: "Semantic HTML, proper aria labels, keyboard navigation, and reduced motion support are required." },
            { icon: "📝", title: "Commit Convention", desc: "Use Conventional Commits: feat:, fix:, docs:, style:, refactor:, test:, chore:" },
          ].map((g) => (
            <div key={g.title} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              <span className="text-xl">{g.icon}</span>
              <div>
                <p className="text-sm font-semibold text-foreground">{g.title}</p>
                <p className="text-xs text-muted-foreground">{g.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="mb-8">
        <h2 className="mb-3 font-heading text-xl font-semibold text-foreground">Tech Stack</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { name: "React 18", icon: "⚛️" },
            { name: "TypeScript", icon: "📘" },
            { name: "Tailwind CSS", icon: "🎨" },
            { name: "Vite", icon: "⚡" },
            { name: "shadcn/ui", icon: "🧩" },
            { name: "Framer Motion", icon: "🎬" },
            { name: "Recharts", icon: "📊" },
            { name: "PWA", icon: "📱" },
          ].map((t) => (
            <div key={t.name} className="flex items-center gap-2 rounded-lg border border-border bg-card p-3">
              <span>{t.icon}</span>
              <span className="text-xs font-medium text-foreground">{t.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* License */}
      <section className="mb-8">
        <h2 className="mb-3 font-heading text-xl font-semibold text-foreground">⚖️ MIT License</h2>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            HabibiChill is released under the <strong className="text-foreground">MIT License</strong>. You are free to use, modify, and distribute this software. By contributing, you agree that your contributions will be licensed under the same license.
          </p>
          <a href={`${GITHUB_URL}/blob/main/LICENSE`} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs text-primary underline">
            View full LICENSE on GitHub →
          </a>
        </div>
      </section>

      {/* Code of Conduct */}
      <section className="mb-8">
        <h2 className="mb-3 font-heading text-xl font-semibold text-foreground">🕊️ Code of Conduct</h2>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground leading-relaxed mb-2">This project follows Islamic adab (etiquette):</p>
          <ul className="list-disc pl-4 text-xs text-muted-foreground space-y-1">
            <li>Be respectful and kind in all interactions</li>
            <li>Provide constructive feedback with good intentions</li>
            <li>Ensure all Islamic content is from authenticated sources</li>
            <li>Avoid content contradicting Qur'an and Sunnah</li>
            <li>Prioritize benefit to the Ummah over ego</li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <div className="rounded-2xl bg-gradient-calm border border-border p-6 text-center">
        <p className="mb-2 font-arabic text-xl text-foreground" dir="rtl">مَنْ دَلَّ عَلَى خَيْرٍ فَلَهُ مِثْلُ أَجْرِ فَاعِلِهِ</p>
        <p className="mb-1 text-sm text-muted-foreground italic">"Whoever guides to good, he will have a reward like that of the one who does it."</p>
        <a href="https://sunnah.com/muslim:1893" target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline">Sahih Muslim 1893 →</a>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:scale-105">
            View on GitHub →
          </a>
          <a href={`${GITHUB_URL}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted">
            Full Guidelines →
          </a>
        </div>
      </div>
    </main>
    <SiteFooter />
  </div>
);

export default ContributePage;
