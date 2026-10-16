import { lanes, laneRange, type LaneId } from "@/lib/signal/data";
import { laneIndex, laneSpanDays, rng, spanDays, type Pt } from "./points";

/** Home page scroll states. `numbers` is an alias of `numbers:0`; `numbers:<i>` is the i-th proof string. */
export type HomeState =
  | "nebula"
  | "timeline"
  | "numbers"
  | `numbers:${number}`
  | `work:${number}`
  | "calm"
  | "pipeline"
  | "contact";

export type Pos = Float32Array;

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface WorkItem {
  lane: LaneId | null;
}

export interface StateMeta {
  /** css px */
  size: number;
  /** drift amplitude, px */
  noise: number;
  /** cursor repel weight */
  repel: number;
  /** lane index kept bright, -1 for none */
  focus: number;
  alpha: number;
  /** the state rotates slowly (contact ring) */
  orbit?: boolean;
  /** the state is the pipeline (its focused node glows) */
  pipe?: boolean;
}

export interface Axis {
  x0: number;
  x1: number;
  y: number;
  /** ISO dates */
  from: string;
  to: string;
}

export interface SceneState {
  positions: Pos;
  meta: StateMeta;
  /** multiplier applied to the point size (1.6 for sparse lanes) */
  pointScale: number;
  axis: Axis | null;
  /** true when this is the calm drift of all points */
  calm: boolean;
}

export interface Layout {
  vw: number;
  vh: number;
  mobile: boolean;
  chart: { x0: number; x1: number; top: number; bottom: number; laneH: number };
  nebula: { cx: number; cy: number; sx: number; sy: number };
  num: { cx: number; cy: number; maxW: number };
  ring: { cx: number; cy: number; r: number };
  pipe: { y: number; xs: number[]; size: number };
  cluster: (workIdx: number) => { cx: number; cy: number; h: number };
}

export function getLayout(vw: number, vh: number, mobile: boolean): Layout {
  const chart = mobile
    ? { x0: 16, x1: vw - 16, top: vh * 0.15, bottom: vh * 0.8, laneH: 0 }
    : { x0: Math.max(236, vw * 0.19), x1: vw - 56, top: vh * 0.2, bottom: vh * 0.76, laneH: 0 };
  chart.laneH = (chart.bottom - chart.top) / lanes.length;
  const pad = mobile ? 18 : Math.min(72, Math.max(18, vw * 0.05));
  const gap = mobile ? 0 : 18;
  const colW = (vw - 2 * pad - 3 * gap) / 4;
  return {
    vw,
    vh,
    mobile,
    chart,
    nebula: mobile
      ? { cx: vw * 0.5, cy: vh * 0.7, sx: vw * 0.36, sy: vh * 0.2 }
      : { cx: vw * 0.7, cy: vh * 0.5, sx: vw * 0.19, sy: vh * 0.25 },
    num: mobile ? { cx: vw * 0.5, cy: vh * 0.34, maxW: vw * 0.86 } : { cx: vw * 0.34, cy: vh * 0.5, maxW: vw * 0.48 },
    ring: mobile
      ? { cx: vw * 0.5, cy: vh * 0.5, r: Math.min(vw * 0.4, vh * 0.3) }
      : { cx: vw * 0.5, cy: vh * 0.5, r: Math.min(vw, vh) * 0.36 },
    pipe: {
      y: vh * (mobile ? 0.33 : 0.4),
      xs: [0, 1, 2, 3].map((i) => pad + colW / 2 + i * (colW + gap)),
      size: mobile ? Math.min(54, colW * 0.7) : Math.min(96, colW * 0.36),
    },
    cluster: (i: number) =>
      mobile
        ? { cx: vw * 0.5, cy: vh * 0.28, h: vh * 0.34 }
        : { cx: i % 2 === 0 ? vw * 0.72 : vw * 0.28, cy: vh * 0.5, h: vh * 0.56 },
  };
}

