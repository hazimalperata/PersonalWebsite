"use client";

import { useRef, useState } from "react";
import { labFacts } from "@/lab/facts";
import { useMotionEnabled } from "@/lab/useMotionEnabled";
import { gsap, ScrollTrigger, useGSAP } from "./gsapSetup";

export function Contact() {
  const motion = useMotionEnabled();
  const root = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(labFacts.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable: the address is still a visible mailto link */
    }
  };

  useGSAP(
    () => {
      if (!motion || !root.current) return;
      const stamp = root.current.querySelector(".approved-stamp");
      const rows = root.current.querySelectorAll(".ct-row");
      if (!stamp) return;
      gsap.set(stamp, { opacity: 0, scale: 0.92, rotate: 0 });
      gsap.set(rows, { opacity: 0, y: 12 });
      ScrollTrigger.create({
        trigger: root.current.querySelector(".approved"),
        start: "top 70%",
        once: true,
        onEnter: () => {
          gsap.to(rows, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" });
          gsap.to(stamp, { opacity: 1, scale: 1, rotate: -3, duration: 0.7, delay: 0.35, ease: "power3.out" });
        },
      });
    },
    { scope: root, dependencies: [motion] },
  );

  return (
    <section id="contact" ref={root} className="sec sec-contact" aria-labelledby="contact-h">
      <header className="sec-head">
        <p className="mono sec-ref">A-07</p>
        <h2 id="contact-h" className="sec-title">
          Contact
        </h2>
        <p className="mono sec-note">TITLE BLOCK · FINAL SHEET</p>
        <span className="rule" aria-hidden="true" />
      </header>

      <div className="approved">
        <div className="approved-head">
          <p className="mono approved-sub">DRAWING STATUS</p>
          <p className="approved-title">Approved for construction.</p>
          <p className="approved-line">Have something that has to be built properly? Write to me.</p>
          <div className="approved-stamp mono" aria-hidden="true">
            APPROVED
            <br />
            FOR CONSTRUCTION
          </div>
        </div>

        <dl className="ct">
          <div className="ct-row">
            <dt className="mono">EMAIL</dt>
            <dd>
              <a className="ct-mail" href={`mailto:${labFacts.email}`}>
                {labFacts.email}
              </a>
              <button type="button" className="btn btn-small" onClick={copy}>
                {copied ? "Copied" : "Copy"}
              </button>
              <span className="sr" role="status">
                {copied ? "Email address copied" : ""}
              </span>
            </dd>
          </div>
          <div className="ct-row">
            <dt className="mono">CV</dt>
            <dd>
              <a className="ct-link" href={labFacts.cv} download>
                Download CV (PDF) <span aria-hidden="true">↓</span>
              </a>
            </dd>
          </div>
          <div className="ct-row">
            <dt className="mono">SOCIAL</dt>
            <dd className="ct-social">
              {labFacts.social.map((s) => (
                <a key={s.href} className="ct-link" href={s.href} target="_blank" rel="noopener noreferrer">
                  {s.name} <span aria-hidden="true">↗</span>
                  <span className="sr"> (opens in a new tab)</span>
                </a>
              ))}
            </dd>
          </div>
          <div className="ct-row">
            <dt className="mono">BASE</dt>
            <dd>
              {labFacts.location} · {labFacts.timezone}
            </dd>
          </div>
        </dl>
      </div>
      <p className="mono footnote foot-end">
        SHEET 7 OF 7 · {labFacts.name.toUpperCase()} · {new Date().getFullYear()} · PROTOTYPE 1 / BLUEPRINT
      </p>
    </section>
  );
}
