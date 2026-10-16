"use client";

import { useSignalScene } from "@/components/signal";
import type { LaneId } from "@/lib/signal/data";

/** Tells the field to show the home scene. `proof` are the strings drawn as points, `work` the lane of each selected project. */
export function HomeScene({ proof, work }: { proof: string[]; work: Array<LaneId | null> }) {
  useSignalScene({ kind: "home", proof, work: work.map((lane) => ({ lane })) });
  return null;
}
