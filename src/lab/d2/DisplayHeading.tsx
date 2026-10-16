"use client";

import { useRef, type ReactNode } from "react";
import { useMotionEnabled } from "@/lab/useMotionEnabled";
import { gsap, SplitText, useGSAP } from "./gsap";

/** A section headline: characters rise through line masks when it enters; skews with scroll velocity. */
export function DisplayHeading({
  children,
  className = "",
  id,
  as: Tag = "h2",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: "h2" | "h3";
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const motion = useMotionEnabled();

  useGSAP(
    () => {
      const el = ref.current;
      if (!motion || !el) return;
      let split: SplitText | null = null;
      let alive = true;
      document.fonts.ready.then(() => {
        if (!alive) return;
        split = SplitText.create(el, { type: "lines,chars", mask: "lines" });
        gsap.from(split.chars, {
          yPercent: 115,
          duration: 1,
          stagger: 0.03,
          ease: "power4.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });
      return () => {
        alive = false;
        split?.revert();
      };
    },
    { scope: ref, dependencies: [motion], revertOnUpdate: true },
  );

  return (
    <Tag ref={ref} id={id} data-skew className={`disp ${className}`}>
      {children}
    </Tag>
  );
}

export function SectionBar({ n, title, right }: { n: string; title: string; right?: ReactNode }) {
  return (
    <div className="px-[var(--gut)]">
      <div className="rule" />
      <div className="label flex items-center justify-between py-3">
        <span>
          ({n}) {title}
        </span>
        {right ? <span>{right}</span> : null}
      </div>
    </div>
  );
}

export function ExtLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <span className="sr"> (opens in a new tab)</span>
    </a>
  );
}
