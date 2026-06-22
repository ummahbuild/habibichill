import { cn } from "@/lib/utils";
import type { UmmahProduct } from "@/data/ummahProducts";
import { getProductLogo } from "@/data/ummahProducts";

interface ProductLogoProps {
  product: UmmahProduct;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  xs: "h-7 w-7 rounded-lg text-sm",
  sm: "h-9 w-9 rounded-lg text-lg",
  md: "h-14 w-14 rounded-xl text-3xl",
  lg: "h-20 w-20 rounded-2xl text-4xl",
};

const ProductLogo = ({ product, size = "md", className }: ProductLogoProps) => {
  const logo = getProductLogo(product);

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden border border-border/50 bg-background/80 backdrop-blur-sm",
        sizeClasses[size],
        className,
      )}
      aria-hidden={!logo}
    >
      {logo ? (
        <img
          src={logo}
          alt={`${product.name} logo`}
          className="h-full w-full object-cover"
          loading="lazy"
          width={size === "lg" ? 80 : size === "md" ? 56 : size === "sm" ? 36 : 28}
          height={size === "lg" ? 80 : size === "md" ? 56 : size === "sm" ? 36 : 28}
        />
      ) : (
        <span>{product.emoji}</span>
      )}
    </div>
  );
};

export default ProductLogo;
