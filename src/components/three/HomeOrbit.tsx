"use client";

import { useGSAP } from "@gsap/react";
import { useCallback, useRef, useState, type ReactNode } from "react";
import { Preloader } from "@/components/layout/Preloader";
import { useTier } from "@/lib/useTier";
import { prefersReducedMotion, registerGsap, ScrollTrigger } from "@/lib/motion";
import EarthCanvas from "./EarthCanvas";
import { setScrollProgress } from "./scrollState";

/**
 * The home route's orbit: owns the fixed earth canvas and turns the scroll position through the
 * wrapped sections (hero + selected work) into the camera progress, 0 at the top, 1 at their end.
 * Reduced motion: progress stays 0 and the canvas is a still poster.
 */
export default function HomeOrbit({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const tier = useTier();
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      registerGsap();

      const trigger = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (st) => setScrollProgress(st.progress),
      });

      // Fonts and images change the page height after mount; measure again once they settled.
      const refresh = () => ScrollTrigger.refresh();
      if (document.readyState === "complete") refresh();
      else window.addEventListener("load", refresh, { once: true });

      return () => {
        window.removeEventListener("load", refresh);
        trigger.kill();
        setScrollProgress(0);
      };
    },
    { scope: ref },
  );

  return (
    <>
      <EarthCanvas onReady={onReady} />
      <Preloader ready={ready} tier={tier} />
      <div ref={ref}>{children}</div>
    </>
  );
}
