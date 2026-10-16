import { projects, rng, spanDays, type Pt } from "./data";

export const STATE = { nebula: 0, timeline: 1, num0: 2, work0: 6, calm: 11, pipe: 12, sys: 13, calm2: 14, contact: 15, count: 16 } as const;

export interface Layout {
  vw: number;
  vh: number;
  mobile: boolean;
  chart: { x0: number; x1: number; top: number; bottom: number; laneH: number };
  nebula: { cx: number; cy: number; sx: number; sy: number };
  num: { cx: number; cy: number; maxW: number };
  ring: { cx: number; cy: number; r: number };
  pipe: { y: number; xs: number[]; size: number };
  sys: { nodes: Array<[number, number]>; size: number };
  cluster: (workIdx: number) => { cx: number; cy: number; h: number };
}

export function getLayout(vw: number, vh: number, mobile: boolean): Layout {
  const chart = mobile
    ? { x0: 16, x1: vw - 16, top: vh * 0.15, bottom: vh * 0.8, laneH: 0 }
    : { x0: Math.max(236, vw * 0.19), x1: vw - 56, top: vh * 0.2, bottom: vh * 0.76, laneH: 0 };
  chart.laneH = (chart.bottom - chart.top) / projects.length;
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
    pipe: (() => {
      const pad = mobile ? 18 : Math.min(72, Math.max(18, vw * 0.05));
      const gap = mobile ? 0 : 18;
      const colW = (vw - 2 * pad - 3 * gap) / 4;
      return {
        y: vh * (mobile ? 0.33 : 0.4),
        xs: [0, 1, 2, 3].map((i) => pad + colW / 2 + i * (colW + gap)),
        size: mobile ? Math.min(54, colW * 0.7) : Math.min(96, colW * 0.36),
      };
    })(),
    sys: (() => {
      const cx = mobile ? vw * 0.5 : vw * 0.72;
      const cy = mobile ? vh * 0.27 : vh * 0.52;
      const rx = mobile ? vw * 0.3 : vw * 0.13;
      const ry = mobile ? vh * 0.13 : vh * 0.29;
      const nodes = [0, 1, 2, 3, 4].map((k): [number, number] => {
        const a = -Math.PI / 2 + (k * 2 * Math.PI) / 5;
        return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry];
      });
      return { nodes, size: mobile ? 46 : 78 };
    })(),
    cluster: (i: number) =>
      mobile
        ? { cx: vw * 0.5, cy: vh * 0.26, h: vh * 0.3 }
        : { cx: i % 2 === 0 ? vw * 0.72 : vw * 0.28, cy: vh * 0.5, h: vh * 0.56 },
  };
}

/** x pixel of a day offset on the timeline chart */
export const dayX = (L: Layout, day: number) => L.chart.x0 + (day / spanDays) * (L.chart.x1 - L.chart.x0);

export interface StateMeta {
  size: number;
  noise: number;
  repel: number;
  focus: number;
  alpha: number;
}

/** per-state look: point size (css px), drift amplitude (px), cursor repel weight, focused project (-1 none) */
export function stateMeta(mobile: boolean): StateMeta[] {
  const k = mobile ? 0.85 : 1;
  const m: StateMeta[] = [];
  m.push({ size: 3.6 * k, noise: 46, repel: mobile ? 0 : 1, focus: -1, alpha: 0.95 }); // nebula
  m.push({ size: 2.7 * k, noise: 0.6, repel: 0, focus: -1, alpha: 1 }); // timeline
  for (let i = 0; i < 4; i++) m.push({ size: 2.4 * k, noise: 1.6, repel: mobile ? 0 : 0.5, focus: -1, alpha: 0.95 }); // numbers
  for (let i = 0; i < 5; i++) m.push({ size: 3.6 * k, noise: 5, repel: 0, focus: projects.findIndex((p) => p.work === i), alpha: 1 }); // work
  m.push({ size: 2.4 * k, noise: 40, repel: mobile ? 0 : 0.6, focus: -1, alpha: 0.42 }); // calm
  m.push({ size: 3 * k, noise: 1.2, repel: 0, focus: -1, alpha: 0.95 }); // workflow pipeline
  m.push({ size: 3 * k, noise: 1.6, repel: 0, focus: -1, alpha: 0.95 }); // system network
  m.push({ size: 2.4 * k, noise: 40, repel: mobile ? 0 : 0.6, focus: -1, alpha: 0.42 }); // calm 2
  m.push({ size: 2.8 * k, noise: 10, repel: 0, focus: -1, alpha: 0.95 }); // contact
  return m;
}

