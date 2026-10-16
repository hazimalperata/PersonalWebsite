import { lanes, type LaneId } from "@/data/lanes";
import rawSignal from "@/data/signal.json";

// One import path for consumers: lane definitions and commit data together.
export { lanes };
export type { Lane, LaneId } from "@/data/lanes";

export interface SignalDay {
  /** YYYY-MM-DD */
  d: string;
  n: number;
}
export interface SignalLane {
  id: LaneId;
  days: SignalDay[];
}
export interface SignalData {
  generatedAt: string;
  lanes: SignalLane[];
}

export const signal: SignalData = rawSignal as SignalData;

const sum = (days: SignalDay[]) => days.reduce((s, x) => s + x.n, 0);

export function laneTotal(id: LaneId): number {
  const lane = signal.lanes.find((l) => l.id === id);
  return lane ? sum(lane.days) : 0;
}

export function laneRange(id: LaneId): { first: string; last: string } | null {
  const lane = signal.lanes.find((l) => l.id === id);
  if (!lane || lane.days.length === 0) return null;
  return { first: lane.days[0].d, last: lane.days[lane.days.length - 1].d };
}

export function laneForSlug(slug: string): LaneId | null {
  return lanes.find((l) => l.slug === slug)?.id ?? null;
}

export const totalCommits: number = signal.lanes.reduce((s, l) => s + sum(l.days), 0);

const allDays = signal.lanes.flatMap((l) => l.days.map((x) => x.d)).sort();
export const signalRange: { first: string; last: string } = {
  first: allDays[0] ?? "",
  last: allDays[allDays.length - 1] ?? "",
};
