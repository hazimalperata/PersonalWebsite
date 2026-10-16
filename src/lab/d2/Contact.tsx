"use client";

import { useRef } from "react";
import { labFacts } from "@/lab/facts";
import { useMotionEnabled } from "@/lab/useMotionEnabled";
import { ExtLink } from "./DisplayHeading";
import { FitText } from "./FitText";
import { useFinePointer } from "./hooks";
import { gsap, SplitText, useGSAP } from "./gsap";

export function Contact() {
  const root = useRef<HTMLElement>(null);
  const head = useRef<HTMLHeadingElement>(null);
  const motion = useMotionEnabled();
  const fine = useFinePointer();

  useGSAP(
    () => {
      const sec = root.current!;
      const h = head.current!;
      if (!motion) return;
      let split: SplitText | null = null;
      let alive = true;
      let cleanup = () => {};
      gsap.from(".email-line", { scaleX: 0, duration: 1.2, ease: "power3.inOut", scrollTrigger: { trigger: ".email-line", start: "top 95%", once: true } });
      document.fonts.ready.then(() => {
        if (!alive) return;
        split = SplitText.create(h.querySelectorAll(".fit-line"), { type: "lines,chars", mask: "lines" });
        window.dispatchEvent(new Event("d2-refit"));
        const chars = split.chars as HTMLElement[];
        const intro = gsap.from(chars, {
          yPercent: 115,
          duration: 1,
          stagger: 0.05,
          ease: "power4.out",
          scrollTrigger: { trigger: h, start: "top 80%", once: true },
        });
        if (!fine) return;
        // Letters lean away from the pointer (per-char quickTo, small distance).
        const xs = chars.map((c) => gsap.quickTo(c, "x", { duration: 0.7, ease: "power3.out" }));
        const ys = chars.map((c) => gsap.quickTo(c, "y", { duration: 0.7, ease: "power3.out" }));
        let raf = 0;
        let ev: PointerEvent | null = null;
        const R = 320;
        const run = () => {
          raf = 0;
          if (!ev || intro.isActive()) return;
          chars.forEach((c, i) => {
            const r = c.getBoundingClientRect();
            const cx = r.left + r.width / 2 - (gsap.getProperty(c, "x") as number);
            const cy = r.top + r.height / 2 - (gsap.getProperty(c, "y") as number);
            const dx = cx - ev!.clientX;
            const dy = cy - ev!.clientY;
            const d = Math.hypot(dx, dy) || 1;
            const f = Math.max(0, 1 - d / R);
            xs[i]((dx / d) * f * 38);
            ys[i]((dy / d) * f * 38);
          });
        };
        const move = (e: PointerEvent) => {
          ev = e;
          if (!raf) raf = requestAnimationFrame(run);
        };
        const leave = () => {
          ev = null;
          chars.forEach((_, i) => {
            xs[i](0);
            ys[i](0);
          });
        };
        sec.addEventListener("pointermove", move, { passive: true });
        sec.addEventListener("pointerleave", leave);
        cleanup = () => {
          sec.removeEventListener("pointermove", move);
          sec.removeEventListener("pointerleave", leave);
          cancelAnimationFrame(raf);
        };
      });
      return () => {
        alive = false;
        cleanup();
        split?.revert();
      };
    },
    { scope: root, dependencies: [motion, fine], revertOnUpdate: true },
  );

  return (
    <section
      ref={root}
      id="contact"
      aria-labelledby="contact-h"
      className="relative flex min-h-svh flex-col justify-between bg-[var(--ink)] pt-24 text-[var(--paper)]"
    >
      <div className="label flex justify-between px-[var(--gut)]">
        <span>(07) Contact</span>
        <span>Open to work</span>
      </div>

      <div className="px-[var(--gut)]">
        <h2 id="contact-h" ref={head} data-skew className="disp" style={{ fontVariationSettings: '"wdth" 100, "wght" 800', lineHeight: 0.95 }}>
          <FitText fallbackVw={21}>Let&apos;s talk</FitText>
        </h2>

        <div className="mt-10">
          <a
            href={`mailto:${labFacts.email}`}
            className="disp relative inline-block text-[clamp(26px,5.6vw,100px)] [overflow-wrap:anywhere]"
            style={{ lineHeight: 1.1, textTransform: "none", letterSpacing: "-0.02em" }}
          >
            {labFacts.email}
            <span aria-hidden className="email-line absolute right-0 bottom-0 left-0 h-[0.07em] origin-left bg-[var(--red)] transition-[height] duration-300 hover:h-[0.14em]" />
          </a>
        </div>
      </div>

      <footer className="px-[var(--gut)] pt-16 pb-6">
        <div className="rule" style={{ opacity: 0.4 }} />
        <div className="grid12 gap-y-6 py-6">
          <ul className="col-span-12 m-0 flex list-none flex-wrap gap-x-8 gap-y-2 p-0 font-medium md:col-span-8">
            <li>
              <a href={labFacts.cv} className="ul" download>
                Download CV (PDF)
              </a>
            </li>
            {labFacts.social.map((s) => (
              <li key={s.name}>
                <ExtLink href={s.href} className="ul">
                  {s.name} ↗
                </ExtLink>
              </li>
            ))}
          </ul>
          <p className="label col-span-12 m-0 opacity-80 md:col-span-4 md:text-right">
            {labFacts.name} · {labFacts.location}
          </p>
        </div>
      </footer>
    </section>
  );
}
