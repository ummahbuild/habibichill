import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePwaInstall } from "@/hooks/use-pwa-install";

const PwaInstallPrompt = () => {
  const { canPrompt, showBanner, deviceType, install, dismiss, isInstalled, isStandalone } = usePwaInstall();
  const [autoDismissed, setAutoDismissed] = useState(false);

  // Auto-dismiss after 8 seconds
  useEffect(() => {
    if (!showBanner || isInstalled || isStandalone) return;
    const timer = setTimeout(() => setAutoDismissed(true), 8000);
    return () => clearTimeout(timer);
  }, [showBanner, isInstalled, isStandalone]);

  if (!showBanner || isInstalled || isStandalone || autoDismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed right-3 top-3 z-50 max-w-xs rounded-2xl border border-primary/20 bg-card p-3 shadow-lg shadow-primary/10"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 40 }}
      >
        <button onClick={dismiss} className="absolute right-2 top-2 text-muted-foreground hover:text-foreground text-xs">✕</button>
        <div className="flex items-start gap-2.5 pr-4">
          <span className="text-2xl">📲</span>
          <div className="flex-1 min-w-0">
            <h3 className="text-xs font-bold text-foreground font-heading">Install HabibiChill</h3>
            <p className="mt-0.5 text-[10px] text-muted-foreground leading-relaxed">
              {deviceType === "ios"
                ? "Tap Share → Add to Home Screen"
                : "Install for offline access"}
            </p>
            <div className="mt-2 flex gap-2">
              {canPrompt ? (
                <button
                  onClick={install}
                  className="rounded-lg bg-primary px-3 py-1.5 text-[10px] font-semibold text-primary-foreground transition-all hover:scale-105 active:scale-95"
                >
                  Install
                </button>
              ) : (
                <span className="rounded-lg bg-muted px-2 py-1 text-[10px] text-foreground">
                  {deviceType === "ios" ? "Use Safari Share ↗" : "Browser menu → Install"}
                </span>
              )}
              <button onClick={dismiss} className="rounded-lg border border-border px-2 py-1 text-[10px] text-muted-foreground hover:text-foreground">
                Later
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

/** Compact card for use inside settings */
export const PwaInstallCard = () => {
  const { canPrompt, install, isInstalled, isStandalone, deviceType } = usePwaInstall();
  const [showInstructions, setShowInstructions] = useState(false);

  if (isInstalled || isStandalone) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-success/30 bg-success/5 p-4">
        <div className="text-left">
          <span className="text-sm font-medium text-foreground">📱 App Installed</span>
          <p className="text-xs text-success">HabibiChill is installed on your device</p>
        </div>
        <span className="text-success text-lg">✓</span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 overflow-hidden">
      <button
        onClick={canPrompt ? install : () => setShowInstructions(!showInstructions)}
        className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-primary/10"
      >
        <div>
          <span className="text-sm font-medium text-foreground">📲 Install App</span>
          <p className="text-xs text-muted-foreground">
            {canPrompt
              ? "Tap to install for offline access"
              : "Tap for installation instructions"}
          </p>
        </div>
        <span className="text-primary font-semibold text-sm">
          {canPrompt ? "Install" : showInstructions ? "▲" : "How?"}
        </span>
      </button>

      <AnimatePresence>
        {showInstructions && !canPrompt && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border px-4 pb-4 pt-3">
              {deviceType === "ios" ? (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-foreground">Safari (iOS)</p>
                  <div className="flex items-start gap-2">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">1</span>
                    <p className="text-xs text-muted-foreground">Tap the <strong className="text-foreground">Share</strong> button (box with arrow) at the bottom of Safari</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">2</span>
                    <p className="text-xs text-muted-foreground">Scroll down and tap <strong className="text-foreground">"Add to Home Screen"</strong></p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">3</span>
                    <p className="text-xs text-muted-foreground">Tap <strong className="text-foreground">"Add"</strong> to confirm</p>
                  </div>
                  <p className="mt-1 text-[10px] text-muted-foreground italic">⚠️ Must use Safari — Chrome/Firefox on iOS don't support PWA install.</p>
                </div>
              ) : deviceType === "android" ? (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-foreground">Chrome (Android)</p>
                  <div className="flex items-start gap-2">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">1</span>
                    <p className="text-xs text-muted-foreground">Tap the <strong className="text-foreground">⋮ menu</strong> (three dots) in the top-right</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">2</span>
                    <p className="text-xs text-muted-foreground">Tap <strong className="text-foreground">"Install app"</strong> or <strong className="text-foreground">"Add to Home Screen"</strong></p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">3</span>
                    <p className="text-xs text-muted-foreground">Tap <strong className="text-foreground">"Install"</strong> to confirm</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-foreground">Desktop Browser</p>
                  <div className="flex items-start gap-2">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">1</span>
                    <p className="text-xs text-muted-foreground">Look for the <strong className="text-foreground">install icon</strong> (⊕) in the address bar, or open the browser menu</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">2</span>
                    <p className="text-xs text-muted-foreground">Click <strong className="text-foreground">"Install HabibiChill"</strong> or <strong className="text-foreground">"Install app"</strong></p>
                  </div>
                  <p className="mt-1 text-[10px] text-muted-foreground italic">Works best in Chrome, Edge, or Brave. Firefox has limited PWA support.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PwaInstallPrompt;
