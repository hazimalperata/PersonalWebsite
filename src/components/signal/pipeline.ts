/**
 * The workflow pipeline's left-to-right fill. `xs` are the four node centres (viewport px), `p` the scroll progress
 * through the pinned runway (0 to 1). The edge starts just left of the first node and ends just right of the last one.
 */
const EDGE_PAD = 70;
const SOFT = 90;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Viewport x the fill has reached at progress `p`. */
export function pipelineEdge(xs: readonly number[], p: number): number {
  const x0 = xs[0] - EDGE_PAD;
  const x1 = xs[xs.length - 1] + EDGE_PAD;
  return x0 + (x1 - x0) * clamp01(Number.isNaN(p) ? 0 : p);
}

/** How lit each node and its card is for an edge at `edge`: 0 (not reached) to 1 (passed), cumulative. */
export function pipelineEmphasis<T extends number[] | Float32Array = number[]>(xs: readonly number[], edge: number, out?: T): T {
  const res = (out ?? new Array<number>(xs.length)) as T;
  for (let i = 0; i < xs.length; i++) res[i] = clamp01((edge - xs[i]) / SOFT + 0.5);
  return res;
}
