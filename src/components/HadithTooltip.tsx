import { useState, useRef, useEffect, ReactNode } from "react";

interface HadithTooltipProps {
  source: string;
  narrator?: string;
  text: string;
  link?: string;
  children: ReactNode;
}

const HadithTooltip = ({ source, narrator, text, link, children }: HadithTooltipProps) => {
  const [show, setShow] = useState(false);
  const [above, setAbove] = useState(true);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (show && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setAbove(rect.top > 200);
    }
  }, [show]);

  return (
    <span
      ref={ref}
      className="relative inline cursor-help"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onTouchStart={() => setShow((s) => !s)}
    >
      <span className="border-b border-dotted border-secondary/50">{children}</span>
      {show && (
        <div
          className={`absolute z-50 left-1/2 -translate-x-1/2 w-72 rounded-xl border border-border bg-popover p-3 shadow-lg ${
            above ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1">📚 {source}</p>
          {narrator && <p className="text-[10px] text-muted-foreground mb-1.5">{narrator}</p>}
          <p className="text-xs text-foreground italic leading-relaxed">"{text}"</p>
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1.5 inline-block text-[10px] text-primary underline"
              onClick={(e) => e.stopPropagation()}
            >
              View on Sunnah.com →
            </a>
          )}
        </div>
      )}
    </span>
  );
};

export default HadithTooltip;
