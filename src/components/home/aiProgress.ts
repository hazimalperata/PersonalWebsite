/** Which of the `count` workflow steps is active at scroll progress `p` (0 to 1) through the pinned runway. */
export function stepForProgress(p: number, count: number): number {
  if (count <= 0 || Number.isNaN(p)) return 0;
  return Math.min(count - 1, Math.max(0, Math.floor(p * count)));
}
