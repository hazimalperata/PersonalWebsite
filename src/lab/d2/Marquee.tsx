"use client";

import { useEffect, useRef } from "react";
import { useMotionEnabled } from "@/lab/useMotionEnabled";
import { gsap } from "./gsap";
import { scroll } from "./scrollVelocity";

/** Full-width band of words. Speed and direction follow scroll velocity; static under reduced motion. */
export function Marquee({
  items,
  bg,
  fg,
  dir = 1,
}: {
  items: string[];
  bg: string;
  fg: string;
  dir?: 1 | -1;
}) {
  const track = useRef<HTMLDivElement>(null);
  const motion = useMotionEnabled();

  useEffect(() => {
    const el = track.current;
    if (!motion || !el) return;
    let x = 0;
    let half = el.scrollWidth / 2;
    const ro = new ResizeObserver(() => (half = el.scrollWidth / 2));
    ro.observe(el);
    const tick = (_t: number, dt: number) => {
      const speed = 70 + scroll.vs * 0.22; // px/s, reverses when scrolling up fast
      x -= (dir * speed * dt) / 1000;
      if (half > 0) x = ((x % half) - half) % half;
      el.style.transform = `translate3d(${x}px,0,0)`;
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      ro.disconnect();
      el.style.transform = "";
    };
  }, [motion, dir]);

  const seq = [...items, ...items];
  const half = seq.map((t, i) => (
    <span key={i} className="marq-item">
      {t}
      <span aria-hidden className="inline-block h-[0.28em] w-[0.28em]" style={{ background: "currentColor" }} />
    </span>
  ));

  return (
    <div aria-hidden className="overflow-hidden py-[1.6vw]" style={{ background: bg, color: fg }}>
      <div ref={track} className="marq-track disp text-[clamp(40px,7.5vw,120px)]">
        <div className="flex">{half}</div>
        <div className="flex">{half}</div>
      </div>
    </div>
  );
}
