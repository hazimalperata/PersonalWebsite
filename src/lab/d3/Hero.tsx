"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { labFacts } from "@/lab/facts";
import { useMotionEnabled } from "@/lab/useMotionEnabled";
import { useCoarsePointer } from "./hooks";
import { gsap, useGSAP } from "./gsap";

const ChromeShader = dynamic(() => import("./ChromeShader"), { ssr: false });

const NAME_WORDS = labFacts.name.split(" ");

export function Hero() {
  const motion = useMotionEnabled();
  const coarse = useCoarsePointer();
  const root = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      if (!motion) return;
      const words = gsap.utils.toArray<HTMLElement>(".d3-hw");
      gsap.set(words, { opacity: 0, y: 20, filter: "blur(8px)" });
      gsap.set([".d3-hrole", ".d3-hmsg", ".d3-hfoot > *"], { opacity: 0, y: 16 });
      gsap
        .timeline({ delay: 0.25, defaults: { ease: "power3.out" } })
        .to(words, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, stagger: 0.14 })
        .to(".d3-hrole", { opacity: 1, y: 0, duration: 0.9 }, "-=0.55")
        .to(".d3-hmsg", { opacity: 1, y: 0, duration: 0.9 }, "-=0.6")
        .to(".d3-hfoot > *", { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, "-=0.5");

      gsap.to([".d3-hero-content", ".d3-hero-foot"], {
        yPercent: -10,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom 30%", scrub: true },
      });
      gsap.to(".d3-hero-bg", {
        scale: 1.08,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    },
    { scope: root, dependencies: [motion] },
  );

  const shader = motion && !coarse;

  return (
    <section ref={root} id="top" data-section="Introduction" className="d3-hero">
      <div className="d3-hero-bg" aria-hidden>
        <div className={`d3-hero-fallback${motion ? " is-drifting" : ""}`} />
        {shader ? (
          <div className="d3-hero-canvas">
            <ChromeShader active={inView} />
          </div>
        ) : null}
        <div className="d3-hero-shade" />
      </div>
      <div className="d3-hero-content">
        <p className="d3-mono d3-hero-kicker">{labFacts.location}</p>
        <h1 className="d3-display d3-hero-h1">
          {NAME_WORDS.map((w) => (
            <span key={w} className="d3-hw">
              {w}
            </span>
          ))}
        </h1>
        <p className="d3-hrole d3-hero-role">{labFacts.role}</p>
        <p className="d3-hmsg d3-hero-msg">{labFacts.message}</p>
      </div>
      <div className="d3-hfoot d3-hero-foot d3-mono">
        <span>Scroll</span>
        <span className="d3-hero-line" aria-hidden />
        <span>Selected work</span>
      </div>
    </section>
  );
}
