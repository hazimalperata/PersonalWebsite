"use client";

import { useRef } from "react";
import { labFacts } from "@/lab/facts";
import { useMotionEnabled } from "@/lab/useMotionEnabled";
import { useGSAP, gsap, ScrollTrigger } from "./gsap";
import { BorderBeam, Magnetic, bursaTime, cssVars, useNowSeconds } from "./ui";

const WORDS = ["Whatever", "I", "build,", "I", "build", "it", "to", "the", "highest", "standard."];
const GRAD_FROM = 8;

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const meshRef = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const motion = useMotionEnabled();
  const now = useNowSeconds();

  useGSAP(
    () => {
      if (!motion) return;
      gsap.to(inner.current, {
        yPercent: -8,
        opacity: 0.1,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom 20%", scrub: true },
      });
      gsap.to(meshRef.current, {
        yPercent: 14,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      // pause the mesh loop when the hero is off screen
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => meshRef.current?.parentElement?.setAttribute("data-paused", String(!self.isActive)),
      });
    },
    { scope: root, dependencies: [motion] },
  );

  return (
    <section id="hero" className="hero" ref={root}>
      <div className="mesh" aria-hidden="true">
        <div className="meshin" ref={meshRef}>
          <div className="blob b1" />
          <div className="blob b2" />
          <div className="blob b3" />
          <div className="blob b4" />
          <div className="blob b5" />
        </div>
        <div className="grain" />
      </div>

      <div className="hero-in wrap" ref={inner}>
        <div className="pill fadein" style={cssVars({ "--d": "0ms" })}>
          <span className="dot" aria-hidden="true" />
          <span>
            Open to work · Bursa, UTC+3 <span className="mono" style={{ color: "var(--ink2)", marginLeft: 4 }}>{bursaTime(now)}</span>
          </span>
          <BorderBeam always />
        </div>

        <h1 className="display">
          <span className="sr-only">{labFacts.name}. </span>
          {WORDS.map((w, i) => (
            <span key={i}>
              <span className="mask">
                <span className={`word${i >= GRAD_FROM ? " grad-text" : ""}`} style={cssVars({ "--i": i })}>
                  {w}
                </span>
              </span>{" "}
            </span>
          ))}
        </h1>

        <p className="lede fadein" style={cssVars({ "--d": "900ms" })}>
          Serious, real, and done the way modern technology says it should be done.
        </p>

        <div className="cta fadein" style={cssVars({ "--d": "1050ms" })}>
          <a className="btn primary" href="#work">
            See the work
          </a>
          <Magnetic>
            <a className="btn" href="#contact">
              Get in touch
            </a>
          </Magnetic>
        </div>

        <p className="who fadein mono" style={cssVars({ "--d": "1200ms", fontSize: 13 })}>
          <span>{labFacts.name}</span>
          <span aria-hidden="true">/</span>
          <span>{labFacts.role}</span>
          <span aria-hidden="true">/</span>
          <span>{labFacts.location}</span>
        </p>
      </div>
    </section>
  );
}
