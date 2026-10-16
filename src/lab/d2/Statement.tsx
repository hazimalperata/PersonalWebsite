"use client";

import { useRef } from "react";
import { useMotionEnabled } from "@/lab/useMotionEnabled";
import { gsap, RED, ScrollTrigger, SplitText, useGSAP } from "./gsap";

/**
 * The owner's message as a big paragraph. Each word is dimmed to 15% and lights up as you scrub.
 * Pinned on fine pointers; on touch it is a normal paragraph whose words light as it crosses the screen.
 * The text is split into key and plain runs by hand so the message stays the verified sentence.
 */
const RUNS: Array<{ t: string; k?: boolean }> = [
  { t: "Whatever I take on, I build it to the " },
  { t: "highest standard", k: true },
  { t: ": serious, " },
  { t: "real", k: true },
  { t: ", and done the way " },
  { t: "modern", k: true },
  { t: " technology says it should be done." },
];

export function Statement() {
  const root = useRef<HTMLElement>(null);
  const p = useRef<HTMLParagraphElement>(null);
  const motion = useMotionEnabled();

  useGSAP(
    () => {
      const para = p.current;
      if (!motion || !para) return;
      let split: SplitText | null = null;
      let mm: gsap.MatchMedia | null = null;
      let alive = true;
      // The pin is created synchronously so later triggers (the proof panels) are measured after its spacer.
      const pinMM = gsap.matchMedia();
      pinMM.add("(hover: hover) and (pointer: fine)", () => {
        ScrollTrigger.create({ trigger: root.current, start: "top top", end: "+=170%", pin: true, anticipatePin: 1 });
      });
      document.fonts.ready.then(() => {
        if (!alive) return;
        split = SplitText.create(para, { type: "words" });
        const words = split.words as HTMLElement[];
        gsap.set(words, { opacity: 0.15 });
        gsap.set(words.filter((w) => w.closest("[data-k]")), { color: "#0B0B0B" });
        mm = gsap.matchMedia();
        mm.add({ pinned: "(hover: hover) and (pointer: fine)", loose: "(hover: none), (pointer: coarse)" }, (ctx) => {
          const pinned = !!ctx.conditions?.pinned;
          const tl = gsap.timeline({
            scrollTrigger: pinned
              ? { trigger: root.current, start: "top top", end: "+=170%", scrub: 0.5 }
              : { trigger: para, start: "top 85%", end: "bottom 55%", scrub: 0.4 },
          });
          words.forEach((w, i) => {
            const key = !!w.closest("[data-k]");
            tl.to(w, { opacity: 1, ...(key ? { color: RED } : {}), duration: 0.6, ease: "none" }, i * 0.18);
          });
          if (pinned) tl.to({}, { duration: 1.2 });
        });
      });
      return () => {
        alive = false;
        mm?.revert();
        pinMM.revert();
        split?.revert();
      };
    },
    { scope: root, dependencies: [motion], revertOnUpdate: true },
  );

  return (
    <section ref={root} id="message" className="relative flex min-h-svh items-center px-[var(--gut)] py-24">
      <div data-skew className="w-full">
        <p className="label mb-6">(01) The standard</p>
        <p
          ref={p}
          className="disp max-w-[22ch] normal-case text-[clamp(32px,6vw,100px)] md:max-w-none"
          style={{ fontVariationSettings: '"wdth" 88, "wght" 700', lineHeight: 1.02, textTransform: "none", letterSpacing: "-0.025em" }}
        >
          {RUNS.map((r, i) =>
            r.k ? (
              <span key={i} data-k style={{ color: "var(--red)" }}>
                {r.t}
              </span>
            ) : (
              <span key={i}>{r.t}</span>
            ),
          )}
        </p>
      </div>
    </section>
  );
}
