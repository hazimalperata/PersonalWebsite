"use client";

import { useSyncExternalStore } from "react";
import { createTierStore, type Tier } from "./capabilities";

const store = createTierStore();
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void): () => void {
  const mq = window.matchMedia(REDUCED_MOTION);
  const handler = () => {
    store.invalidate();
    onChange();
  };
  mq.addEventListener("change", handler);
  return () => mq.removeEventListener("change", handler);
}

const getServerSnapshot = (): Tier | null => null;

/** `null` on the server and before mount, then the detected tier. Re-detects when reduced-motion changes. */
export function useTier(): Tier | null {
  return useSyncExternalStore<Tier | null>(subscribe, store.getSnapshot, getServerSnapshot);
}
