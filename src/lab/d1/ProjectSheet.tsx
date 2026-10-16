"use client";

import Image from "next/image";
import { useRef } from "react";
import type { LabWork } from "@/lab/facts";
import { useMotionEnabled } from "@/lab/useMotionEnabled";
import { gsap, ScrollTrigger, useGSAP } from "./gsapSetup";
import { SystemDiagram } from "./SystemDiagram";

/** Intrinsic pixel size of each public screenshot (measured from the files). */
const ASSET: Record<string, [number, number]> = {
  dremly: [660, 1434],
  posme: [900, 1905],
  "1likte-mobile-application": [1999, 838],
  "1likte-seller-panel": [2467, 1214],
};

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="ship-link">
      {children}
      <span className="sr"> (opens in a new tab)</span>
    </a>
  );
}

interface Note {
  k: string;
  v: string;
  side: "l" | "r" | "b";
  y: number;
}

export function ProjectSheet({ work, n }: { work: LabWork; n: number }) {
  const motion = useMotionEnabled();
  const root = useRef<HTMLElement>(null);
  const isDiagram = work.images.length === 0;
  const wide = !work.portrait && !isDiagram;
  const web = work.slug === "1likte-seller-panel";
  const dims = ASSET[work.slug];
  const ref = `B-${String(n).padStart(2, "0")}`;
  const id = `sheet-${work.slug}`;

  const status = work.links.length
    ? "SHIPPED"
    : isDiagram
      ? "CLIENT PROJECT · IN DEVELOPMENT"
      : "IN PRODUCTION";

  const notes: Note[] = wide
    ? [
        { k: "STACK", v: work.stack.join(" · "), side: "b", y: 0 },
        { k: "PLATFORMS", v: work.platforms.join(" · "), side: "b", y: 0 },
        { k: "ROLE", v: work.role, side: "b", y: 0 },
      ]
    : [
        { k: "STACK", v: work.stack.join(" · "), side: "l", y: 20 },
        { k: "PLATFORMS", v: work.platforms.join(" · "), side: "l", y: 66 },
        { k: "ROLE", v: work.role, side: "r", y: 26 },
        { k: work.kind.toUpperCase(), v: work.year, side: "r", y: 70 },
      ];

  // Wide frame geometry (SVG units): 800 wide, 12 px margin, optional 28 px browser bar.
  const W = 800;
  const bar = web ? 28 : 0;
  const sh = dims && wide ? Math.round(((W - 24) * dims[1]) / dims[0]) : 0;
  const H = sh + bar + 24;

  useGSAP(
    () => {
      const el = root.current;
      if (!motion || !el) return;
      const q = gsap.utils.selector(el);
      const setStage = (s: number) => {
        if (el.dataset.stage !== String(s)) el.dataset.stage = String(s);
      };

      const mm = gsap.matchMedia();
      const build = (scrub: boolean, desktop: boolean) => {
        const d = desktop ? "h" : "v";
        const ease = scrub ? "none" : "power2.out";
        const tl0 = gsap.timeline({ defaults: { ease } });
        const ok = (t: unknown) => (Array.isArray(t) ? t.length > 0 : !!t);
        const tl = {
          to: (t: gsap.TweenTarget, v: gsap.TweenVars, p?: number) => (ok(t) ? tl0.to(t, v, p) : tl0),
          set: (t: gsap.TweenTarget, v: gsap.TweenVars, p?: number) => (ok(t) ? tl0.set(t, v, p) : tl0),
          call: tl0.call.bind(tl0),
          timeScale: tl0.timeScale.bind(tl0),
          pause: tl0.pause.bind(tl0),
          play: tl0.play.bind(tl0),
          raw: tl0,
        };
        const gset = (t: gsap.TweenTarget, v: gsap.TweenVars) => {
          if (ok(t)) gsap.set(t, v);
        };
        const stroke = q(".dev-svg .o");
        const cls = q(".cl");
        const leads = q(".note .lead");
        const noteTxt = q(".note .nt");

        gset(stroke, { drawSVG: "0% 0%" });
        gset(cls, { opacity: 0 });
        gset(q(".cl-h"), { scaleX: 0, transformOrigin: "0% 50%" });
        gset(q(".cl-v"), { scaleY: 0, transformOrigin: "50% 0%" });
        gset(q(".shot-in"), { clipPath: "inset(0 0 100% 0)" });
        gset(leads, { scale: 0, transformOrigin: (_i: number, el: Element) => (el as HTMLElement).dataset.o ?? "50% 50%" });
        gset(noteTxt, { opacity: 0, y: 8 });
        gset(q(".asset-dim"), { opacity: 0 });
        gset(q(".ship"), { opacity: 0, y: 12 });
        gset(q(".fig-tag"), { opacity: 0 });

        // PLAN 0 → 1
        tl.to(stroke, { drawSVG: "0% 100%", duration: 0.9, stagger: 0.08 }, 0);
        tl.to(cls, { opacity: 1, duration: 0.3 }, 0.1);
        tl.to(q(".cl-h"), { scaleX: 1, duration: 0.8 }, 0.1);
        tl.to(q(".cl-v"), { scaleY: 1, duration: 0.8 }, 0.1);
        tl.to(q(".fig-tag"), { opacity: 1, duration: 0.3 }, 0.6);

        if (isDiagram) {
          const diag = q(`.sd-${d}`)[0] as unknown as SVGElement | undefined;
          if (diag) {
            const dq = gsap.utils.selector(diag);
            gset(dq(".sd-box"), { drawSVG: "0% 0%" });
            gset(dq(".sd-path"), { drawSVG: "0% 0%" });
            gset(dq(".sd-txt"), { opacity: 0 });
            gset(dq(".sd-dot"), { opacity: 0 });
            tl.to(dq(".sd-box"), { drawSVG: "0% 100%", duration: 0.7, stagger: 0.12 }, 0.1);
            tl.to(dq(".sd-txt"), { opacity: 1, duration: 0.3, stagger: 0.1 }, 0.7);
            // BUILD 1 → 2: paths draw, then a dot travels along them
            tl.to(dq(".sd-path"), { drawSVG: "0% 100%", duration: 0.3, stagger: 0.52 }, 1);
            const pts = diag.querySelectorAll<SVGPolylineElement>(".sd-route");
            const route: Array<[number, number]> = [];
            pts.forEach((p) => {
              const [a, b] = (p.getAttribute("data-a") ?? "0,0").split(",").map(Number);
              const [c, e] = (p.getAttribute("data-b") ?? "0,0").split(",").map(Number);
              route.push([a, b], [c, e]);
            });
            if (route.length) {
              gset(dq(".sd-dot"), { attr: { cx: route[0][0], cy: route[0][1] } });
              tl.to(dq(".sd-dot"), { opacity: 1, duration: 0.1 }, 1.1);
              let t0 = 1.15;
              for (let i = 1; i < route.length; i++) {
                const to = route[i];
                const dur = i % 2 === 1 ? 0.3 : 0.22;
                tl.to(dq(".sd-dot"), { attr: { cx: to[0], cy: to[1] }, duration: dur, ease: scrub ? "none" : "power1.inOut" }, t0);
                t0 += dur;
              }
              tl.to(dq(".sd-dot"), { opacity: 0, duration: 0.15 }, t0 + 0.05);
            }
          }
        } else {
          // BUILD 1 → 2
          tl.to(q(".shot-in"), { clipPath: "inset(0 0 0% 0)", duration: 0.9, ease: scrub ? "none" : "power3.inOut" }, 1);
          tl.to(q(".asset-dim"), { opacity: 1, duration: 0.25 }, 1.5);
        }
        tl.to(leads, { scale: 1, duration: 0.4, stagger: 0.1 }, 1.3);
        tl.to(noteTxt, { opacity: 1, y: 0, duration: 0.4, stagger: 0.1 }, 1.45);
        // SHIP 2 → 3
        tl.to(q(".ship"), { opacity: 1, y: 0, duration: 0.6 }, 2.15);
        tl.to(cls, { opacity: 0.45, duration: 0.5 }, 2.2);
        tl.to({}, { duration: 0.2 }, 2.8);
        return tl;
      };
      void 0;

      mm.add("(min-width: 900px)", () => {
        const tl = build(true, true);
        ScrollTrigger.create({
          animation: tl.raw,
          trigger: el,
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: 0.5,
          onUpdate: (self) => setStage(self.progress < 0.34 ? 0 : self.progress < 0.7 ? 1 : 2),
        });
        setStage(0);
      });

      mm.add("(max-width: 899px)", () => {
        const tl = build(false, false);
        tl.timeScale(1.5);
        tl.pause(0);
        setStage(0);
        tl.call(() => setStage(1), [], 1);
        tl.call(() => setStage(2), [], 2.15);
        ScrollTrigger.create({
          trigger: q(".fig")[0],
          start: "top 78%",
          once: true,
          onEnter: () => tl.play(),
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [motion] },
  );

  return (
    <article ref={root} id={id} className={`sheet ${wide ? "is-wide" : isDiagram ? "is-diagram" : "is-portrait"}`} data-stage="2" aria-labelledby={`${id}-t`}>
      <div className="sheet-in">
        <div className="sheet-meta">
          <p className="mono ref-line">
            {ref} <span>/</span> {work.kind.toUpperCase()} <span>/</span> {work.year}
          </p>
          <h3 id={`${id}-t`} className="sheet-title">
            {work.title}
          </h3>
          <p className="sheet-sum">{work.summary}</p>

          <ol className="stages mono" aria-hidden="true">
            <li data-s="0">PLAN</li>
            <li data-s="1">BUILD</li>
            <li data-s="2">SHIP</li>
          </ol>

          <div className="ship">
            <p className="stamp-label mono">{status}</p>
            {work.links.length > 0 && (
              <p className="ship-links mono">
                {work.links.map((l) => (
                  <Ext key={l.href} href={l.href}>
                    {l.label} <span aria-hidden="true">↗</span>
                  </Ext>
                ))}
              </p>
            )}
          </div>
          {work.href && (
            <a className="case-link mono" href={work.href}>
              Case study <span aria-hidden="true">→</span>
            </a>
          )}
        </div>

        {isDiagram ? (
          <div className="fig-box"><figure className="fig fig-d">
            <figcaption className="fig-tag mono">ILLUSTRATION · SYSTEM DIAGRAM</figcaption>
            <SystemDiagram stack={work.stack} />
          </figure></div>
        ) : wide ? (
          <div className="fig-box"><figure className="fig fig-w" style={{ "--r": W / H } as React.CSSProperties}>
            <span className="cl cl-v" style={{ left: "50%", top: 0, height: "100%" }} aria-hidden="true" />
            <div className="dev dev-w" style={{ aspectRatio: `${W} / ${H}` }}>
              <svg className="dev-svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
                <rect className="o" x="1" y="1" width={W - 2} height={H - 2} rx="10" />
                <rect className="o" x="12" y={12 + bar} width={W - 24} height={sh} rx="3" />
                {web && <line className="o" x1="1" y1="40" x2={W - 1} y2="40" />}
                {web && <circle className="o" cx="24" cy="26" r="4" />}
                {web && <circle className="o" cx="40" cy="26" r="4" />}
                {web && <circle className="o" cx="56" cy="26" r="4" />}
              </svg>
              <div
                className="shot"
                style={{ left: `${(12 / W) * 100}%`, top: `${((12 + bar) / H) * 100}%`, width: `${((W - 24) / W) * 100}%`, height: `${(sh / H) * 100}%`, borderRadius: 3 }}
              >
                <div className="shot-in">
                  <Image src={work.images[0]} alt={`${work.title} screenshot`} fill sizes="(max-width: 900px) 92vw, 52vw" />
                </div>
              </div>
            </div>
            {dims && <span className="asset-dim mono">ASSET {dims[0]} × {dims[1]} PX</span>}
            <ul className="notes-b">
              {notes.map((nt) => (
                <li key={nt.k} className="note note-b">
                  <span className="lead lead-v" data-o="50% 100%" aria-hidden="true" />
                  <span className="nt">
                    <b className="mono">{nt.k}</b>
                    {nt.v}
                  </span>
                </li>
              ))}
            </ul>
          </figure></div>
        ) : (
          <div className="fig-box"><figure className="fig fig-p">
            <span className="cl cl-h" style={{ top: 0 }} aria-hidden="true" />
            <span className="cl cl-h" style={{ top: "100%" }} aria-hidden="true" />
            <span className="cl cl-v" style={{ left: "50%", top: "-4%", height: "108%" }} aria-hidden="true" />
            <div className="dev dev-p">
              <svg className="dev-svg" viewBox="0 0 270 560" aria-hidden="true">
                <rect className="o" x="1" y="1" width="268" height="558" rx="42" />
                <rect className="o" x="12" y="12" width="246" height="536" rx="31" />
                <rect className="o" x="95" y="22" width="80" height="20" rx="10" />
              </svg>
              <div className="shot" style={{ left: "4.44%", top: "2.14%", width: "91.1%", height: "95.7%", borderRadius: "11.5% / 5.4%" }}>
                <div className="shot-in">
                  <Image src={work.images[0]} alt={`${work.title} app screenshot`} fill sizes="(max-width: 900px) 56vw, 18vw" />
                </div>
              </div>
            </div>
            {dims && <span className="asset-dim mono">ASSET {dims[0]} × {dims[1]} PX</span>}
            <ul className="notes">
              {notes.map((nt) => (
                <li key={nt.k} className={`note note-${nt.side}`} style={{ top: `${nt.y}%` }}>
                  <span className="nt">
                    <b className="mono">{nt.k}</b>
                    {nt.v}
                  </span>
                  <span className="lead lead-h" data-o={nt.side === "l" ? "0% 50%" : "100% 50%"} aria-hidden="true" />
                </li>
              ))}
            </ul>
          </figure></div>
        )}
      </div>
    </article>
  );
}
