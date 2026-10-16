"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useMotionEnabled } from "@/components/signal";
import { gsap } from "@/lib/motion";
import { formatProof } from "@/lib/proof";
import css from "./home.module.css";

const DELAY_MS = 500;
const DURATION_MS = 2200;

const noop = () => () => {};

/** The commit total. It counts up once, eased, and lands exactly on the real value (no overshoot). */
export function Counter({ value, locale }: { value: number; locale: "en" | "tr" }) {
  const motion = useMotionEnabled();
  // false while rendering on the server and during hydration, true afterwards. With motion wanted the digits stay
  // hidden until then, so the final number is never painted and then reset to 0 (the sr-only number is always there; the caption beside it says what it counts).
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  const [ramp, setRamp] = useState<number | null>(null);

  useEffect(() => {
    if (!motion) return;
    const start = performance.now() + DELAY_MS;
    // the page's one GSAP ticker drives the one-shot ramp; it removes itself when done
    const step = () => {
      const t = Math.min(1, Math.max(0, (performance.now() - start) / DURATION_MS));
      setRamp(t >= 1 ? value : Math.round(value * (1 - (1 - t) ** 3)));
      if (t >= 1) gsap.ticker.remove(step);
    };
    gsap.ticker.add(step);
    return () => gsap.ticker.remove(step);
  }, [motion, value]);

  const shown = motion ? (ramp ?? 0) : value;
  return (
    <>
      <span className={`${css.counterN}${hydrated ? "" : ` ${css.counterPending}`}`} aria-hidden="true">
        {formatProof(shown, locale)}
      </span>
      <span className="sr-only">{formatProof(value, locale)}</span>
    </>
  );
}
