import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { useEffect } from "react";
import type { Tier } from "@/lib/capabilities";

const state: { tier: Tier | null; theme: "dark" | "light"; sceneThrows: boolean; preflightFails: boolean } = {
  tier: null,
  theme: "dark",
  sceneThrows: false,
  preflightFails: false,
};
const preflighted: string[] = [];

// jsdom does not load images: stand in for the texture preflight (new Image() + decode()).
class FakeImage {
  src = "";
  decode() {
    preflighted.push(this.src);
    return state.preflightFails ? Promise.reject(new Error("decode")) : Promise.resolve();
  }
}
vi.stubGlobal("Image", FakeImage);

vi.mock("@/lib/useTier", () => ({ useTier: () => state.tier }));
vi.mock("@/components/layout/ThemeProvider", () => ({
  useTheme: () => ({ theme: state.theme, setTheme: () => {} }),
}));
function FakeScene({ onReady }: { onReady?: () => void }) {
  if (state.sceneThrows) throw new Error("gl");
  useEffect(() => {
    onReady?.();
  }, [onReady]);
  return <div data-testid="scene" />;
}
vi.mock("./EarthScene", () => ({ default: FakeScene }));

import EarthCanvas, { PREFLIGHT_TIMEOUT_MS, SETTLE_MS, preflightTextures } from "./EarthCanvas";

describe("EarthCanvas", () => {
  beforeEach(() => {
    state.tier = null;
    state.theme = "dark";
    state.sceneThrows = false;
    state.preflightFails = false;
    preflighted.length = 0;
  });
  afterEach(() => cleanup());

  it("renders nothing before the tier is known (SSR)", () => {
    const { container } = render(<EarthCanvas />);
    expect(container.firstChild).toBeNull();
  });

  it("renders the poster for tier poster, picked by theme", () => {
    state.tier = "poster";
    const { rerender } = render(<EarthCanvas />);
    const img = screen.getByRole("presentation", { hidden: true }) as HTMLImageElement;
    expect(img.getAttribute("alt")).toBe("");
    expect(decodeURIComponent(img.src)).toContain("/posters/earth-dark.webp");
    expect(screen.queryByTestId("scene")).toBeNull();

    state.theme = "light";
    rerender(<EarthCanvas />);
    const light = screen.getByRole("presentation", { hidden: true }) as HTMLImageElement;
    expect(decodeURIComponent(light.src)).toContain("/posters/earth-light.webp");
  });

  it("is a fixed, inert, aria-hidden backdrop", () => {
    state.tier = "poster";
    const { container } = render(<EarthCanvas />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.getAttribute("aria-hidden")).toBe("true");
    expect(wrapper.className).toContain("pointer-events-none");
    expect(wrapper.className).toContain("fixed");
    expect(wrapper.style.viewTransitionName).toBe("earth");
  });

  it("mounts the scene after idle, without the settle delay, for tier high", async () => {
    state.tier = "high";
    render(<EarthCanvas />);
    expect(screen.queryByTestId("scene")).toBeNull();
    expect(await screen.findByTestId("scene")).toBeTruthy();
  });

  it("preflights every scene texture for the tier before mounting the scene", async () => {
    state.tier = "high";
    render(<EarthCanvas />);
    await screen.findByTestId("scene");
    expect(preflighted).toEqual([
      "/textures/earth/4k/day.webp",
      "/textures/earth/4k/lights.webp",
      "/textures/earth/4k/bump.webp",
      "/textures/earth/4k/clouds.webp",
      "/textures/earth/4k/clouds-alpha.webp",
      "/textures/space/star.png",
    ]);
  });

  it("shows the poster and never mounts the scene when a texture fails to load", async () => {
    state.tier = "high";
    state.preflightFails = true;
    const onReady = vi.fn();
    render(<EarthCanvas onReady={onReady} />);
    await waitFor(() => {
      const img = screen.getByRole("presentation", { hidden: true }) as HTMLImageElement;
      expect(decodeURIComponent(img.src)).toContain("/posters/earth-dark.webp");
    });
    expect(screen.queryByTestId("scene")).toBeNull();
    expect(onReady).toHaveBeenCalledTimes(1);
  });

  it("waits for the settle delay before mounting the scene for tier low", async () => {
    vi.useFakeTimers();
    try {
      state.tier = "low";
      render(<EarthCanvas />);
      act(() => {
        vi.advanceTimersByTime(SETTLE_MS - 100);
      });
      expect(screen.queryByTestId("scene")).toBeNull();
      await act(async () => {
        await vi.advanceTimersByTimeAsync(2000);
      });
      expect(screen.queryByTestId("scene")).not.toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it("falls back to the poster when the scene throws", async () => {
    state.tier = "high";
    state.sceneThrows = true;
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<EarthCanvas />);
    await waitFor(() => {
      const img = screen.getByRole("presentation", { hidden: true }) as HTMLImageElement;
      expect(decodeURIComponent(img.src)).toContain("/posters/earth-dark.webp");
    });
    spy.mockRestore();
    warn.mockRestore();
  });

  it("calls onReady once for the poster tier, even when the callback identity changes", () => {
    state.tier = "poster";
    const first = vi.fn();
    const second = vi.fn();
    const { rerender } = render(<EarthCanvas onReady={first} />);
    rerender(<EarthCanvas onReady={second} />);
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).not.toHaveBeenCalled();
  });

  it("calls onReady once when the scene fails, so a preloader never hangs", async () => {
    state.tier = "high";
    state.sceneThrows = true;
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const onReady = vi.fn();
    render(<EarthCanvas onReady={onReady} />);
    await waitFor(() => expect(onReady).toHaveBeenCalledTimes(1));
    expect(warn).toHaveBeenCalled();
    spy.mockRestore();
    warn.mockRestore();
  });

  it("calls onReady when the scene reports its textures loaded", async () => {
    state.tier = "high";
    const onReady = vi.fn();
    render(<EarthCanvas onReady={onReady} />);
    await screen.findByTestId("scene");
    expect(onReady).toHaveBeenCalledTimes(1);
  });

  it("rejects a texture preflight that never settles after the timeout", async () => {
    vi.useFakeTimers();
    try {
      vi.stubGlobal(
        "Image",
        class {
          src = "";
          decode() {
            return new Promise<void>(() => {});
          }
        },
      );
      const result = preflightTextures(["/a.webp"]);
      const assertion = expect(result).rejects.toThrow("timed out");
      await vi.advanceTimersByTimeAsync(PREFLIGHT_TIMEOUT_MS + 1);
      await assertion;
    } finally {
      vi.stubGlobal("Image", FakeImage);
      vi.useRealTimers();
    }
  });
});
