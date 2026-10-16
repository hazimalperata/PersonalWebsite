"use client";

import "lenis/dist/lenis.css";
import { ReactLenis, useLenis } from "lenis/react";
import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/motion";

const COARSE = "(pointer: coarse)";
const REDUCED = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void): () => void {
  const queries = [window.matchMedia(COARSE), window.matchMedia(REDUCED)];
  queries.forEach((mq) => mq.addEventListener("change", onChange));
  return () => queries.forEach((mq) => mq.removeEventListener("change", onChange));
}

const getSnapshot = () => !window.matchMedia(COARSE).matches && !window.matchMedia(REDUCED).matches;
const getServerSnapshot = () => false;

/** Drives the Lenis instance from the GSAP ticker so ScrollTrigger and smooth scroll share one clock. */
function LenisDriver() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    registerGsap();
    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(tick);
    };
  }, [lenis]);

  return null;
}

/**
 * Smooth scroll on fine pointers without reduced motion. Decided after mount (server snapshot is false),
 * and rendered as a sibling of the children so toggling it never remounts the page.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const enabled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return (
    <>
      {enabled && (
        <>
          <ReactLenis root options={{ autoRaf: false, anchors: true }} />
          <LenisDriver />
        </>
      )}
      {children}
    </>
  );
}
