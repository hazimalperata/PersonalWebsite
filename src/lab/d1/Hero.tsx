"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { labFacts } from "@/lab/facts";
import { useMotionEnabled } from "@/lab/useMotionEnabled";
import { gsap, SplitText, useGSAP } from "./gsapSetup";
import { ContourField } from "./ContourField";

const HEADLINE = "Built to the highest standard.";

const LOG = [
  "> load labFacts … ok",
  `> resolve ${labFacts.work.length} projects … ok`,
  "> 2 apps live on 2 stores",
  "> measure headline … ok",
  "> build: ok",
];

export function Hero() {
  const motion = useMotionEnabled();
  const root = useRef<HTMLElement>(null);
  const h1 = useRef<HTMLHeadingElement>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });

  // Real measured size of the headline, kept in sync on resize.
  useLayoutEffect(() => {
    const el = h1.current;
    const text = el?.querySelector<HTMLElement>(".hl");
    if (!el || !text) return;
    const measure = () => {
      const r = text.getBoundingClientRect();
      setDims((d) => (d.w === Math.round(r.width) && d.h === Math.round(r.height) ? d : { w: Math.round(r.width), h: Math.round(r.height) }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    ro.observe(text);
    return () => ro.disconnect();
  }, []);

  useGSAP(
    () => {
      if (!motion || !root.current) return;
      const q = gsap.utils.selector(root.current);
      const grid = document.querySelector(".d1-grid");
      const title = h1.current!;
      const hl = title.querySelector(".hl") as HTMLElement;
      const split = SplitText.create(hl, { type: "words,chars" });

      gsap.set(q("[data-h]"), { opacity: 1 });
      gsap.set(q(".logline"), { clipPath: "inset(0 100% 0 0)" });
      gsap.set(split.chars, { opacity: 0, y: "0.32em", filter: "blur(8px)" });
      gsap.set(q(".dim-line"), { scaleX: 0, scaleY: 0 });
      gsap.set(q(".dim-label, .dim-arrow"), { opacity: 0 });
      gsap.set(q(".fade-up"), { opacity: 0, y: 14 });
      gsap.set(q(".d1-contour"), { opacity: 0 });
      if (grid) gsap.set(grid, { opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      if (grid) tl.to(grid, { opacity: 1, duration: 0.8, ease: "none" }, 0);
      q(".logline").forEach((line, i) => {
        const chars = (line.textContent ?? "").length;
        tl.to(line, { clipPath: "inset(0 0% 0 0)", duration: 0.22, ease: `steps(${chars})` }, 0.04 + i * 0.2);
      });
      tl.to(split.chars, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.55, stagger: 0.014 }, 0.18);
      tl.to(q(".dim-line.dim-w"), { scaleX: 1, duration: 0.55, ease: "power3.inOut" }, 0.5);
      tl.to(q(".dim-line.dim-h"), { scaleY: 1, duration: 0.55, ease: "power3.inOut" }, 0.55);
      tl.to(q(".dim-label, .dim-arrow"), { opacity: 1, duration: 0.3, ease: "none" }, 0.95);
      tl.to(q(".fade-up"), { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }, 0.8);
      tl.to(q(".d1-contour"), { opacity: 1, duration: 1.0, ease: "none" }, 0.4);
    },
    { scope: root, dependencies: [motion] },
  );

  return (
    <section id="hero" ref={root} className="d1-hero" aria-labelledby="hero-title">
      <ContourField />
      <div className="hero-log mono" aria-hidden="true" data-h>
        {LOG.map((l) => (
          <div key={l} className="logline">
            {l}
          </div>
        ))}
        <span className="log-caret" />
      </div>

      <div className="hero-main">
        <p className="mono hero-kicker fade-up" data-h>
          {labFacts.name} <span>/</span> {labFacts.role}
        </p>

        <div className="hl-wrap" data-h style={{ "--hw": `${dims.w}px`, "--hh": `${dims.h}px` } as React.CSSProperties}>
          <div className="dim dim-top" aria-hidden="true">
            <span className="dim-line dim-w" />
            <span className="dim-arrow dim-arrow-l" />
            <span className="dim-arrow dim-arrow-r" />
            <span className="dim-label mono">W {dims.w ? String(dims.w).padStart(4, "0") : "----"} PX</span>
          </div>
          <div className="dim dim-left" aria-hidden="true">
            <span className="dim-line dim-h" />
            <span className="dim-arrow dim-arrow-t" />
            <span className="dim-arrow dim-arrow-b" />
            <span className="dim-label mono">H {dims.h ? String(dims.h).padStart(4, "0") : "----"} PX</span>
          </div>
          <h1 id="hero-title" ref={h1} className="hl-h1">
            <span className="sr">{labFacts.name}, {labFacts.role}. </span>
            <span className="hl">{HEADLINE}</span>
          </h1>
        </div>

        <p className="hero-message fade-up" data-h>
          {labFacts.message}
        </p>
        <div className="hero-cta fade-up" data-h>
          <a href="#work" className="btn btn-solid">
            Selected work <span aria-hidden="true">↓</span>
          </a>
          <a href="#contact" className="btn">
            Contact
          </a>
        </div>
      </div>

      <p className="mono hero-scroll fade-up" aria-hidden="true" data-h>
        SCROLL TO COMPILE ↓
      </p>
    </section>
  );
}
