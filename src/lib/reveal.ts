/** Latest the split may land after first contentful paint and still replay as a reveal (ms). */
export const REVEAL_WINDOW_MS = 150;

/**
 * Decide whether the headline reveal should run. If the split lands well after the
 * SSR text painted (slow device), replaying would blink the text out and back in,
 * so the text stays in place. Unknown FCP counts as late.
 */
export function shouldReveal(fcpStart: number | undefined, now: number): boolean {
  if (fcpStart === undefined) return false;
  return now - fcpStart <= REVEAL_WINDOW_MS;
}

export function currentFcp(): number | undefined {
  return performance.getEntriesByName("first-contentful-paint")[0]?.startTime;
}
