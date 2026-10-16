/** Written by the scroll driver (Task 13) through `setScrollProgress`, read every frame by the scene. */
export const scrollState = { progress: 0, visible: true };

type Listener = (progress: number) => void;
const listeners = new Set<Listener>();

/**
 * Stores the progress (0..1) and tells subscribers, so a sleeping render loop can wake up on a
 * progress change alone. Task 13 calls this from ScrollTrigger.
 */
export function setScrollProgress(progress: number): void {
  scrollState.progress = progress;
  listeners.forEach((listener) => listener(progress));
}

/** Calls `listener` on every `setScrollProgress`. Returns the unsubscribe function. */
export function subscribeScrollProgress(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/** Canvas wrapper opacity for a scroll progress: fully visible until 85%, gone at 100%. */
export function fadeFor(progress: number): number {
  return 1 - smoothstep(0.85, 1, progress);
}

/** Writes the fade to the DOM, only when it moved enough to matter (always at the 0 and 1 ends). */
export function writeFade(el: HTMLElement | null, progress: number): number {
  const next = fadeFor(progress);
  if (el) {
    const prev = el.style.opacity === "" ? 1 : Number(el.style.opacity);
    if (Math.abs(prev - next) > 0.005 || (next === 0 && prev !== 0) || (next === 1 && prev !== 1)) {
      el.style.opacity = String(next);
    }
  }
  return next;
}
