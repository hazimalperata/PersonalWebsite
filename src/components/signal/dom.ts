import type { Box } from "./states";

/**
 * Document-space box of the first element matching `selector`, as it would sit at scroll 0
 * (the field is fixed, so states are built once for the top of the page). `null` when absent.
 */
export function elementBox(selector: string): Box | null {
  if (typeof document === "undefined") return null;
  const el = document.querySelector<HTMLElement>(selector);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  if (r.width === 0 && r.height === 0) return null;
  return { x: r.left, y: r.top + window.scrollY, w: r.width, h: r.height };
}
