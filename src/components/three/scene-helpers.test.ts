import { describe, expect, it, vi } from "vitest";
import { fadeFor, scrollState, setScrollProgress, subscribeScrollProgress, writeFade } from "./scrollState";
import { SceneTheme } from "./useSceneTheme";

describe("fadeFor", () => {
  it("is 1 until 85%, 0 at 100%, smooth and monotonic in between", () => {
    expect(fadeFor(0)).toBe(1);
    expect(fadeFor(0.85)).toBe(1);
    expect(fadeFor(1)).toBe(0);
    expect(fadeFor(0.925)).toBeCloseTo(0.5, 5);
    let prev = 1;
    for (let p = 0.85; p <= 1; p += 0.01) {
      const f = fadeFor(p);
      expect(f).toBeLessThanOrEqual(prev + 1e-9);
      prev = f;
    }
  });
});

describe("writeFade", () => {
  it("writes the opacity only when it moved by more than 0.005", () => {
    const el = document.createElement("div");
    expect(writeFade(el, 0)).toBe(1);
    expect(el.style.opacity).toBe(""); // already at 1, nothing written
    writeFade(el, 0.95);
    const written = el.style.opacity;
    expect(Number(written)).toBeCloseTo(fadeFor(0.95), 5);
    writeFade(el, 0.9501); // tiny change: left alone
    expect(el.style.opacity).toBe(written);
    writeFade(el, 1);
    expect(el.style.opacity).toBe("0");
    writeFade(el, 0);
    expect(el.style.opacity).toBe("1");
  });

  it("tolerates a missing element", () => {
    expect(writeFade(null, 1)).toBe(0);
  });
});

describe("setScrollProgress", () => {
  it("stores the value and notifies subscribers until they unsubscribe", () => {
    const listener = vi.fn();
    const off = subscribeScrollProgress(listener);
    setScrollProgress(0.4);
    expect(scrollState.progress).toBe(0.4);
    expect(listener).toHaveBeenCalledWith(0.4);
    off();
    setScrollProgress(0.7);
    expect(scrollState.progress).toBe(0.7);
    expect(listener).toHaveBeenCalledTimes(1);
    setScrollProgress(0);
  });
});

describe("SceneTheme.step", () => {
  it("starts at the theme's own values", () => {
    const t = new SceneTheme("dark");
    expect(t.sunAngle).toBe(3.8);
    expect(t.atmosphereAlpha).toBe(0);
    expect(new SceneTheme("light").starsOpacity).toBe(0);
  });

  it("settles on the other theme in about a second, passing the middle on the way", () => {
    const t = new SceneTheme("dark");
    const dt = 1 / 60;
    let crossedMiddle = false;
    for (let i = 0; i < 60; i++) {
      t.step("light", dt);
      if (Math.abs(t.sunAngle - 2.6) < 0.1) crossedMiddle = true;
    }
    expect(crossedMiddle).toBe(true);
    expect(t.sunAngle).toBeCloseTo(1.4, 1);
    expect(t.ambient).toBeCloseTo(0.45, 1);
    expect(t.atmosphereAlpha).toBeGreaterThan(0.85);
    expect(t.starsOpacity).toBeLessThan(0.03);
    expect(t.atmosphere.getHexString()).not.toBe("8ccbff");
  });

  it("does not move when already at the target", () => {
    const t = new SceneTheme("light");
    t.step("light", 0.016);
    expect(t.sunAngle).toBeCloseTo(1.4, 6);
    expect(t.ambient).toBeCloseTo(0.45, 6);
  });
});
