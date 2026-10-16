"use client";

/**
 * Small interaction primitives for direction 5.
 * - MagicCard: spotlight that follows the cursor. Idea from Magic UI "Magic Card" (https://magicui.design, MIT);
 *   re-implemented here with CSS variables instead of a motion value.
 * - BorderBeam: conic-gradient ring travelling around the border. Idea from Magic UI "Border Beam" (MIT);
 *   own implementation using a registered @property angle (see d5.css).
 * - NumberTicker: idea from Magic UI "Number Ticker" (MIT); eased gsap tween, ends on the exact value.
 */

import { useEffect, useRef, useSyncExternalStore, type CSSProperties, type ElementType, type ReactNode } from "react";
import { useMotionEnabled } from "@/lab/useMotionEnabled";
import { gsap } from "./gsap";

export function BorderBeam({ always = false }: { always?: boolean }) {
  return <span className={`beam${always ? " always" : ""}`} aria-hidden="true" />;
}

export function MagicCard({
  children,
  className = "",
  as: Tag = "div",
  ...rest
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  href?: string;
  target?: string;
  rel?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  return (
    <Tag
      ref={ref}
      className={`card magic ${className}`}
      onPointerMove={(e: React.PointerEvent) => {
        const el = ref.current;
        if (!el || e.pointerType === "touch") return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      {...rest}
    >
      <span className="spot" aria-hidden="true" />
      <BorderBeam />
      {children}
    </Tag>
  );
}

/** Button wrapper that leans toward the cursor on fine pointers. Thin: the painted button is the child. */
export function Magnetic({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motion = useMotionEnabled();
  useEffect(() => {
    const el = ref.current;
    if (!el || !motion || !window.matchMedia("(pointer: fine)").matches) return;
    const target = el.firstElementChild as HTMLElement | null;
    if (!target) return;
    const qx = gsap.quickTo(target, "x", { duration: 0.5, ease: "power3.out" });
    const qy = gsap.quickTo(target, "y", { duration: 0.5, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      qx((e.clientX - (r.left + r.width / 2)) * 0.28);
      qy((e.clientY - (r.top + r.height / 2)) * 0.4);
    };
    const leave = () => {
      qx(0);
      qy(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      gsap.set(target, { clearProps: "x,y" });
    };
  }, [motion]);
  return (
    <span ref={ref} style={{ display: "inline-flex", padding: 14, margin: -14 }}>
      {children}
    </span>
  );
}

const fmt = (n: number) => n.toLocaleString("en-US");

export function NumberTicker({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motion = useMotionEnabled();
  useEffect(() => {
    const el = ref.current;
    if (!el || !motion) return;
    const obj = { v: 0 };
    let tween: gsap.core.Tween | undefined;
    el.textContent = "0";
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        tween = gsap.to(obj, {
          v: value,
          duration: 2.2,
          ease: "power3.out",
          onUpdate: () => {
            el.textContent = fmt(Math.round(obj.v));
          },
          onComplete: () => {
            el.textContent = fmt(value);
          },
        });
      },
      { threshold: 0.5, rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      tween?.kill();
      el.textContent = fmt(value);
    };
  }, [motion, value]);
  return (
    <span className="mono">
      <span ref={ref}>{fmt(value)}</span>
      {suffix}
    </span>
  );
}

/** Seconds since epoch, ticking once a second; null on the server so markup is stable. */
export function useNowSeconds(): number | null {
  return useSyncExternalStore(
    (cb) => {
      const id = window.setInterval(cb, 1000);
      return () => window.clearInterval(id);
    },
    () => Math.floor(Date.now() / 1000),
    () => null,
  );
}

const bursa = (opts: Intl.DateTimeFormatOptions, t: number) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Istanbul", hourCycle: "h23", ...opts }).format(t * 1000);

export function bursaTime(t: number | null, withSeconds = false) {
  if (t === null) return withSeconds ? "--:--:--" : "--:--";
  return bursa({ hour: "2-digit", minute: "2-digit", ...(withSeconds ? { second: "2-digit" } : {}) }, t);
}

export function ExternalHint() {
  return <span className="sr-only"> (opens in a new tab)</span>;
}

export const cssVars = (v: Record<string, string | number>) => v as CSSProperties;
