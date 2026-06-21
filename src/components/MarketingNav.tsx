import { Link } from "react-router-dom";
import logo from "@/assets/habibichill-logo.png";

interface MarketingNavProps {
  backTo?: { label: string; href: string };
}

const MarketingNav = ({ backTo }: MarketingNavProps) => (
  <nav className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-md">
    <div className="container mx-auto flex items-center justify-between gap-3 px-4 py-3">
      <Link to="/" className="flex min-w-0 items-center gap-2">
        <img src={logo} alt="HabibiChill" className="h-8 w-8 shrink-0 rounded-full object-cover" width={32} height={32} />
        <span className="truncate font-heading text-lg font-bold text-foreground">HabibiChill</span>
      </Link>

      <div className="flex shrink-0 items-center gap-2">
        {backTo && (
          <Link to={backTo.href} className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:inline">
            {backTo.label}
          </Link>
        )}
        <Link to="/products" className="hidden rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted sm:inline">
          Products
        </Link>
        <Link to="/pitch" className="hidden rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted md:inline">
          Pitch
        </Link>
        <Link to="/" className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          Launch App
        </Link>
      </div>
    </div>
  </nav>
);

export default MarketingNav;
