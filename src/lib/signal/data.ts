// TEMP stand-in for Task 1; replaced at merge
export type LaneId = "seller" | "mobile" | "admin" | "landing" | "dremly" | "posme" | "rommer" | "site";

export interface Lane {
  id: LaneId;
  name: { en: string; tr: string };
  color: string;
  slug?: string;
  total: number;
  first: string;
}

export const lanes: Lane[] = [
  { id: "seller", name: { en: "Seller panel", tr: "Satıcı paneli" }, color: "#8ccbff", slug: "1likte-seller-panel", total: 1700, first: "2022-11-25" },
  { id: "mobile", name: { en: "Mobile app", tr: "Mobil uygulama" }, color: "#8ccbff", slug: "1likte-mobile-application", total: 906, first: "2025-05-21" },
  { id: "admin", name: { en: "Admin panel", tr: "Admin paneli" }, color: "#8ccbff", slug: "1likte-admin-panel", total: 752, first: "2023-06-20" },
  { id: "landing", name: { en: "Landing page", tr: "Tanıtım sitesi" }, color: "#8ccbff", slug: "1likte-landing-page", total: 392, first: "2023-12-18" },
  { id: "dremly", name: { en: "Dremly", tr: "Dremly" }, color: "#8ccbff", slug: "dremly", total: 600, first: "2026-07-11" },
  { id: "posme", name: { en: "Posme", tr: "Posme" }, color: "#8ccbff", slug: "posme", total: 217, first: "2026-07-01" },
  { id: "rommer", name: { en: "Rommer", tr: "Rommer" }, color: "#8ccbff", slug: "rommer-movement-analysis", total: 569, first: "2026-08-19" },
  { id: "site", name: { en: "This site", tr: "Bu site" }, color: "#8ccbff", total: 139, first: "2024-09-19" },
];

function lane(id: LaneId): Lane {
  return lanes.find((l) => l.id === id)!;
}

export function laneTotal(id: LaneId): number {
  return lane(id).total;
}

export function laneRange(id: LaneId): { first: string; last: string } | null {
  return { first: lane(id).first, last: "2026-10-16" };
}

export function laneForSlug(slug: string): LaneId | null {
  return lanes.find((l) => l.slug === slug)?.id ?? null;
}
