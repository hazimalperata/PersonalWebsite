import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";

vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key }));

import { Preloader, SHOW_AFTER_MS } from "./Preloader";

const label = () => screen.queryByText("preloader.label");
const advance = (ms: number) =>
  act(() => {
    vi.advanceTimersByTime(ms);
  });

describe("Preloader", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.clear();
  });
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("stays hidden until the scene is still not ready 300 ms after mount", () => {
    render(<Preloader ready={false} tier="high" />);
    expect(label()).toBeNull();
    advance(SHOW_AFTER_MS - 1);
    expect(label()).toBeNull();
    advance(1);
    expect(label()).not.toBeNull();
  });

  it("never shows when the scene is ready within 300 ms, and remembers it for the session", () => {
    const { rerender } = render(<Preloader ready={false} tier="high" />);
    advance(100);
    rerender(<Preloader ready tier="high" />);
    advance(1000);
    expect(label()).toBeNull();
    expect(sessionStorage.getItem("preloaded")).toBe("1");
  });

  it("hides when ready flips to true while shown", () => {
    const { rerender } = render(<Preloader ready={false} tier="high" />);
    advance(SHOW_AFTER_MS);
    expect(label()).not.toBeNull();
    rerender(<Preloader ready tier="high" />);
    expect(label()).toBeNull();
    expect(sessionStorage.getItem("preloaded")).toBe("1");
  });

  it("hides after 1500 ms even when the scene never reports ready", () => {
    render(<Preloader ready={false} tier="high" />);
    advance(1499);
    expect(label()).not.toBeNull();
    advance(1);
    expect(label()).toBeNull();
    expect(sessionStorage.getItem("preloaded")).toBe("1");
  });

  it("is decorative: aria-hidden and not a live region", () => {
    const { container } = render(<Preloader ready={false} tier="high" />);
    advance(SHOW_AFTER_MS);
    const root = container.firstElementChild as HTMLElement;
    expect(root.getAttribute("aria-hidden")).toBe("true");
    expect(root.hasAttribute("aria-live")).toBe(false);
  });

  it("is never shown on the mobile tier", () => {
    render(<Preloader ready={false} tier="low" />);
    advance(1000);
    expect(label()).toBeNull();
  });

  it("does not render when it already ran this session", () => {
    sessionStorage.setItem("preloaded", "1");
    const { container } = render(<Preloader ready={false} tier="high" />);
    advance(1000);
    expect(container.firstChild).toBeNull();
  });
});
