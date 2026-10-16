export type LaneId = "seller" | "mobile" | "admin" | "landing" | "dremly" | "posme" | "rommer" | "site";

export interface Lane {
  id: LaneId;
  name: { en: string; tr: string };
  color: string;
  slug?: string;
}

/** Order = chronological by first commit. */
export const lanes: Lane[] = [
  {
    id: "seller",
    name: { en: "1likte Seller Panel", tr: "1likte Satıcı Paneli" },
    color: "#3E8BFF",
    slug: "1likte-seller-panel",
  },
  {
    id: "admin",
    name: { en: "1likte Admin Panel", tr: "1likte Admin Paneli" },
    color: "#7FB2FF",
    slug: "1likte-admin-panel",
  },
  {
    id: "landing",
    name: { en: "1likte Landing", tr: "1likte Tanıtım Sitesi" },
    color: "#A8D8FF",
    slug: "1likte-landing-page",
  },
  { id: "site", name: { en: "This site", tr: "Bu site" }, color: "#E8EAF0" },
  {
    id: "mobile",
    name: { en: "1likte Mobile", tr: "1likte Mobil" },
    color: "#5CC8FF",
    slug: "1likte-mobile-application",
  },
  { id: "posme", name: { en: "Posme", tr: "Posme" }, color: "#FFB86B", slug: "posme" },
  { id: "dremly", name: { en: "Dremly", tr: "Dremly" }, color: "#9B8CFF", slug: "dremly" },
  {
    id: "rommer",
    name: { en: "Movement analysis (Rommer)", tr: "Hareket analizi (Rommer)" },
    color: "#6EE7B7",
    slug: "rommer-movement-analysis",
  },
];
