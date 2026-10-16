"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { useMotionEnabled } from "@/components/signal";
import css from "./home.module.css";

/**
 * Fades and lifts its children in the first time they scroll into view. The server HTML is fully visible: the
 * hidden state is applied by the client only when motion is allowed and the block starts below the fold, so
 * nothing depends on JS to be readable.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  /** ms */
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const motion = useMotionEnabled();

  useEffect(() => {
    const el = ref.current;
    if (!el || !motion || typeof IntersectionObserver === "undefined") return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;
    el.dataset.reveal = "hidden";
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        el.dataset.reveal = "shown";
        io.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      delete el.dataset.reveal;
    };
  }, [motion]);

  return (
    <div
      ref={ref}
      className={`${css.reveal}${className ? ` ${className}` : ""}`}
      style={{ "--d": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
