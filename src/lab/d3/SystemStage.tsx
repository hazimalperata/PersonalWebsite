"use client";

import { useRef } from "react";
import { labFacts } from "@/lab/facts";
import { useMotionEnabled } from "@/lab/useMotionEnabled";
import { ScrollTrigger, useGSAP } from "./gsap";

const pad = (i: number) => String(i + 1).padStart(2, "0");

/** The system built around the assistant: a terminal on a dark stage, typed by scroll (sticky, scrubbed). */
export function SystemStage() {
  const motion = useMotionEnabled();
  const sys = labFacts.ai.system;
  const sec = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = sec.current;
      if (!motion || !root) return;
      const names = Array.from(root.querySelectorAll<HTMLElement>(".d3-sys-name"));
      const out = root.querySelector<HTMLElement>(".d3-sys-text");
      const cmd = root.querySelector<HTMLElement>(".d3-sys-cmd");
      const bar = root.querySelector<HTMLElement>(".d3-sys-bar");
      const n = sys.parts.length;
      let shown = -1;
      let chars = -1;
      const setPart = (i: number) => {
        names.forEach((el, k) => el.classList.toggle("is-on", k === i));
        if (cmd) cmd.textContent = `$ system --part ${pad(i)} --name "${sys.parts[i].name}"`;
      };
      setPart(0);
      if (out) out.textContent = "";
      const st = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const p = Math.min(0.9999, self.progress);
          const i = Math.floor(p * n);
          const local = p * n - i;
          if (i !== shown) {
            shown = i;
            chars = -1;
            setPart(i);
          }
          const text = sys.parts[i].line;
          const c = Math.round(text.length * Math.min(1, local / 0.7));
          if (c !== chars && out) {
            chars = c;
            out.textContent = text.slice(0, c);
          }
          if (bar) bar.style.transform = `scaleX(${self.progress.toFixed(4)})`;
        },
      });
      return () => {
        st.kill();
        if (out) out.textContent = sys.parts[0].line;
      };
    },
    { scope: sec, dependencies: [motion] },
  );

  if (!motion) {
    return (
      <section data-section="The system" className="d3-sec d3-sys-static">
        <h3 className="d3-display d3-sys-h">{sys.title}</h3>
        <p className="d3-sys-intro">{sys.intro}</p>
        <ul className="d3-sys-grid">
          {sys.parts.map((p, i) => (
            <li key={p.name} className="d3-cap">
              <p className="d3-mono d3-cap-n">{pad(i)}</p>
              <h4 className="d3-display d3-cap-title">{p.name}</h4>
              <p className="d3-pl-line">{p.line}</p>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section ref={sec} data-section="The system" className="d3-sys">
      <div className="d3-sys-sticky">
        <div>
          <h3 className="d3-display d3-sys-h">{sys.title}</h3>
          <p className="d3-sys-intro">{sys.intro}</p>
        </div>
        <div className="d3-sys-body">
          <ol className="d3-sys-names" aria-hidden>
            {sys.parts.map((p, i) => (
              <li key={p.name} className="d3-sys-name">
                <span className="d3-mono">{pad(i)}</span>
                <span>{p.name}</span>
              </li>
            ))}
          </ol>
          <div className="d3-sys-term" aria-hidden>
            <div className="d3-sys-dots">
              <i />
              <i />
              <i />
              <span className="d3-mono">claude code</span>
            </div>
            <p className="d3-mono d3-sys-cmd" />
            <p className="d3-sys-text">{sys.parts[0].line}</p>
            <span className="d3-sys-caret" />
            <span className="d3-sys-bar" />
          </div>
        </div>
        <ul className="d3-sr">
          {sys.parts.map((p) => (
            <li key={p.name}>
              {p.name}: {p.line}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
