import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";

vi.mock("next-intl", () => ({
  useTranslations: (ns?: string) => (key: string) => (ns ? `${ns}.${key}` : key),
  useLocale: () => "en",
}));

let lose: (() => void) | null = null;
vi.mock("./SignalEngine", () => ({
  default: ({ onLost }: { onLost: () => void }) => {
    lose = onLost;
    return <div data-testid="engine" />;
  },
}));

import { SignalCanvas } from "./SignalCanvas";

class FakeResizeObserver {
  observe() {}
  disconnect() {}
  unobserve() {}
}

describe("SignalCanvas fallbacks", () => {
  beforeEach(() => {
    vi.stubGlobal("ResizeObserver", FakeResizeObserver);
    lose = null;
  });
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  const staticEl = () => document.querySelector("[data-signal-static]");
  const modeFlag = () => document.documentElement.hasAttribute("data-signal-static-mode");

  it("renders the static timeline (aria-hidden, flagging <html>) when WebGL is absent", async () => {
    vi.stubGlobal("WebGLRenderingContext", undefined);
    expect(() => render(<SignalCanvas coarse={false} />)).not.toThrow();
    await waitFor(() => expect(staticEl()).toBeTruthy());
    expect(staticEl()?.querySelector("canvas")?.getAttribute("aria-hidden")).toBe("true");
    expect(screen.queryByRole("img")).toBeNull();
    expect(modeFlag()).toBe(true);
    expect(screen.queryByTestId("engine")).toBeNull();
    cleanup();
    expect(modeFlag()).toBe(false);
  });

  it("falls back when the context cannot be created", async () => {
    vi.stubGlobal("WebGLRenderingContext", function WebGLRenderingContext() {});
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(() => null);
    render(<SignalCanvas coarse={false} />);
    await waitFor(() => expect(staticEl()).toBeTruthy());
    expect(modeFlag()).toBe(true);
  });

  it("mounts the engine when WebGL works, and drops to the static timeline when the context is lost", async () => {
    vi.stubGlobal("WebGLRenderingContext", function WebGLRenderingContext() {});
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(
      () => ({ getExtension: () => ({ loseContext: () => {} }) }) as unknown as RenderingContext,
    );
    render(<SignalCanvas coarse={false} />);
    await waitFor(() => expect(screen.getByTestId("engine")).toBeTruthy());
    expect(staticEl()).toBeNull();
    expect(modeFlag()).toBe(false);
    vi.restoreAllMocks();
    act(() => lose?.());
    await waitFor(() => expect(staticEl()).toBeTruthy());
    expect(modeFlag()).toBe(true);
    expect(screen.queryByTestId("engine")).toBeNull();
  });
});
