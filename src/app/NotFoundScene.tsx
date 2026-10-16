"use client";

import { useSignalScene } from "@/components/signal";

/** Picks the 404 scene: the points scatter, then settle around the link marked `data-signal-target`. */
export function NotFoundScene() {
  useSignalScene({ kind: "notFound" });
  return null;
}
