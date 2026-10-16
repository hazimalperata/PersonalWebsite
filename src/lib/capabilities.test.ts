import { describe, expect, it } from "vitest";
import { createTierStore, detectTier, posterFor, textureSet, type CapEnv } from "./capabilities";
import { vi } from "vitest";

const base: CapEnv = {
  reducedMotion: false,
  coarsePointer: false,
  cores: 8,
  memoryGb: 8,
  saveData: false,
  webgl2: true,
  width: 1440,
};

describe("detectTier", () => {
  it("poster when reduced motion", () => expect(detectTier({ ...base, reducedMotion: true })).toBe("poster"));
  it("poster when no webgl2", () => expect(detectTier({ ...base, webgl2: false })).toBe("poster"));
  it("poster when save-data", () => expect(detectTier({ ...base, saveData: true })).toBe("poster"));
  it("poster wins over low signals", () =>
    expect(detectTier({ ...base, reducedMotion: true, coarsePointer: true, cores: 2 })).toBe("poster"));
  it("low on coarse pointer or few cores", () => {
    expect(detectTier({ ...base, coarsePointer: true })).toBe("low");
    expect(detectTier({ ...base, cores: 4 })).toBe("low");
  });
  it("low on little memory (null memory does not count)", () => {
    expect(detectTier({ ...base, memoryGb: 4 })).toBe("low");
    expect(detectTier({ ...base, memoryGb: null })).toBe("high");
  });
  it("low on narrow viewport", () => {
    expect(detectTier({ ...base, width: 767 })).toBe("low");
    expect(detectTier({ ...base, width: 768 })).toBe("high");
  });
  it("high otherwise", () => expect(detectTier(base)).toBe("high"));
});

describe("paths", () => {
  it("textureSet returns absolute public paths per tier", () => {
    expect(textureSet("high")).toEqual({
      map: "/textures/earth/4k/day.webp",
      lights: "/textures/earth/4k/lights.webp",
      clouds: "/textures/earth/4k/clouds.webp",
      cloudsAlpha: "/textures/earth/4k/clouds-alpha.webp",
      bump: "/textures/earth/4k/bump.webp",
    });
    expect(textureSet("low").map).toBe("/textures/earth/2k/day.webp");
  });
  it("posterFor maps theme to poster", () => {
    expect(posterFor("dark")).toBe("/posters/earth-dark.webp");
    expect(posterFor("light")).toBe("/posters/earth-light.webp");
  });
});

describe("createTierStore", () => {
  it("reads the environment once across repeated getSnapshot calls", () => {
    const read = vi.fn(() => base);
    const store = createTierStore(read);
    expect(store.getSnapshot()).toBe("high");
    expect(store.getSnapshot()).toBe("high");
    expect(read).toHaveBeenCalledTimes(1);
  });
  it("re-detects after invalidate", () => {
    let env = base;
    const read = vi.fn(() => env);
    const store = createTierStore(read);
    expect(store.getSnapshot()).toBe("high");
    env = { ...base, reducedMotion: true };
    expect(store.getSnapshot()).toBe("high");
    store.invalidate();
    expect(store.getSnapshot()).toBe("poster");
    expect(read).toHaveBeenCalledTimes(2);
  });
});
