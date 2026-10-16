import { describe, expect, it } from "vitest";
import { resolveTheme, THEME_SCRIPT } from "./theme";

describe("resolveTheme", () => {
  it("honours a stored valid theme over the system preference", () => {
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });
  it("falls back to the system preference when nothing is stored", () => {
    expect(resolveTheme(null, true)).toBe("dark");
    expect(resolveTheme(null, false)).toBe("light");
  });
  it("ignores invalid stored values", () => {
    expect(resolveTheme("garbage", false)).toBe("light");
    expect(resolveTheme("garbage", true)).toBe("dark");
  });
});

describe("THEME_SCRIPT", () => {
  function run(opts: { stored?: string | null; throws?: boolean; dark: boolean }) {
    const attrs: Record<string, string> = {};
    const localStorage = {
      getItem: () => {
        if (opts.throws) throw new Error("blocked");
        return opts.stored ?? null;
      },
    };
    const matchMedia = () => ({ matches: opts.dark });
    const document = { documentElement: { setAttribute: (k: string, v: string) => (attrs[k] = v) } };
    new Function("localStorage", "matchMedia", "document", THEME_SCRIPT)(localStorage, matchMedia, document);
    return attrs["data-theme"];
  }
  it("uses the stored theme", () => {
    expect(run({ stored: "light", dark: true })).toBe("light");
  });
  it("resolves from the system preference when storage throws", () => {
    expect(run({ throws: true, dark: false })).toBe("light");
    expect(run({ throws: true, dark: true })).toBe("dark");
  });
  it("resolves from the system preference for an invalid value", () => {
    expect(run({ stored: "x", dark: false })).toBe("light");
  });
});