/** x pixel of a day offset on the home timeline chart */
export const dayX = (L: Layout, day: number) => L.chart.x0 + (day / spanDays) * (L.chart.x1 - L.chart.x0);

const pointsOf = (pts: Pt[], laneIdx: number): number[] => {
  const out: number[] = [];
  pts.forEach((p, i) => {
    if (p.lane === laneIdx) out.push(i);
  });
  return out;
};

function gauss(r: () => number) {
  return Math.sqrt(-2 * Math.log(r() + 1e-9)) * Math.cos(6.2831853 * r());
}

function toWorld(out: Pos, i: number, L: Layout, x: number, y: number, z: number) {
  out[i * 3] = x - L.vw / 2;
  out[i * 3 + 1] = L.vh / 2 - y;
  out[i * 3 + 2] = z;
}

/** Inverse of `toWorld` for the x/y pair, used by tests and the 2D fallback. */
export const toScreen = (L: Layout, wx: number, wy: number): [number, number] => [wx + L.vw / 2, L.vh / 2 - wy];

// ---------- looks ----------

const metaFor = {
  nebula: (k: number): StateMeta => ({ size: 3.6 * k, noise: 46, repel: k < 1 ? 0 : 1, focus: -1, alpha: 0.95 }),
  timeline: (k: number): StateMeta => ({ size: 2.7 * k, noise: 0.6, repel: 0, focus: -1, alpha: 1 }),
  numbers: (k: number): StateMeta => ({ size: 2.4 * k, noise: 1.6, repel: k < 1 ? 0 : 0.5, focus: -1, alpha: 0.95 }),
  work: (k: number, focus: number): StateMeta => ({ size: 3.6 * k, noise: 5, repel: 0, focus, alpha: focus < 0 ? 0.42 : 1 }),
  calm: (k: number, alpha = 0.42): StateMeta => ({ size: 2.4 * k, noise: 40, repel: k < 1 ? 0 : 0.6, focus: -1, alpha }),
  pipeline: (k: number): StateMeta => ({ size: 3 * k, noise: 1.2, repel: 0, focus: -1, alpha: 0.95, pipe: true }),
  contact: (k: number): StateMeta => ({ size: 2.8 * k, noise: 10, repel: 0, focus: -1, alpha: 0.95, orbit: true }),
};

// ---------- point layouts ----------

function nebulaState(pts: Pt[], L: Layout, spread: number): Pos {
  const out = new Float32Array(pts.length * 3);
  const { cx, cy, sx, sy } = L.nebula;
  pts.forEach((p, i) => {
    const r = rng(Math.floor(p.seed * 1e9) ^ 0x51ed);
    const a = r() * 6.2831853;
    const rad = Math.abs(gauss(r)) * 0.7 + 0.12;
    const arm = Math.sin(a * 3 + rad * 3) * 0.18;
    toWorld(out, i, L, cx + Math.cos(a) * (rad + arm) * sx * spread, cy + Math.sin(a) * (rad + arm) * sy * spread, r() * 2 - 1);
  });
  return out;
}

/** The whole field as a wide, slow cloud: the calm drift every non-home scene falls back to. */
export function ambientState(pts: Pt[], L: Layout): Pos {
  const out = new Float32Array(pts.length * 3);
  pts.forEach((p, i) => {
    const r = rng(Math.floor(p.seed * 1e9) ^ 0xa11b);
    const a = r() * 6.2831853;
    const rad = Math.sqrt(r());
    toWorld(out, i, L, L.vw * 0.5 + Math.cos(a) * rad * L.vw * 0.5, L.vh * 0.5 + Math.sin(a) * rad * L.vh * 0.5, r() * 2 - 1);
  });
  return out;
}

export function timelineState(pts: Pt[], L: Layout): Pos {
  const out = new Float32Array(pts.length * 3);
  const { top, laneH } = L.chart;
  const spacing = L.mobile ? 1.7 : 2.3;
  const cap = laneH * (L.mobile ? 0.58 : 0.82);
  const perCol = Math.max(2, Math.floor(cap / spacing));
  pts.forEach((p, i) => {
    const base = top + (p.lane + 1) * laneH - 3;
    const col = Math.floor(p.stack / perCol);
    const row = p.stack % perCol;
    toWorld(out, i, L, dayX(L, p.day) + col * (L.mobile ? 0.9 : 1.1), base - row * spacing, 0);
  });
  return out;
}

