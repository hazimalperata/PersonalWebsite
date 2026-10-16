"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

/**
 * One line of display type whose font-size is measured so the text fills its container width exactly.
 * Recomputed on resize and when fonts finish loading. `variation` is the axis state to measure at.
 */
export function FitText({
  children,
  fallbackVw,
  variation = '"wdth" 100, "wght" 800',
  className = "",
}: {
  children: ReactNode;
  fallbackVw: number;
  variation?: string;
  className?: string;
}) {
  const outer = useRef<HTMLSpanElement>(null);
  const inner = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = outer.current;
    const text = inner.current;
    if (!el || !text) return;
    let lastW = -1;
    const fit = () => {
      const W = el.clientWidth;
      if (W <= 0) return;
      lastW = W;
      el.style.fontSize = "1000px";
      el.style.fontVariationSettings = variation;
      const w = text.offsetWidth;
      el.style.fontVariationSettings = "";
      if (w > 0) el.style.fontSize = `${(1000 * W * 0.992) / w}px`;
    };
    fit();
    const ro = new ResizeObserver(() => {
      if (el.clientWidth !== lastW) fit();
    });
    ro.observe(el);
    let alive = true;
    document.fonts.ready.then(() => alive && fit());
    // Splitting into characters drops kerning, so the owner can ask for a re-measure afterwards.
    window.addEventListener("d2-refit", fit);
    return () => {
      alive = false;
      ro.disconnect();
      window.removeEventListener("d2-refit", fit);
    };
  }, [variation]);

  return (
    <span
      ref={outer}
      className={`fit-line block whitespace-nowrap ${className}`}
      style={{ fontSize: `${fallbackVw}vw` }}
    >
      <span ref={inner} className="inline-block">
        {children}
      </span>
    </span>
  );
}
