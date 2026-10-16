"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { labFacts } from "@/lab/facts";
import { useMotionEnabled } from "@/lab/useMotionEnabled";
import { gsap, ScrollTrigger } from "./gsapSetup";
import { SECTIONS } from "./sectionList";
import { CommandPalette } from "./CommandPalette";

/**
 * The drawing sheet: border frame, grid, header (CSS scroll-driven), title block, crosshair, palette.
 * Also sets data-motion on the page root and tracks which sheet is current.
 */
export function Chrome() {
  const motion = useMotionEnabled();
  const head = useRef<HTMLElement>(null);
  const cross = useRef<HTMLDivElement>(null);
  const readout = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState("");
  const mac = useSyncExternalStore(
    () => () => {},
    () => /Mac|iPhone|iPad/.test(navigator.platform),
    () => true,
  );

  const rootEl = () => head.current?.closest<HTMLElement>(".d1") ?? null;

  useLayoutEffect(() => {
    const r = rootEl();
    if (r) r.dataset.motion = motion ? "1" : "0";
  }, [motion]);

  // Current sheet.
  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(els.indexOf(e.target as HTMLElement));
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const r = rootEl();
    if (r) r.dataset.sheet = String(active + 1);
  }, [active]);

  // Fallback for the progress hairline where CSS scroll timelines are unsupported.
  useEffect(() => {
    if (!motion || CSS.supports("animation-timeline: scroll()")) return;
    const bar = head.current?.querySelector(".hdr-progress");
    if (!bar) return;
    gsap.set(bar, { scaleX: 0, transformOrigin: "0 50%" });
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (s) => gsap.set(bar, { scaleX: s.progress }),
    });
    return () => st.kill();
  }, [motion]);

  // Fonts change line breaks and heights: refresh pin positions once they settle.
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);

  // Keyboard shortcut.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Crosshair and coordinate readout (fine pointers only; the native cursor stays).
  useEffect(() => {
    if (!motion || !window.matchMedia("(pointer: fine)").matches) return;
    const c = cross.current;
    const ro = readout.current;
    if (!c || !ro) return;
    const qx = gsap.quickTo(c, "x", { duration: 0.18, ease: "power3.out" });
    const qy = gsap.quickTo(c, "y", { duration: 0.18, ease: "power3.out" });
    let raf = 0;
    let px = 0;
    let py = 0;
    const onMove = (e: PointerEvent) => {
      qx(e.clientX);
      qy(e.clientY);
      px = e.clientX;
      py = e.clientY;
      c.dataset.on = "1";
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0;
          ro.textContent = `x ${String(Math.round(px)).padStart(4, "0")} · y ${String(Math.round(py)).padStart(4, "0")}`;
        });
    };
    const onOut = () => {
      c.dataset.on = "0";
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onOut);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onOut);
      cancelAnimationFrame(raf);
    };
  }, [motion]);

  const showToast = useCallback((m: string) => {
    setToast(m);
    window.setTimeout(() => setToast(""), 1800);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  const jump = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: motion ? "smooth" : "auto", block: "start" });
  };

  return (
    <>
      <div className="d1-grid" aria-hidden="true" />
      <div className="d1-frame" aria-hidden="true" />

      <header ref={head} className="hdr">
        <div className="hdr-bg" aria-hidden="true" />
        <div className="hdr-in">
          <a href="#hero" className="brand mono" onClick={jump("hero")}>
            <span className="brand-mark" aria-hidden="true" />
            H.A.ATA
          </a>
          <nav className="hdr-nav" aria-label="Sections">
            <ol>
              {SECTIONS.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="mono" aria-current={active === i ? "true" : undefined} onClick={jump(s.id)}>
                    <span>{s.ref}</span> {s.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <button type="button" className="kbd mono" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-label="Open command palette">
            <span className="kbd-d">{mac ? "⌘K" : "Ctrl K"}</span>
            <span className="kbd-m">Menu</span>
          </button>
        </div>
        <span className="hdr-progress" aria-hidden="true" />
      </header>

      <aside className="tb" aria-label="Drawing title block">
        <dl>
          <div>
            <dt className="mono">NAME</dt>
            <dd>{labFacts.name}</dd>
          </div>
          <div className="tb-x">
            <dt className="mono">ROLE</dt>
            <dd>{labFacts.role}</dd>
          </div>
          <div className="tb-x">
            <dt className="mono">LOCATION</dt>
            <dd>{labFacts.location}</dd>
          </div>
          <div className="tb-sheet">
            <dt className="mono">SHEET</dt>
            <dd className="mono">
              <b>{active + 1}</b> OF {SECTIONS.length}<span className="tb-sec"> · {SECTIONS[active].ref}</span>
            </dd>
          </div>
        </dl>
      </aside>

      <div ref={cross} className="cross" aria-hidden="true" data-on="0">
        <span className="cross-h" />
        <span className="cross-v" />
        <span ref={readout} className="cross-ro mono">
          x 0000 · y 0000
        </span>
      </div>

      <CommandPalette open={open} onClose={close} onToast={showToast} smooth={motion} />
      <div className="toast mono" role="status" aria-live="polite" data-show={toast ? "1" : "0"}>
        {toast}
      </div>
    </>
  );
}
