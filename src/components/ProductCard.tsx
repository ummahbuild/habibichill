import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
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
        "group flex flex-col rounded-2xl border border-border bg-card transition-all hover:border-primary/40 hover:shadow-calm",
        isCompact ? "p-3" : "h-full p-5",
        className,
      )}
    >
      <div className={cn("flex items-start gap-3", isCompact ? "gap-2.5" : "mb-3")}>
        <div
          className={cn(
            "flex shrink-0 items-center justify-center rounded-xl bg-gradient-calm",
            isCompact ? "h-10 w-10 text-xl" : "h-14 w-14 text-3xl",
          )}
          aria-hidden
        >
          {product.image && !isCompact ? (
            <img
              src={product.image}
              alt=""
              className="h-full w-full rounded-xl object-cover"
              loading="lazy"
            />
          ) : (
            product.emoji
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-1.5">
            <h3
              className={cn(
                "font-heading font-bold text-card-foreground group-hover:text-primary",
                isCompact ? "text-sm" : "text-lg",
              )}
            >
              {product.name}
            </h3>
            {product.isCurrentApp && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-primary">
                You are here
              </span>
            )}
          </div>

          {!isCompact && (
            <p className="mb-2 text-xs text-muted-foreground">{product.domain}</p>
          )}

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
          <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
            {product.description}
          </p>
          <div className="flex items-center justify-between gap-2">
            <span className="rounded-full border border-border px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              {product.appType}
            </span>
            <span className="text-xs font-semibold text-primary">Learn more →</span>
          </div>
        </>
      )}

      {isCompact && (
        <span className="mt-2 hidden text-[10px] font-medium text-primary sm:inline">
          {product.appType}
        </span>
      )}
    </Link>
  );
};

export default ProductCard;
