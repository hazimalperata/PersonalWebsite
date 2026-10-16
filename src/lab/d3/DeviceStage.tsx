"use client";

/* eslint-disable react-hooks/immutability -- the scroll progress is a mutable value shared with the render loop on purpose */

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { labFacts, type LabWork } from "@/lab/facts";
import { useMotionEnabled } from "@/lab/useMotionEnabled";
import { useCoarsePointer } from "./hooks";
import { clamp01, damp, gsap, ScrollTrigger, smooth, useGSAP } from "./gsap";
import { getPose, POSE_BONES, type JointName } from "./pose";
import type { StageProgress } from "./DeviceScene";

const DeviceScene = dynamic(() => import("./DeviceScene"), { ssr: false });

const works = labFacts.work;
const [dremly, posme, , likteMobile, likteSeller] = works;

/** Scroll ranges (0..1 of the pinned section) where each text panel is the active one. */
const RANGES: Array<[number, number]> = [
  [0, 0.22],
  [0.22, 0.44],
  [0.44, 0.66],
  [0.66, 0.78],
  [0.78, 0.88],
];
/** Rail steps: the two 1likte products share step 4. */
const RAIL: Array<[number, number]> = [
  [0, 0.22],
  [0.22, 0.44],
  [0.44, 0.66],
  [0.66, 0.88],
];
const RAIL_OF = [0, 1, 2, 3, 3];

