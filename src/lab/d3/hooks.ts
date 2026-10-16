"use client";

import { useSyncExternalStore } from "react";

/** Media query as an external store. The server snapshot is `false`. */
export function useMedia(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export const useCoarsePointer = () => useMedia("(pointer: coarse)");
export const useNarrow = () => useMedia("(max-width: 767px)");
