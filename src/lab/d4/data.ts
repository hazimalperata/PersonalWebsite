import signal from "./signal.json";

export interface ProjectMeta {
  name: string;
  color: string;
  rgb: [number, number, number];
  /** index into labFacts.work for the selected-work states, or -1 */
  work: number;
}

/** Lane order is chronological by first commit (top to bottom). */
const META: Array<{ name: string; color: string; work: number }> = [
  { name: "1likte Seller Panel", color: "#3E8BFF", work: 4 },
  { name: "1likte Admin Panel", color: "#7FB2FF", work: -1 },
  { name: "1likte Landing", color: "#A8D8FF", work: -1 },
  { name: "This site", color: "#E8EAF0", work: -1 },
  { name: "1likte Mobile", color: "#5CC8FF", work: 3 },
  { name: "Posme", color: "#FFB86B", work: 1 },
  { name: "Dremly", color: "#9B8CFF", work: 0 },
  { name: "Rommer", color: "#6EE7B7", work: 2 },
];

function hex(c: string): [number, number, number] {
  const n = parseInt(c.slice(1), 16);
  return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export const projects: ProjectMeta[] = META.map((m) => ({ ...m, rgb: hex(m.color) }));

const DAY = 86400000;
const toDay = (d: string) => Math.round(Date.parse(d + "T00:00:00Z") / DAY);

const raw = signal.projects.map((p) => ({ name: p.name, days: p.days }));
let first = Infinity;
let last = -Infinity;
for (const p of raw) {
  for (const d of p.days) {
    const t = toDay(d.d);
    if (t < first) first = t;
    if (t > last) last = t;
  }
}
export const firstDay = first;
export const lastDay = last;
export const spanDays = last - first;
export const firstYear = new Date(first * DAY).getUTCFullYear();
export const lastYear = new Date(last * DAY).getUTCFullYear();
export const dayToDate = (d: number) => new Date(d * DAY);
export const totalCommits = raw.reduce((s, p) => s + p.days.reduce((a, d) => a + d.n, 0), 0);
export const projectTotals = raw.map((p) => ({ name: p.name, total: p.days.reduce((a, d) => a + d.n, 0) }));

export interface Pt {
  proj: number;
  /** days since first commit */
  day: number;
  /** index within that day's stack */
  stack: number;
  seed: number;
}

/** deterministic PRNG so server and client build identical fields */
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
  META.forEach((m, proj) => {
    const src = raw.find((p) => p.name === m.name);
    if (!src) return;
    let counter = 0;
    for (const d of src.days) {
      const day = toDay(d.d) - first;
      let stack = 0;
      for (let i = 0; i < d.n; i++) {
        if (counter++ % stride === 0) out.push({ proj, day, stack: stack++, seed: r() });
      }
    }
  });
  return out;
}
