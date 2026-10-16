"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { labFacts, type LabWork } from "@/lab/facts";
import { useMotionEnabled } from "@/lab/useMotionEnabled";
import { useGSAP, gsap, ScrollTrigger } from "./gsap";
import { ExternalHint, cssVars } from "./ui";

/** Phone mockup; screenshots cross-fade while the card is on screen. */
function Phone({ work }: { work: LabWork }) {
  const [i, setI] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const motion = useMotionEnabled();
  useEffect(() => {
    const el = ref.current;
    if (!el || !motion || work.images.length < 2) return;
    let id: number | undefined;
    const io = new IntersectionObserver(([e]) => {
      window.clearInterval(id);
      if (e.isIntersecting) id = window.setInterval(() => setI((n) => (n + 1) % work.images.length), 3000);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearInterval(id);
    };
  }, [motion, work.images.length]);
  const shown = motion ? i : 0;
  return (
    <div className="device" ref={ref}>
      <span className="island" aria-hidden="true" />
      <div className="screen">
        {work.images.map((src, n) => (
          <Image
            key={src}
            src={src}
            alt={n === 0 ? `${work.title} app screen` : ""}
            aria-hidden={n === 0 ? undefined : true}
            width={330}
            height={717}
            sizes="260px"
            className={n === shown ? "on" : ""}
          />
        ))}
      </div>
      {work.images.length > 1 && (
        <div className="dots" aria-hidden="true">
          {work.images.map((_, n) => (
            <i key={n} className={n === shown ? "on" : ""} />
          ))}
        </div>
      )}
    </div>
  );
}

function Browser({ work }: { work: LabWork }) {
  return (
    <div className="browser">
      <div className="bar" aria-hidden="true">
        <i /> <i /> <i />
        <span className="mono">{work.title}</span>
      </div>
      <Image src={work.images[0]} alt={`${work.title} screenshot`} width={1200} height={600} sizes="(max-width: 860px) 90vw, 560px" />
    </div>
  );
}

const ARCH = [
  { t: "Phone camera", s: "Vision Camera · Skia" },
  { t: "On-device pose", s: "Analysed on the phone" },
  { t: "API", s: "NestJS · PostgreSQL" },
  { t: "Staff panel", s: "Next.js web panel" },
];

function Architecture() {
  return (
    <figure className="arch">
      <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="d5g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#9d8cf0" />
            <stop offset="1" stopColor="#6aa8ff" />
          </linearGradient>
        </defs>
      </svg>
      {ARCH.map((a, n) => (
        <div key={a.t} style={{ display: "contents" }}>
          {n > 0 && (
            <div className="conn" aria-hidden="true">
              <svg viewBox="0 0 12 34" preserveAspectRatio="none">
                <line x1="6" y1="0" x2="6" y2="34" />
              </svg>
            </div>
          )}
          <div className="box">
            <b>{a.t}</b>
            <span>{a.s}</span>
          </div>
        </div>
      ))}
      <figcaption className="cap mono">Illustration: architecture overview, not a screenshot</figcaption>
    </figure>
  );
}

function Visual({ work }: { work: LabWork }) {
  if (work.images.length === 0) return <Architecture />;
  return work.portrait ? <Phone work={work} /> : <Browser work={work} />;
}

export function Cases() {
  const root = useRef<HTMLDivElement>(null);
  const motion = useMotionEnabled();

  useGSAP(
    () => {
      if (!motion) return;
      const cards = gsap.utils.toArray<HTMLElement>(".case", root.current);
      const inner = cards.map((c) => c.querySelector<HTMLElement>(".case-card")!);
      const dims = cards.map((c) => c.querySelector<HTMLElement>(".dim")!);
      const geo = { hs: [] as number[], nat: [] as number[], stick: [] as number[] };

      const measure = () => {
        const r = root.current!;
        const cs = getComputedStyle(r);
        const gap = parseFloat(cs.rowGap) || 0;
        let y = r.getBoundingClientRect().top + window.scrollY;
        geo.hs = cards.map((c) => c.offsetHeight);
        geo.nat = geo.hs.map((h) => {
          const at = y;
          y += h + gap;
          return at;
        });
        geo.stick = cards.map((c) => parseFloat(getComputedStyle(c).top) || 88);
      };
      measure();

      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onRefresh: measure,
        onUpdate: () => {
          const y = window.scrollY;
          for (let i = 0; i < cards.length - 1; i++) {
            const next = i + 1;
            const nextNatural = geo.nat[next];
            // next card's viewport top travels from (this card's sticky top + height) to its own sticky top
            const from = nextNatural - (geo.stick[i] + geo.hs[i]);
            const to = nextNatural - geo.stick[next];
            const p = gsap.utils.clamp(0, 1, (y - from) / (to - from));
            gsap.set(inner[i], { scale: 1 - 0.06 * p });
            gsap.set(dims[i], { opacity: 0.55 * p });
          }
        },
      });
    },
    { scope: root, dependencies: [motion] },
  );

  return (
    <div className="stack" ref={root}>
      {labFacts.work.map((w, i) => (
        <article key={w.slug} className="case" style={cssVars({ "--n": i })} aria-labelledby={`case-${w.slug}`}>
          <div className="case-card" data-kind={w.images.length === 0 ? "arch" : w.portrait ? "phone" : "wide"}>
            <div className="case-text">
              <div className="meta mono">
                <span>{String(i + 1).padStart(2, "0")} / {String(labFacts.work.length).padStart(2, "0")}</span>
                <span aria-hidden="true">·</span>
                <span>{w.kind} · {w.year}</span>
              </div>
              <h3 id={`case-${w.slug}`}>{w.title}</h3>
              <p className="sum">{w.summary}</p>
              <p className="role">{w.role}</p>
              <ul className="chips">
                {w.stack.map((s) => (
                  <li key={s} className="chip">
                    {s}
                  </li>
                ))}
              </ul>
              <div className="links">
                {w.href && (
                  <Link className="btn small ghost-dark" href={w.href} prefetch={false}>
                    Case study
                  </Link>
                )}
                {w.links.map((l) => (
                  <a key={l.href} className="btn small ghost-dark" href={l.href} target="_blank" rel="noopener noreferrer">
                    {l.label}
                    <ExternalHint />
                  </a>
                ))}
              </div>
            </div>
            <div className="case-vis">
              <Visual work={w} />
            </div>
            <span className="dim" aria-hidden="true" />
          </div>
        </article>
      ))}
    </div>
  );
}
