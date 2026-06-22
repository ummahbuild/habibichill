import { cn } from "@/lib/utils";
import type { UmmahProduct } from "@/data/ummahProducts";

type BadgeSize = "xs" | "sm";

const sizeClasses: Record<BadgeSize, string> = {
  xs: "px-2 py-0.5 text-[10px] gap-1",
  sm: "px-2.5 py-0.5 text-[11px] gap-1.5",
};

const statusConfig: Record<
  UmmahProduct["status"],
  { label: string; className: string; dotClassName: string }
> = {
  live: {
    label: "Live",
    className: "border-success/40 bg-success/15 text-success",
    dotClassName: "bg-success",
  },
  beta: {
    label: "Beta",
    className: "border-warning/40 bg-warning/15 text-warning",
    dotClassName: "bg-warning",
  },
  "coming-soon": {
    label: "Coming Soon",
    className: "border-border bg-muted text-muted-foreground",
    dotClassName: "bg-muted-foreground",
  },
};

interface BadgeBaseProps {
  size?: BadgeSize;
  className?: string;
}

export const ProductStatusDot = ({
  status,
  className,
}: { status: UmmahProduct["status"]; className?: string }) => {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-block h-2 w-2 shrink-0 rounded-full",
        config.dotClassName,
        status === "live" && "shadow-[0_0_6px_hsl(var(--success)/0.6)]",
        className,
      )}
      title={config.label}
      aria-label={config.label}
    />
  );
};

export const ProductStatusBadge = ({
  status,
  size = "sm",
  showDot = true,
  className,
}: BadgeBaseProps & { status: UmmahProduct["status"]; showDot?: boolean }) => {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-semibold uppercase tracking-wide",
        sizeClasses[size],
        config.className,
        className,
      )}
    >
      {showDot && (
        <span
          className={cn(
            "shrink-0 rounded-full",
            size === "xs" ? "h-1.5 w-1.5" : "h-2 w-2",
            config.dotClassName,
            status === "live" && "shadow-[0_0_6px_hsl(var(--success)/0.6)]",
          )}
          aria-hidden
        />
      )}
      {config.label}
    </span>
  );
};

export const ProductCategoryBadge = ({
  category,
  size = "sm",
  className,
}: BadgeBaseProps & { category: UmmahProduct["category"] }) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full border border-primary/30 bg-primary/10 font-semibold text-primary",
      sizeClasses[size],
      className,
    )}
  >
    {category}
  </span>
);

export const ProductAppTypeBadge = ({
  appType,
  size = "sm",
  className,
}: BadgeBaseProps & { appType: UmmahProduct["appType"] }) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full border border-border bg-background font-medium text-foreground",
      sizeClasses[size],
      className,
    )}
  >
    {appType}
  </span>
);

export const ProductTagBadge = ({
  tag,
  className,
}: { tag: string; className?: string }) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full border border-border bg-muted/70 px-3 py-0.5 text-[11px] font-medium text-foreground/80",
      className,
    )}
  >
    #{tag}
  </span>
);

export const ProductCurrentAppBadge = ({ className }: { className?: string }) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary-foreground",
      className,
    )}
  >
    You are here
  </span>
);

interface ProductMetaBadgesProps {
  product: UmmahProduct;
  size?: BadgeSize;
  showStatus?: boolean;
  showCategory?: boolean;
  showAppType?: boolean;
  className?: string;
}

export const ProductMetaBadges = ({
  product,
  size = "sm",
  showStatus = true,
  showCategory = true,
  showAppType = false,
  className,
}: ProductMetaBadgesProps) => (
  <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
    {showAppType && <ProductAppTypeBadge appType={product.appType} size={size} />}
    {showCategory && <ProductCategoryBadge category={product.category} size={size} />}
    {showStatus && <ProductStatusBadge status={product.status} size={size} />}
  </div>
);
