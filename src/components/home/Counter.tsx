"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useMotionEnabled } from "@/components/signal";
import { formatProof } from "@/lib/proof";
import css from "./home.module.css";

const DELAY_MS = 500;
const DURATION_MS = 2200;

const noop = () => () => {};

/** The commit total. It counts up once, eased, and lands exactly on the real value (no overshoot). */
export function Counter({ value, locale, label }: { value: number; locale: "en" | "tr"; label: string }) {
  const motion = useMotionEnabled();
  // false while rendering on the server and during hydration, true afterwards. With motion wanted the digits stay
  // hidden until then, so the final number is never painted and then reset to 0 (the sr-only total is always there).
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  const [ramp, setRamp] = useState<number | null>(null);

  useEffect(() => {
    if (!motion) return;
    const start = performance.now() + DELAY_MS;
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / DURATION_MS));
      setRamp(t >= 1 ? value : Math.round(value * (1 - (1 - t) ** 3)));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [motion, value]);

  const shown = motion ? (ramp ?? 0) : value;
  return (
    <>
      <span className={`${css.counterN}${hydrated ? "" : ` ${css.counterPending}`}`} aria-hidden="true">
        {formatProof(shown, locale)}
      </span>
      <span className="sr-only">{label}</span>
    </>
  );
}
