import { beforeAll, describe, expect, it, vi } from "vitest";
import { lanes, laneTotal, totalCommits } from "@/lib/signal/data";
import { laneIndex, buildPoints } from "./points";
import {
  blend,
  buildTrack,
  measureAnchors,
  playheadAt,
  stagger,
  type Anchor,
} from "./scenes";
import {
  buildGalleryState,
  buildHomeStates,
  buildNotFoundState,
  buildProjectState,
  clusterBox,
  clusterScale,
  getLayout,
  homeKeys,
  SKELETON_JOINT_COUNT,
  toScreen,
} from "./states";

// jsdom has no 2D canvas: number sampling falls back to a soft blob, which is all these tests need
beforeAll(() => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
});

const L = getLayout(1440, 900, false);
const Lm = getLayout(390, 844, true);
const pts = buildPoints(1);
const box = { x: 120, y: 90, w: 900, h: 320 };

const extent = (pos: Float32Array, idx: number[]) => {
  const xs = idx.map((i) => pos[i * 3]);
  const ys = idx.map((i) => pos[i * 3 + 1]);
  return { w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) };
};
const idxOf = (laneId: string) => pts.flatMap((p, i) => (lanes[p.lane].id === laneId ? [i] : []));

describe("points", () => {
  it("is one point per commit", () => {
    expect(pts).toHaveLength(totalCommits);
  });
  it("keeps every third commit on coarse devices", () => {
    expect(buildPoints(3).length).toBeGreaterThan(totalCommits / 3 - lanes.length);
    expect(buildPoints(3).length).toBeLessThan(totalCommits / 3 + lanes.length);
  });
});

describe("buildProjectState", () => {
  it("forms a 217-point lane's own timeline inside the header box", () => {
    const li = laneIndex("posme");
    const s = buildProjectState(pts, L, "posme", box);
    expect(idxOf("posme")).toHaveLength(laneTotal("posme"));
    for (const i of idxOf("posme")) {
      const [x, y] = toScreen(L, s.positions[i * 3], s.positions[i * 3 + 1]);
      expect(x).toBeGreaterThanOrEqual(box.x);
      expect(x).toBeLessThanOrEqual(box.x + box.w);
      expect(y).toBeGreaterThanOrEqual(box.y);
      expect(y).toBeLessThanOrEqual(box.y + box.h);
    }
    expect(s.meta.focus).toBe(li);
    expect(s.calm).toBe(false);
    // 217 points are not sparse: normal point size, no axis
    expect(s.pointScale).toBe(1);
    expect(s.axis).toBeNull();
  });

  it("enlarges points and adds a faint date axis below 50 points", () => {
    const li = laneIndex("posme");
    const few = [...pts.filter((p) => p.lane !== li), ...pts.filter((p) => p.lane === li).slice(0, 30)];
    const s = buildProjectState(few, L, "posme", box);
    expect(s.pointScale).toBe(1.6);
    expect(s.meta.size).toBeCloseTo(2.7 * 1.6, 5);
    expect(s.axis).not.toBeNull();
    expect(s.axis!.x1).toBeLessThanOrEqual(box.x + box.w);
  });

  it("is the calm drift when the project has no lane", () => {
    const s = buildProjectState(pts, L, null, box);
    expect(s.calm).toBe(true);
    expect(s.meta.focus).toBe(-1);
    expect(s.axis).toBeNull();
    expect(s.positions).toHaveLength(pts.length * 3);
  });

  it("builds a calm gallery state", () => {
    const g = buildGalleryState(pts, L);
    expect(g.calm).toBe(true);
    expect(g.positions).toHaveLength(pts.length * 3);
  });
});

describe("buildHomeStates", () => {
  const opts = (n: number) => ({
    family: "sans-serif",
    proof: ["12", "1,700+", "900+", "8+"],
    work: Array.from({ length: n }, (_, i) => ({ lane: lanes[i % lanes.length].id })),
  });

  it("yields one work:<i> state per featured project", () => {
    const h = buildHomeStates(pts, L, opts(5));
    expect(h.keys.filter((k) => k.startsWith("work:"))).toEqual(["work:0", "work:1", "work:2", "work:3", "work:4"]);
    expect(h.states).toHaveLength(h.keys.length);
    expect(h.meta).toHaveLength(h.keys.length);
    h.states.forEach((s) => expect(s).toHaveLength(pts.length * 3));
  });

  it("does not hard-code the count", () => {
    expect(buildHomeStates(pts, L, opts(3)).keys.filter((k) => k.startsWith("work:"))).toHaveLength(3);
    expect(buildHomeStates(pts, L, opts(7)).keys.filter((k) => k.startsWith("work:"))).toHaveLength(7);
  });

  it("has a four-node pipeline and no system pentagon", () => {
    const h = buildHomeStates(pts, L, opts(5));
    expect(h.keys).toEqual(homeKeys(4, 5));
    expect(h.keys).not.toContain("system");
    expect(h.keys.slice(-3)).toEqual(["calm", "pipeline", "contact"]);
    expect(L.pipe.xs).toHaveLength(4);
  });

  it("makes a cluster read as a shape at its real count (sparse lanes shrink)", () => {
    const h = buildHomeStates(pts, L, { family: "sans-serif", proof: [], work: [{ lane: "posme" }, { lane: "seller" }] });
    const posme = extent(h.states[h.keys.indexOf("work:0")], idxOf("posme"));
    const seller = extent(h.states[h.keys.indexOf("work:1")], idxOf("seller"));
    expect(clusterScale(217, false)).toBeLessThan(clusterScale(1700, false));
    expect(posme.h).toBeLessThan(seller.h);
    expect(posme.h).toBeGreaterThan(80);
  });

  it("only the featured lane is bright in its cluster", () => {
    const h = buildHomeStates(pts, L, { family: "sans-serif", proof: [], work: [{ lane: "dremly" }, { lane: null }] });
    expect(h.meta[h.keys.indexOf("work:0")].focus).toBe(laneIndex("dremly"));
    expect(h.meta[h.keys.indexOf("work:1")].focus).toBe(-1);
  });

  it("pins the Rommer cluster to a pose skeleton of 15 joints inside its box", () => {
    expect(SKELETON_JOINT_COUNT).toBe(15);
    const h = buildHomeStates(pts, L, { family: "sans-serif", proof: [], work: [{ lane: "rommer" }] });
    const pos = h.states[h.keys.indexOf("work:0")];
    const b = clusterBox(L, 0, "rommer", laneTotal("rommer"));
    for (const i of idxOf("rommer")) {
      const [x, y] = toScreen(L, pos[i * 3], pos[i * 3 + 1]);
      expect(x).toBeGreaterThan(b.x - 30);
      expect(x).toBeLessThan(b.x + b.w + 30);
      expect(y).toBeGreaterThan(b.y - 30);
      expect(y).toBeLessThan(b.y + b.h + 30);
    }
  });

  it("works on a phone layout too", () => {
    const h = buildHomeStates(buildPoints(3), Lm, { family: "sans-serif", proof: ["1"], work: [{ lane: "posme" }] });
    expect(h.keys).toEqual(homeKeys(1, 1));
  });
});

