"use client";

import { useRef } from "react";
import { labFacts } from "@/lab/facts";
import { useMotionEnabled } from "@/lab/useMotionEnabled";
import { gsap, useGSAP } from "./gsap";

const PANELS = [
  { bg: "#0B0B0B", fg: "#F2EFE8" },
  { bg: "#E2261C", fg: "#F2EFE8" },
  { bg: "#F2EFE8", fg: "#0B0B0B" },
  { bg: "#E4FF3A", fg: "#0B0B0B" },
];
const FROM = ["", "inset(100% 0% 0% 0%)", "inset(0% 0% 0% 100%)", "inset(100% 0% 0% 0%)"];

const fmt = (v: number, suffix: string) => `${Math.round(v).toLocaleString("en-US")}${suffix}`;

export function ProofPanels() {
  const root = useRef<HTMLElement>(null);
  const motion = useMotionEnabled();

  useGSAP(
    () => {
      const sec = root.current;
      if (!motion || !sec) return;
      const panels = gsap.utils.toArray<HTMLElement>(".proof-panel", sec);
      const nums = panels.map((p) => p.querySelector<HTMLElement>(".proof-num")!);
      const setNum = (i: number, v: number) => {
        const node = nums[i].firstChild;
        if (node) node.nodeValue = fmt(v, labFacts.proof[i].suffix);
      };
      const mm = gsap.matchMedia();
      mm.add({ short: "(max-width: 767px), (pointer: coarse)", long: "(min-width: 768px) and (pointer: fine)" }, (ctx) => {
        const short = !!ctx.conditions?.short;
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: sec, start: "top top", end: short ? "+=230%" : "+=330%", pin: true, scrub: 0.6, anticipatePin: 1 },
        });
        panels.forEach((p, i) => {
          const target = labFacts.proof[i].value;
          const counter = { v: 0 };
          setNum(i, 0);
          if (i === 0) {
            // First panel is already there: its number counts when the section arrives.
            gsap.to(counter, {
              v: target,
              duration: 1.6,
              ease: "power3.out",
              onUpdate: () => setNum(0, counter.v),
              scrollTrigger: { trigger: sec, start: "top 70%", once: true },
            });
            return;
          }
          tl.fromTo(p, { clipPath: FROM[i] }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1 }, i - 1);
          tl.to(counter, { v: target, duration: 1, ease: "power2.out", onUpdate: () => setNum(i, counter.v) }, i - 1);
        });
        tl.to({}, { duration: 0.4 });
      });
      return () => {
        mm.revert();
        nums.forEach((_, i) => setNum(i, labFacts.proof[i].value));
        panels.forEach((p) => gsap.set(p, { clearProps: "clipPath" }));
      };
    },
    { scope: root, dependencies: [motion], revertOnUpdate: true },
  );

  return (
    <section
      ref={root}
      id="proof"
      aria-label="Proof"
      className={`relative ${motion ? "h-svh overflow-hidden" : ""}`}
    >
      {labFacts.proof.map((f, i) => {
        const text = fmt(f.value, f.suffix);
        const len = text.length;
        return (
          <div
            key={f.label}
            className={`proof-panel flex flex-col justify-between px-[var(--gut)] pt-20 pb-8 ${motion ? "absolute inset-0" : "relative min-h-[80svh]"} ${i === 3 ? "acid-ring" : ""}`}
            style={{ background: PANELS[i].bg, color: PANELS[i].fg, zIndex: i }}
          >
            <div className="label flex justify-between">
              <span>(02) Proof</span>
              <span>
                {String(i + 1).padStart(2, "0")} / {String(labFacts.proof.length).padStart(2, "0")}
              </span>
            </div>
            <p
              className="disp proof-num"
              data-skew
              suppressHydrationWarning
              style={{
                fontSize: `min(${(175 / len).toFixed(1)}vw, 52svh)`,
                fontVariationSettings: '"wdth" 75, "wght" 800',
                lineHeight: 0.85,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {text}
            </p>
            <p className="max-w-[18ch] text-[clamp(22px,2.6vw,40px)] font-semibold leading-[1.1] tracking-tight">{f.label}</p>
          </div>
        );
      })}
    </section>
  );
}
