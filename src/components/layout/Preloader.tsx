"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState, useSyncExternalStore } from "react";
import type { Tier } from "@/lib/capabilities";

const KEY = "preloaded";
const TIMEOUT_MS = 1500;
/** The indicator only appears when the scene is still not ready this long after mount. */
export const SHOW_AFTER_MS = 300;

const subscribe = () => () => {};
// Only a first visit in this tab shows the preloader. Storage can throw (private mode, blocked data).
function getSnapshot(): boolean {
  try {
    return sessionStorage.getItem(KEY) !== "1";
  } catch {
    return false;
  }
}
const getServerSnapshot = () => false;

/**
 * A small corner indicator, never a curtain: the headline is on screen the whole time. Appears only if the
 * scene is not ready 300 ms after mount, ends when it reports ready or after 1.5 s, and stays away for the
 * rest of the session. Never shown on the mobile tier (`low`), where the scene arrives late on purpose.
 */
export function Preloader({ ready, tier }: { ready: boolean; tier: Tier | null }) {
  const t = useTranslations();
  const firstVisit = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [timedOut, setTimedOut] = useState(false);
  const [delayed, setDelayed] = useState(false);
  const done = ready || timedOut || tier === "low";
  const visible = firstVisit && delayed && !done;

  useEffect(() => {
    if (!firstVisit) return;
    const show = setTimeout(() => setDelayed(true), SHOW_AFTER_MS);
    const cap = setTimeout(() => setTimedOut(true), TIMEOUT_MS);
    return () => {
      clearTimeout(show);
      clearTimeout(cap);
    };
  }, [firstVisit]);

  useEffect(() => {
    if (!firstVisit || !done) return;
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {
      /* storage unavailable: it simply shows again next visit */
    }
  }, [firstVisit, done]);

  if (!visible) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed right-6 bottom-6 z-50 flex items-end gap-3">
      <span className="text-xs text-fg-2">{t("preloader.label")}</span>
      <span aria-hidden className="relative block h-12 w-px overflow-hidden bg-fg-2/25">
        <span className="absolute inset-x-0 top-0 h-1/2 animate-[preloader-sweep_1.1s_ease-in-out_infinite] bg-fg motion-reduce:h-full motion-reduce:animate-none" />
      </span>
    </div>
  );
}
