import { useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { blogPosts } from "@/data/blogPosts";
import logo from "@/assets/habibichill-logo.png";
import SiteFooter from "@/components/SiteFooter";

const allCategories = Array.from(new Set(blogPosts.map((p) => p.category)));
const allTags = Array.from(new Set(blogPosts.flatMap((p) => p.tags)));

const BlogList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "";
  const activeTag = searchParams.get("tag") || "";
  const searchQuery = searchParams.get("q") || "";

  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      if (activeCategory && post.category !== activeCategory) return false;
      if (activeTag && !post.tags.includes(activeTag)) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return post.title.toLowerCase().includes(q) || post.excerpt.toLowerCase().includes(q) || post.tags.some(t => t.toLowerCase().includes(q));
      }
      return true;
    });
  }, [activeCategory, activeTag, searchQuery]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    // Reset to first page when filtering
    setSearchParams(next, { replace: true });
  };

  const clearFilters = () => {
    setSearchParams({}, { replace: true });
  };

  useEffect(() => {
    document.title = "Blog — HabibiChill | Islamic Anger Management Articles";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Articles on Islamic anger management, Qur'an and Sunnah guidance, evidence-based emotional mastery, and practical guides for Muslim mental health.");
  }, []);

  const hasFilters = activeCategory || activeTag || searchQuery;

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
            {blogPosts.length} articles on Islamic anger management, Qur'anic wisdom, prophetic guidance, and practical guides.
          </motion.p>
        </div>
      </header>

      {/* Search & Filters */}
      <div className="container mx-auto px-4 py-6 space-y-4">
        {/* Search */}
        <div className="relative max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => updateParam("q", e.target.value)}
            placeholder="Search articles..."
            className="w-full rounded-xl border border-border bg-card px-4 py-2.5 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">🔍</span>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateParam("category", "")}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${!activeCategory ? "bg-primary text-primary-foreground" : "border border-border bg-card text-muted-foreground hover:text-foreground"}`}
          >
            All
          </button>
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => updateParam("category", activeCategory === cat ? "" : cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${activeCategory === cat ? "bg-primary text-primary-foreground" : "border border-border bg-card text-muted-foreground hover:text-foreground"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => updateParam("tag", activeTag === tag ? "" : tag)}
              className={`rounded-full px-3 py-1 text-[10px] font-medium transition-colors ${activeTag === tag ? "bg-secondary text-secondary-foreground" : "border border-border bg-card text-muted-foreground hover:text-foreground"}`}
            >
              #{tag}
            </button>
          ))}
        </div>

        {hasFilters && (
          <button onClick={clearFilters} className="text-xs text-primary underline hover:text-primary/80">
            Clear all filters
          </button>
        )}
      </div>

      {/* Posts Grid */}
      <main className="container mx-auto px-4 pb-16">
        {filteredPosts.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-4xl mb-2">📝</p>
            <p className="text-muted-foreground">No articles match your filters.</p>
            <button onClick={clearFilters} className="mt-2 text-sm text-primary underline">Clear filters</button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post, i) => (
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
                  <p className="mb-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                  <div className="mb-3 flex flex-wrap gap-1">
                    {post.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    <span>{post.readTime} read</span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </main>

      <SiteFooter />

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
