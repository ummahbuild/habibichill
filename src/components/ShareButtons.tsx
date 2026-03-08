import { useState } from "react";
import { Share2, Check, Link2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ShareButtonsProps {
  url: string;
  title: string;
  text?: string;
  compact?: boolean;
}

const ShareButtons = ({ url, title, text, compact = false }: ShareButtonsProps) => {
  const [copied, setCopied] = useState(false);
  const [showNative, setShowNative] = useState(false);

  const fullUrl = url.startsWith("http") ? url : `https://habibichill.com${url}`;
  const shareText = text || title;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement("input");
      input.value = fullUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: shareText, url: fullUrl });
      } catch {}
    } else {
      setShowNative(true);
    }
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${fullUrl}`)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(fullUrl)}&via=ummahbuild`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(shareText)}`;

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        {navigator.share && (
          <button
            onClick={handleNativeShare}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Share"
          >
            <Share2 className="h-3.5 w-3.5" />
          </button>
        )}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-[hsl(142,70%,45%)]/10 hover:text-[hsl(142,70%,45%)] hover:border-[hsl(142,70%,45%)]/30 transition-colors"
          aria-label="Share on WhatsApp"
        >
          <span className="text-sm">💬</span>
        </a>
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors"
          aria-label="Share on X/Twitter"
        >
          <span className="text-sm">𝕏</span>
        </a>
        <button
          onClick={handleCopy}
          className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
            copied
              ? "border-success/30 bg-success/10 text-success"
              : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
          aria-label={copied ? "Link copied" : "Copy link"}
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-muted-foreground mr-1">Share:</span>
      
      {navigator.share && (
        <button
          onClick={handleNativeShare}
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Share"
        >
          <Share2 className="h-3.5 w-3.5" />
          Share
        </button>
      )}

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-[hsl(142,70%,45%)]/10 hover:text-[hsl(142,70%,45%)] hover:border-[hsl(142,70%,45%)]/30 transition-colors"
      >
        💬 WhatsApp
      </a>

      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors"
      >
        𝕏 Twitter
      </a>

      <a
        href={telegramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent/10 hover:text-accent hover:border-accent/30 transition-colors"
      >
        ✈️ Telegram
      </a>

      <button
        onClick={handleCopy}
        className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
          copied
            ? "border-success/30 bg-success/10 text-success"
            : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
        }`}
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5" />
            Copied!
          </>
        ) : (
          <>
            <Link2 className="h-3.5 w-3.5" />
            Copy Link
          </>
        )}
      </button>
    </div>
  );
};

export default ShareButtons;
