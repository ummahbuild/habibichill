import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import MarketingNav from "@/components/MarketingNav";
import SiteFooter from "@/components/SiteFooter";
import EmptyState from "@/components/EmptyState";
import {
  filterProducts,
  productCategories,
  ummahProducts,
  ummahBuildMeta,
  type ProductCategory,
} from "@/data/ummahProducts";
import { usePageSeo } from "@/hooks/use-page-seo";

const categoryStats = productCategories.map((cat) => ({
  category: cat,
  count: ummahProducts.filter((p) => p.category === cat).length,
}));

const ProductsPage = () => {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ProductCategory | "">("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filtered = useMemo(
    () => filterProducts(query, activeCategory),
    [query, activeCategory],
  );

  usePageSeo({
    title: "Ummah Build Products — Islamic Tech Ecosystem | HabibiChill",
    description:
      "Explore the Ummah Build product ecosystem: HabibiChill, SunnahSleep, MosqueSteps, MosqueList, TryRamadan, ShariaCheck, MuslimName, and PRAYSAP — faith-aligned apps for the global ummah.",
    path: "/products",
    keywords: [
      "ummah build",
      "islamic apps",
      "muslim tech",
      "habibichill",
      "sunnahsleep",
      "mosquesteps",
      "praysap",
      "ummaceleration",
    ],
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Ummah Build Product Ecosystem",
      description: ummahBuildMeta.description,
      url: "https://habibichill.com/products",
      isPartOf: {
        "@type": "WebSite",
        name: "HabibiChill",
        url: "https://habibichill.com",
      },
      publisher: {
        "@type": "Organization",
        name: ummahBuildMeta.name,
        url: ummahBuildMeta.url,
      },
      mainEntity: {
        "@type": "ItemList",
        itemListElement: ummahProducts.map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: product.name,
          url: `https://habibichill.com/product/${product.slug}`,
          description: product.tagline,
        })),
      },
    },
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <MarketingNav />

      <header className="bg-gradient-hero py-14 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.p
            className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {ummahBuildMeta.motto}
          </motion.p>
          <motion.h1
            className="mx-auto mb-4 max-w-3xl font-heading text-4xl font-extrabold text-foreground md:text-5xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {ummahBuildMeta.name} Product Ecosystem
          </motion.h1>
          <motion.p
            className="mx-auto max-w-2xl text-lg text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            {ummahBuildMeta.description}
          </motion.p>
          <motion.a
            href={ummahBuildMeta.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-block text-sm font-semibold text-primary underline hover:text-primary/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            Visit ummah.build →
          </motion.a>
        </div>
      </header>

      <section className="border-b border-border bg-card/50">
        <div className="container mx-auto grid grid-cols-2 gap-3 px-4 py-6 sm:grid-cols-4 lg:grid-cols-5">
          {categoryStats.map(({ category, count }) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(activeCategory === category ? "" : category)}
              className={`rounded-xl border px-3 py-3 text-center transition-colors ${
                activeCategory === category
                  ? "border-primary/40 bg-primary/10"
                  : "border-border bg-background hover:border-primary/30"
              }`}
              aria-pressed={activeCategory === category}
            >
              <p className="font-heading text-xl font-bold text-foreground">{count}</p>
              <p className="text-xs font-medium text-foreground/70">{category}</p>
            </button>
          ))}
        </div>
      </section>

      <main className="container mx-auto px-4 py-10">
        {ummahProducts.length === 0 ? (
          <EmptyState
            emoji="📦"
            title="Products unavailable"
            description="We couldn't load the product catalog. Reload the page or try again shortly."
            actionLabel="Reload"
            onAction={() => window.location.reload()}
            secondaryLabel="Go home"
            onSecondary={() => { window.location.href = "/"; }}
          />
        ) : (
          <>
            <div className="mb-6 space-y-4">
              <div className="relative max-w-md">
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  aria-label="Search products"
                  className="w-full rounded-xl border border-border bg-card px-4 py-2.5 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">🔍</span>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveCategory("")}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${!activeCategory ? "bg-primary text-primary-foreground" : "border border-border bg-card text-muted-foreground hover:text-foreground"}`}
                >
                  All
                </button>
                {productCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(activeCategory === cat ? "" : cat)}
                    className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${activeCategory === cat ? "bg-primary text-primary-foreground" : "border border-border bg-card text-muted-foreground hover:text-foreground"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {filtered.length} product{filtered.length !== 1 ? "s" : ""}
                {activeCategory ? ` in ${activeCategory}` : ""}
              </p>
              {(query || activeCategory) && (
                <button
                  type="button"
                  onClick={() => { setQuery(""); setActiveCategory(""); }}
                  className="text-xs text-primary underline hover:text-primary/80"
                >
                  Clear filters
                </button>
              )}
            </div>

            {filtered.length === 0 ? (
              <EmptyState
                emoji="🔍"
                title="No matching products"
                description="Try a different search term or clear the category filter."
                actionLabel="Clear filters"
                onAction={() => { setQuery(""); setActiveCategory(""); }}
              />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((product, i) => (
                  <motion.div
                    key={product.slug}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ delay: Math.min(i * 0.03, 0.24) }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <SiteFooter />
    </div>
  );
};

export default ProductsPage;
