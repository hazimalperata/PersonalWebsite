"use client";

import { gsap, ScrollTrigger } from "./gsap";

/** Shared scroll velocity (px/s). `v` is raw from ScrollTrigger, `vs` is smoothed for marquees and skew. */
export const scroll = { v: 0, vs: 0 };

/** One ScrollTrigger reads the velocity; one ticker callback decays and smooths it. Returns a cleanup. */
export function startScrollVelocity(): () => void {
  let last = 0;
  const st = ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: (self) => {
      scroll.v = self.getVelocity();
      last = performance.now();
    },
  });
  const tick = () => {
    if (performance.now() - last > 90) scroll.v = 0;
    scroll.vs += (scroll.v - scroll.vs) * 0.14;
    if (Math.abs(scroll.vs) < 0.5) scroll.vs = 0;
  };
  gsap.ticker.add(tick);
  return () => {
    gsap.ticker.remove(tick);
    st.kill();
    scroll.v = 0;
    scroll.vs = 0;
  };
}

/** Skews every [data-skew] element with the scroll velocity, clamped, smoothed with quickTo. */
export function startVelocitySkew(max: number): () => void {
  const els = gsap.utils.toArray<HTMLElement>("[data-skew]");
  els.forEach((el) => (el.style.willChange = "transform"));
  const setters = els.map((el) => gsap.quickTo(el, "skewY", { duration: 0.6, ease: "power3.out" }));
  let prev = 0;
  const tick = () => {
    const t = gsap.utils.clamp(-max, max, -scroll.vs / 260);
    if (Math.abs(t - prev) > 0.005) {
      for (const s of setters) s(t);
      prev = t;
    }
  };
  gsap.ticker.add(tick);
  return () => {
    gsap.ticker.remove(tick);
    els.forEach((el) => {
      el.style.willChange = "";
      gsap.set(el, { skewY: 0 });
    });
  };
}
