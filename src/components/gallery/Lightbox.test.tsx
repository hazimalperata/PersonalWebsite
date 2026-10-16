// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));
vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key }));

let present = true;
vi.mock("motion/react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("motion/react")>()),
  useIsPresent: () => present,
}));

import type Lenis from "lenis";
import { setLenis } from "@/components/signal/lenis";
import { Lightbox } from "./Lightbox";

const items = [
  { src: "/a.jpeg", width: 2000, height: 1126, alt: "A" },
  { src: "/b.jpeg", width: 1126, height: 2000, alt: "B" },
  { src: "/c.jpeg", width: 2000, height: 1126, alt: "C" },
];

afterEach(() => {
  setLenis(null);
  present = true;
  cleanup();
  document.body.style.overflow = "";
});

describe("Lightbox", () => {
  it("pauses the page's smooth scroll while open and resumes it on close", () => {
    const lenis = { stop: vi.fn(), start: vi.fn() };
    setLenis(lenis as unknown as Lenis);
    const { unmount } = render(<Lightbox items={items} index={0} onClose={() => {}} onIndex={() => {}} />);
    expect(lenis.stop).toHaveBeenCalledTimes(1);
    expect(lenis.start).not.toHaveBeenCalled();
    unmount();
    expect(lenis.start).toHaveBeenCalledTimes(1);
  });

  it("names the dialog after the current photo and announces navigation", () => {
    render(<Lightbox items={items} index={1} onClose={() => {}} onIndex={() => {}} />);
    expect(screen.getByRole("dialog", { name: "B" })).toBeTruthy();
    const live = document.querySelector("[aria-live=polite]");
    expect(live?.textContent).toContain("B");
    expect(live?.textContent).toContain("2 / 3");
  });

  it("closes on a backdrop click but not on the photo or the controls", () => {
    const onClose = vi.fn();
    render(<Lightbox items={items} index={0} onClose={() => {}} onIndex={() => {}} />);
    cleanup();
    render(<Lightbox items={items} index={0} onClose={onClose} onIndex={() => {}} />);
    fireEvent.click(screen.getByAltText("A"));
    fireEvent.click(screen.getByRole("button", { name: "next" }));
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("dialog"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("ignores arrows combined with modifier keys", () => {
    const onIndex = vi.fn();
    render(<Lightbox items={items} index={0} onClose={() => {}} onIndex={onIndex} />);
    fireEvent.keyDown(document, { key: "ArrowRight", altKey: true });
    fireEvent.keyDown(document, { key: "ArrowLeft", metaKey: true });
    expect(onIndex).not.toHaveBeenCalled();
  });

  it("is inert and ignores keys and the scroll lock once it is exiting", () => {
    const onClose = vi.fn();
    const onIndex = vi.fn();
    present = false;
    render(<Lightbox items={items} index={0} onClose={onClose} onIndex={onIndex} />);
    expect(document.querySelector("[role=dialog]")?.hasAttribute("inert")).toBe(true);
    expect(document.body.style.overflow).toBe("");
    fireEvent.keyDown(document, { key: "Escape" });
    fireEvent.keyDown(document, { key: "ArrowRight" });
    expect(onClose).not.toHaveBeenCalled();
    expect(onIndex).not.toHaveBeenCalled();
  });

  it("opens as a modal dialog with focus on the close button", () => {
    render(<Lightbox items={items} index={1} onClose={() => {}} onIndex={() => {}} />);
    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "close" }));
    expect(screen.getByAltText("B")).toBeTruthy();
  });

  it("locks body scroll while open and restores it on unmount", () => {
    const { unmount } = render(<Lightbox items={items} index={0} onClose={() => {}} onIndex={() => {}} />);
    expect(document.body.style.overflow).toBe("hidden");
    unmount();
    expect(document.body.style.overflow).toBe("");
  });

  it("closes on Escape", () => {
    const onClose = vi.fn();
    render(<Lightbox items={items} index={0} onClose={onClose} onIndex={() => {}} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("navigates with the arrow keys and wraps around", () => {
    const onIndex = vi.fn();
    const { rerender } = render(<Lightbox items={items} index={0} onClose={() => {}} onIndex={onIndex} />);
    fireEvent.keyDown(document, { key: "ArrowRight" });
    expect(onIndex).toHaveBeenLastCalledWith(1);
    fireEvent.keyDown(document, { key: "ArrowLeft" });
    expect(onIndex).toHaveBeenLastCalledWith(2);
    rerender(<Lightbox items={items} index={2} onClose={() => {}} onIndex={onIndex} />);
    fireEvent.keyDown(document, { key: "ArrowRight" });
    expect(onIndex).toHaveBeenLastCalledWith(0);
  });

  it("traps Tab and Shift+Tab inside the dialog", () => {
    render(<Lightbox items={items} index={0} onClose={() => {}} onIndex={() => {}} />);
    const close = screen.getByRole("button", { name: "close" });
    const next = screen.getByRole("button", { name: "next" });
    next.focus();
    fireEvent.keyDown(next, { key: "Tab" });
    expect(document.activeElement).toBe(close);
    fireEvent.keyDown(close, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(next);
  });

  it("pulls focus back into the dialog when it sits outside", () => {
    render(
      <>
        <button type="button">outside</button>
        <Lightbox items={items} index={0} onClose={() => {}} onIndex={() => {}} />
      </>,
    );
    const outside = screen.getByRole("button", { name: "outside" });
    outside.focus();
    fireEvent.keyDown(outside, { key: "Tab" });
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "close" }));
  });
});
