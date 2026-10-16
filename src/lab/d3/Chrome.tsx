"use client";

import { useEffect, useState } from "react";
import Lenis from "lenis";
import { labFacts } from "@/lab/facts";
import { useMotionEnabled } from "@/lab/useMotionEnabled";
import { gsap, ScrollTrigger } from "./gsap";

let lenis: Lenis | null = null;

function scrollToEnd() {
  const top = document.documentElement.scrollHeight - window.innerHeight;
  if (lenis) lenis.scrollTo(top, { duration: 2 });
  else window.scrollTo({ top, behavior: "auto" });
}

/** Smooth scroll, driven from the single GSAP ticker. Renders nothing. */
export function SmoothScroll() {
  const motion = useMotionEnabled();
  useEffect(() => {
    if (!motion) return;
    const instance = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis = instance;
    const onScroll = () => ScrollTrigger.update();
    instance.on("scroll", onScroll);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => {
      window.removeEventListener("load", onLoad);
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      instance.off("scroll", onScroll);
      instance.destroy();
      lenis = null;
    };
  }, [motion]);
  return null;
}

/** Thin top bar: name, current section, Contact pill. */
export function TopBar() {
  const [section, setSection] = useState("Introduction");
  const motion = useMotionEnabled();

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-section]"));
    const triggers = els.map((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => {
          if (self.isActive) setSection(el.dataset.section ?? "");
        },
      }),
    );
    const main = document.querySelector<HTMLElement>(".d3-main");
    if (main) {
      triggers.push(
        ScrollTrigger.create({
          trigger: main,
          start: "bottom 72%",
          onEnter: () => setSection("Contact"),
          onLeaveBack: () => setSection("Experience"),
        }),
      );
    }
    return () => triggers.forEach((t) => t.kill());
  }, [motion]);

  return (
    <header className="d3-top">
      <a href="#top" className="d3-top-name" onClick={(e) => { e.preventDefault(); if (lenis) lenis.scrollTo(0, { duration: 1.6 }); else window.scrollTo(0, 0); }}>
        {labFacts.name}
      </a>
      <span key={section} className="d3-mono d3-top-section" aria-live="polite">
        {section}
      </span>
      <a
        href="#contact"
        className="d3-pill"
        onClick={(e) => {
          e.preventDefault();
          scrollToEnd();
        }}
      >
        Contact
      </a>
    </header>
  );
}
