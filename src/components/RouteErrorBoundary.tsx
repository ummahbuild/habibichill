import { Component, type ErrorInfo, type ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
  children: ReactNode;
  /** Optional label shown in the recovery UI */
  label?: string;
}

interface State {
  hasError: boolean;
  message: string;
}

/**
 * Catches render + lazy-import failures so the app never dies as a blank white screen.
 */
class RouteErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      message: error?.message || "Something went wrong while loading this page.",
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[RouteErrorBoundary]", error, info.componentStack);
  }

  private handleReload = () => {
    this.setState({ hasError: false, message: "" });
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, message: "" });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16 text-center">
        <p className="mb-3 text-4xl" aria-hidden>
          ⚠️
        </p>
        <h1 className="mb-2 font-heading text-2xl font-bold text-foreground">
          {this.props.label ? `${this.props.label} failed to load` : "Page failed to load"}
        </h1>
        <p className="mb-2 max-w-md text-sm text-muted-foreground">
          This is usually a temporary network or cache issue after an update — not a missing page.
        </p>
        {this.state.message && (
          <p className="mb-6 max-w-md rounded-xl border border-border bg-card px-3 py-2 text-left text-[11px] text-muted-foreground">
            {this.state.message}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={this.handleReload}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-calm"
          >
            Reload page
          </button>
          <button
            type="button"
            onClick={this.handleReset}
            className="rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground"
          >
            Try again
          </button>
          <Link
            to="/products"
            onClick={this.handleReset}
            className="rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground"
          >
            Products
          </Link>
          <Link
            to="/"
            onClick={this.handleReset}
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground"
          >
            Home
          </Link>
        </div>
      </div>
    );
  }
}

export default RouteErrorBoundary;
