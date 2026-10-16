import { lanes, signal, signalRange, type LaneId } from "@/lib/signal/data";

const DAY = 86400000;
const toDay = (d: string) => Math.round(Date.parse(`${d}T00:00:00Z`) / DAY);

/** One entry per lane, in `lanes` order, with its colour as 0..1 rgb. */
export const laneMeta = lanes.map((l) => {
  const n = parseInt(l.color.slice(1), 16);
  return { id: l.id, rgb: [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255] as [number, number, number] };
});

export const laneIndex = (id: LaneId | null | undefined): number => (id ? lanes.findIndex((l) => l.id === id) : -1);

export const firstDay = signalRange.first ? toDay(signalRange.first) : 0;
export const lastDay = signalRange.last ? toDay(signalRange.last) : firstDay + 1;
export const spanDays = Math.max(1, lastDay - firstDay);
export const firstYear = new Date(firstDay * DAY).getUTCFullYear();
export const lastYear = new Date(lastDay * DAY).getUTCFullYear();

export interface Pt {
  /** index into `lanes` */
  lane: number;
  /** days since the first commit of any lane */
  day: number;
  /** days since the first commit of this lane */
  laneDay: number;
  /** index within that day's stack */
  stack: number;
  seed: number;
}

/** Days a lane spans (at least 1). */
export function laneSpanDays(laneIdx: number): number {
  const l = signal.lanes.find((x) => x.id === lanes[laneIdx]?.id);
  if (!l || l.days.length === 0) return 1;
  return Math.max(1, toDay(l.days[l.days.length - 1].d) - toDay(l.days[0].d));
}

/** Deterministic PRNG so server and client build identical fields. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** One point per commit; with stride 3 every third commit is kept ("1 point = 3 commits"). */
export function buildPoints(stride: number): Pt[] {
  const r = rng(7);
  const out: Pt[] = [];
  lanes.forEach((lane, li) => {
    const src = signal.lanes.find((l) => l.id === lane.id);
    if (!src || src.days.length === 0) return;
    const laneFirst = toDay(src.days[0].d);
    let counter = 0;
    for (const d of src.days) {
      const t = toDay(d.d);
      let stack = 0;
      for (let i = 0; i < d.n; i++) {
        if (counter++ % stride === 0) out.push({ lane: li, day: t - firstDay, laneDay: t - laneFirst, stack: stack++, seed: r() });
      }
    }
  });
  return out;
}
