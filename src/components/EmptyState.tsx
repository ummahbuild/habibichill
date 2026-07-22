import { cn } from "@/lib/utils";

interface EmptyStateProps {
  emoji: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  className?: string;
  compact?: boolean;
}

/**
 * Compact empty state with optional primary/secondary CTAs.
 * Designed to invite one clear next action without clutter.
 */
const EmptyState = ({
  emoji,
  title,
  description,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
  className,
  compact = false,
}: EmptyStateProps) => (
  <div
    className={cn(
      "rounded-2xl border border-dashed border-border bg-card text-center",
      compact ? "px-4 py-5" : "px-5 py-8",
      className,
    )}
  >
    <p className={cn("mb-2", compact ? "text-2xl" : "text-3xl")} aria-hidden>
      {emoji}
    </p>
    <h3 className="mb-1 font-heading text-sm font-semibold text-foreground">{title}</h3>
    <p className="mx-auto mb-4 max-w-xs text-xs leading-relaxed text-muted-foreground">
      {description}
    </p>
    {(actionLabel || secondaryLabel) && (
      <div className="flex flex-wrap items-center justify-center gap-2">
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-calm transition-all hover:scale-[1.02] active:scale-95 touch-target"
          >
            {actionLabel}
          </button>
        )}
        {secondaryLabel && onSecondary && (
          <button
            type="button"
            onClick={onSecondary}
            className="rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-medium text-foreground transition-colors hover:bg-muted touch-target"
          >
            {secondaryLabel}
          </button>
        )}
      </div>
    )}
  </div>
);

export default EmptyState;
