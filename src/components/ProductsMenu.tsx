import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ummahProducts, ummahBuildMeta, getProductDetailPath } from "@/data/ummahProducts";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const ProductsMenu = () => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();

  const handleEnter = () => {
    if (isMobile) return;
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };

  const handleLeave = () => {
    if (isMobile) return;
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
          aria-haspopup="dialog"
          aria-expanded={open}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        >
          Products
          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="center"
        side="top"
        className="w-[min(92vw,22rem)] p-0"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        <div className="border-b border-border bg-gradient-calm px-4 py-3">
          <p className="font-heading text-sm font-bold text-foreground">{ummahBuildMeta.name}</p>
          <p className="text-xs text-muted-foreground line-clamp-2">{ummahBuildMeta.tagline}</p>
        </div>

        <ul className="max-h-72 overflow-y-auto p-2">
          {ummahProducts.map((product) => (
            <li key={product.slug}>
              <Link
                to={getProductDetailPath(product.slug)}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-muted"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background text-lg">
                  {product.emoji}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-foreground">
                    {product.name}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {product.tagline}
                  </span>
                </span>
                <span className="hidden shrink-0 rounded-full border border-border px-2 py-0.5 text-[9px] text-muted-foreground sm:inline">
                  {product.appType}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="border-t border-border p-2">
          <Link
            to="/products"
            onClick={() => setOpen(false)}
            className="block rounded-xl bg-primary/10 px-3 py-2 text-center text-xs font-semibold text-primary hover:bg-primary/20"
          >
            View all ecosystem products →
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ProductsMenu;
