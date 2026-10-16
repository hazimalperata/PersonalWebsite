"use client";

import { useEffect, useState } from "react";
import { useMotionEnabled } from "@/components/signal";
import { formatProof } from "@/lib/proof";
import css from "./home.module.css";

const DELAY_MS = 500;
const DURATION_MS = 2200;

/** The commit total. It counts up once, eased, and lands exactly on the real value (no overshoot). */
export function Counter({ value, locale, label }: { value: number; locale: "en" | "tr"; label: string }) {
  const motion = useMotionEnabled();
  const [shown, setShown] = useState(value);

  useEffect(() => {
    if (!motion) return;
    const start = performance.now() + DELAY_MS;
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / DURATION_MS));
      setShown(t >= 1 ? value : Math.round(value * (1 - (1 - t) ** 3)));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      setShown(value);
    };
  }, [motion, value]);

  return (
    <>
      <span className={css.counterN} aria-hidden="true">
        {formatProof(shown, locale)}
      </span>
      <span className="sr-only">{label}</span>
    </>
  );
}
