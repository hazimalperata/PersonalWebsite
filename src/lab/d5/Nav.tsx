"use client";

import { useEffect, useState } from "react";
import { motion as m } from "motion/react";
import { useMotionEnabled } from "@/lab/useMotionEnabled";

const LINKS = [
  { id: "work", label: "Work" },
  { id: "capabilities", label: "Skills" },
  { id: "ai", label: "AI" },
  { id: "experience", label: "Career" },
  { id: "contact", label: "Contact" },
];
const WATCH = ["hero", "proof", "work", "more", "capabilities", "ai", "experience", "contact"];

export function Nav() {
  const [active, setActive] = useState("");
  const motion = useMotionEnabled();

  useEffect(() => {
    const els = WATCH.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const id = e.target.id;
          setActive(LINKS.some((l) => l.id === id) ? id : id === "more" ? "work" : "");
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <nav className="nav" aria-label="Primary">
      <a className="brand" href="#hero" aria-label="Hazim Alper Ata, back to top">
        <span>Hazim A.</span>
      </a>
      {LINKS.map((l) => (
        <a key={l.id} href={`#${l.id}`} aria-current={active === l.id ? "true" : undefined}>
          {active === l.id && (
            <m.span
              layoutId="d5-nav-slide"
              className="slide"
              transition={motion ? { type: "spring", stiffness: 420, damping: 38 } : { duration: 0 }}
            />
          )}
          <span>{l.label}</span>
        </a>
      ))}
    </nav>
  );
}
