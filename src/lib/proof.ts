import type { ProjectMeta } from "@/lib/content";
import { laneRange, laneTotal } from "@/lib/signal/data";

export interface ProofFact {
  id: "apps" | "seller" | "mobile" | "years";
  value: number;
  suffix: "+" | "";
  sinceYear?: number;
}

function roundedDown(total: number): number {
  return Math.floor(total / 100) * 100;
}

// `mobile` carries no sinceYear: its git history starts in 2025 but the app is older, so a year would mislead.
function commitFact(id: "seller" | "mobile"): ProofFact {
  const first = id === "seller" ? laneRange(id)?.first : undefined;
  return {
    id,
    value: roundedDown(laneTotal(id)),
    suffix: "+",
    ...(first ? { sinceYear: Number(first.slice(0, 4)) } : {}),
  };
}

/**
 * The numbers shown as proof. Derived from content and git history so they cannot drift from the work.
 * `experienceStarts` are "YYYY-MM" strings from the experience list.
 */
export function getProofFacts(projects: ProjectMeta[], experienceStarts: string[]): ProofFact[] {
  const apps = projects.filter((p) => {
    const stores = new Set(p.storeLinks.map((l) => l.store));
    return stores.has("appStore") && stores.has("googlePlay");
  }).length;
  const now = new Date();
  const nowMonths = now.getFullYear() * 12 + now.getMonth();
  // full years since the earliest start month ("YYYY-MM"), so January-March does not read one year too high
  const earliest = Math.min(...experienceStarts.map((s) => Number(s.slice(0, 4)) * 12 + Number(s.slice(5, 7)) - 1));
  const years = Math.max(0, Math.floor((nowMonths - earliest) / 12));
  return [
    { id: "apps", value: apps, suffix: "" },
    commitFact("seller"),
    commitFact("mobile"),
    { id: "years", value: years, suffix: "+" },
  ];
}

export function formatProof(value: number, locale: "en" | "tr"): string {
  return new Intl.NumberFormat(locale === "tr" ? "tr-TR" : "en-US", { useGrouping: true }).format(value);
}
