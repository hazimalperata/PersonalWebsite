"use client";

import { useEffect, useRef, useState } from "react";
import { buildPoints, firstDay, firstYear, lastYear, projects } from "./data";
import { dayX, getLayout } from "./states";
import { buildStates } from "./states";

export function useBox<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => setBox({ w: el.clientWidth, h: el.clientHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, box] as const;
}

/** Lane labels (the legend) and year ticks, aligned to the same chart layout the particles use. */
export function TimelineLabels({ w, h, mobile }: { w: number; h: number; mobile: boolean }) {
  const L = getLayout(w, h, mobile);
  const { chart } = L;
  const years: number[] = [];
  for (let y = firstYear + 1; y <= lastYear; y++) years.push(y);
  return (
    <>
      {years.map((y) => {
        const day = Math.round(Date.UTC(y, 0, 1) / 86400000) - firstDay;
        const x = day < 0 ? chart.x0 : dayX(L, day);
        return (
          <div key={y}>
            <div className="tl-tick" style={{ left: x, top: chart.top - 6, height: chart.bottom - chart.top + 10 }} />
            <div className="tl-year mono" style={{ left: Math.max(x, 14), top: chart.bottom + 8 }}>
              {y}
            </div>
          </div>
        );
      })}
      {projects.map((p, i) => {
        const base = chart.top + (i + 1) * chart.laneH - 3;
        return mobile ? (
          <div key={p.name} className="tl-label mono" style={{ left: chart.x0, top: chart.top + i * chart.laneH + 1, fontSize: 10 }}>
            <i style={{ background: p.color }} />
            {p.name}
          </div>
        ) : (
          <div key={p.name} className="tl-label left mono" style={{ left: chart.x0 - 16, top: base + 2 }}>
            {p.name}
            <i style={{ background: p.color }} />
          </div>
        );
      })}
    </>
  );
}

/** Reduced-motion version: the same chart drawn once into a 2D canvas. */
export function StaticTimeline() {
  const [ref, box] = useBox<HTMLDivElement>();
  const canvas = useRef<HTMLCanvasElement>(null);
  const mobile = !!box && box.w < 720;
  useEffect(() => {
    const c = canvas.current;
    if (!c || !box) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = box.w * dpr;
    c.height = box.h * dpr;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    const L = getLayout(box.w, box.h, mobile);
    const pts = buildPoints(1);
    const { states } = buildStates(pts, L, "sans-serif", ["", "", "", ""]);
    const tl = states[1];
    pts.forEach((p, i) => {
      ctx.fillStyle = projects[p.proj].color;
      ctx.globalAlpha = 0.9;
      ctx.fillRect(tl[i * 3] + box.w / 2 - 0.6, box.h / 2 - tl[i * 3 + 1] - 0.6, 1.4, 1.4);
    });
  }, [box, mobile]);
  return (
    <div ref={ref} className="tl-static" style={{ height: mobile ? 640 : 520 }}>
      <canvas ref={canvas} role="img" aria-label="Contribution chart: every commit as a point, by project and date" />
      {box && (
        <div style={{ position: "absolute", inset: 0 }}>
          <TimelineLabels w={box.w} h={box.h} mobile={mobile} />
        </div>
      )}
    </div>
  );
}
