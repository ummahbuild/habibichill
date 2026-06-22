import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import MarketingNav from "@/components/MarketingNav";
import ProductLogo from "@/components/ProductLogo";
import {
  ProductMetaBadges,
  ProductStatusBadge,
  ProductTagBadge,
} from "@/components/ProductBadges";
import RelatedProductsCarousel from "@/components/RelatedProductsCarousel";
import ShareButtons from "@/components/ShareButtons";
import SiteFooter from "@/components/SiteFooter";
import {
  getProductBySlug,
  getRelatedProducts,
  getProductLogoUrl,
  ummahBuildMeta,
} from "@/data/ummahProducts";
import { usePageSeo } from "@/hooks/use-page-seo";

const ProductDetailPage = () => {
  const { slug = "" } = useParams<{ slug: string }>();
  const product = getProductBySlug(slug);
  const related = getRelatedProducts(slug, 6);
  const detailPath = `/product/${slug}`;

  usePageSeo({
    title: product
      ? `${product.name} — ${product.tagline} | Ummah Build`
      : "Product Not Found | HabibiChill",
    description: product
      ? `${product.longDescription || product.description} Part of the ${ummahBuildMeta.name} Islamic tech ecosystem (${ummahBuildMeta.motto}).`
      : "This Ummah Build product page could not be found.",
    path: detailPath,
    image: getProductLogoUrl(slug) ?? "https://habibichill.com/habibichillmeta.png",
    type: "website",
    keywords: product ? [product.name, product.category, ...product.tags, "ummah build", "islamic app"] : [],
    jsonLd: product
      ? [
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: product.name,
            url: product.url,
            image: getProductLogoUrl(product.slug),
            description: product.longDescription || product.description,
            applicationCategory: product.appType,
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            creator: {
              "@type": "Organization",
              name: ummahBuildMeta.name,
              url: ummahBuildMeta.url,
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://habibichill.com/" },
              { "@type": "ListItem", position: 2, name: "Products", item: "https://habibichill.com/products" },
              {
                "@type": "ListItem",
                position: 3,
                name: product.name,
                item: `https://habibichill.com${detailPath}`,
              },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: `What is ${product.name}?`,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: product.longDescription || product.description,
                },
              },
              {
                "@type": "Question",
                name: `Who built ${product.name}?`,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: `${product.name} is built by ${ummahBuildMeta.name}, an Islamic technology venture studio (${ummahBuildMeta.motto}).`,
                },
              },
            ],
          },
        ]
      : undefined,
  });

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
        <p className="mb-2 text-5xl">📦</p>
        <h1 className="mb-2 font-heading text-2xl font-bold text-foreground">Product Not Found</h1>
        <p className="mb-6 text-muted-foreground">This Ummah Build product does not exist yet.</p>
        <Link to="/products" className="rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground">
          View All Products
        </Link>
      </div>
    );
  }

  const ctaHref = product.isCurrentApp ? "/" : product.url;
  const ctaLabel = product.isCurrentApp ? "Open HabibiChill" : `Visit ${product.domain}`;

  return (
    <div className="min-h-screen bg-background">
      <MarketingNav backTo={{ label: "← All Products", href: "/products" }} />

      <nav aria-label="Breadcrumb" className="container mx-auto px-4 pt-6 text-xs text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1">
          <li><Link to="/" className="hover:text-foreground">Home</Link></li>
          <li>/</li>
          <li><Link to="/products" className="hover:text-foreground">Products</Link></li>
          <li>/</li>
          <li className="text-foreground">{product.name}</li>
        </ol>
      </nav>

      <article className="container mx-auto max-w-3xl px-4 py-10">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className={`mb-6 overflow-hidden rounded-3xl border border-border bg-gradient-to-br p-6 ${product.accent}`}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <ProductLogo product={product} size="lg" className="border-border/50 bg-background/90" />
              <div className="min-w-0">
                <ProductMetaBadges
                  product={product}
                  showAppType
                  className="mb-3"
                />
                <h1 className="mb-2 font-heading text-3xl font-extrabold text-foreground md:text-4xl">
                  {product.name}
                </h1>
                <p className="text-lg font-medium text-primary">{product.tagline}</p>
                <p className="mt-1 text-sm text-muted-foreground">{product.domain}</p>
              </div>
            </div>
          </div>

          <p className="mb-6 text-base leading-relaxed text-muted-foreground">
            {product.longDescription || product.description}
          </p>

          <section className="mb-8">
            <h2 className="mb-3 font-heading text-lg font-bold text-foreground">Key Highlights</h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {product.highlights.map((item) => (
                <li key={item} className="flex items-start gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-muted-foreground">
                  <span className="text-primary" aria-hidden>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <div className="mb-8 flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <ProductTagBadge key={tag} tag={tag} />
            ))}
          </div>

          <div className="mb-6 flex flex-wrap gap-3">
            {product.isCurrentApp ? (
              <Link
                to={ctaHref}
                className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-calm"
              >
                {ctaLabel}
              </Link>
            ) : (
              <a
                href={ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-calm"
              >
                {ctaLabel}
              </a>
            )}
            <Link
              to="/products"
              className="rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground"
            >
              Explore Ecosystem
            </Link>
          </div>

          <ShareButtons
            url={detailPath}
            title={`${product.name} — ${product.tagline}`}
            text={`${product.name} by Ummah Build: ${product.tagline}`}
            compact
          />
        </motion.header>

        <section className="mt-12 rounded-2xl border border-border bg-gradient-calm p-6">
          <h2 className="mb-2 font-heading text-lg font-bold text-foreground">About {ummahBuildMeta.name}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {ummahBuildMeta.description} Our motto is <strong className="text-foreground">{ummahBuildMeta.motto}</strong> — accelerating Islamic innovation for the ummah.
          </p>
          <a
            href={ummahBuildMeta.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm font-semibold text-primary underline"
          >
            Learn more at ummah.build →
          </a>
        </section>
      </article>

      <section className="container mx-auto px-4 pb-16">
        <RelatedProductsCarousel products={related} />
      </section>

      <SiteFooter />
    </div>
  );
};

export default ProductDetailPage;
