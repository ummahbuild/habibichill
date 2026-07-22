import { lazy, type ComponentType, type LazyExoticComponent } from "react";

const RELOAD_KEY = "hc-chunk-reload";
const RELOAD_COOLDOWN_MS = 15_000;

/**
 * Like React.lazy, but retries failed dynamic imports (common after deploys / flaky networks)
 * and does at most one hard reload per cooldown when a stale PWA cache serves a missing chunk.
 */
export function lazyWithRetry<T extends ComponentType<unknown>>(
  factory: () => Promise<{ default: T }>,
  retries = 2,
): LazyExoticComponent<T> {
  return lazy(async () => {
    let lastError: unknown;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await factory();
      } catch (error) {
        lastError = error;
        if (attempt < retries) {
          await new Promise((resolve) => setTimeout(resolve, 350 * (attempt + 1)));
        }
      }
    }

    // Chunk hash mismatch after deploy: one hard reload usually fixes it.
    try {
      const lastReload = Number(sessionStorage.getItem(RELOAD_KEY) || 0);
      if (!lastReload || Date.now() - lastReload > RELOAD_COOLDOWN_MS) {
        sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
        window.location.reload();
        // Hold the promise open until the page unloads.
        return new Promise(() => undefined);
      }
    } catch {
      // sessionStorage unavailable — fall through and throw
    }

    throw lastError;
  });
}
