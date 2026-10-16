"use client";

import { useGSAP } from "@gsap/react";
import { useRef, type ElementType } from "react";
import { gsap, prefersReducedMotion, registerGsap, SplitText } from "@/lib/motion";
import { currentFcp, shouldReveal } from "@/lib/reveal";

type Props = {
  as?: "h1" | "h2" | "p";
  className?: string;
  children: string;
  /** Seconds before the reveal starts. */
  delay?: number;
};

/**
 * Server-rendered text that is visible from the first paint (so it can be the LCP element).
 * After fonts load, the lines are split and masked, then slide up one by one.
 * Reduced motion: left alone, the text stays as rendered.
 * Callers must pass `key={text}` so a text change remounts instead of reverting a live split.
 */
export function SplitHeading({ as = "h1", className, children, delay = 0 }: Props) {
  const Tag: ElementType = as;
  const ref = useRef<HTMLHeadingElement & HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      registerGsap();

      let split: SplitText | undefined;
      let cancelled = false;

      document.fonts.ready.then(() => {
        if (cancelled) return;
        // Late split (slow device): the text already painted, leave it in place.
        if (!shouldReveal(currentFcp(), performance.now())) return;
        split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          linesClass: "split-line",
          aria: "none",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, { yPercent: 110, duration: 0.9, stagger: 0.08, ease: "power3.out", delay }),
        });
      });

      return () => {
        cancelled = true;
        split?.revert();
      };
    },
    { dependencies: [delay] },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
