import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ModalShellProps {
  children: ReactNode;
  onClose: () => void;
  title: string;
  className?: string;
  contentClassName?: string;
  labelledById?: string;
}

/**
 * Full-screen app overlay with dialog semantics, Escape handling, and basic focus trap.
 */
const ModalShell = ({
  children,
  onClose,
  title,
  className,
  contentClassName,
  labelledById = "modal-shell-title",
}: ModalShellProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousFocus.current = document.activeElement as HTMLElement | null;

    const root = containerRef.current;
    if (!root) return;

    const focusables = () =>
      Array.from(
        root.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null);

    const items = focusables();
    (items[1] ?? items[0] ?? root).focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const list = focusables();
      if (list.length === 0) {
        e.preventDefault();
        root.focus();
        return;
      }
      const first = list[0];
      const last = list[list.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey) {
        if (active === first || !root.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.body.style.overflow = prevOverflow;
      previousFocus.current?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledById}
      tabIndex={-1}
      className={cn(
        "fixed inset-0 z-50 overflow-y-auto bg-background/95 backdrop-blur-sm outline-none",
        className,
      )}
    >
      <span id={labelledById} className="sr-only">
        {title}
      </span>
      <div className={cn("relative min-h-full", contentClassName)}>{children}</div>
    </div>
  );
};

export default ModalShell;
