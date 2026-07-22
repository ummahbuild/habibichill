import { Link } from "react-router-dom";
import logo from "@/assets/habibichill-logo.png";

interface MarketingNavProps {
  backTo?: { label: string; href: string };
}

const MarketingNav = ({ backTo }: MarketingNavProps) => (
  <nav className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-md">
    <div className="container mx-auto flex items-center justify-between gap-2 px-4 py-3">
      <Link to="/" className="flex min-w-0 items-center gap-2">
        <img src={logo} alt="HabibiChill" className="h-8 w-8 shrink-0 rounded-full object-cover" width={32} height={32} />
        <span className="truncate font-heading text-base font-bold text-foreground sm:text-lg">HabibiChill</span>
      </Link>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        {backTo && (
          <Link to={backTo.href} className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:inline">
            {backTo.label}
          </Link>
        )}
        <Link
          to="/products"
          className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted sm:px-3 sm:text-sm"
        >
          Products
        </Link>
        <Link
          to="/pitch"
          className="hidden rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted sm:inline"
        >
          Pitch
        </Link>
        <Link to="/" className="rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground sm:px-4 sm:py-2 sm:text-sm">
          Launch App
        </Link>
      </div>
    </div>
  </nav>
);

export default MarketingNav;
