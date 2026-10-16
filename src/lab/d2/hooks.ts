"use client";

import { useSyncExternalStore } from "react";

/** SSR-safe matchMedia hook; false on the server. */
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

export const FINE_POINTER = "(hover: hover) and (pointer: fine)";
export function useFinePointer(): boolean {
  return useMedia(FINE_POINTER);
}
