"use client";

import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import { lanes } from "@/lib/signal/data";
import { buildPoints } from "./points";
import { elementBox, SIGNAL_ATTR, signalSelector } from "./dom";
import { SignalOverlay, useBox } from "./SignalOverlay";
import css from "./signal.module.css";
import { buildCalmState, buildProjectState, getLayout, timelineState, toScreen } from "./states";
import { signalStore } from "./store";

/** Set on <html> while the still timeline is shown (reduced motion, no WebGL, lost context). */
export const STATIC_MODE_ATTR = "data-signal-static-mode";

/**
 * The honest fallback (reduced motion, no WebGL, lost context): the same data drawn once into a 2D canvas, no
 * animation. Home shows the whole timeline, a case page shows its own lane, other scenes a faint still.
 */
export function StaticTimeline() {
  const [ref, box] = useBox<HTMLDivElement>();
  const canvas = useRef<HTMLCanvasElement>(null);
  const snap = useSyncExternalStore(signalStore.subscribe, signalStore.get, signalStore.get);
  const pts = useMemo(() => buildPoints(1), []);
  const mobile = !!box && box.w < 720;

  // The page collapses its scroll runways while the still timeline is what the visitor gets.
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute(STATIC_MODE_ATTR, "");
    return () => root.removeAttribute(STATIC_MODE_ATTR);
  }, []);

  useEffect(() => {
    const c = canvas.current;
    if (!c || !box) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = box.w * dpr;
    c.height = box.h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, box.w, box.h);
    const L = getLayout(box.w, box.h, mobile);
    const scene = snap.scene;
    let positions: Float32Array;
    let focus = -1;
    let alpha = 0.9;
    let size = 1.4;
    let axis = null;
    if (scene.kind === "home") {
      positions = timelineState(pts, L);
    } else if (scene.kind === "project" && scene.lane) {
      const s = buildProjectState(pts, L, scene.lane, elementBox(signalSelector("header")) ?? { x: 0, y: 0, w: box.w, h: box.h * 0.4 });
      positions = s.positions;
      focus = s.meta.focus;
      size = 1.4 * s.pointScale;
      axis = s.axis;
    } else {
      positions = buildCalmState(pts, L).positions;
      alpha = 0.25;
    }
    signalStore.setAxis(axis);
    pts.forEach((p, i) => {
      if (focus >= 0 && p.lane !== focus) return;
      const [x, y] = toScreen(L, positions[i * 3], positions[i * 3 + 1]);
      ctx.fillStyle = lanes[p.lane].color;
      ctx.globalAlpha = alpha;
      ctx.fillRect(x - size / 2, y - size / 2, size, size);
    });
  }, [box, mobile, pts, snap.scene]);

  return (
    <>
      <div ref={ref} className={css.static} {...{ [SIGNAL_ATTR.static]: "" }}>
        <canvas ref={canvas} aria-hidden="true" />
      </div>
      <SignalOverlay coarse={false} fixed />
    </>
  );
}
