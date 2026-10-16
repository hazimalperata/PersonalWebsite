"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { labFacts, type LabWork } from "@/lab/facts";
import { useMotionEnabled } from "@/lab/useMotionEnabled";
import { ExtLink } from "./DisplayHeading";
import { Flip, gsap } from "./gsap";

const works = labFacts.work as LabWork[];

const STEPS = ["Phone camera", "Pose analysis, on the device", "Backend: NestJS, PostgreSQL", "Staff panel: Next.js"];

/** Rommer has no screenshots that may be shown, so the detail uses an explicit system illustration. */
function RommerDiagram() {
  return (
    <figure className="m-0">
      <figcaption className="label mb-3">Illustration: how the system fits together</figcaption>
      <ol className="m-0 grid list-none gap-0 p-0 sm:grid-cols-2">
        {STEPS.map((s, i) => (
          <li
            key={s}
            className="flex min-h-[110px] flex-col justify-between border border-[var(--ink)] p-4 -mt-px -ml-px"
            style={i === 1 ? { background: "var(--red)", color: "var(--paper)" } : undefined}
          >
            <span className="label">{String(i + 1).padStart(2, "0")}</span>
            <span className="disp text-[clamp(22px,2vw,32px)]" style={{ lineHeight: 1 }}>
              {s}
            </span>
          </li>
        ))}
      </ol>
    </figure>
  );
}

export function WorkOverlay({ slug, onClose }: { slug: string; onClose: () => void }) {
  const work = works.find((w) => w.slug === slug)!;
  const root = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const motion = useMotionEnabled();
  const closing = useRef(false);

  const rowTitle = () => document.querySelector<HTMLElement>(`.row-title[data-flip-id="t-${slug}"]`);

  // Open: the overlay title starts exactly on top of the row title (Flip.fit) and travels to its place.
  useEffect(() => {
    const el = root.current!;
    const t = title.current!;
    const content = el.querySelectorAll<HTMLElement>("[data-reveal]");
    closeBtn.current?.focus();
    const row = rowTitle();
    if (!motion || !row) return;
    const tl = gsap.timeline();
    gsap.set(el, { opacity: 0 });
    gsap.set(content, { opacity: 0, y: 24 });
    Flip.fit(t, row, { scale: true });
    tl.to(el, { opacity: 1, duration: 0.3, ease: "power1.out" }, 0);
    tl.to(t, { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 0.85, ease: "power4.inOut" }, 0);
    tl.to(content, { opacity: 1, y: 0, duration: 0.7, stagger: 0.07, ease: "power3.out" }, 0.45);
    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = () => {
    if (closing.current) return;
    closing.current = true;
    const row = rowTitle();
    const el = root.current!;
    if (!motion || !row) return onClose();
    const content = el.querySelectorAll<HTMLElement>("[data-reveal]");
    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(content, { opacity: 0, duration: 0.2, ease: "power1.in" }, 0);
    tl.add(Flip.fit(title.current!, row, { scale: true, duration: 0.6, ease: "power3.inOut" }) as gsap.core.Tween, 0.05);
    tl.to(el, { opacity: 0, duration: 0.25, ease: "power1.in" }, 0.4);
  };

  // Esc closes; Tab stays inside the dialog.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "Tab") {
        const f = root.current!.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const facts: Array<[string, string]> = [
    ["Role", work.role],
    ["Stack", work.stack.join(", ")],
    ["Platforms", work.platforms.join(", ")],
    ["Year", work.year],
  ];

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-labelledby="work-dialog-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-[var(--paper)] text-[var(--ink)]"
    >
      <div className="px-[var(--gut)] pt-5 pb-16">
        <div className="flex items-center justify-between">
          <span className="label">
            {work.kind} · {work.year}
          </span>
          <button
            ref={closeBtn}
            type="button"
            onClick={close}
            className="label cursor-pointer border border-[var(--ink)] bg-transparent px-4 py-2 text-inherit hover:bg-[var(--ink)] hover:text-[var(--paper)]"
            style={{ font: "inherit", letterSpacing: "0.08em", textTransform: "uppercase" }}
          >
            Close <span aria-hidden>✕</span>
          </button>
        </div>
        <div className="rule mt-4" />

        <h2
          id="work-dialog-title"
          ref={title}
          data-flip-id={`t-${slug}`}
          className={`disp mt-6 inline-block ${work.title.length > 16 ? "max-w-[min(100%,62vw)] text-[clamp(30px,5.6vw,104px)]" : "whitespace-nowrap text-[clamp(40px,9vw,170px)]"}`}
          style={{ lineHeight: 0.95 }}
        >
          {work.title}
        </h2>

        <div className="grid12 mt-10 gap-y-10">
          <div className="col-span-12 md:col-span-6">
            <p data-reveal className="m-0 text-[clamp(20px,2vw,30px)] leading-[1.3] font-medium">
              {work.summary}
            </p>
            <dl data-reveal className="mt-8 mb-0">
              {facts.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[7.5rem_1fr] gap-4 border-t border-[var(--ink)] py-3">
                  <dt className="label pt-1">{k}</dt>
                  <dd className="m-0">{v}</dd>
                </div>
              ))}
            </dl>
            <div data-reveal className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              {work.href ? (
                <Link
                  href={work.href}
                  className="disp inline-block bg-[var(--ink)] px-6 py-4 text-[clamp(18px,1.6vw,26px)] text-[var(--paper)] hover:bg-[var(--red)]"
                  style={{ lineHeight: 1 }}
                >
                  Read the case study →
                </Link>
              ) : null}
              {work.links.map((l) => (
                <ExtLink key={l.href} href={l.href} className="ul font-semibold">
                  {l.label} ↗
                </ExtLink>
              ))}
            </div>
          </div>

          <div data-reveal className="col-span-12 md:col-span-5 md:col-start-8">
            {work.images.length === 0 ? (
              <RommerDiagram />
            ) : work.portrait ? (
              <div className="flex gap-4">
                {work.images.slice(0, 3).map((src) => (
                  <span key={src} className="phone block aspect-[9/19.2] min-w-0 flex-1">
                    <Image src={src} alt={`${work.title} screenshot`} fill sizes="(max-width:768px) 30vw, 14vw" className="object-cover" />
                  </span>
                ))}
              </div>
            ) : (
              <span
                className="relative block w-full overflow-hidden border-2 border-[var(--ink)]"
                style={{ aspectRatio: work.slug.includes("seller") ? "2467/1214" : "1999/838" }}
              >
                <Image src={work.images[0]} alt={`${work.title} screenshot`} fill sizes="(max-width:768px) 90vw, 40vw" className="object-cover" />
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