function gauss(r: () => number) {
  return Math.sqrt(-2 * Math.log(r() + 1e-9)) * Math.cos(6.2831853 * r());
}

type Pos = Float32Array;

function toWorld(out: Pos, i: number, L: Layout, x: number, y: number, z: number) {
  out[i * 3] = x - L.vw / 2;
  out[i * 3 + 1] = L.vh / 2 - y;
  out[i * 3 + 2] = z;
}

function nebulaState(pts: Pt[], L: Layout, spread: number): Pos {
  const out = new Float32Array(pts.length * 3);
  const { cx, cy, sx, sy } = L.nebula;
  pts.forEach((p, i) => {
    const r = rng(Math.floor(p.seed * 1e9) ^ 0x51ed);
    // elliptical gaussian cloud with a few denser arms
    const a = r() * 6.2831853;
    const rad = Math.abs(gauss(r)) * 0.7 + 0.12;
    const arm = Math.sin(a * 3 + rad * 3) * 0.18;
    const x = cx + Math.cos(a) * (rad + arm) * sx * spread;
    const y = cy + Math.sin(a) * (rad + arm) * sy * spread;
    toWorld(out, i, L, x, y, r() * 2 - 1);
  });
  return out;
}

function timelineState(pts: Pt[], L: Layout): Pos {
  const out = new Float32Array(pts.length * 3);
  const { top, laneH } = L.chart;
  const spacing = L.mobile ? 1.7 : 2.3;
  const cap = laneH * (L.mobile ? 0.58 : 0.82);
  const perCol = Math.max(2, Math.floor(cap / spacing));
  pts.forEach((p, i) => {
    const base = top + (p.proj + 1) * laneH - 3;
    const col = Math.floor(p.stack / perCol);
    const row = p.stack % perCol;
    const x = dayX(L, p.day) + col * (L.mobile ? 0.9 : 1.1);
    const y = base - row * spacing;
    toWorld(out, i, L, x, y, 0);
  });
  return out;
}

/** Sample n positions from filled pixels of `text`, centred at (cx, cy) and fitted to maxW. */
function sampleText(text: string, family: string, n: number, cx: number, cy: number, maxW: number, seedBase: number) {
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  const base = 220;
  ctx.font = `600 ${base}px ${family}`;
  const tw = ctx.measureText(text).width;
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
  const r = rng(seedBase);
  const out: number[] = [];
  const cnt = px.length / 2;
  const midY = (minY + maxY) / 2;
  for (let i = 0; i < n; i++) {
    const k = cnt ? Math.floor(r() * cnt) : 0;
    out.push(cx + (px[k * 2] - w / 2) + (r() - 0.5) * step, cy + (px[k * 2 + 1] - midY) + (r() - 0.5) * step);
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
    const a = (i / pts.length) * 6.2831853 * 7 + g() * 0.4; // interleaves projects around the ring
    const band = (g() - 0.5) * r * 0.16 + gauss(g) * r * 0.025;
    toWorld(out, i, L, cx + Math.cos(a) * (r + band), cy + Math.sin(a) * (r + band), g() * 2 - 1);
  });
  return out;
}

/** Four nodes (spec, agents, review, gates) joined by three connectors; every point picks an element from its seed. */
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

/** Five nodes in a ring, each linked to its neighbours: the system built around the assistant. */
function systemState(pts: Pt[], L: Layout): Pos {
  const out = new Float32Array(pts.length * 3);
  const { nodes, size } = L.sys;
  const rad = size / 2;
  pts.forEach((p, i) => {
    const g = rng(Math.floor(p.seed * 1e9) ^ 0x2c71);
    const r = g();
    let x: number;
    let y: number;
    if (r < 0.6) {
      const n = nodes[Math.min(4, Math.floor((r / 0.6) * 5))];
      const a = g() * 6.2831853;
      const d = g() < 0.45 ? rad : Math.sqrt(g()) * rad;
      x = n[0] + Math.cos(a) * d;
      y = n[1] + Math.sin(a) * d;
    } else {
      const e = Math.min(4, Math.floor(((r - 0.6) / 0.4) * 5));
      const A = nodes[e];
      const B = nodes[(e + 1) % 5];
      const dx = B[0] - A[0];
      const dy = B[1] - A[1];
      const len = Math.hypot(dx, dy) || 1;
      const t = (rad + 6) / len + g() * (1 - (2 * (rad + 6)) / len);
      x = A[0] + dx * t + (g() - 0.5) * 3;
      y = A[1] + dy * t + (g() - 0.5) * 3;
    }
    toWorld(out, i, L, x, y, (g() - 0.5) * 1.2);
  });
  return out;
}