/** Sample n positions from the filled pixels of `text`, centred at (cx, cy) and fitted to maxW. */
function sampleText(text: string, family: string, n: number, cx: number, cy: number, maxW: number, seedBase: number) {
  const r = rng(seedBase);
  const out: number[] = [];
  const ctx = typeof document === "undefined" ? null : document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  if (!ctx || !text) {
    // no 2D context (or nothing to draw): a soft blob, so the state still exists
    for (let i = 0; i < n; i++) out.push(cx + (r() - 0.5) * maxW * 0.6, cy + (r() - 0.5) * maxW * 0.18);
    return out;
  }
  const c = ctx.canvas;
  const base = 220;
  ctx.font = `600 ${base}px ${family}`;
  const tw = ctx.measureText(text).width || base;
  const size = Math.min(base * (maxW / tw), 360);
  const w = Math.ceil(tw * (size / base)) + 20;
  const h = Math.ceil(size * 1.1);
  c.width = w;
  c.height = h;
  ctx.font = `600 ${size}px ${family}`;
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#fff";
  ctx.fillText(text, 10, size * 0.82);
  const data = ctx.getImageData(0, 0, w, h).data;
  const px: number[] = [];
  let minY = h;
  let maxY = 0;
  const step = 2;
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      if (data[(y * w + x) * 4 + 3] > 128) {
        px.push(x, y);
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  const cnt = px.length / 2;
  const midY = (minY + maxY) / 2;
  for (let i = 0; i < n; i++) {
    const k = cnt ? Math.floor(r() * cnt) : 0;
    out.push(cx + ((px[k * 2] ?? w / 2) - w / 2) + (r() - 0.5) * step, cy + ((px[k * 2 + 1] ?? midY) - midY) + (r() - 0.5) * step);
  }
  return out;
}

function numberState(pts: Pt[], L: Layout, text: string, family: string, idx: number): Pos {
  const out = new Float32Array(pts.length * 3);
  const s = sampleText(text, family, pts.length, L.num.cx, L.num.cy, L.num.maxW, 100 + idx);
  pts.forEach((p, i) => toWorld(out, i, L, s[i * 2], s[i * 2 + 1], (p.seed - 0.5) * 2));
  return out;
}

function ringState(pts: Pt[], L: Layout): Pos {
  const out = new Float32Array(pts.length * 3);
  const { cx, cy, r } = L.ring;
  pts.forEach((p, i) => {
    const g = rng(Math.floor(p.seed * 1e9) ^ 0x9e37);
    const a = (i / pts.length) * 6.2831853 * 7 + g() * 0.4;
    const band = (g() - 0.5) * r * 0.16 + gauss(g) * r * 0.025;
    toWorld(out, i, L, cx + Math.cos(a) * (r + band), cy + Math.sin(a) * (r + band), g() * 2 - 1);
  });
  return out;
}

/** Four nodes joined by three connectors; every point picks an element from its seed. */
function pipelineState(pts: Pt[], L: Layout): Pos {
  const out = new Float32Array(pts.length * 3);
  const { xs, y, size } = L.pipe;
  const half = size / 2;
  pts.forEach((p, i) => {
    const g = rng(Math.floor(p.seed * 1e9) ^ 0x1b3d);
    const r = g();
    let x: number;
    let yy: number;
    if (r < 0.64) {
      const node = Math.min(3, Math.floor((r / 0.64) * 4));
      if (g() < 0.4) {
        x = xs[node] + (g() - 0.5) * (size - 14);
        yy = y + (g() - 0.5) * (size - 14);
      } else {
        const [px, py] = rrPerimeter(g(), size, size, size * 0.2);
        x = xs[node] + px;
        yy = y + py;
      }
    } else {
      const c = Math.min(2, Math.floor(((r - 0.64) / 0.36) * 3));
      const a = xs[c] + half + 8;
      const b = xs[c + 1] - half - 8;
      const t = g();
      x = a + (b - a) * t;
      yy = y + (g() - 0.5) * 3;
      if (t > 0.9) yy += (g() - 0.5) * 2 * (1 - t) * 40;
    }
    toWorld(out, i, L, x, yy, (g() - 0.5) * 1.2);
  });
  return out;
}

/** Point on a rounded-rect perimeter (centred on 0,0), t in [0,1). */
export function rrPerimeter(t: number, w: number, h: number, rad: number): [number, number] {
  const r = Math.max(0.01, Math.min(rad, w / 2, h / 2));
  const sw = w - 2 * r;
  const sh = h - 2 * r;
  const arc = (Math.PI / 2) * r;
  const total = 2 * sw + 2 * sh + 4 * arc;
  let d = (t % 1) * total;
  const seg = [sw, arc, sh, arc, sw, arc, sh, arc];
  for (let s = 0; s < 8; s++) {
    if (d <= seg[s] || s === 7) {
      const u = seg[s] > 0 ? Math.min(d / seg[s], 1) : 0;
      switch (s) {
        case 0: return [-w / 2 + r + u * sw, -h / 2];
        case 1: { const a = -Math.PI / 2 + u * (Math.PI / 2); return [w / 2 - r + Math.cos(a) * r, -h / 2 + r + Math.sin(a) * r]; }
        case 2: return [w / 2, -h / 2 + r + u * sh];
        case 3: { const a = u * (Math.PI / 2); return [w / 2 - r + Math.cos(a) * r, h / 2 - r + Math.sin(a) * r]; }
        case 4: return [w / 2 - r - u * sw, h / 2];
        case 5: { const a = Math.PI / 2 + u * (Math.PI / 2); return [-w / 2 + r + Math.cos(a) * r, h / 2 - r + Math.sin(a) * r]; }
        case 6: return [-w / 2, h / 2 - r - u * sh];
        default: { const a = Math.PI + u * (Math.PI / 2); return [-w / 2 + r + Math.cos(a) * r, -h / 2 + r + Math.sin(a) * r]; }
      }
    }
    d -= seg[s];
  }
  return [0, 0];
}

// ---------- work clusters ----------

type Shape = "browser" | "phone" | "skeleton";

const SHAPES: Record<LaneId, Shape> = {
  seller: "browser",
  admin: "browser",
  landing: "browser",
  site: "browser",
  mobile: "phone",
  posme: "phone",
  dremly: "phone",
  rommer: "skeleton",
};

/**
 * Sparse lanes (Dremly, Posme) would read as dust at full size. The shape shrinks with the point count, so the
 * spacing between points stays close to that of a dense lane and the outline still reads.
 */
export function clusterScale(n: number, mobile: boolean): number {
  return Math.min(1, Math.max(mobile ? 0.66 : 0.55, Math.sqrt(n / 900)));
}

// Hand-authored pose (a stride): x/y in units of the figure height, y down, origin at the figure centre.
const JOINTS = {
  head: [0.0, -0.42],
  neck: [0.0, -0.33],
  shoulderL: [-0.1, -0.3],
  shoulderR: [0.1, -0.3],
  elbowL: [-0.2, -0.17],
  elbowR: [0.2, -0.2],
  wristL: [-0.26, -0.04],
  wristR: [0.3, -0.1],
  pelvis: [0.0, -0.05],
  hipL: [-0.06, -0.04],
  hipR: [0.06, -0.04],
  kneeL: [-0.12, 0.16],
  kneeR: [0.17, 0.12],
  ankleL: [-0.2, 0.37],
  ankleR: [0.27, 0.33],
} as const satisfies Record<string, readonly [number, number]>;
type Joint = keyof typeof JOINTS;
export const SKELETON_JOINT_COUNT = Object.keys(JOINTS).length;

const BONES: Array<[Joint, Joint]> = [
  ["neck", "head"],
  ["neck", "shoulderL"],
  ["neck", "shoulderR"],
  ["shoulderL", "elbowL"],
  ["elbowL", "wristL"],
  ["shoulderR", "elbowR"],
  ["elbowR", "wristR"],
  ["neck", "pelvis"],
  ["pelvis", "hipL"],
  ["pelvis", "hipR"],
  ["hipL", "kneeL"],
  ["kneeL", "ankleL"],
  ["hipR", "kneeR"],
  ["kneeR", "ankleR"],
];
const BONE_LEN = BONES.map(([a, b]) => Math.hypot(JOINTS[a][0] - JOINTS[b][0], JOINTS[a][1] - JOINTS[b][1]));
const BONE_TOTAL = BONE_LEN.reduce((s, v) => s + v, 0);

/** Offset (in px, from the cluster centre) of the k-th of n points of a pose skeleton `hs` px tall. */
function skeletonPoint(f: number, g: () => number, hs: number): [number, number] {
  if (f < 0.07) {
    // head: a ring around the head joint
    const a = (f / 0.07) * 6.2831853;
    const [hx, hy] = JOINTS.head;
    return [(hx + Math.cos(a) * 0.055) * hs, (hy + Math.sin(a) * 0.055) * hs];
  }
  if (f < 0.35) {
    // joints: small bright knots
    const keys = Object.keys(JOINTS) as Joint[];
    const j = JOINTS[keys[Math.floor(g() * keys.length)]];
    return [(j[0] + gauss(g) * 0.008) * hs, (j[1] + gauss(g) * 0.008) * hs];
  }
  // limbs: along the bones, weighted by length
  let t = g() * BONE_TOTAL;
  let b = 0;
  while (b < BONES.length - 1 && t > BONE_LEN[b]) t -= BONE_LEN[b++];
  const [a, c] = BONES[b];
  const u = t / BONE_LEN[b];
  const x = JOINTS[a][0] + (JOINTS[c][0] - JOINTS[a][0]) * u;
  const y = JOINTS[a][1] + (JOINTS[c][1] - JOINTS[a][1]) * u;
  return [(x + gauss(g) * 0.004) * hs, (y + gauss(g) * 0.004) * hs];
}

/** A browser frame never wider than the half of the screen its cluster sits in. */
const browserWidth = (L: Layout, cx: number, hs: number) => Math.min(hs * 1.55, 2 * (Math.min(cx, L.vw - cx) - 24));

/** Box a lane's cluster occupies on screen (viewport px), for overlays that label it. */
export function clusterBox(L: Layout, workIdx: number, lane: LaneId, n: number): Box & { cx: number; cy: number } {
  const { cx, cy, h } = L.cluster(workIdx);
  const hs = h * clusterScale(n, L.mobile);
  const shape = SHAPES[lane];
  const w = shape === "browser" ? browserWidth(L, cx, hs) : shape === "phone" ? hs * 0.5 : hs * 0.7;
  const hh = shape === "browser" ? w * 0.62 : shape === "phone" ? hs : hs * 0.9;
  return { cx, cy, x: cx - w / 2, y: cy - hh / 2, w, h: hh };
}

function workState(pts: Pt[], L: Layout, workIdx: number, lane: LaneId | null, ambient: Pos): Pos {
  const out = new Float32Array(ambient);
  const li = laneIndex(lane);
  if (li < 0 || !lane) return out;
  const mine = pointsOf(pts, li);
  const n = mine.length;
  if (n === 0) return out;
  const shape = SHAPES[lane];
  const { cx, cy, h } = L.cluster(workIdx);
  const hs = h * clusterScale(n, L.mobile);
  const browser = shape === "browser";
  const w = browser ? browserWidth(L, cx, hs) : hs * 0.5;
  const hh = browser ? w * 0.62 : hs;
  mine.forEach((idx, k) => {
    const g = rng(Math.floor(pts[idx].seed * 1e9) ^ 0x77);
    const f = k / n;
    let x: number;
    let y: number;
    if (shape === "skeleton") {
      [x, y] = skeletonPoint(f, g, hs);
    } else if (browser) {
      if (f < 0.5) {
        [x, y] = rrPerimeter(f / 0.5, w, hh, 12);
      } else if (f < 0.66) {
        x = (g() - 0.5) * w;
        y = -hh / 2 + hh * 0.13;
      } else if (f < 0.7) {
        x = -w / 2 + 16 + ((f - 0.66) / 0.04) * 40;
        y = -hh / 2 + hh * 0.065;
      } else {
        x = (g() - 0.5) * (w - 24);
        y = -hh / 2 + hh * 0.18 + g() * (hh * 0.78);
      }
    } else if (f < 0.5) {
      [x, y] = rrPerimeter(f / 0.5, w, hh, w * 0.14);
    } else if (f < 0.56) {
      x = (g() - 0.5) * w * 0.3;
      y = -hh / 2 + hh * 0.035;
    } else {
      x = (g() - 0.5) * (w - 20);
      y = (g() - 0.5) * (hh - 36);
    }
    toWorld(out, idx, L, cx + x, cy + y, (g() - 0.5) * 1.2);
  });
  return out;
}

// ---------- home ----------

export interface HomeBuilt {
  keys: HomeState[];
  states: Pos[];
  meta: StateMeta[];
}

/** The ordered key list for a home page with `proofCount` proof strings and `workCount` work clusters. */
export function homeKeys(proofCount: number, workCount: number): HomeState[] {
  const keys: HomeState[] = ["nebula", "timeline"];
  for (let i = 0; i < proofCount; i++) keys.push(`numbers:${i}`);
  for (let i = 0; i < workCount; i++) keys.push(`work:${i}`);
  keys.push("calm", "pipeline", "contact");
  return keys;
}

/** Normalises the `numbers` alias. */
export const canonicalState = (s: string): string => (s === "numbers" ? "numbers:0" : s);

export function buildHomeStates(pts: Pt[], L: Layout, opts: { family: string; proof: string[]; work: WorkItem[] }): HomeBuilt {
  const k = L.mobile ? 0.85 : 1;
  const keys = homeKeys(opts.proof.length, opts.work.length);
  const nebula = nebulaState(pts, L, 1);
  const ambient = ambientState(pts, L);
  const states: Pos[] = [];
  const meta: StateMeta[] = [];
  for (const key of keys) {
    if (key === "nebula") {
      states.push(nebula);
      meta.push(metaFor.nebula(k));
    } else if (key === "timeline") {
      states.push(timelineState(pts, L));
      meta.push(metaFor.timeline(k));
    } else if (key.startsWith("numbers:")) {
      const i = Number(key.slice(8));
      states.push(numberState(pts, L, opts.proof[i], opts.family, i));
      meta.push(metaFor.numbers(k));
    } else if (key.startsWith("work:")) {
      const i = Number(key.slice(5));
      const lane = opts.work[i]?.lane ?? null;
      const li = laneIndex(lane);
      states.push(workState(pts, L, i, lane, ambient));
      meta.push(metaFor.work(k, li >= 0 && pointsOf(pts, li).length > 0 ? li : -1));
    } else if (key === "calm") {
      states.push(ambient);
      meta.push(metaFor.calm(k));
    } else if (key === "pipeline") {
      states.push(pipelineState(pts, L));
      meta.push(metaFor.pipeline(k));
    } else {
      states.push(ringState(pts, L));
      meta.push(metaFor.contact(k));
    }
  }
  return { keys, states, meta };
}

// ---------- other scenes ----------

const kFor = (L: Layout) => (L.mobile ? 0.85 : 1);

export function buildCalmState(pts: Pt[], L: Layout, alpha = 0.22): SceneState {
  return { positions: ambientState(pts, L), meta: metaFor.calm(kFor(L), alpha), pointScale: 1, axis: null, calm: true };
}

export function buildGalleryState(pts: Pt[], L: Layout): SceneState {
  return buildCalmState(pts, L, 0.3);
}

/**
 * A case page's own timeline inside its header box (viewport px, as at scroll 0). Only that lane is bright; the
 * rest drift dimly. Lanes under 50 points get larger points and a faint date axis. `lane: null` is the calm drift.
 */
export function buildProjectState(pts: Pt[], L: Layout, lane: LaneId | null, box: Box): SceneState {
  const li = laneIndex(lane);
  const mine = li < 0 ? [] : pointsOf(pts, li);
  if (li < 0 || !lane || mine.length === 0) return buildCalmState(pts, L, 0.42);
  const positions = ambientState(pts, L);
  const sparse = mine.length < 50;
  const pointScale = sparse ? 1.6 : 1;
  const spacing = (L.mobile ? 1.9 : 2.4) * pointScale;
  const cap = box.h * 0.6;
  const perCol = Math.max(2, Math.floor(cap / spacing));
  const colStep = 1.1 * pointScale;
  const maxStack = mine.reduce((m, i) => Math.max(m, pts[i].stack), 0);
  const cols = Math.floor(maxStack / perCol) + 1;
  const padX = Math.min(24, box.w * 0.05);
  const x0 = box.x + padX;
  const x1 = Math.max(x0 + 1, box.x + box.w - padX - (cols - 1) * colStep);
  const base = box.y + box.h * 0.82;
  const span = laneSpanDays(li);
  mine.forEach((idx) => {
    const p = pts[idx];
    const col = Math.floor(p.stack / perCol);
    const row = p.stack % perCol;
    toWorld(positions, idx, L, x0 + (p.laneDay / span) * (x1 - x0) + col * colStep, base - row * spacing, 0);
  });
  const range = laneRange(lane);
  const meta = { ...metaFor.timeline(kFor(L)), focus: li };
  meta.size *= pointScale;
  return {
    positions,
    meta,
    pointScale,
    axis: sparse && range ? { x0, x1, y: base + 10, from: range.first, to: range.last } : null,
    calm: false,
  };
}

/** 404: a loose "lost signal" scatter, then a settled halo around the way-home link box. */
export function buildNotFoundState(pts: Pt[], L: Layout, target: Box | null): { scatter: SceneState; settled: SceneState } {
  const k = kFor(L);
  const t = target ?? { x: L.vw / 2 - 110, y: L.vh * 0.62, w: 220, h: 48 };
  const scatter = new Float32Array(pts.length * 3);
  const settled = new Float32Array(pts.length * 3);
  const tcx = t.x + t.w / 2;
  const tcy = t.y + t.h / 2;
  pts.forEach((p, i) => {
    const g = rng(Math.floor(p.seed * 1e9) ^ 0x404);
    toWorld(scatter, i, L, g() * L.vw, g() * L.vh, g() * 2 - 1);
    const layer = Math.floor(g() * 4);
    if (g() < 0.78) {
      const r = 10 + layer * 9 + gauss(g) * 1.5;
      const [px, py] = rrPerimeter(g(), t.w + 2 * r, t.h + 2 * r, t.h / 2 + r);
      toWorld(settled, i, L, tcx + px, tcy + py, (g() - 0.5) * 1.2);
    } else {
      const a = g() * 6.2831853;
      const d = 50 + Math.abs(gauss(g)) * Math.min(L.vw, L.vh) * 0.14;
      toWorld(settled, i, L, tcx + Math.cos(a) * (t.w / 2 + d), tcy + Math.sin(a) * (t.h / 2 + d), (g() - 0.5) * 1.2);
    }
  });
  return {
    scatter: { positions: scatter, meta: { size: 3 * k, noise: 70, repel: 0, focus: -1, alpha: 0.6 }, pointScale: 1, axis: null, calm: false },
    settled: { positions: settled, meta: { size: 2.8 * k, noise: 5, repel: 0, focus: -1, alpha: 0.95 }, pointScale: 1, axis: null, calm: false },
  };
}
