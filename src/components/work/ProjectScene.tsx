"use client";

import { useSignalScene } from "@/components/signal/useSignalScene";
import type { LaneId } from "@/lib/signal/data";

/** Picks the project scene for the page: the lane forms a timeline in the header box. Renders nothing. */
export function ProjectScene({ lane }: { lane: LaneId | null }) {
  useSignalScene({ kind: "project", lane });
  return null;
}
