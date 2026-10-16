"use client";

import Link from "next/link";
import { useRef } from "react";
import { labFacts } from "@/lab/facts";
import { useMotionEnabled } from "@/lab/useMotionEnabled";
import { useCoarsePointer } from "./hooks";
import { gsap, ScrollTrigger, useGSAP } from "./gsap";

const fmt = (n: number) => n.toLocaleString("en-US");

/* ------------------------------------------------------------------ Proof */

export function Proof() {
  const motion = useMotionEnabled();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!motion) return;
      gsap.utils.toArray<HTMLElement>(".d3-stat").forEach((el, i) => {
        const num = el.querySelector<HTMLElement>(".d3-num");
        const sweep = el.querySelector<HTMLElement>(".d3-sweep");
        const label = el.querySelector<HTMLElement>(".d3-stat-label");
        const target = Number(el.dataset.value);
        const state = { v: 0 };
        if (num) num.textContent = "0";
        gsap.set(label, { opacity: 0, y: 12 });
        gsap.set(sweep, { backgroundPosition: "0% 0%" });
        gsap.set(el.querySelector(".d3-stat-rule"), { scaleX: 0 });
        gsap
          .timeline({
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
            delay: i * 0.08,
          })
          .to(state, {
            v: target,
            duration: 2.2,
            ease: "power3.out",
            onUpdate: () => {
              if (num) num.textContent = fmt(Math.round(state.v));
            },
          })
          .to(sweep, { backgroundPosition: "100% 0%", duration: 1.8, ease: "power2.inOut" }, 0)
          .to(el.querySelector(".d3-stat-rule"), { scaleX: 1, duration: 1.2, ease: "power3.out" }, 0)
          .to(label, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, 0.5);
      });
    },
    { scope: root, dependencies: [motion] },
  );

  return (
    <section ref={root} data-section="Proof" className="d3-sec d3-proof">
      <h2 className="d3-mono d3-sec-label">Proof</h2>
      <ul className="d3-proof-grid">
        {labFacts.proof.map((p) => (
          <li key={p.label} className="d3-stat" data-value={p.value}>
            <span className="d3-stat-rule" aria-hidden />
            <p className="d3-display d3-stat-value">
              <span className="d3-sweep">
                <span className="d3-num">{fmt(p.value)}</span>
                {p.suffix}
              </span>
            </p>
            <p className="d3-stat-label">{p.label}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* -------------------------------------------------------------- More work */

export function MoreWork() {
  const coarse = useCoarsePointer();
  const motion = useMotionEnabled();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!motion) return;
      gsap.from(".d3-row", {
        opacity: 0,
        y: 24,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: ".d3-rows", start: "top 82%", once: true },
      });
    },
    { scope: root, dependencies: [motion] },
  );

  return (
    <section ref={root} data-section="More work" className="d3-sec d3-more">
      <h2 className="d3-mono d3-sec-label">More work</h2>
      <ul className="d3-rows">
        {labFacts.more.map((m, i) => (
          <li key={m.href} className="d3-row">
            <Link
              href={m.href}
              className="d3-row-link"
              onPointerMove={(e) => {
                if (coarse) return;
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
              }}
            >
              <span className="d3-mono d3-row-n">{String(i + 1).padStart(2, "0")}</span>
              <span className="d3-row-title">{m.title}</span>
              <span className="d3-row-line">{m.line}</span>
              <span className="d3-row-arrow" aria-hidden>
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ----------------------------------------------------------- Capabilities */

export function Capabilities() {
  const motion = useMotionEnabled();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!motion) return;
      gsap.utils.toArray<HTMLElement>(".d3-cap").forEach((el, i) => {
        gsap.from(el, {
          opacity: 0,
          y: 40,
          duration: 1,
          ease: "power3.out",
          delay: (i % 2) * 0.12,
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
            onEnter: () => window.setTimeout(() => el.classList.add("is-shining"), 300 + (i % 2) * 120),
          },
        });
      });
    },
    { scope: root, dependencies: [motion] },
  );

  return (
    <section ref={root} data-section="Capabilities" className="d3-sec d3-caps">
      <h2 className="d3-mono d3-sec-label">Capabilities</h2>
      <p className="d3-display d3-caps-lead">The whole stack, from the shader to the store release.</p>
      <div className="d3-caps-grid">
        {labFacts.capabilities.map((c, i) => (
          <article key={c.title} className="d3-cap">
            <span className="d3-shine" aria-hidden />
            <p className="d3-mono d3-cap-n">{String(i + 1).padStart(2, "0")}</p>
            <h3 className="d3-display d3-cap-title">{c.title}</h3>
            <ul className="d3-cap-list">
              {c.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- AI */

export function AiSection() {
  const motion = useMotionEnabled();
  const root = useRef<HTMLElement>(null);
  const ai = labFacts.ai;

  useGSAP(
    () => {
      if (!motion) return;
      const list = root.current?.querySelector<HTMLElement>(".d3-pl");
      if (!list) return;
      const steps = gsap.utils.toArray<HTMLElement>(".d3-pl-step");
      const n = steps.length;
      list.classList.add("is-armed");
      list.style.setProperty("--p", "0");
      ScrollTrigger.create({
        trigger: list,
        start: "top 72%",
        end: "bottom 62%",
        scrub: true,
        onUpdate: (self) => {
          list.style.setProperty("--p", self.progress.toFixed(4));
          steps.forEach((el, i) => el.classList.toggle("is-on", self.progress >= i / (n - 1) - 0.02));
        },
      });
      gsap.from(".d3-prod", {
        opacity: 0,
        x: -28,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.14,
        scrollTrigger: { trigger: ".d3-prods", start: "top 80%", once: true },
      });
      return () => list.classList.remove("is-armed");
    },
    { scope: root, dependencies: [motion] },
  );

  return (
    <section ref={root} data-section="How I use AI" className="d3-sec d3-ai">
      <h2 className="d3-mono d3-sec-label">{ai.title}</h2>
      <p className="d3-display d3-caps-lead">{ai.intro}</p>
      <ol className="d3-pl">
        <span className="d3-pl-track" aria-hidden>
          <span className="d3-pl-fill" />
        </span>
        {ai.workflow.map((w, i) => (
          <li key={w.step} className="d3-pl-step is-on">
            <span className="d3-pl-node" aria-hidden />
            <p className="d3-mono d3-pl-n">{String(i + 1).padStart(2, "0")}</p>
            <h3 className="d3-display d3-pl-title">{w.step}</h3>
            <p className="d3-pl-line">{w.line}</p>
          </li>
        ))}
      </ol>
      <h3 className="d3-mono d3-prods-label">In the products</h3>
      <ul className="d3-prods">
        {ai.inProducts.map((p) => (
          <li key={p.product} className="d3-prod">
            <span className="d3-prod-name">{p.product}</span>
            <span className="d3-prod-line">{p.line}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------- Experience */

export function Timeline() {
  const motion = useMotionEnabled();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!motion) return;
      const list = root.current?.querySelector<HTMLElement>(".d3-tl");
      if (!list) return;
      list.classList.add("is-armed");
      gsap.set(".d3-tl-fill", { scaleY: 0 });
      gsap.to(".d3-tl-fill", {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: list, start: "top 65%", end: "bottom 65%", scrub: 0.4 },
      });
      gsap.utils.toArray<HTMLElement>(".d3-tl-item").forEach((el) => {
        gsap.from(el.querySelectorAll(".d3-tl-body > *"), {
          opacity: 0,
          y: 18,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: "top 80%", once: true },
        });
        el.classList.remove("is-on");
        ScrollTrigger.create({
          trigger: el,
          start: "top 65%",
          onEnter: () => el.classList.add("is-on"),
          onLeaveBack: () => el.classList.remove("is-on"),
        });
      });
      return () => list.classList.remove("is-armed");
    },
    { scope: root, dependencies: [motion] },
  );

  return (
    <section ref={root} data-section="Experience" className="d3-sec d3-exp">
      <h2 className="d3-mono d3-sec-label">Experience</h2>
      <ol className="d3-tl">
        <span className="d3-tl-track" aria-hidden>
          <span className="d3-tl-fill" />
        </span>
        {labFacts.experience.map((x) => (
          <li key={x.company} className="d3-tl-item is-on">
            <span className="d3-tl-dot" aria-hidden />
            <p className="d3-mono d3-tl-date">
              {x.from === x.to ? x.from : `${x.from} — ${x.to}`}
            </p>
            <div className="d3-tl-body">
              <h3 className="d3-display d3-tl-co">{x.company}</h3>
              <p className="d3-tl-role">{x.role}</p>
              <p className="d3-tl-line">{x.line}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ---------------------------------------------------------------- Contact */

export function ContactFooter() {
  const motion = useMotionEnabled();
  const coarse = useCoarsePointer();
  const btn = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      const el = btn.current;
      if (!motion || coarse || !el) return;
      const qx = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
      const qy = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        qx((e.clientX - (r.left + r.width / 2)) * 0.28);
        qy((e.clientY - (r.top + r.height / 2)) * 0.28);
      };
      const leave = () => {
        qx(0);
        qy(0);
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    },
    { dependencies: [motion, coarse] },
  );

  return (
    <footer id="contact" className="d3-foot">
      <div className="d3-foot-inner">
        <p className="d3-mono d3-sec-label">Contact</p>
        <h2 className="d3-display d3-foot-h">
          Let&rsquo;s build
          <br />
          something real.
        </h2>
        <div className="d3-foot-row">
          <a ref={btn} href={`mailto:${labFacts.email}`} className="d3-magnet">
            <span>{labFacts.email}</span>
            <span aria-hidden>↗</span>
          </a>
          <ul className="d3-foot-links">
            <li>
              <a href={labFacts.cv} target="_blank" rel="noopener noreferrer">
                CV (PDF)<span className="d3-sr"> (opens in a new tab)</span>
              </a>
            </li>
            {labFacts.social.map((s) => (
              <li key={s.name}>
                <a href={s.href} target="_blank" rel="noopener noreferrer">
                  {s.name}
                  <span className="d3-sr"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <p className="d3-mono d3-foot-meta">
          <span>{labFacts.name}</span>
          <span>{labFacts.location}</span>
        </p>
      </div>
    </footer>
  );
}
