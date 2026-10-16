import { describe, expect, it } from "vitest";
import { pipelineEdge, pipelineEmphasis } from "./pipeline";

const xs = [200, 500, 800, 1100];
const lit = (p: number) => pipelineEmphasis(xs, pipelineEdge(xs, p));

describe("pipeline fill", () => {
  it("moves the edge from just left of the first node to just right of the last", () => {
    expect(pipelineEdge(xs, 0)).toBe(130);
    expect(pipelineEdge(xs, 1)).toBe(1170);
    expect(pipelineEdge(xs, 0.5)).toBe(650);
  });

  it("clamps progress outside 0 to 1 and ignores NaN", () => {
    expect(pipelineEdge(xs, -2)).toBe(130);
    expect(pipelineEdge(xs, 9)).toBe(1170);
    expect(pipelineEdge(xs, Number.NaN)).toBe(130);
  });

  it("at the start nothing is lit; just past it only the first card is partly lit", () => {
    expect(lit(0)).toEqual([0, 0, 0, 0]);
    const on = lit(0.05);
    expect(on[0]).toBeGreaterThan(0);
    expect(on[0]).toBeLessThan(1);
    expect(on.slice(1)).toEqual([0, 0, 0]);
  });

  it("at the end every card is fully lit", () => {
    expect(lit(1)).toEqual([1, 1, 1, 1]);
  });

  it("is cumulative: a card that has been passed stays lit while later ones wait", () => {
    const on = lit(0.5);
    expect(on[0]).toBe(1);
    expect(on[1]).toBe(1);
    expect(on[2]).toBe(0);
    expect(on[3]).toBe(0);
    for (const p of [0.1, 0.3, 0.45, 0.6, 0.8]) {
      const a = lit(p);
      const b = lit(p + 0.05);
      a.forEach((v, i) => expect(b[i]).toBeGreaterThanOrEqual(v));
      for (let i = 1; i < a.length; i++) expect(a[i - 1]).toBeGreaterThanOrEqual(a[i]);
    }
  });

  it("keeps every value inside 0 to 1", () => {
    for (let p = -0.2; p <= 1.2; p += 0.05) for (const v of lit(p)) expect(v >= 0 && v <= 1).toBe(true);
  });
});
