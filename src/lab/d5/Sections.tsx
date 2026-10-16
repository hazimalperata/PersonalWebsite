"use client";

import Link from "next/link";
import { AnimatePresence, motion as m } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { labFacts } from "@/lab/facts";
import { useMotionEnabled } from "@/lab/useMotionEnabled";
import { useGSAP, gsap } from "./gsap";
import { BorderBeam, ExternalHint, Magnetic } from "./ui";

export function MoreWork() {
  return (
    <ul className="more-grid">
      {labFacts.more.map((w) => (
        <li key={w.title}>
          <Link className="mcard" href={w.href} prefetch={false} style={{ height: "100%" }}>
            <h3>{w.title}</h3>
            <p>{w.line}</p>
            <span className="go mono">View case study →</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function Capabilities() {
  const root = useRef<HTMLUListElement>(null);
  const motion = useMotionEnabled();
  useGSAP(
    () => {
      if (!motion) return;
      gsap.from(".cap-card", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.09,
        scrollTrigger: { trigger: root.current, start: "top 82%", once: true },
      });
      gsap.from(".cap-card li", {
        opacity: 0,
        y: 8,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.025,
        delay: 0.25,
        scrollTrigger: { trigger: root.current, start: "top 82%", once: true },
      });
    },
    { scope: root, dependencies: [motion] },
  );
  return (
    <ul className="caps-grid" ref={root}>
      {labFacts.capabilities.map((c) => (
        <li key={c.title} className="cap-card">
          <h3>{c.title}</h3>
          <ul>
            {c.items.map((it) => (
              <li key={it} className="chip">
                {it}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

export function Experience() {
  const root = useRef<HTMLOListElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const motion = useMotionEnabled();
  useGSAP(
    () => {
      if (!motion) return;
      gsap.fromTo(
        fill.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top 62%", end: "bottom 62%", scrub: 0.4 },
        },
      );
      gsap.utils.toArray<HTMLElement>("li", root.current).forEach((li) => {
        gsap.from(li.children, {
          y: 22,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: li,
            start: "top 80%",
            once: true,
            onEnter: () => li.classList.add("on"),
          },
        });
      });
    },
    { scope: root, dependencies: [motion] },
  );
  return (
    <div className="tl">
      <div className="tl-line" aria-hidden="true">
        <span className="tl-fill" ref={fill} />
      </div>
      <ol ref={root}>
        {labFacts.experience.map((e) => (
          <li key={e.company} className={motion ? "" : "on"}>
            <p className="mono label" style={{ paddingTop: 8 }}>
              {e.from === e.to ? e.from : `${e.from} — ${e.to}`}
            </p>
            <div>
              <h3>
                {e.role} <span style={{ color: "var(--ink2)", fontWeight: 500 }}>· {e.company}</span>
              </h3>
              <p style={{ marginTop: 8 }}>{e.line}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function ContactCard() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const motion = useMotionEnabled();
  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(labFacts.email);
    } catch {
      window.location.href = `mailto:${labFacts.email}`;
      return;
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2200);
  }, []);
  const t = motion ? { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const } : { duration: 0 };

  return (
    <div className="cta-card">
      <BorderBeam always />
      <div className="cta-in">
        <h2 className="display">Let&rsquo;s build something that ships.</h2>
        <p className="lede">
          Hiring, or have something to build? Write to me and I will answer personally.
        </p>
        <div className="cta-row">
          <Magnetic>
            <button type="button" className="btn primary copy-btn" onClick={copy} aria-label={`Copy email address ${labFacts.email}`}>
              <span className="ico" aria-hidden="true">
                <AnimatePresence initial={false} mode="popLayout">
                  <m.svg
                    key={copied ? "check" : "copy"}
                    viewBox="0 0 18 18"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={t}
                    style={{ position: "absolute", inset: 0 }}
                  >
                    {copied ? <path d="M3.5 9.5l3.5 3.5 7.5-8" /> : <path d="M6.5 6.5h8v8h-8zM11.5 6.5v-3h-8v8h3" />}
                  </m.svg>
                </AnimatePresence>
              </span>
              <span>{labFacts.email}</span>
            </button>
          </Magnetic>
          <a className="btn" href={labFacts.cv} target="_blank" rel="noopener noreferrer">
            Download CV
            <ExternalHint />
          </a>
        </div>
        <ul className="socials">
          {labFacts.social.map((s) => (
            <li key={s.name}>
              <a className="link" href={s.href} target="_blank" rel="noopener noreferrer">
                {s.name}
                <ExternalHint />
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div aria-live="polite" role="status">
        <AnimatePresence>
          {copied && (
            <m.div
              className="toast"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={t}
            >
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="#5fe0b0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3.5 9.5l3.5 3.5 7.5-8" />
              </svg>
              Email address copied
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
