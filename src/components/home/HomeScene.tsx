"use client";

import { useEffect } from "react";
import { useSignalScene } from "@/components/signal";
import type { LaneId } from "@/lib/signal/data";

const FLAG = "data-home-timeline";

/**
 * Tells the field to show the home scene. `proof` are the strings drawn as points, `work` the lane of each selected
 * project. It also flags the document while the timeline section is mid-screen, so the still fallback timeline can
 * stay out of the way of the text elsewhere (see `home.module.css`).
 */
export function HomeScene({ proof, work }: { proof: string[]; work: Array<LaneId | null> }) {
  useSignalScene({ kind: "home", proof, work: work.map((lane) => ({ lane })) });

  useEffect(() => {
    const el = document.getElementById("timeline");
    if (!el || typeof IntersectionObserver === "undefined") return;
    const root = document.documentElement;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) root.setAttribute(FLAG, "");
        else root.removeAttribute(FLAG);
      },
      { rootMargin: "-35% 0px -35% 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      root.removeAttribute(FLAG);
    };
  }, []);

  return null;
}
