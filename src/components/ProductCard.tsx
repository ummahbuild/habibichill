import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { UmmahProduct } from "@/data/ummahProducts";
import { getProductDetailPath } from "@/data/ummahProducts";

interface ProductCardProps {
  product: UmmahProduct;
  variant?: "compact" | "full";
  className?: string;
}

const statusLabel: Record<UmmahProduct["status"], string> = {
  live: "Live",
  beta: "Beta",
  "coming-soon": "Soon",
};

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
          "pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b opacity-60",
          product.accent,
        )}
        aria-hidden
      />

      <div className={cn("relative flex items-start gap-3", isCompact ? "gap-2.5" : "mb-3")}>
        <div
          className={cn(
            "flex shrink-0 items-center justify-center rounded-xl border border-border/50 bg-background/80 backdrop-blur-sm",
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
            <div className="mb-2 flex flex-wrap items-center gap-1.5">
              <span className="rounded-full border border-border bg-background/80 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                {product.category}
              </span>
              <span className="rounded-full bg-secondary/10 px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
                {statusLabel[product.status]}
              </span>
            </div>
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
          <p className="relative mb-4 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
            {product.description}
          </p>
          <div className="relative flex items-center justify-between gap-2">
            <span className="rounded-full border border-border px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              {product.appType}
            </span>
            <span className="text-xs font-semibold text-primary">Learn more →</span>
          </div>
        </>
      )}

      {isCompact && (
        <span className="relative mt-2 hidden text-[10px] font-medium text-muted-foreground sm:inline">
          {product.appType} · {product.category}
        </span>
      )}
    </Link>
  );
};

export default ProductCard;
