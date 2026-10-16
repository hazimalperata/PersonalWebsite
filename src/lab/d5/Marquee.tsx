"use client";

/** Two-row marquee that speeds up with scroll velocity and flips direction on scroll up.
 *  Concept: Magic UI "Marquee" (https://magicui.design, MIT) + the velocity idea from Motion/GSAP demos; own implementation
 *  driven by the single gsap ticker. */

import { useEffect, useRef } from "react";
import { useMotionEnabled } from "@/lab/useMotionEnabled";
import { gsap } from "./gsap";

function ChipSet({ items, hidden }: { items: string[]; hidden?: boolean }) {
  return (
    <ul className="mq-set" aria-hidden={hidden || undefined}>
      {items.map((t) => (
        <li key={t} className="chip">
          {t}
        </li>
      ))}
    </ul>
  );
}

export function TechMarquee({ rows }: { rows: [string[], string[]] }) {
  const motion = useMotionEnabled();
  const root = useRef<HTMLDivElement>(null);
  const t0 = useRef<HTMLDivElement>(null);
  const t1 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!motion) return;
    const tracks = [t0.current, t1.current];
    const wrap = root.current;
    if (!wrap || !tracks[0] || !tracks[1]) return;
    const widths = [0, 0];
    const x = [0, 0];
    const measure = () => {
      tracks.forEach((t, i) => {
        widths[i] = (t as HTMLElement).scrollWidth / 2;
      });
      x[1] = -widths[1];
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(wrap);
    let lastY = window.scrollY;
    let boost = 0;
    const dirs = [-1, 1];
    let flip = 1;
    const tick = () => {
      const y = window.scrollY;
      const v = y - lastY;
      lastY = y;
      boost += (Math.min(Math.abs(v), 90) - boost) * 0.08;
      if (Math.abs(v) > 2) flip = v > 0 ? 1 : -1;
      if (!visible) return;
      const dt = gsap.ticker.deltaRatio(60);
      for (let i = 0; i < 2; i++) {
        const w = widths[i];
        if (!w) continue;
        x[i] += dirs[i] * flip * (0.55 + boost * 0.16) * dt;
        while (x[i] > 0) x[i] -= w;
        while (x[i] <= -w) x[i] += w;
        (tracks[i] as HTMLElement).style.transform = `translate3d(${x[i]}px,0,0)`;
      }
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      ro.disconnect();
      io.disconnect();
      tracks.forEach((t) => ((t as HTMLElement).style.transform = ""));
    };
  }, [motion]);

  return (
    <div className={`mq${motion ? "" : " static"}`} ref={root}>
      {rows.map((items, i) => (
        <div key={i} className="mq-track" ref={i === 0 ? t0 : t1}>
          <ChipSet items={items} />
          {motion && <ChipSet items={items} hidden />}
        </div>
      ))}
    </div>
  );
}
