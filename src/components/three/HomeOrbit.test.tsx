import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

const motion = vi.hoisted(() => ({
  reduced: false,
  kill: vi.fn(),
  create: vi.fn(),
  refresh: vi.fn(),
}));

vi.mock("@/lib/motion", () => ({
  registerGsap: vi.fn(),
  prefersReducedMotion: () => motion.reduced,
  ScrollTrigger: {
    create: (...args: unknown[]) => {
      motion.create(...args);
      return { kill: motion.kill };
    },
    refresh: motion.refresh,
  },
}));
vi.mock("@/lib/useTier", () => ({ useTier: () => "high" }));
vi.mock("./EarthCanvas", () => ({ default: () => <div data-testid="canvas" /> }));
vi.mock("@/components/layout/Preloader", () => ({ Preloader: () => <div data-testid="preloader" /> }));

import HomeOrbit from "./HomeOrbit";

describe("HomeOrbit", () => {
  beforeEach(() => {
    motion.reduced = false;
    motion.kill.mockClear();
    motion.create.mockClear();
    motion.refresh.mockClear();
  });
  afterEach(() => cleanup());

  it("renders the canvas, the preloader and its children", () => {
    render(
      <HomeOrbit>
        <p>child</p>
      </HomeOrbit>,
    );
    expect(screen.getByTestId("canvas")).toBeTruthy();
    expect(screen.getByTestId("preloader")).toBeTruthy();
    expect(screen.getByText("child")).toBeTruthy();
  });

  it("creates one scrubbed ScrollTrigger over its own height and kills it on unmount", () => {
    const { unmount } = render(
      <HomeOrbit>
        <p>child</p>
      </HomeOrbit>,
    );
    expect(motion.create).toHaveBeenCalledTimes(1);
    const config = motion.create.mock.calls[0][0] as Record<string, unknown>;
    expect(config).toMatchObject({ start: "top top", end: "bottom bottom", scrub: true });
    expect(typeof config.onUpdate).toBe("function");
    unmount();
    expect(motion.kill).toHaveBeenCalledTimes(1);
  });

  it("creates no ScrollTrigger with reduced motion", () => {
    motion.reduced = true;
    render(
      <HomeOrbit>
        <p>child</p>
      </HomeOrbit>,
    );
    expect(motion.create).not.toHaveBeenCalled();
  });
});
