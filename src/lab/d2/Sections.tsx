"use client";

import Link from "next/link";
import { useRef } from "react";
import { labFacts } from "@/lab/facts";
import { useMotionEnabled } from "@/lab/useMotionEnabled";
import { DisplayHeading, SectionBar } from "./DisplayHeading";
import { gsap, useGSAP } from "./gsap";

/** Rules draw in (scaleX 0 -> 1) as they enter; nothing is hidden before JS under reduced motion. */
function useDrawRules(scope: React.RefObject<HTMLElement | null>, motion: boolean) {
  useGSAP(
    () => {
      if (!motion) return;
      gsap.utils.toArray<HTMLElement>(".draw", scope.current!).forEach((r) =>
        gsap.from(r, { scaleX: 0, duration: 1.1, ease: "power3.inOut", scrollTrigger: { trigger: r, start: "top 92%", once: true } }),
      );
    },
    { scope, dependencies: [motion], revertOnUpdate: true },
  );
}

export function MoreWork() {
  const root = useRef<HTMLElement>(null);
  const motion = useMotionEnabled();
  useDrawRules(root, motion);
  return (
    <section ref={root} id="more" aria-labelledby="more-h" className="pt-10 pb-24">
      <SectionBar n="04" title="More work" />
      <div className="px-[var(--gut)] pt-2">
        <h2 id="more-h" className="sr">
          More work
        </h2>
        <ol className="m-0 list-none p-0">
          {labFacts.more.map((m, i) => (
            <li key={m.href}>
              <div className="draw rule" />
              <Link href={m.href} className="group grid12 items-baseline gap-y-1 py-4 sm:py-5">
                <span className="label col-span-2 md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
                <span data-skew className="disp col-span-10 text-[clamp(30px,6vw,110px)] md:col-span-7" style={{ lineHeight: 1 }}>
                  <span className="ul">{m.title}</span>
                </span>
                <span className="col-span-10 col-start-3 text-[0.9em] opacity-80 md:col-span-4 md:col-start-9">{m.line}</span>
              </Link>
            </li>
          ))}
          <li>
            <div className="draw rule" />
          </li>
        </ol>
      </div>
    </section>
  );
}

export function Capabilities() {
  const root = useRef<HTMLElement>(null);
  const motion = useMotionEnabled();
  useDrawRules(root, motion);
  return (
    <section ref={root} id="capabilities" aria-labelledby="cap-h" className="cols relative pt-24 pb-28">
      <SectionBar n="05" title="Capabilities" />
      <div className="px-[var(--gut)] pt-6 pb-14">
        <DisplayHeading id="cap-h" className="text-[clamp(56px,15vw,260px)]">
          What I build with
        </DisplayHeading>
      </div>
      <div className="grid grid-cols-1 gap-x-[var(--gut)] gap-y-12 px-[var(--gut)] sm:grid-cols-2 lg:grid-cols-4">
        {labFacts.capabilities.map((c, i) => (
          <div key={c.title}>
            <div className="draw rule" />
            <p className="label pt-3">{String(i + 1).padStart(2, "0")}</p>
            <h3 data-skew className="disp mt-2 text-[clamp(40px,5vw,84px)]" style={{ lineHeight: 0.95 }}>
              {c.title}
            </h3>
            <ul className="m-0 mt-6 list-none p-0 font-medium">
              {c.items.map((it) => (
                <li key={it} className="flex items-baseline gap-3 py-1">
                  <span aria-hidden className="mt-[0.1em] inline-block h-[0.5em] w-[0.5em] shrink-0 bg-[var(--red)]" />
                  {it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Experience() {
  const root = useRef<HTMLElement>(null);
  const motion = useMotionEnabled();
  useDrawRules(root, motion);
  return (
    <section ref={root} id="experience" aria-labelledby="exp-h" className="pt-24 pb-28">
      <SectionBar n="06" title="Experience" />
      <div className="px-[var(--gut)] pt-6 pb-14">
        <DisplayHeading id="exp-h" className="text-[clamp(56px,15vw,260px)]">
          Experience
        </DisplayHeading>
      </div>
      <ol className="m-0 list-none px-[var(--gut)] p-0">
        {labFacts.experience.map((e) => (
          <li key={e.company + e.from}>
            <div className="draw rule" />
            <div className="grid12 gap-y-3 py-6 sm:py-8">
              <p data-skew className="disp col-span-12 text-[clamp(44px,8vw,140px)] md:col-span-5" style={{ lineHeight: 0.9 }}>
                {e.from === e.to ? e.from : `${e.from}–${e.to === "present" ? "Now" : e.to}`}
              </p>
              <div className="col-span-12 md:col-span-6 md:col-start-7">
                <h3 className="disp m-0 text-[clamp(28px,3vw,52px)]" style={{ lineHeight: 1 }}>
                  {e.company}
                </h3>
                <p className="label mt-2">{e.role}</p>
                <p className="mt-4 max-w-[46ch]">{e.line}</p>
              </div>
            </div>
          </li>
        ))}
        <li>
          <div className="draw rule" />
        </li>
      </ol>
    </section>
  );
}
