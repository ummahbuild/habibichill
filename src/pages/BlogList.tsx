import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { blogPosts } from "@/data/blogPosts";
import logo from "@/assets/habibichill-logo.png";

const categories = ["All", ...Array.from(new Set(blogPosts.map((p) => p.category)))];

const BlogList = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Blog — HabibiChill | Islamic Anger Management Articles";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Articles on Islamic anger management, Qur'an and Sunnah guidance, evidence-based emotional mastery, and practical guides for Muslim mental health.");
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="HabibiChill" className="h-8 w-8 rounded-full object-cover" width={32} height={32} />
            <span className="font-heading text-lg font-bold text-foreground">HabibiChill</span>
          </Link>
          <Link to="/" className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:scale-105">
            Launch App
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="bg-gradient-calm py-16 text-center">
        <div className="container mx-auto px-4">
          <motion.h1
            className="mb-4 font-heading text-4xl font-extrabold text-foreground md:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Blog & Resources
          </motion.h1>
          <motion.p
            className="mx-auto max-w-2xl text-lg text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Evidence-based Islamic anger management articles, Qur'anic wisdom, prophetic guidance, and practical guides for emotional mastery.
          </motion.p>
        </div>
      </header>

      {/* Categories */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <span
              key={cat}
              className="rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      <main className="container mx-auto px-4 pb-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post, i) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/blogs/${post.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-calm hover:border-primary/30"
              >
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-3xl">{post.emoji}</span>
                  <span className="rounded-full bg-primary/10 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                    {post.category}
                  </span>
                </div>
                <h2 className="mb-2 font-heading text-lg font-bold text-card-foreground group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  <span>{post.readTime} read</span>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto flex flex-col items-center gap-4 px-4 text-center text-sm text-muted-foreground md:flex-row md:justify-between">
          <p>Made with ❤️ by <a href="https://ummah.build" target="_blank" rel="noopener noreferrer" className="font-medium text-foreground underline">Ummah Build</a></p>
          <div className="flex items-center gap-4">
            <Link to="/" className="transition-colors hover:text-foreground">Home</Link>
            <Link to="/blogs" className="transition-colors hover:text-foreground">Blog</Link>
            <Link to="/legal" className="transition-colors hover:text-foreground">Legal</Link>
          </div>
          <p>© {new Date().getFullYear()} HabibiChill.com</p>
        </div>
      </footer>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "HabibiChill Blog",
            "url": "https://habibichill.com/blogs",
            "description": "Islamic anger management articles, Qur'anic wisdom, and evidence-based guides.",
            "publisher": { "@type": "Organization", "name": "Ummah Build", "url": "https://ummah.build" },
            "blogPost": blogPosts.map((p) => ({
              "@type": "BlogPosting",
              "headline": p.title,
              "description": p.excerpt,
              "datePublished": p.date,
              "author": { "@type": "Organization", "name": p.author },
              "url": `https://habibichill.com/blogs/${p.slug}`,
            })),
          }),
        }}
      />
    </div>
  );
};

export default BlogList;
