"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { labFacts, type LabWork } from "@/lab/facts";
import { useMotionEnabled } from "@/lab/useMotionEnabled";
import { DisplayHeading, SectionBar } from "./DisplayHeading";
import { useFinePointer } from "./hooks";
import { gsap, useGSAP } from "./gsap";

const works = labFacts.work as LabWork[];

/** Phone-shaped or wide screenshot in a frame; the Rommer movement-analysis item (no images) gets a red type card labelled as an illustration. */
function Shot({ work, index = 0, sizes }: { work: LabWork; index?: number; sizes: string }) {
  if (work.images.length === 0) return <RommerCard />;
  const src = work.images[index] ?? work.images[0];
  return work.portrait ? (
    <span className="phone block aspect-[9/19.2] w-full">
      <Image src={src} alt="" fill sizes={sizes} className="object-cover" />
    </span>
  ) : (
    <span className="relative block aspect-[1999/838] w-full overflow-hidden border-2 border-[var(--ink)] bg-[var(--ink)]" style={{ aspectRatio: work.slug.includes("seller") ? "2467/1214" : "1999/838" }}>
      <Image src={src} alt="" fill sizes={sizes} className="object-cover object-left-top" />
    </span>
  );
}

export function RommerCard() {
  return (
    <span className="flex aspect-[8/5] w-full flex-col justify-between bg-[var(--red)] p-4 text-[var(--paper)]">
      <span className="label">Illustration</span>
      <span className="disp text-[clamp(26px,2.4vw,40px)]" style={{ lineHeight: 0.95 }}>
        Movement analysis, on device
      </span>
    </span>
  );
}

function CursorPreview({ active }: { active: string | null }) {
  const wrap = useRef<HTMLDivElement>(null);
  const rot = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -999, y: -999, seen: false });

  useGSAP(
    () => {
      const w = wrap.current!;
      const r = rot.current!;
      gsap.set(w.querySelectorAll("[data-slug]"), { xPercent: -50, yPercent: -50, scale: 0.9, opacity: 0 });
      const qx = gsap.quickTo(w, "x", { duration: 0.6, ease: "power3.out" });
      const qy = gsap.quickTo(w, "y", { duration: 0.6, ease: "power3.out" });
      const qr = gsap.quickTo(r, "rotation", { duration: 0.5, ease: "power3.out" });
      let lastX = 0;
      let decay: gsap.core.Tween | null = null;
      const move = (e: PointerEvent) => {
        const p = pos.current;
        if (!p.seen) {
          gsap.set(w, { x: e.clientX, y: e.clientY });
          p.seen = true;
        }
        p.x = e.clientX;
        p.y = e.clientY;
        qx(e.clientX);
        qy(e.clientY);
        qr(gsap.utils.clamp(-10, 10, (e.clientX - lastX) * 0.6));
        lastX = e.clientX;
        decay?.kill();
        decay = gsap.delayedCall(0.08, () => qr(0));
      };
      window.addEventListener("pointermove", move, { passive: true });
      return () => {
        window.removeEventListener("pointermove", move);
        decay?.kill();
      };
    },
    { scope: wrap },
  );

  useEffect(() => {
    const items = wrap.current!.querySelectorAll<HTMLElement>("[data-slug]");
    items.forEach((el) => {
      const on = el.dataset.slug === active;
      gsap.to(el, {
        opacity: on ? 1 : 0,
        scale: on ? 1 : 0.9,
        duration: on ? 0.4 : 0.2,
        ease: on ? "power3.out" : "power2.in",
        overwrite: true,
      });
    });
  }, [active]);

  return (
    <div ref={wrap} aria-hidden className="pointer-events-none fixed top-0 left-0 z-40" style={{ willChange: "transform" }}>
      <div ref={rot}>
        {works.map((w) => (
          <div
            key={w.slug}
            data-slug={w.slug}
            className="absolute"
            style={{
              opacity: 0,
              width: w.images.length === 0 ? 340 : w.portrait ? 200 : 420,
            }}
          >
            <Shot work={w} sizes="420px" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function Work({ onOpen }: { onOpen: (slug: string, trigger: HTMLElement) => void }) {
  const motion = useMotionEnabled();
  const fine = useFinePointer();
  const [hover, setHover] = useState<string | null>(null);
  const list = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      if (!motion) return;
      const rows = gsap.utils.toArray<HTMLElement>(".row-rule", list.current!);
      rows.forEach((r) =>
        gsap.from(r, { scaleX: 0, duration: 1.1, ease: "power3.inOut", scrollTrigger: { trigger: r, start: "top 92%", once: true } }),
      );
    },
    { scope: list, dependencies: [motion], revertOnUpdate: true },
  );

  return (
    <section id="work" aria-labelledby="work-h" className="relative pt-24 pb-24">
      <SectionBar n="03" title="Selected work" right="05 projects" />
      <div className="px-[var(--gut)] pt-6 pb-14">
        <DisplayHeading id="work-h" className="text-[clamp(56px,15vw,260px)]">
          Selected work
        </DisplayHeading>
      </div>

      <ul ref={list} className="rows m-0 list-none p-0" onMouseLeave={() => setHover(null)}>
        {works.map((w, i) => (
          <li key={w.slug} className="px-[var(--gut)]">
            <div className="row-rule rule" />
            <button
              type="button"
              className="row grid12 w-full cursor-pointer items-end gap-y-3 bg-transparent py-5 text-left text-inherit sm:py-7"
              style={{ border: 0, font: "inherit", color: "inherit" }}
              aria-haspopup="dialog"
              onClick={(e) => onOpen(w.slug, e.currentTarget)}
              onMouseEnter={() => fine && motion && setHover(w.slug)}
              onFocus={() => fine && motion && setHover(w.slug)}
              onBlur={() => setHover(null)}
            >
              <span className="label col-span-2 self-start pt-3 md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
              <span data-skew className={`disp col-span-12 -order-1 md:order-none md:col-span-8 ${w.title.length > 16 ? "text-[clamp(30px,5.6vw,104px)]" : "text-[clamp(34px,9vw,170px)]"}`} style={{ lineHeight: 0.95 }}>
                <span className={`row-title ${w.title.length > 16 ? "whitespace-normal" : ""}`} data-flip-id={`t-${w.slug}`}>
                  {w.title}
                </span>
              </span>
              <span className="label col-span-10 flex flex-col gap-1 md:col-span-3 md:col-start-10 md:items-end md:text-right">
                <span>
                  {w.kind} · {w.year}
                </span>
                <span className="normal-case tracking-normal opacity-80">{w.stack.slice(0, 4).join(", ")}</span>
              </span>
              <span className="row-inline col-span-12 pt-2">
                <span className={`flex gap-3 ${w.portrait && w.images.length ? "w-[min(62%,240px)]" : w.images.length ? "w-full max-w-[460px]" : "w-full max-w-[360px]"}`}>
                  {w.images.length === 0 ? (
                    <RommerCard />
                  ) : (
                    w.images.slice(0, w.portrait ? 2 : 1).map((_, k) => <Shot key={k} work={w} index={k} sizes="240px" />)
                  )}
                </span>
              </span>
            </button>
          </li>
        ))}
        <li className="px-[var(--gut)]">
          <div className="row-rule rule" />
        </li>
      </ul>

      {fine && motion ? <CursorPreview active={hover} /> : null}
    </section>
  );
}
