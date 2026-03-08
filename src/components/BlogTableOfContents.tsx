import { useMemo, useState } from "react";

interface Props {
  content: string[];
}

const BlogTableOfContents = ({ content }: Props) => {
  const [open, setOpen] = useState(false);

  const headings = useMemo(() => {
    return content
      .filter((b) => b.startsWith("## ") || b.startsWith("### "))
      .map((b) => ({
        level: b.startsWith("### ") ? 3 : 2,
        text: b.replace(/^#{2,3}\s/, ""),
        id: b.replace(/^#{2,3}\s/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      }));
  }, [content]);

  if (headings.length < 3) return null;

  return (
    <nav className="mb-8 rounded-2xl border border-border bg-card p-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-sm font-semibold text-foreground"
      >
        <span>📑 Table of Contents</span>
        <span className="text-muted-foreground">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <ol className="mt-3 space-y-1.5 text-sm">
          {headings.map((h, i) => (
            <li key={i} className={h.level === 3 ? "ml-4" : ""}>
              <a
                href={`#${h.id}`}
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                {h.text}
              </a>
            </li>
          ))}
        </ol>
      )}
    </nav>
  );
};

export default BlogTableOfContents;
