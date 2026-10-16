/** The seven drawing sheets of the page, in order. Shared by the nav, the title block and the palette. */
export const SECTIONS = [
  { id: "hero", ref: "A-01", label: "Overview" },
  { id: "proof", ref: "A-02", label: "Proof" },
  { id: "work", ref: "A-03", label: "Work" },
  { id: "capabilities", ref: "A-04", label: "Capabilities" },
  { id: "ai", ref: "A-05", label: "AI" },
  { id: "experience", ref: "A-06", label: "Experience" },
  { id: "contact", ref: "A-07", label: "Contact" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];
