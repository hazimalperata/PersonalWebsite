"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { labFacts } from "@/lab/facts";
import { useMotionEnabled } from "@/lab/useMotionEnabled";
import { Contact } from "./Contact";
import { Hero } from "./Hero";
import { Marquee } from "./Marquee";
import { ProofPanels } from "./ProofPanels";
import { Capabilities, Experience, MoreWork } from "./Sections";
import { Statement } from "./Statement";
import { Work } from "./Work";
import { WorkOverlay } from "./WorkOverlay";
import { ScrollTrigger } from "./gsap";
import { startScrollVelocity, startVelocitySkew } from "./scrollVelocity";

const STACK = Array.from(new Set(labFacts.work.flatMap((w) => w.stack)));
const STACK_2 = [...STACK].reverse();

const NAV = [
  { href: "#work", label: "Work" },
  { href: "#capabilities", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-[var(--ink)] bg-[var(--paper)] text-[var(--ink)]">
      <nav aria-label="Primary" className="flex items-center justify-between px-[var(--gut)] py-4">
        <a href="#top" className="disp text-[22px]" style={{ lineHeight: 1 }}>
          H.A.A
        </a>
        <ul className="m-0 flex list-none gap-5 p-0 text-[15px] font-medium sm:gap-8">
          {NAV.map((n, i) => (
            <li key={n.href} className={i > 0 && i < NAV.length - 1 ? "hidden sm:block" : ""}>
              <a href={n.href} className="ul">
                {n.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export function Kinetic() {
  const motion = useMotionEnabled();
  const [open, setOpen] = useState<string | null>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);

  // Scroll velocity feeds the skew and the marquees.
  useEffect(() => {
    if (!motion) return;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const stopV = startScrollVelocity();
    const stopS = startVelocitySkew(coarse ? 3 : 6);
    let alive = true;
    document.fonts.ready.then(() => alive && ScrollTrigger.refresh());
    return () => {
      alive = false;
      stopS();
      stopV();
    };
  }, [motion]);

  const onOpen = useCallback((slug: string, trigger: HTMLElement) => {
    lastTrigger.current = trigger;
    setOpen(slug);
  }, []);

  const onClose = useCallback(() => {
    setOpen(null);
  }, []);

  // Give focus back to the row once the page is no longer inert.
  useEffect(() => {
    if (open === null) lastTrigger.current?.focus({ preventScroll: true });
  }, [open]);

  // Lock page scroll while the overlay is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <div inert={open !== null}>
        <Nav />
        <main>
          <Hero />
          <Marquee items={STACK} bg="var(--ink)" fg="var(--paper)" />
          <Statement />
          <ProofPanels />
          <Work onOpen={onOpen} />
          <MoreWork />
          <Marquee items={STACK_2} bg="var(--red)" fg="var(--paper)" dir={-1} />
          <Capabilities />
          <Experience />
        </main>
        <Contact />
      </div>
      {open ? <WorkOverlay slug={open} onClose={onClose} /> : null}
    </>
  );
}
