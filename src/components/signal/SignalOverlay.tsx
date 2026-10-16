"use client";

import { useLocale } from "next-intl";
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { lanes } from "@/lib/signal/data";
import { firstDay, firstYear, lastYear } from "./points";
import css from "./signal.module.css";
import { dayX, getLayout } from "./states";
import { signalStore } from "./store";
import { useSignalText } from "./useSignalText";

/** Measures an element and keeps measuring it. */
export function useBox<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => setBox({ w: el.clientWidth, h: el.clientHeight });
    read();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, box] as const;
}

const DAY = 86400000;

/** Lane labels and year ticks, aligned to the same chart layout the points use. */
export function TimelineLabels({ w, h, mobile, showRatio }: { w: number; h: number; mobile: boolean; showRatio?: boolean }) {
  const locale = useLocale() === "tr" ? "tr" : "en";
  const t = useSignalText();
  const L = getLayout(w, h, mobile);
  const { chart } = L;
  const years: number[] = [];
  for (let y = firstYear + 1; y <= lastYear; y++) years.push(y);
  return (
    <>
      {years.map((y) => {
        const day = Math.round(Date.UTC(y, 0, 1) / DAY) - firstDay;
        const x = day < 0 ? chart.x0 : dayX(L, day);
        return (
          <div key={y}>
            <div className={css.tick} style={{ left: x, top: chart.top - 6, height: chart.bottom - chart.top + 10 }} />
            <div className={css.year} style={{ left: Math.max(x, 14), top: chart.bottom + 8 }}>
              {y}
            </div>
          </div>
        );
      })}
      {lanes.map((lane, i) => {
        const base = chart.top + (i + 1) * chart.laneH - 3;
        return mobile ? (
          <div key={lane.id} className={css.label} style={{ left: chart.x0, top: chart.top + i * chart.laneH + 1, fontSize: 10 }}>
            <i style={{ background: lane.color }} />
            {lane.name[locale]}
          </div>
        ) : (
          <div key={lane.id} className={`${css.label} ${css.labelLeft}`} style={{ left: chart.x0 - 16, top: base + 2 }}>
            {lane.name[locale]}
            <i style={{ background: lane.color }} />
          </div>
        );
      })}
      {showRatio && (
        <div className={css.note} style={{ top: chart.bottom + 30 }}>
          {t("pointRatio")}
        </div>
      )}
    </>
  );
}

/**
 * Decorative labels over the field: the home timeline's lane names and years, a case page's date axis, and the
 * "Illustration" tag under the pose skeleton. The engine fades each layer through the CSS variables `--tl`,
 * `--axis` and `--illus` set on this element. `fixed` pins them to 1 for the static fallback.
 */
export function SignalOverlay({ coarse, fixed }: { coarse: boolean; fixed?: boolean }) {
  const [ref, box] = useBox<HTMLDivElement>();
  const snap = useSyncExternalStore(signalStore.subscribe, signalStore.get, signalStore.get);
  const locale = useLocale() === "tr" ? "tr" : "en";
  const t = useSignalText();
  const mobile = coarse || (!!box && box.w < 720);
  const scene = snap.scene;
  const isHome = scene.kind === "home";
  const style = (fixed
    ? { "--tl": isHome ? 1 : 0, "--axis": snap.axis ? 1 : 0, "--illus": 0 }
    : { "--tl": 0, "--axis": 0, "--illus": 0 }) as CSSProperties;
  const fmt = (iso: string) =>
    new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en-US", { month: "short", year: "numeric", timeZone: "UTC" }).format(
      new Date(`${iso}T00:00:00Z`),
    );
  const illus = snap.illus;
  return (
    <div ref={ref} className={css.overlay} data-signal-overlay aria-hidden="true" style={style}>
      {box && (
        <>
          <div className={css.layer} style={{ opacity: "var(--tl)" }}>
            {isHome && <TimelineLabels w={box.w} h={box.h} mobile={mobile} showRatio={coarse} />}
          </div>
          <div className={css.layer} style={{ opacity: "var(--axis)" }}>
            {snap.axis && (
              <>
                <div className={css.axisLine} style={{ left: snap.axis.x0, top: snap.axis.y, width: snap.axis.x1 - snap.axis.x0 }} />
                <div className={css.axisEnd} style={{ left: snap.axis.x0, top: snap.axis.y + 6 }}>
                  {fmt(snap.axis.from)}
                </div>
                <div className={css.axisEnd} style={{ left: snap.axis.x1, top: snap.axis.y + 6, transform: "translateX(-100%)" }}>
                  {fmt(snap.axis.to)}
                </div>
              </>
            )}
          </div>
          <div className={css.layer} style={{ opacity: "var(--illus)" }}>
            {illus && (
              <div className={css.illustration} style={{ left: illus.left, top: illus.top }}>
                {t("illustration")}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
