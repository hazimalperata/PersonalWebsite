import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { buildPoints } from "./points";
import { SIGNAL_ATTR } from "./dom";
import { buildHomeStates, getLayout, toScreen } from "./states";
import { createSignalStore } from "./store";

beforeAll(() => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
});

const pts = buildPoints(1);
const work = [{ lane: "seller" as const }, { lane: "posme" as const }];
const opts = { family: "sans-serif", proof: [], work };

const centroid = (pos: Float32Array, idx: number[], L: ReturnType<typeof getLayout>) => {
  let x = 0;
  let y = 0;
  for (const i of idx) {
    const [sx, sy] = toScreen(L, pos[i * 3], pos[i * 3 + 1]);
    x += sx;
    y += sy;
  }
  return [x / idx.length, y / idx.length];
};
const lane = (id: string) => pts.flatMap((p, i) => (i >= 0 && p.lane === ({ seller: 0, posme: 5 } as Record<string, number>)[id] ? [i] : []));

describe("DOM anchoring", () => {
  it("exposes the attribute names", () => {
    expect(SIGNAL_ATTR.work).toBe("data-signal-work");
    expect(SIGNAL_ATTR.step).toBe("data-signal-step");
    expect(SIGNAL_ATTR.header).toBe("data-signal-header");
    expect(SIGNAL_ATTR.target).toBe("data-signal-target");
  });

  it("puts a work cluster in the supplied box, not at the viewport fraction", () => {
    const box = { x: 40, y: 560, w: 300, h: 260 };
    const L = getLayout(390, 844, true, { work: [null, box] });
    const h = buildHomeStates(pts, L, opts);
    const [cx, cy] = centroid(h.states[h.keys.indexOf("work:1")], lane("posme"), L);
    expect(Math.abs(cx - (box.x + box.w / 2))).toBeLessThan(box.w / 2);
    expect(Math.abs(cy - (box.y + box.h / 2))).toBeLessThan(box.h / 2);
    // the fallback would have been the top of the screen (0.28 vh)
    expect(cy).toBeGreaterThan(844 * 0.5);
  });

  it("falls back to the viewport layout when a box is missing", () => {
    const plain = getLayout(1440, 900, false);
    const withHole = getLayout(1440, 900, false, { work: [null, undefined], step: [null, null, null, null] });
    expect(withHole.cluster(0)).toEqual(plain.cluster(0));
    expect(withHole.cluster(1)).toEqual(plain.cluster(1));
    expect(withHole.pipe).toEqual(plain.pipe);
    const a = buildHomeStates(pts, plain, opts);
    const b = buildHomeStates(pts, withHole, opts);
    expect(Array.from(b.states[b.keys.indexOf("work:0")])).toEqual(Array.from(a.states[a.keys.indexOf("work:0")]));
  });

  it("places pipeline nodes on the supplied step boxes, including a stacked mobile column", () => {
    const steps = [0, 1, 2, 3].map((i) => ({ x: 20, y: 100 + i * 120, w: 350, h: 100 }));
    const L = getLayout(390, 844, true, { step: steps });
    expect(L.pipe.xs.every((x) => x === 195)).toBe(true);
    expect(L.pipe.ys).toEqual([150, 270, 390, 510]);
    const h = buildHomeStates(pts, L, opts);
    const pos = h.states[h.keys.indexOf("pipeline")];
    // every point lies near some node or on a connector between them: inside the stack's bounding strip
    for (let i = 0; i < pts.length; i += 7) {
      const [x, y] = toScreen(L, pos[i * 3], pos[i * 3 + 1]);
      expect(x).toBeGreaterThan(195 - L.pipe.size);
      expect(x).toBeLessThan(195 + L.pipe.size);
      expect(y).toBeGreaterThan(150 - L.pipe.size);
      expect(y).toBeLessThan(510 + L.pipe.size);
    }
  });
});

describe("pipeline fill lifetime", () => {
  let store: ReturnType<typeof createSignalStore>;
  beforeEach(() => {
    store = createSignalStore();
  });
  it("starts with no fill, takes a progress and clears it again", () => {
    expect(store.get().pipelineProgress).toBeNull();
    store.setPipelineProgress(0.4);
    expect(store.get().pipelineProgress).toBe(0.4);
    store.setPipelineProgress(null);
    expect(store.get().pipelineProgress).toBeNull();
  });
  it("is cleared by a scene change and by a reset", () => {
    store.setPipelineProgress(0.7);
    store.setScene({ kind: "gallery" });
    expect(store.get().pipelineProgress).toBeNull();
    store.setPipelineProgress(0.2);
    store.reset();
    expect(store.get().pipelineProgress).toBeNull();
  });
  it("does not notify when the value is unchanged", () => {
    const listener = vi.fn();
    store.subscribe(listener);
    store.setPipelineProgress(0.5);
    store.setPipelineProgress(0.5);
    expect(listener).toHaveBeenCalledTimes(1);
  });
});

describe("pipeline layout", () => {
  it("anchors the four nodes to the supplied slots and sizes them to the slot, capped at 96", () => {
    const slots = [0, 1, 2, 3].map((i) => ({ x: 40 + i * 300, y: 200, w: 280, h: 96 }));
    const L = getLayout(1440, 900, false, { step: slots });
    expect(L.pipe.xs).toEqual([180, 480, 780, 1080]);
    expect(L.pipe.ys).toEqual([248, 248, 248, 248]);
    expect(L.pipe.size).toBe(96);
    const row = [0, 1, 2, 3].map((i) => ({ x: 16 + i * 80, y: 300, w: 72, h: 54 }));
    expect(getLayout(390, 844, true, { step: row }).pipe.size).toBe(54);
  });
  it("falls back to the prototype formula without anchors", () => {
    expect(getLayout(1440, 900, false).pipe.size).toBeLessThanOrEqual(96);
    expect(getLayout(390, 844, true).pipe.size).toBeLessThanOrEqual(54);
  });
});
