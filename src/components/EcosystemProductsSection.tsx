import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { ummahProducts, ummahBuildMeta } from "@/data/ummahProducts";

interface EcosystemProductsSectionProps {
  title?: string;
  limit?: number;
  showFeaturedOnly?: boolean;
}

const EcosystemProductsSection = ({
  title = "More from Ummah Build",
  limit = 4,
  showFeaturedOnly = true,
}: EcosystemProductsSectionProps) => {
  const products = (showFeaturedOnly ? ummahProducts.filter((p) => p.featured && !p.isCurrentApp) : ummahProducts)
    .slice(0, limit);

  return (
    <section className="py-16" aria-label="Ummah Build product ecosystem">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {ummahBuildMeta.motto}
            </p>
            <h2 className="font-heading text-3xl font-bold text-foreground">{title}</h2>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground line-clamp-2 sm:line-clamp-none">
              {ummahBuildMeta.tagline} — faith-aligned apps from {ummahBuildMeta.name}.
            </p>
          </div>
          <Link
            to="/products"
            className="shrink-0 self-start rounded-xl bg-primary/10 px-5 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/20"
          >
            View all {ummahProducts.length} products →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, i) => (
            <motion.div
              key={product.slug}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EcosystemProductsSection;
