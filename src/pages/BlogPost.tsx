import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getPostBySlug, getRelatedPosts } from "@/data/blogPosts";
import logo from "@/assets/habibichill-logo.png";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = getPostBySlug(slug || "");
  const related = getRelatedPosts(slug || "", 3);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (post) {
      document.title = `${post.title} — HabibiChill Blog`;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute("content", post.excerpt);
    }
  }, [post]);

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background text-center">
        <p className="mb-4 text-6xl">📝</p>
        <h1 className="mb-2 font-heading text-2xl font-bold text-foreground">Post Not Found</h1>
        <p className="mb-6 text-muted-foreground">This article doesn't exist.</p>
        <Link to="/blogs" className="rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground">
          View All Posts
        </Link>
      </div>
    );
  }

  const renderContent = (block: string) => {
    if (block.startsWith("## ")) {
      return <h2 className="mb-3 mt-8 font-heading text-2xl font-bold text-foreground">{block.slice(3)}</h2>;
    }
    if (block.startsWith("### ")) {
      return <h3 className="mb-2 mt-6 font-heading text-xl font-semibold text-foreground">{block.slice(4)}</h3>;
    }
    if (block.startsWith("- ")) {
      return (
        <li className="mb-1 ml-4 list-disc text-muted-foreground" dangerouslySetInnerHTML={{
          __html: block.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>')
        }} />
      );
    }
    if (block.match(/^\d+\.\s/)) {
      return (
        <li className="mb-1 ml-4 list-decimal text-muted-foreground" dangerouslySetInnerHTML={{
          __html: block.replace(/^\d+\.\s/, '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>')
        }} />
      );
    }
    return (
      <p className="mb-4 leading-relaxed text-muted-foreground" dangerouslySetInnerHTML={{
        __html: block.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>')
      }} />
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="HabibiChill" className="h-8 w-8 rounded-full object-cover" width={32} height={32} />
            <span className="font-heading text-lg font-bold text-foreground">HabibiChill</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/blogs" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              ← All Posts
            </Link>
            <Link to="/" className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:scale-105">
              Launch App
            </Link>
          </div>
        </div>
      </nav>

      {/* Article */}
      <article className="container mx-auto max-w-3xl px-4 py-12">
        <motion.header
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-4 flex items-center gap-3">
            <span className="text-4xl">{post.emoji}</span>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              {post.category}
            </span>
          </div>
          <h1 className="mb-4 font-heading text-3xl font-extrabold leading-tight text-foreground md:text-4xl">
            {post.title}
          </h1>
          <p className="mb-4 text-lg text-muted-foreground">{post.excerpt}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span>By {post.author}</span>
            <span>·</span>
            <time dateTime={post.date}>{new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time>
            <span>·</span>
            <span>{post.readTime} read</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-border px-3 py-0.5 text-[11px] text-muted-foreground">
                #{tag}
              </span>
            ))}
          </div>
        </motion.header>

        <motion.div
          className="prose-custom"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {post.content.map((block, i) => (
            <div key={i}>{renderContent(block)}</div>
          ))}
        </motion.div>

        {/* CTA */}
        <div className="mt-12 rounded-2xl bg-gradient-calm border border-border p-8 text-center">
          <h3 className="mb-2 font-heading text-xl font-bold text-foreground">Ready to Start Your Sabr Journey?</h3>
          <p className="mb-4 text-muted-foreground">HabibiChill is free, private, and works offline.</p>
          <Link to="/" className="inline-block rounded-2xl bg-primary px-8 py-3 font-heading font-semibold text-primary-foreground shadow-calm transition-all hover:scale-105">
            Launch HabibiChill
          </Link>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 font-heading text-2xl font-bold text-foreground">Related Articles</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to={`/blogs/${r.slug}`}
                  className="group rounded-2xl border border-border bg-card p-4 transition-all hover:shadow-calm hover:border-primary/30"
                >
                  <span className="mb-2 block text-2xl">{r.emoji}</span>
                  <h3 className="mb-1 font-heading text-sm font-bold text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {r.title}
                  </h3>
                  <p className="text-[11px] text-muted-foreground">{r.readTime} read</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto flex flex-col items-center gap-4 px-4 text-center text-sm text-muted-foreground md:flex-row md:justify-between">
          <p>Made with ❤️ by <a href="https://ummah.build" target="_blank" rel="noopener noreferrer" className="font-medium text-foreground underline">Ummah Build</a></p>
          <div className="flex items-center gap-4">
            <Link to="/" className="transition-colors hover:text-foreground">Home</Link>
            <Link to="/blogs" className="transition-colors hover:text-foreground">Blog</Link>
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
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "datePublished": post.date,
            "author": { "@type": "Organization", "name": post.author },
            "publisher": { "@type": "Organization", "name": "Ummah Build", "url": "https://ummah.build" },
            "url": `https://habibichill.com/blogs/${post.slug}`,
            "keywords": post.tags.join(", "),
          }),
        }}
      />
    </div>
  );
};

export default BlogPost;
