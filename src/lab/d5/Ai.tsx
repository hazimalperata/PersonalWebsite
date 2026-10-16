"use client";

import { motion as m } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { labFacts } from "@/lab/facts";
import { useMotionEnabled } from "@/lab/useMotionEnabled";
import { useGSAP, gsap, ScrollTrigger } from "./gsap";
import { BorderBeam, MagicCard } from "./ui";

const ai = labFacts.ai;

/** Workflow: 4 tiles joined by a line; a beam fills along it (scrubbed) and each step lights up as it is reached. */
function Workflow() {
  const root = useRef<HTMLOListElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const motion = useMotionEnabled();

  useGSAP(
    () => {
      if (!motion) return;
      const steps = gsap.utils.toArray<HTMLElement>(".wf-step", root.current);
      const vertical = () => window.matchMedia("(max-width: 900px)").matches;
      gsap.set(fill.current, { scaleX: 0, scaleY: 0 });
      gsap.set(steps, { opacity: 0.45, y: 18 });
      const set = (p: number) => {
        const v = vertical();
        gsap.set(fill.current, v ? { scaleX: 1, scaleY: p } : { scaleY: 1, scaleX: p });
        steps.forEach((s, i) => {
          const on = p >= i / (steps.length - 1) - 0.001;
          s.classList.toggle("on", on);
          gsap.to(s, { opacity: on ? 1 : 0.45, y: on ? 0 : 18, duration: 0.5, ease: "power3.out", overwrite: true });
        });
      };
      ScrollTriggerCreate(root.current!, set);
    },
    { scope: root, dependencies: [motion] },
  );

  return (
    <ol className="wf" ref={root}>
      <span className="wf-rail" aria-hidden="true">
        <span className="wf-fill" ref={fill} />
      </span>
      {ai.workflow.map((w, i) => (
        <li key={w.step} className={`wf-step${motion ? "" : " on"}`}>
          <MagicCard>
            <span className="label">Step {i + 1}</span>
            <h3>{w.step}</h3>
            <p>{w.line}</p>
          </MagicCard>
        </li>
      ))}
    </ol>
  );
}

function ScrollTriggerCreate(el: HTMLElement, onProgress: (p: number) => void) {
  let last = -1;
  ScrollTrigger.create({
    trigger: el,
    start: "top 70%",
    end: "bottom 60%",
    scrub: true,
    onUpdate: (self) => {
      // quantise to avoid re-running tweens every frame
      const q = Math.round(self.progress * 100) / 100;
      if (q !== last) {
        last = q;
        onProgress(q);
      }
    },
  });
}

function SystemPalette() {
  const parts = ai.system.parts;
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const motion = useMotionEnabled();

  useEffect(() => {
    const el = box.current;
    if (!el || !motion || touched) return;
    let id: number | undefined;
    const io = new IntersectionObserver(([e]) => {
      window.clearInterval(id);
      if (e.isIntersecting) id = window.setInterval(() => setActive((n) => (n + 1) % parts.length), 4200);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearInterval(id);
    };
  }, [motion, touched, parts.length]);

  const pick = (i: number) => {
    setTouched(true);
    setActive(i);
  };

  return (
    <div className="sys dark" ref={box}>
      <BorderBeam always />
      <div className="sys-in">
        <div className="sys-head">
          <span className="label">Claude Code</span>
          <h3 className="display">{ai.system.title}</h3>
          <p>{ai.system.intro}</p>
        </div>
        <div className="pal" role="tablist" aria-label="Parts of my Claude Code setup" aria-orientation="vertical">
          <div className="pal-bar mono" aria-hidden="true">
            <span>&gt;</span> my setup <kbd>5 parts</kbd>
          </div>
          {parts.map((p, i) => (
            <button
              key={p.name}
              role="tab"
              aria-selected={i === active}
              className={`pal-row${i === active ? " on" : ""}`}
              onClick={() => pick(i)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                  e.preventDefault();
                  const n = (i + (e.key === "ArrowDown" ? 1 : parts.length - 1)) % parts.length;
                  pick(n);
                  (e.currentTarget.parentElement?.querySelectorAll<HTMLElement>(".pal-row")[n])?.focus();
                }
              }}
              tabIndex={i === active ? 0 : -1}
            >
              {i === active && (
                <m.span
                  layoutId="d5-pal"
                  className="pal-hl"
                  transition={motion ? { type: "spring", stiffness: 420, damping: 40 } : { duration: 0 }}
                />
              )}
              <span className="pal-n mono">{String(i + 1).padStart(2, "0")}</span>
              <span className="pal-t">
                <b>{p.name}</b>
                <span>{p.line}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AiSection() {
  return (
    <>
      <div className="sec-head">
        <span className="label">AI</span>
        <h2 id="ai-h" className="display">
          {ai.title}
        </h2>
        <p>{ai.intro}</p>
      </div>
      <ul className="ai-prod">
        {ai.inProducts.map((p) => (
          <li key={p.product}>
            <MagicCard>
              <span className="label">In the product</span>
              <h3>{p.product}</h3>
              <p>{p.line}</p>
            </MagicCard>
          </li>
        ))}
      </ul>
      <Workflow />
      <SystemPalette />
    </>
  );
}