function WorkText({ w, headingLevel = "h3" }: { w: LabWork; headingLevel?: "h3" }) {
  const H = headingLevel;
  return (
    <>
      <p className="d3-mono d3-w-kind">
        {w.kind} · {w.year} · {w.platforms.join(" / ")}
      </p>
      <H className="d3-display d3-w-title">{w.title}</H>
      <p className="d3-w-sum">{w.summary}</p>
      <p className="d3-w-role">{w.role}</p>
      <ul className="d3-chips" aria-label={`${w.title} stack`}>
        {w.stack.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <div className="d3-w-links">
        {w.links.map((l) => (
          <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="d3-link">
            {l.label} <span aria-hidden>↗</span>
            <span className="d3-sr"> (opens in a new tab)</span>
          </a>
        ))}
        {w.href ? (
          <Link href={w.href} className="d3-link d3-link-quiet">
            Case study <span aria-hidden>→</span>
          </Link>
        ) : null}
      </div>
    </>
  );
}

/* ---------------------------------------------------------------- Theatre */

function Theatre() {
  const coarse = useCoarsePointer();
  const section = useRef<HTMLElement>(null);
  const sticky = useRef<HTMLDivElement>(null);
  const [progress] = useState<StageProgress>(() => ({ current: { target: 0, value: 0 } }));
  const invalidateRef = useRef<(() => void) | null>(null);
  const visible = useRef(false);
  const [near, setNear] = useState(false);

  const imageUrls = useMemo(
    () => ({
      dremly: dremly.images,
      posme: posme.images.slice(0, 2),
      mobile: likteMobile.images[0],
      seller: likteSeller.images[0],
    }),
    [],
  );
  const onReady = useCallback((inv: () => void) => {
    invalidateRef.current = inv;
  }, []);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setNear(true);
    }, { rootMargin: "100% 0px 100% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      const root = sticky.current;
      const sec = section.current;
      if (!root || !sec) return;
      const panels = Array.from(root.querySelectorAll<HTMLElement>(".d3-panel"));
      const fills = Array.from(root.querySelectorAll<HTMLElement>(".d3-rail-fill"));
      const count = root.querySelector<HTMLElement>(".d3-rail-count");
      const canvasWrap = root.querySelector<HTMLElement>(".d3-stage-canvas");
      const rail = root.querySelector<HTMLElement>(".d3-rail");
      let shown = -1;

      const st = ScrollTrigger.create({
        trigger: sec,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          progress.current.target = self.progress;
        },
        onToggle: (self) => {
          visible.current = self.isActive || (self.progress > 0 && self.progress < 1);
        },
      });
      const vis = ScrollTrigger.create({
        trigger: sec,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => {
          visible.current = self.isActive;
        },
      });
      progress.current.target = st.progress;
      progress.current.value = st.progress;

      const apply = (p: number) => {
        let best = 0;
        let bestO = -1;
        panels.forEach((el, i) => {
          const [a, b] = RANGES[i];
          // exit finishes at the boundary, entrance starts there: no ghosting between titles
          const fin = i === 0 ? 1 : smooth(clamp01((p - a) / 0.024));
          const fout = smooth(clamp01((p - (b - 0.024)) / 0.024));
          const o = fin * (1 - fout);
          if (o > bestO) {
            bestO = o;
            best = i;
          }
          el.style.opacity = o.toFixed(3);
          el.style.visibility = o < 0.02 ? "hidden" : "visible";
          const y = (1 - fin) * 26 - fout * 14;
          el.style.transform = `translate3d(0,${y.toFixed(2)}px,0)`;
          el.style.filter = o > 0.98 ? "" : `blur(${((1 - o) * 7).toFixed(1)}px)`;
        });
        fills.forEach((f, i) => {
          const [a, b] = RAIL[i];
          f.style.transform = `scaleX(${clamp01((p - a) / (b - a)).toFixed(3)})`;
        });
        const step = RAIL_OF[best];
        if (count && shown !== step) {
          shown = step;
          count.textContent = `${String(step + 1).padStart(2, "0")} / 04`;
        }
        if (rail) rail.style.opacity = String(1 - smooth(clamp01((p - 0.85) / 0.03)));
        if (canvasWrap) canvasWrap.style.opacity = String(1 - smooth(clamp01((p - 0.985) / 0.015)));
      };
      apply(progress.current.value);

      const tick = (_: number, deltaMs: number) => {
        const dt = Math.min(deltaMs / 1000, 0.05);
        const pr = progress.current;
        if (Math.abs(pr.target - pr.value) > 0.00005) pr.value = damp(pr.value, pr.target, 9, dt);
        else pr.value = pr.target;
        apply(pr.value);
        if (visible.current) invalidateRef.current?.();
      };
      gsap.ticker.add(tick);
      // layout switched from the static list to the pinned stage: re-measure every trigger
      const refresh = requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => {
        cancelAnimationFrame(refresh);
        gsap.ticker.remove(tick);
        st.kill();
        vis.kill();
      };
    },
    { scope: sticky },
  );

  return (
    <section ref={section} id="work" data-section="Selected work" className="d3-stage">
      <div ref={sticky} className="d3-stage-sticky">
        <div className="d3-stage-glow" aria-hidden />
        <div className="d3-stage-canvas" aria-hidden>
          {near ? (
            <DeviceScene
              progress={progress}
              coarse={coarse}
              onReady={onReady}
              imageUrls={imageUrls}
            />
          ) : null}
        </div>

        <div className="d3-stage-text">
          <h2 className="d3-mono d3-sec-label">Selected work</h2>
          <div className="d3-panels">
            {works.map((w) => (
              <article key={w.slug} className="d3-panel">
                <WorkText w={w} />
                {w.slug === "rommer" ? (
                  <p className="d3-mono d3-w-note">Illustration · on-device pose analysis. No screenshots shown.</p>
                ) : null}
              </article>
            ))}
          </div>
          <div className="d3-rail" aria-hidden>
            <span className="d3-mono d3-rail-count">01 / 04</span>
            <span className="d3-rail-bars">
              {RAIL.map((r) => (
                <span key={r[0]} className="d3-rail-bar">
                  <span className="d3-rail-fill" />
                </span>
              ))}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- Static */

function PoseSvg() {
  const pose = getPose(1.9);
  return (
    <svg viewBox="0 0 200 400" role="img" aria-label="Illustration of a pose skeleton" className="d3-pose-svg">
      <rect width="200" height="400" fill="#101015" />
      <g stroke="#EDE9E3" strokeWidth="3" strokeLinecap="round" fill="none">
        {POSE_BONES.map(([a, b]) => (
          <line key={`${a}${b}`} x1={pose[a].x} y1={pose[a].y} x2={pose[b].x} y2={pose[b].y} />
        ))}
        <circle cx={pose.head.x} cy={pose.head.y} r="15" />
      </g>
      {(Object.keys(pose) as JointName[])
        .filter((k) => k !== "head")
        .map((k) => (
          <circle key={k} cx={pose[k].x} cy={pose[k].y} r="4.6" fill="#cdd6ff" />
        ))}
    </svg>
  );
}

function StaticWork() {
  return (
    <section id="work" data-section="Selected work" className="d3-sec d3-static">
      <h2 className="d3-mono d3-sec-label">Selected work</h2>
      {works.map((w) => (
        <article key={w.slug} className="d3-static-item">
          <div className="d3-static-text">
            <WorkText w={w} />
          </div>
          <div className={`d3-static-media${w.portrait ? " is-portrait" : ""}`}>
            {w.slug === "rommer" ? (
              <figure className="d3-static-fig">
                <PoseSvg />
                <figcaption className="d3-mono">Illustration · on-device pose analysis</figcaption>
              </figure>
            ) : (
              w.images.map((src) => (
                <Image
                  key={src}
                  src={src}
                  alt={`${w.title} screenshot`}
                  width={w.portrait ? 330 : 1000}
                  height={w.portrait ? 717 : 420}
                  sizes={w.portrait ? "(max-width: 768px) 40vw, 240px" : "(max-width: 768px) 90vw, 560px"}
                  className="d3-static-img"
                />
              ))
            )}
          </div>
        </article>
      ))}
    </section>
  );
}

export function DeviceStage() {
  const motion = useMotionEnabled();
  return motion ? <Theatre /> : <StaticWork />;
}