describe("buildNotFoundState", () => {
  it("scatters, then settles around the way-home link", () => {
    const target = { x: 600, y: 520, w: 240, h: 48 };
    const { scatter, settled } = buildNotFoundState(pts, L, target);
    const cx = target.x + target.w / 2;
    const cy = target.y + target.h / 2;
    const mean = (pos: Float32Array) => {
      let s = 0;
      for (let i = 0; i < pts.length; i++) {
        const [x, y] = toScreen(L, pos[i * 3], pos[i * 3 + 1]);
        s += Math.hypot(x - cx, y - cy);
      }
      return s / pts.length;
    };
    expect(mean(settled.positions)).toBeLessThan(mean(scatter.positions) * 0.5);
    expect(settled.meta.noise).toBeLessThan(scatter.meta.noise);
  });
});

describe("buildTrack", () => {
  const input = { pts, L, family: "sans-serif", header: box, target: null };
  it("drives each scene kind", () => {
    expect(buildTrack({ kind: "home", proof: ["1"], work: [] }, input).drive).toBe("home");
    expect(buildTrack({ kind: "project", lane: "posme" }, input).drive).toBe("header");
    expect(buildTrack({ kind: "project", lane: "posme" }, input).keys).toEqual(["timeline", "calm"]);
    expect(buildTrack({ kind: "project", lane: null }, input).drive).toBe("fixed");
    expect(buildTrack({ kind: "gallery" }, input).drive).toBe("fixed");
    expect(buildTrack({ kind: "notFound" }, input).drive).toBe("time");
  });
});

describe("scroll map", () => {
  const anchors: Anchor[] = [
    { state: 0, a: 0, b: 100 },
    { state: 1, a: 500, b: 900 },
    { state: 4, a: 1500, b: 1600 },
  ];
  it("holds on an anchor and morphs between anchors", () => {
    expect(playheadAt(anchors, 50)).toBe(0);
    expect(playheadAt(anchors, 700)).toBe(1);
    const mid = playheadAt(anchors, 1200);
    expect(mid).toBeGreaterThan(1);
    expect(mid).toBeLessThan(2);
    expect(playheadAt(anchors, 5000)).toBe(2);
    expect(playheadAt([], 100)).toBe(0);
  });
  it("maps data-signal elements to state indices, skipping unknown keys", () => {
    const mk = (s: string, top: number, height: number) => {
      const el = document.createElement("section");
      el.dataset.signal = s;
      el.getBoundingClientRect = () => ({ top, height, bottom: top + height, left: 0, right: 0, width: 0, x: 0, y: top, toJSON: () => ({}) }) as DOMRect;
      return el;
    };
    const keys = homeKeys(1, 1);
    const a = measureAnchors(keys, [mk("work:0", 2000, 800), mk("nebula", 0, 900), mk("nope", 1, 1), mk("numbers", 1000, 600)], 900, 0);
    expect(a.map((x) => keys[x.state])).toEqual(["nebula", "numbers:0", "work:0"]);
  });
});

describe("blend", () => {
  const seeds = [0, 0.5, 0.99];
  const from = new Float32Array([0, 0, 0, 10, 10, 0, 20, 20, 0]);
  const to = new Float32Array([100, 0, 0, 110, 10, 0, 120, 20, 0]);
  const still = { angle: 0, from: false, to: false };
  it("is the from-state at 0 and the to-state at 1", () => {
    expect(Array.from(blend(from, to, 0, seeds, still))).toEqual(Array.from(from));
    const end = blend(from, to, 1, seeds, still);
    to.forEach((v, i) => expect(end[i]).toBeCloseTo(v, 3));
  });
  it("staggers by seed", () => {
    expect(stagger(0.3, 0)).toBeGreaterThan(stagger(0.3, 0.9));
  });
});
