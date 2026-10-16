"use client";

import { useEffect } from "react";
import { useSignalScene } from "@/components/signal";
import type { LaneId } from "@/lib/signal/data";

const HOME = "data-home";
const TIMELINE = "data-home-timeline";
const FOOTER_VAR = "--footer-h";

/**
 * Tells the field to show the home scene. `proof` are the strings drawn as points, `work` the lane of each selected
 * project. While mounted it flags the document (`data-home`), and flags it again while the timeline section is
 * mid-screen, so the still fallback timeline stays out of the way of the text elsewhere on the home page only
 * (see `home.module.css`). It also publishes the measured footer height, which the contact section uses to sit in
 * the middle of the ring.
 */
export function HomeScene({ proof, work }: { proof: string[]; work: Array<LaneId | null> }) {
  useSignalScene({ kind: "home", proof, work: work.map((lane) => ({ lane })) });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute(HOME, "");
    const footer = document.querySelector("footer");
    let ro: ResizeObserver | undefined;
    if (footer && typeof ResizeObserver !== "undefined") {
      const set = () => root.style.setProperty(FOOTER_VAR, `${footer.getBoundingClientRect().height}px`);
      set();
      ro = new ResizeObserver(set);
      ro.observe(footer);
    }
    return () => {
      ro?.disconnect();
      root.removeAttribute(HOME);
      root.style.removeProperty(FOOTER_VAR);
    };
  }, []);

  useEffect(() => {
    const el = document.getElementById("timeline");
    if (!el || typeof IntersectionObserver === "undefined") return;
    const root = document.documentElement;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) root.setAttribute(TIMELINE, "");
        else root.removeAttribute(TIMELINE);
      },
      { rootMargin: "-35% 0px -35% 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      root.removeAttribute(TIMELINE);
    };
  }, []);

  return null;
}
