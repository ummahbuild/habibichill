import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "@/assets/habibichill-logo.png";
import ProductCard from "@/components/ProductCard";
import SiteFooter from "@/components/SiteFooter";
import { ummahProducts, ummahBuildMeta } from "@/data/ummahProducts";
import { usePageSeo } from "@/hooks/use-page-seo";

const ProductsPage = () => {
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
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="HabibiChill" className="h-8 w-8 rounded-full object-cover" width={32} height={32} />
            <span className="font-heading text-lg font-bold text-foreground">HabibiChill</span>
          </Link>
          <Link to="/" className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            Launch App
          </Link>
        </div>
      </nav>

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

      <main className="container mx-auto px-4 py-14">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground">All Products</h2>
            <p className="text-sm text-muted-foreground">{ummahProducts.length} faith-aligned apps in the ecosystem</p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ummahProducts.map((product, i) => (
            <motion.div
              key={product.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default ProductsPage;
