import type Lenis from "lenis";

/**
 * The page's one smooth-scroll instance, created by the provider (desktop with motion only). Overlays such as the
 * lightbox read it to pause scrolling while they are open; it is null on touch devices and under reduced motion.
 */
let instance: Lenis | null = null;

export function setLenis(next: Lenis | null): void {
  instance = next;
}

export function getLenis(): Lenis | null {
  return instance;
}
