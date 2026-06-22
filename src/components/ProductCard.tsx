import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import ProductLogo from "@/components/ProductLogo";
import {
  ProductAppTypeBadge,
  ProductCurrentAppBadge,
  ProductMetaBadges,
} from "@/components/ProductBadges";
import type { UmmahProduct } from "@/data/ummahProducts";
import { getProductDetailPath } from "@/data/ummahProducts";

interface ProductCardProps {
  product: UmmahProduct;
  variant?: "compact" | "full";
  className?: string;
}

const ProductCard = ({ product, variant = "full", className }: ProductCardProps) => {
  const detailPath = getProductDetailPath(product.slug);
  const isCompact = variant === "compact";

  return (
    <Link
      to={detailPath}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/40 hover:shadow-calm",
        isCompact ? "p-3" : "h-full p-5",
        className,
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b opacity-50",
          product.accent,
        )}
        aria-hidden
      />

      <div className={cn("relative flex items-start gap-3", isCompact ? "gap-2.5" : "mb-3")}>
        <ProductLogo product={product} size={isCompact ? "sm" : "md"} />

        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
            <h3
              className={cn(
                "font-heading font-bold text-card-foreground group-hover:text-primary",
                isCompact ? "text-sm" : "text-lg",
              )}
            >
              {product.name}
            </h3>
            {product.isCurrentApp && <ProductCurrentAppBadge />}
          </div>

          <ProductMetaBadges
            product={product}
            size={isCompact ? "xs" : "sm"}
            showAppType={isCompact}
            className="mb-1.5"
          />

          <p
            className={cn(
              "text-muted-foreground",
              isCompact ? "line-clamp-1 text-xs" : "line-clamp-2 text-sm leading-relaxed",
            )}
          >
            {product.tagline}
          </p>
        </div>
      </div>

      {!isCompact && (
        <>
          <p className="relative mb-4 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
            {product.description}
          </p>
          <div className="relative flex items-center justify-between gap-2">
            <ProductAppTypeBadge appType={product.appType} size="xs" />
            <span className="text-xs font-semibold text-primary">Learn more →</span>
          </div>
        </>
      )}
    </Link>
  );
};

export default ProductCard;
