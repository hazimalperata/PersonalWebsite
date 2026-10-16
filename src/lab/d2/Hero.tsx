"use client";

import { useRef } from "react";
import { labFacts } from "@/lab/facts";
import { useMotionEnabled } from "@/lab/useMotionEnabled";
import { FitText } from "./FitText";
import { gsap, SplitText, useGSAP } from "./gsap";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const h1 = useRef<HTMLHeadingElement>(null);
  const meta = useRef<HTMLDivElement>(null);
  const motion = useMotionEnabled();

  useGSAP(
    () => {
      const title = h1.current;
      if (!motion || !title) return;
      let split: SplitText | null = null;
      let alive = true;
      const axes = { wdth: 100, wght: 800 };
      const apply = () => {
        title.style.fontVariationSettings = `"wdth" ${axes.wdth.toFixed(1)}, "wght" ${Math.round(axes.wght)}`;
      };

      // Scroll-linked variable axes: wide and heavy -> condensed and light as the hero leaves.
      gsap.to(axes, {
        wdth: 75,
        wght: 300,
        ease: "none",
        onUpdate: apply,
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.4 },
      });

      document.fonts.ready.then(() => {
        if (!alive) return;
        split = SplitText.create(title.querySelectorAll(".fit-line"), { type: "lines,chars", mask: "lines" });
        window.dispatchEvent(new Event("d2-refit"));
        gsap.set(split.chars, { yPercent: 115 });
        gsap.set(title, { visibility: "visible" });
        gsap.set(meta.current!.children, { opacity: 0, y: 18 });
        const tl = gsap.timeline({ delay: 0.1 });
        tl.to(split.chars, { yPercent: 0, duration: 1, stagger: 0.06, ease: "power4.out" });
        tl.to(meta.current!.children, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: "power3.out" }, 0.7);
      });

      return () => {
        alive = false;
        split?.revert();
        title.style.fontVariationSettings = "";
        gsap.set(meta.current!.children, { clearProps: "all" });
      };
    },
    { scope: root, dependencies: [motion], revertOnUpdate: true },
  );

  return (
    <section ref={root} id="top" className="relative flex flex-col justify-between gap-12 pt-20 pb-6 md:min-h-svh">
      <div className="px-[var(--gut)] pt-4 sm:pt-8">
        <h1
          ref={h1}
          data-skew
          className="disp prehide"
          style={{ fontVariationSettings: '"wdth" 100, "wght" 800', lineHeight: 0.92 }}
        >
          <FitText fallbackVw={29}>Hazim</FitText>
          <FitText fallbackVw={16}>Alper Ata</FitText>
        </h1>
      </div>

      <div ref={meta} className="px-[var(--gut)]">
        <div className="rule mt-8" />
        <div className="grid12 gap-y-4 pt-5">
          <p className="disp col-span-12 text-[clamp(26px,3.2vw,48px)] md:col-span-5">{labFacts.role}</p>
          <p className="col-span-12 max-w-[34ch] font-medium md:col-span-5 md:col-start-7">
            Built to the highest standard. Serious. Real. Done the modern way.
          </p>
          <p className="label col-span-12 md:col-span-2 md:col-start-11 md:text-right">
            {labFacts.location}
            <br />
            <span aria-hidden className="mt-2 inline-block">
              Scroll ↓
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
