import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import SiteFooter from "@/components/SiteFooter";
import ProductLogo from "@/components/ProductLogo";
import { getRelatedProducts } from "@/data/ummahProducts";
import { getProductDetailPath } from "@/data/ummahProducts";
import { usePageSeo } from "@/hooks/use-page-seo";

const suggestedProducts = getRelatedProducts("habibichill", 3);

const NotFound = () => {
  const location = useLocation();

  usePageSeo({
    title: "404 — Page Not Found | HabibiChill",
    description: "This page does not exist. Explore HabibiChill, the Ummah Build product ecosystem, guides, and blog instead.",
    path: "/404",
    noindex: true,
  });

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-muted">
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl rounded-3xl border border-border bg-card p-8 text-center shadow-calm">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">404 Error</p>
          <h1 className="mb-3 font-heading text-4xl font-extrabold text-foreground md:text-5xl">
            Page Not Found
          </h1>
          <p className="mx-auto mb-6 max-w-xl text-muted-foreground">
            The page you requested does not exist or may have moved. Try one of these instead.
          </p>

          <div className="mb-6 rounded-xl border border-border bg-background px-4 py-3 text-left text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Requested path:</span>{" "}
            <span className="break-all">{location.pathname}</span>
          </div>

          <div className="mb-8 grid gap-3 sm:grid-cols-2">
            <Link
              to="/"
              className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-all hover:scale-[1.01]"
            >
              Launch App
            </Link>
            <Link
              to="/products"
              className="rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Explore Products
            </Link>
            <Link
              to="/guides"
              className="rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Browse Guides
            </Link>
            <Link
              to="/blogs"
              className="rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Read Blog Posts
            </Link>
          </div>

          <div className="text-left">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Ummah Build products
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedProducts.map((product) => (
                <Link
                  key={product.slug}
                  to={getProductDetailPath(product.slug)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary/40"
                >
                  <ProductLogo product={product} size="xs" className="border-0 bg-transparent" />
                  {product.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
};

export default NotFound;
