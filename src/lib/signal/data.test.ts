import { describe, expect, it } from "vitest";
import rawSignal from "@/data/signal.json";
import { lanes } from "@/data/lanes";
import { laneForSlug, laneRange, laneTotal, signal, signalRange, totalCommits } from "./data";

describe("signal data", () => {
  it("totalCommits equals the sum of all days", () => {
    const sum = signal.lanes.reduce((s, l) => s + l.days.reduce((t, x) => t + x.n, 0), 0);
    expect(totalCommits).toBe(sum);
    expect(totalCommits).toBeGreaterThan(0);
  });

  it("every signal lane id exists in lanes", () => {
    const ids = new Set(lanes.map((l) => l.id));
    for (const l of signal.lanes) expect(ids.has(l.id)).toBe(true);
  });

  it("lanes are ordered chronologically by first commit", () => {
    const firsts = lanes.map((l) => laneRange(l.id)?.first ?? "9999");
    expect(firsts).toEqual([...firsts].sort());
  });

  it("maps slugs to lanes", () => {
    expect(laneForSlug("posme")).toBe("posme");
    expect(laneForSlug("1likte-seller-panel")).toBe("seller");
    expect(laneForSlug("adventures-of-the-knight")).toBeNull();
  });

  it("laneTotal and laneRange agree with the data", () => {
    expect(laneTotal("site")).toBeGreaterThan(0);
    const r = laneRange("site");
    expect(r).not.toBeNull();
    expect(r!.first <= r!.last).toBe(true);
    expect(signalRange.first <= signalRange.last).toBe(true);
  });

  it("signal.json contains only the allowed keys", () => {
    const allowed = new Set(["generatedAt", "lanes", "id", "days", "d", "n"]);
    const walk = (v: unknown) => {
      if (Array.isArray(v)) v.forEach(walk);
      else if (v && typeof v === "object") {
        for (const [k, val] of Object.entries(v)) {
          expect(allowed.has(k)).toBe(true);
          walk(val);
        }
      }
    };
    walk(rawSignal);
  });
});
