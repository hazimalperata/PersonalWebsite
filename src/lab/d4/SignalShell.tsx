"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import dynamic from "next/dynamic";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useMotionEnabled } from "@/lab/useMotionEnabled";
import { TimelineLabels, useBox } from "./Timeline";

gsap.registerPlugin(ScrollTrigger);

const SignalField = dynamic(() => import("./SignalField").then((m) => m.SignalField), { ssr: false });

interface Env {
  coarse: boolean;
}
const EnvCtx = createContext<Env>({ coarse: false });
export const useEnv = () => useContext(EnvCtx);

function Overlay({ coarse }: { coarse: boolean }) {
  const [ref, box] = useBox<HTMLDivElement>();
  return (
    <div ref={ref} className="d4-overlay" aria-hidden="true">
      {box && <TimelineLabels w={box.w} h={box.h} mobile={coarse} />}
    </div>
  );
}

export function SignalShell({ children }: { children: ReactNode }) {
  const motion = useMotionEnabled();
  const [coarse, setCoarse] = useState<boolean | null>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const read = () => setCoarse(mq.matches || window.innerWidth < 720);
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);

  // one smooth-scroll instance, driven by the single gsap ticker
  useEffect(() => {
    if (!motion) return;
    const lenis = new Lenis({ anchors: true, lerp: 0.11, autoRaf: false });
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    lenis.on("scroll", () => {
      ScrollTrigger.update();
      if (bar.current) bar.current.style.transform = `scaleX(${lenis.progress})`;
    });
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
      lenis.destroy();
    };
  }, [motion]);

  return (
    <EnvCtx.Provider value={{ coarse: !!coarse }}>
      {motion && coarse !== null && (
        <>
          <SignalField coarse={coarse} />
          <Overlay coarse={coarse} />
          <div ref={bar} className="progress" aria-hidden="true" />
        </>
      )}
      {children}
    </EnvCtx.Provider>
  );
}
