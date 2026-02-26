import { useState, useRef, useEffect, ReactNode } from "react";

interface ReferenceTooltipProps {
  reference: string; // e.g. "Qur'an 3:134" or "Bukhari 6114"
  arabic?: string;
  english: string;
  source?: string;
  link?: string;
  children: ReactNode;
}

const ReferenceTooltip = ({ reference, arabic, english, source, link, children }: ReferenceTooltipProps) => {
  const [show, setShow] = useState(false);
  const [above, setAbove] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (show && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setAbove(rect.top > 200);
    }
  }, [show]);

  return (
    <span
      className="relative inline"
      ref={ref}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onTouchStart={() => setShow((s) => !s)}
    >
      {children}
      {show && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 left-1/2 -translate-x-1/2 w-72 rounded-xl border border-border bg-popover p-3 shadow-lg ${
            above ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-1">{reference}</p>
          {arabic && (
            <p className="font-arabic text-base leading-relaxed text-foreground mb-1.5" dir="rtl">{arabic}</p>
          )}
          <p className="text-xs text-muted-foreground italic leading-relaxed">"{english}"</p>
          {source && <p className="mt-1.5 text-[10px] text-muted-foreground">{source}</p>}
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-[10px] text-primary underline"
              onClick={(e) => e.stopPropagation()}
            >
              Read more →
            </a>
          )}
        </div>
      )}
    </span>
  );
};

export default ReferenceTooltip;
