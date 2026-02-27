import { useState, useEffect, useCallback, useMemo } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export type DeviceType = "ios" | "android" | "desktop" | "unknown";

function detectDevice(): DeviceType {
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  if (/Windows|Macintosh|Linux/.test(ua) && !/Mobile/i.test(ua)) return "desktop";
  return "unknown";
}

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    try {
      const val = localStorage.getItem("hc-pwa-dismissed");
      if (!val) return false;
      const ts = parseInt(val, 10);
      if (isNaN(ts)) return false;
      return Date.now() - ts < 7 * 24 * 60 * 60 * 1000;
    } catch {
      return false;
    }
  });

  const deviceType = useMemo(detectDevice, []);

  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as any).standalone === true;

  useEffect(() => {
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    const handlePrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => setIsInstalled(true);

    window.addEventListener("beforeinstallprompt", handlePrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handlePrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, [isStandalone]);

  const install = useCallback(async () => {
    if (!deferredPrompt) return;
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") setIsInstalled(true);
    } catch {
      // prompt can fail silently in some browsers
    }
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  const dismiss = useCallback(() => {
    setDismissed(true);
    try {
      localStorage.setItem("hc-pwa-dismissed", String(Date.now()));
    } catch {
      // localStorage may be unavailable in private browsing
    }
  }, []);

  const canPrompt = !!deferredPrompt && !isInstalled;
  const showBanner = !isInstalled && !dismissed && !isStandalone;

  return { canPrompt, isInstalled, isStandalone, deviceType, install, dismiss, showBanner };
}
