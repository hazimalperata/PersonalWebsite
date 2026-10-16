import type { LaneId } from "@/lib/signal/data";
import {
  buildCalmState,
  buildGalleryState,
  buildHomeStates,
  buildNotFoundState,
  buildProjectState,
  canonicalState,
  type Axis,
  type Box,
  type Layout,
  type Pos,
  type SceneState,
  type StateMeta,
  type WorkItem,
} from "./states";
import type { Pt } from "./points";

export type { HomeState } from "./states";

/**
 * What the page is showing. The home scene may carry the data the engine samples (proof strings, one entry per
 * featured project); every other scene needs nothing more.
 */
export type SignalScene =
  | { kind: "home"; proof?: string[]; work?: WorkItem[] }
  | { kind: "project"; lane: LaneId | null }
  | { kind: "gallery" }
  | { kind: "notFound" };

export const sceneKey = (scene: SignalScene): string => JSON.stringify(scene);

/** How a track's playhead moves. */
export type Drive = "home" | "header" | "time" | "fixed";

export interface Track {
  drive: Drive;
  keys: string[];
  states: Pos[];
  meta: StateMeta[];
  /** project scenes: the faint date axis, if any */
  axis: Axis | null;
  /** time-driven tracks: seconds to wait, then seconds to travel */
  auto?: { delay: number; duration: number };
  /** header-driven tracks: document box of the header */
  header?: Box;
}

export interface TrackInput {
  pts: Pt[];
  L: Layout;
  family: string;
  /** document-space boxes of marked elements, if present on the page */
  header?: Box | null;
  target?: Box | null;
}

const fromScene = (s: SceneState) => ({ states: s.positions, meta: s.meta });

export function buildTrack(scene: SignalScene, input: TrackInput): Track {
  const { pts, L } = input;
  switch (scene.kind) {
    case "home": {
      const h = buildHomeStates(pts, L, { family: input.family, proof: scene.proof ?? [], work: scene.work ?? [] });
      return { drive: "home", keys: h.keys, states: h.states, meta: h.meta, axis: null };
    }
    case "project": {
      const header = input.header ?? { x: 0, y: 0, w: L.vw, h: L.vh * 0.5 };
      const proj = buildProjectState(pts, L, scene.lane, header);
      if (proj.calm) {
        const a = fromScene(proj);
        return { drive: "fixed", keys: ["calm"], states: [a.states], meta: [a.meta], axis: null };
      }
      const calm = buildCalmState(pts, L, 0.22);
      return {
        drive: "header",
        keys: ["timeline", "calm"],
        states: [proj.positions, calm.positions],
        meta: [proj.meta, calm.meta],
        axis: proj.axis,
        header,
      };
    }
    case "gallery": {
      const g = buildGalleryState(pts, L);
      return { drive: "fixed", keys: ["calm"], states: [g.positions], meta: [g.meta], axis: null };
    }
    case "notFound": {
      const n = buildNotFoundState(pts, L, input.target ?? null);
      return {
        drive: "time",
        keys: ["scatter", "settled"],
        states: [n.scatter.positions, n.settled.positions],
        meta: [n.scatter.meta, n.settled.meta],
        axis: null,
        auto: { delay: 0.7, duration: 3.2 },
      };
    }
  }
}

// ---------- home scroll map ----------

export interface Anchor {
  /** index into the home key list */
  state: number;
  a: number;
  b: number;
}

/** Playhead (index into the anchored states, fractional while morphing) for a scroll position. */
export function playheadAt(anchors: Anchor[], y: number): number {
  const n = anchors.length;
  if (n === 0 || y <= anchors[0].b) return 0;
  for (let i = 0; i < n - 1; i++) {
    if (y <= anchors[i].b) return i;
    if (y < anchors[i + 1].a) {
      const t = (y - anchors[i].b) / Math.max(1, anchors[i + 1].a - anchors[i].b);
      return i + Math.min(1, Math.max(0, (t - 0.2) / 0.6));
    }
  }
  return n - 1;
}

/** Reads `[data-signal]` elements into scroll anchors, in home-state order. Unknown or duplicate keys are skipped. */
export function measureAnchors(keys: string[], els: HTMLElement[], vh: number, scrollY: number): Anchor[] {
  const list: Anchor[] = [];
  const seen = new Set<number>();
  for (const el of els) {
    const state = keys.indexOf(canonicalState(el.dataset.signal ?? ""));
    if (state < 0 || seen.has(state)) continue;
    seen.add(state);
    const r = el.getBoundingClientRect();
    const top = r.top + scrollY;
    const m = Math.min(r.height, vh);
    list.push({ state, a: top + (m - vh) / 2, b: top + r.height - (m + vh) / 2 });
  }
  return list.sort((x, y) => x.state - y.state);
}

// ---------- CPU blending (same easing and stagger as the vertex shader) ----------

const quintic = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
export const stagger = (mix: number, seed: number) => quintic(Math.min(1, Math.max(0, (mix - seed * 0.32) / 0.68)));

/**
 * The positions currently on screen for a (from, to, mix) triple, without noise: a morph snapshot. `orbit` rotates
 * the states that carry the orbit flag, as the shader does.
 */
export function blend(
  from: Pos,
  to: Pos,
  mix: number,
  seeds: ArrayLike<number>,
  orbit: { angle: number; from: boolean; to: boolean },
): Pos {
  const out = new Float32Array(from.length);
  const c = Math.cos(orbit.angle);
  const s = Math.sin(orbit.angle);
  for (let i = 0; i < seeds.length; i++) {
    const e = stagger(mix, seeds[i]);
    let fx = from[i * 3];
    let fy = from[i * 3 + 1];
    let tx = to[i * 3];
    let ty = to[i * 3 + 1];
    if (orbit.from) [fx, fy] = [c * fx - s * fy, s * fx + c * fy];
    if (orbit.to) [tx, ty] = [c * tx - s * ty, s * tx + c * ty];
    const travel = Math.sin(e * Math.PI) * 38;
    out[i * 3] = fx + (tx - fx) * e + Math.cos(seeds[i] * 40) * travel;
    out[i * 3 + 1] = fy + (ty - fy) * e + Math.sin(seeds[i] * 40) * travel;
    out[i * 3 + 2] = from[i * 3 + 2] + (to[i * 3 + 2] - from[i * 3 + 2]) * e;
  }
  return out;
}

export function lerpMeta(a: StateMeta, b: StateMeta, t: number): StateMeta {
  const m = (x: number, y: number) => x + (y - x) * t;
  const dom = t < 0.5 ? a : b;
  return {
    size: m(a.size, b.size),
    noise: m(a.noise, b.noise),
    repel: m(a.repel, b.repel),
    alpha: m(a.alpha, b.alpha),
    focus: dom.focus,
    pipe: dom.pipe,
    // the rotation is already baked into a snapshot, so a lerped meta never rotates
    orbit: false,
  };
}