/** point on a rounded-rect perimeter, t in [0,1) */
function rrPerimeter(t: number, w: number, h: number, rad: number): [number, number] {
  const sw = w - 2 * rad;
  const sh = h - 2 * rad;
  const arc = (Math.PI / 2) * rad;
  const total = 2 * sw + 2 * sh + 4 * arc;
  let d = t * total;
  const seg = [sw, arc, sh, arc, sw, arc, sh, arc];
  for (let s = 0; s < 8; s++) {
    if (d <= seg[s] || s === 7) {
      const u = Math.min(d / seg[s], 1);
      switch (s) {
        case 0: return [-w / 2 + rad + u * sw, -h / 2];
        case 1: { const a = -Math.PI / 2 + u * (Math.PI / 2); return [w / 2 - rad + Math.cos(a) * rad, -h / 2 + rad + Math.sin(a) * rad]; }
        case 2: return [w / 2, -h / 2 + rad + u * sh];
        case 3: { const a = u * (Math.PI / 2); return [w / 2 - rad + Math.cos(a) * rad, h / 2 - rad + Math.sin(a) * rad]; }
        case 4: return [w / 2 - rad - u * sw, h / 2];
        case 5: { const a = Math.PI / 2 + u * (Math.PI / 2); return [-w / 2 + rad + Math.cos(a) * rad, h / 2 - rad + Math.sin(a) * rad]; }
        case 6: return [-w / 2, h / 2 - rad - u * sh];
        default: { const a = Math.PI + u * (Math.PI / 2); return [-w / 2 + rad + Math.cos(a) * rad, -h / 2 + rad + Math.sin(a) * rad]; }
      }
    }
    d -= seg[s];
  }
  return [0, 0];
}

function workState(pts: Pt[], L: Layout, workIdx: number, ambient: Pos): Pos {
  const out = new Float32Array(ambient);
  const proj = projects.findIndex((p) => p.work === workIdx);
  const { cx, cy, h } = L.cluster(workIdx);
  const browser = workIdx === 4;
  const w = browser ? Math.min(h * 1.55, L.vw * 0.78) : h * 0.5;
  const hh = browser ? w * 0.62 : h;
  const mine: number[] = [];
  pts.forEach((p, i) => {
    if (p.proj === proj) mine.push(i);
  });
  const n = mine.length;
  mine.forEach((idx, k) => {
    const g = rng(Math.floor(pts[idx].seed * 1e9) ^ 0x77);
    const f = k / n;
    let x: number;
    let y: number;
    if (browser) {
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
      x = (g() - 0.5) * w * 0.3; // notch
      y = -hh / 2 + hh * 0.035;
    } else {
      x = (g() - 0.5) * (w - 20);
      y = (g() - 0.5) * (hh - 36);
    }
    toWorld(out, idx, L, cx + x, cy + y, (g() - 0.5) * 1.2);
  });
  return out;
}

export interface BuiltStates {
  states: Pos[];
  meta: StateMeta[];
}

export function buildStates(pts: Pt[], L: Layout, family: string, texts: string[]): BuiltStates {
  const nebula = nebulaState(pts, L, 1);
  const ambient = nebulaState(pts, L, 1.9);
  const states: Pos[] = [nebula, timelineState(pts, L)];
  texts.forEach((t, i) => states.push(typeof document === "undefined" ? nebula : numberState(pts, L, t, family, i)));
  for (let i = 0; i < 5; i++) states.push(workState(pts, L, i, ambient));
  states.push(ambient);
  states.push(pipelineState(pts, L));
  states.push(systemState(pts, L));
  states.push(ambient);
  states.push(ringState(pts, L));
  return { states, meta: stateMeta(L.mobile) };
}
