"use client";

import { useSignalScene } from "@/components/signal";

/** Picks the calm gallery scene for the field behind the page. Renders nothing. */
export function GalleryScene() {
  useSignalScene({ kind: "gallery" });
  return null;
}
