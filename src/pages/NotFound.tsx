import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <div className="w-full max-w-2xl rounded-3xl border border-border bg-card p-8 text-center shadow-calm">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">404 Error</p>
        <h1 className="mb-3 font-heading text-4xl font-extrabold text-foreground md:text-5xl">
          Page Not Found
        </h1>
        <p className="mx-auto mb-6 max-w-xl text-muted-foreground">
          The page you requested does not exist or may have moved. Use one of the quick actions below.
        </p>

        <div className="mb-6 rounded-xl border border-border bg-background px-4 py-3 text-left text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Requested path:</span> {location.pathname}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            to="/"
            className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-all hover:scale-[1.01]"
          >
            Launch App
          </Link>
          <Link
            to="/pitch"
            className="rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            View Quick Pitch
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
      </div>
    </div>
  );
};

export default NotFound;
