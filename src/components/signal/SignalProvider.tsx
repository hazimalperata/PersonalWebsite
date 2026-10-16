"use client";

import "lenis/dist/lenis.css";
import Lenis from "lenis";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/motion";
import { plexMono, sora } from "./fonts";
import { canonicalState, type HomeState } from "./states";
import { setLenis } from "./lenis";
import { SignalCanvas } from "./SignalCanvas";
import { StaticTimeline } from "./StaticTimeline";
import { signalStore } from "./store";
import { useMotionEnabled } from "./useMotionEnabled";

export type { HomeState } from "./states";
export type { SignalScene } from "./scenes";

export interface SignalContextValue {
  /** The pipeline node that glows (0-3), or `null` to light all of them. For the AI section. */
  setPipelineProgress: (p: number | null) => void;
  /** Few points, no cursor repel (coarse pointer or a small screen). */
  coarse: boolean;
  /** False under reduced motion: no canvas, no smooth scroll. */
  motion: boolean;
}

const SignalContext = createContext<SignalContextValue>({ setPipelineProgress: () => {}, coarse: false, motion: false });

export const useSignal = () => useContext(SignalContext);

/** Marks a home section as a scroll anchor: while it is on screen the field shows `state`. */
export function SignalSection({ id, state, children }: { id: string; state: HomeState; children: ReactNode }) {
  return (
    <section id={id} data-signal={canonicalState(state)}>
      {children}
    </section>
  );
}

/** Resolves after first paint, so the server-rendered headline stays the LCP element. */
function useAfterIdle(enabled: boolean): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    let id: number | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (typeof requestIdleCallback === "function") id = requestIdleCallback(() => setReady(true), { timeout: 1200 });
    else timer = setTimeout(() => setReady(true), 200);
    return () => {
      if (id !== undefined) cancelIdleCallback(id);
      if (timer !== undefined) clearTimeout(timer);
    };
  }, [enabled]);
  return ready && enabled;
}

/**
 * Owns the one fixed field behind the page, the single GSAP ticker (Lenis + ScrollTrigger + render, the latter in
 * the engine) and the motion gate. Mounted once in the locale layout, it survives route changes; pages choose what
 * it shows with `useSignalScene`.
 */
export function SignalProvider({ children }: { children: ReactNode }) {
  const motion = useMotionEnabled();
  const [env, setEnv] = useState<{ coarse: boolean; touch: boolean } | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const read = () => {
      const next = { touch: mq.matches, coarse: mq.matches || window.innerWidth < 720 };
      // phone URL-bar resizes fire constantly; do not re-render the canvas subtree when nothing changed
      setEnv((prev) => (prev && prev.touch === next.touch && prev.coarse === next.coarse ? prev : next));
    };
    read();
    window.addEventListener("resize", read);
    mq.addEventListener("change", read);
    return () => {
      window.removeEventListener("resize", read);
      mq.removeEventListener("change", read);
    };
  }, []);

  const touch = env?.touch ?? true;
  useEffect(() => {
    if (!motion || touch) return;
    registerGsap();
    const lenis = new Lenis({ anchors: true, lerp: 0.11, autoRaf: false });
    setLenis(lenis);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    lenis.on("scroll", ScrollTrigger.update);
    let timer = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    });
    ro.observe(document.body);
    return () => {
      window.clearTimeout(timer);
      ro.disconnect();
      gsap.ticker.remove(tick);
      setLenis(null);
      lenis.destroy();
    };
  }, [motion, touch]);

  // touch devices scroll natively but still need refreshes when the page height changes
  useEffect(() => {
    if (!motion || !touch) return;
    let timer = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    });
    ro.observe(document.body);
    return () => {
      window.clearTimeout(timer);
      ro.disconnect();
    };
  }, [motion, touch]);

  const canvasReady = useAfterIdle(motion && env !== null);
  const value = useMemo<SignalContextValue>(
    () => ({ setPipelineProgress: signalStore.setPipelineProgress, coarse: env?.coarse ?? false, motion }),
    [env?.coarse, motion],
  );

  return (
    <SignalContext.Provider value={value}>
      <div data-signal-fonts className={`${sora.variable} ${plexMono.variable}`} style={{ display: "contents" }}>
        {children}
        {/* after the page in DOM order (skip link first); both are fixed, so nothing moves on screen */}
        {env !== null && !motion && <StaticTimeline />}
        {env !== null && canvasReady && <SignalCanvas coarse={env.coarse} />}
      </div>
    </SignalContext.Provider>
  );
}
