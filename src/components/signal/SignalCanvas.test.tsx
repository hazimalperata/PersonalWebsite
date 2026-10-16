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

  it("renders the static timeline (role img, named from signal.staticLabel) when WebGL is absent", async () => {
    vi.stubGlobal("WebGLRenderingContext", undefined);
    expect(() => render(<SignalCanvas coarse={false} />)).not.toThrow();
    const img = await screen.findByRole("img", { name: "signal.staticLabel" });
    expect(img).toBeTruthy();
    expect(screen.queryByTestId("engine")).toBeNull();
  });

  it("falls back when the context cannot be created", async () => {
    vi.stubGlobal("WebGLRenderingContext", function WebGLRenderingContext() {});
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(() => null);
    render(<SignalCanvas coarse={false} />);
    expect(await screen.findByRole("img", { name: "signal.staticLabel" })).toBeTruthy();
  });

  it("mounts the engine when WebGL works, and drops to the static timeline when the context is lost", async () => {
    vi.stubGlobal("WebGLRenderingContext", function WebGLRenderingContext() {});
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(
      () => ({ getExtension: () => ({ loseContext: () => {} }) }) as unknown as RenderingContext,
    );
    render(<SignalCanvas coarse={false} />);
    await waitFor(() => expect(screen.getByTestId("engine")).toBeTruthy());
    expect(screen.queryByRole("img")).toBeNull();
    vi.restoreAllMocks();
    act(() => lose?.());
    expect(await screen.findByRole("img", { name: "signal.staticLabel" })).toBeTruthy();
    expect(screen.queryByTestId("engine")).toBeNull();
  });
});
