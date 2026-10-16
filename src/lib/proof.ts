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

function commitFact(id: "seller" | "mobile"): ProofFact {
  const first = laneRange(id)?.first;
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
  const earliest = Math.min(...experienceStarts.map((s) => Number(s.slice(0, 4))));
  const years = new Date().getFullYear() - earliest;
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
