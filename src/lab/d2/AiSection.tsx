"use client";

import { useRef } from "react";
import { labFacts } from "@/lab/facts";
import { useMotionEnabled } from "@/lab/useMotionEnabled";
import { DisplayHeading, SectionBar } from "./DisplayHeading";
import { gsap, useGSAP } from "./gsap";

const ai = labFacts.ai;
const sys = ai.system;

/**
 * "How I use AI". Signature motion: the four workflow steps are a pipeline. A red line is scrubbed down the
 * page with the scroll and each step lights up (number turns red, text rises to full opacity) as it arrives.
 * Product lines draw their rules in. Static and fully lit under reduced motion.
 */
export function AiSection() {
  const root = useRef<HTMLElement>(null);
  const pipe = useRef<HTMLOListElement>(null);
  const motion = useMotionEnabled();

  useGSAP(
    () => {
      if (!motion) return;
      gsap.utils.toArray<HTMLElement>(".draw", root.current!).forEach((r) =>
        gsap.from(r, { scaleX: 0, duration: 1.1, ease: "power3.inOut", scrollTrigger: { trigger: r, start: "top 92%", once: true } }),
      );
      const list = pipe.current!;
      const steps = gsap.utils.toArray<HTMLElement>(".pipe-step", list);
      gsap.fromTo(
        ".pipe-line",
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: list, start: "top 65%", end: "bottom 60%", scrub: 0.4 } },
      );
      steps.forEach((s) => {
        const num = s.querySelector(".pipe-num")!;
        const body = s.querySelectorAll(".pipe-body > *");
        gsap.set(body, { opacity: 0.18, y: 14 });
        gsap.set(num, { color: "#0B0B0B" });
        const tl = gsap.timeline({
          paused: true,
          defaults: { ease: "power3.out", duration: 0.6 },
        });
        tl.to(num, { color: "#E2261C" }, 0).to(body, { opacity: 1, y: 0, stagger: 0.08 }, 0);
        gsap.timeline({ scrollTrigger: { trigger: s, start: "top 62%", onEnter: () => tl.play(), onLeaveBack: () => tl.reverse() } });
      });
      // System panel: wipes up over the page (scrubbed clip-path), then each part lights in turn.
      gsap.fromTo(
        ".sys-wrap",
        { clipPath: "inset(14% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { trigger: ".sys-wrap", start: "top 95%", end: "top 25%", scrub: 0.4 } },
      );
      gsap.utils.toArray<HTMLElement>(".sys-part", root.current!).forEach((part) => {
        const name = part.querySelector(".sys-name")!;
        const line = part.querySelector(".sys-line")!;
        gsap.set(name, { opacity: 0.2 });
        gsap.set(line, { opacity: 0, y: 16 });
        const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out", duration: 0.7 } });
        tl.to(name, { opacity: 1, color: "#E2261C", x: 0 }, 0).to(line, { opacity: 1, y: 0 }, 0.1);
        gsap.timeline({ scrollTrigger: { trigger: part, start: "top 66%", onEnter: () => tl.play(), onLeaveBack: () => tl.reverse() } });
      });
      return () => {
        gsap.set(".pipe-num", { clearProps: "color" });
      };
    },
    { scope: root, dependencies: [motion], revertOnUpdate: true },
  );

  return (
    <section ref={root} id="ai" aria-labelledby="ai-h" className="relative pt-24 pb-24">
      <SectionBar n="06" title="AI" />
      <div className="px-[var(--gut)] pt-6 pb-10">
        <DisplayHeading id="ai-h" className="text-[clamp(56px,15vw,260px)]">
          {ai.title}
        </DisplayHeading>
        <p className="mt-10 max-w-[26ch] text-[clamp(24px,3.2vw,52px)] leading-[1.12] font-semibold tracking-tight">{ai.intro}</p>
      </div>

      {/* In the products */}
      <div className="px-[var(--gut)] pt-10">
        <p className="label pb-3">In the products</p>
        <ul className="m-0 list-none p-0">
          {ai.inProducts.map((p) => (
            <li key={p.product}>
              <div className="draw rule" />
              <div className="grid12 gap-y-2 py-5 sm:py-7">
                <h3 data-skew className="disp col-span-12 text-[clamp(30px,4.6vw,84px)] md:col-span-7" style={{ lineHeight: 0.98 }}>
                  {p.product}
                </h3>
                <p className="col-span-12 m-0 max-w-[40ch] md:col-span-4 md:col-start-9">{p.line}</p>
              </div>
            </li>
          ))}
          <li>
            <div className="draw rule" />
          </li>
        </ul>
      </div>

      {/* Workflow pipeline */}
      <div className="px-[var(--gut)] pt-20">
        <p className="label pb-6">How I work</p>
        <ol ref={pipe} className="relative m-0 list-none p-0 pl-[clamp(44px,7vw,120px)]">
          <span aria-hidden className="absolute top-2 bottom-2 left-[clamp(10px,1.6vw,26px)] w-px bg-[var(--ink)] opacity-20" />
          <span aria-hidden className="pipe-line absolute top-2 bottom-2 left-[clamp(10px,1.6vw,26px)] w-[3px] origin-top bg-[var(--red)]" />
          {ai.workflow.map((w, i) => (
            <li key={w.step} className="pipe-step relative pb-14 last:pb-0">
              <span
                aria-hidden
                className="absolute top-3 -left-[clamp(44px,7vw,120px)] ml-[clamp(10px,1.6vw,26px)] h-3 w-3 -translate-x-[5px] bg-[var(--red)]"
              />
              <div className="pipe-body grid12 gap-y-2">
                <p className="pipe-num disp col-span-3 m-0 text-[clamp(40px,7vw,120px)] md:col-span-2" style={{ lineHeight: 0.9 }}>
                  {String(i + 1).padStart(2, "0")}
                </p>
                <div className="col-span-12 md:col-span-9">
                  <h3 className="disp m-0 text-[clamp(32px,5vw,90px)]" style={{ lineHeight: 0.95 }}>
                    {w.step}
                  </h3>
                  <p className="mt-3 max-w-[44ch]">{w.line}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* The system: the strongest moment. A black panel wipes up over the page, then each part lights as it arrives. */}
      <div className="sys-wrap mt-24 bg-[var(--ink)] text-[var(--paper)]">
        <div className="sys px-[var(--gut)] pt-16 pb-24">
          <p className="label">(06.1) The system</p>
          <h3 data-skew className="disp mt-6 text-[clamp(44px,10vw,180px)]" style={{ lineHeight: 0.92 }}>
            {sys.title}
          </h3>
          <p className="mt-8 max-w-[30ch] text-[clamp(22px,2.6vw,42px)] leading-[1.15] font-semibold tracking-tight">{sys.intro}</p>
          <ol className="m-0 mt-16 list-none p-0">
            {sys.parts.map((p, i) => (
              <li key={p.name} className="sys-part">
                <div className="rule" style={{ opacity: 0.35 }} />
                <div className="grid12 gap-y-3 py-8 md:py-12">
                  <span className="label col-span-2 pt-2 md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
                  <h4
                    data-skew
                    className="sys-name disp col-span-12 -order-1 m-0 text-[clamp(38px,7.2vw,132px)] md:order-none md:col-span-11"
                    style={{ lineHeight: 0.94 }}
                  >
                    {p.name}
                  </h4>
                  <p className="sys-line col-span-10 m-0 max-w-[52ch] md:col-span-6 md:col-start-2">{p.line}</p>
                </div>
              </li>
            ))}
            <li>
              <div className="rule" style={{ opacity: 0.35 }} />
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
