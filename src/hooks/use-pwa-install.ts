import { useState, useEffect, useCallback } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export type DeviceType = "ios" | "android" | "desktop" | "unknown";

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    const val = localStorage.getItem("hc-pwa-dismissed");
    if (!val) return false;
    // Allow re-prompt after 7 days
    const ts = parseInt(val, 10);
    return Date.now() - ts < 7 * 24 * 60 * 60 * 1000;
  });

  const deviceType: DeviceType = (() => {
    const ua = navigator.userAgent;
    if (/iPad|iPhone|iPod/.test(ua)) return "ios";
    if (/Android/i.test(ua)) return "android";
    if (/Windows|Macintosh|Linux/.test(ua) && !/Mobile/i.test(ua)) return "desktop";
    return "unknown";
  })();

  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as any).standalone === true;

  useEffect(() => {
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setIsInstalled(true));

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [isStandalone]);

  const install = useCallback(async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") setIsInstalled(true);
      setDeferredPrompt(null);
    }
  }, [deferredPrompt]);

  const dismiss = useCallback(() => {
    setDismissed(true);
    localStorage.setItem("hc-pwa-dismissed", String(Date.now()));
  }, []);

  const canPrompt = !!deferredPrompt && !isInstalled;
  const showBanner = !isInstalled && !dismissed && !isStandalone;

  return { canPrompt, isInstalled, isStandalone, deviceType, install, dismiss, showBanner };
}
