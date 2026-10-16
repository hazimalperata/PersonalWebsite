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

/** Attribute names the field reads. Pages must use these constants, not string literals. */
export const SIGNAL_ATTR = {
  /** home section anchor, value is a HomeState (set by SignalSection) */
  section: "data-signal",
  /** case page header: the box its timeline is drawn into */
  header: "data-signal-header",
  /** 404: the way-home link the points settle around */
  target: "data-signal-target",
  /** `data-signal-work="<i>"`: the stage a work cluster is drawn in */
  work: "data-signal-work",
  /** `data-signal-step="<i>"`: the element a pipeline node sits on */
  step: "data-signal-step",
  /** the workflow runway element: the engine writes the cards' `--on0..3` emphasis on it while the pipeline fills */
  pipeRun: "data-signal-pipe-run",
  /** the 2D fallback layer (reduced motion, no WebGL) */
  static: "data-signal-static",
  /** the decorative label overlay drawn over the field */
  overlay: "data-signal-overlay",
} as const;

export const signalSelector = (attr: keyof typeof SIGNAL_ATTR, index?: number) =>
  index === undefined ? `[${SIGNAL_ATTR[attr]}]` : `[${SIGNAL_ATTR[attr]}="${index}"]`;

/**
 * Box (viewport px) an element will have while its state is showing: the document position minus the scroll
 * at which the owning `[data-signal]` section is centred (the same hold position the scroll map uses). Without
 * an owning section the element itself is centred. `null` when absent or empty.
 */
export function anchoredBox(selector: string): Box | null {
  if (typeof document === "undefined") return null;
  const el = document.querySelector<HTMLElement>(selector);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  if (r.width === 0 && r.height === 0) return null;
  const owner = el.closest<HTMLElement>("[data-signal]") ?? el;
  const o = owner.getBoundingClientRect();
  const vh = window.innerHeight;
  const maxScroll = Math.max(0, document.documentElement.scrollHeight - vh);
  const active = Math.min(maxScroll, Math.max(0, o.top + window.scrollY + (Math.min(o.height, vh) - vh) / 2));
  return { x: r.left, y: r.top + window.scrollY - active, w: r.width, h: r.height };
}
