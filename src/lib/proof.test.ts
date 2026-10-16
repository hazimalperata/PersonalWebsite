import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ProjectMeta } from "./content";

vi.mock("@/lib/signal/data", () => ({
  laneTotal: (id: string) => ({ seller: 1700, mobile: 906 })[id] ?? 0,
  laneRange: (id: string) =>
    ({ seller: { first: "2022-11-25", last: "2026-10-16" }, mobile: { first: "2025-05-21", last: "2026-10-16" } })[id] ?? null,
}));

import { formatProof, getProofFacts } from "./proof";

function project(slug: string, stores: Array<"appStore" | "googlePlay">): ProjectMeta {
  return {
    slug,
    locale: "en",
    fallback: false,
    title: slug,
    summary: "",
    publishedAt: "2026-01-01",
    year: "2026",
    images: [],
    cover: "",
    status: "completed",
    role: "",
    stack: [],
    featured: false,
    order: 99,
    kind: "product",
    platforms: [],
    storeLinks: stores.map((store) => ({ store, href: `https://example.com/${slug}/${store}` })),
    portraitImages: false,
    signal: null,
  };
}

describe("getProofFacts", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-16T12:00:00Z"));
  });
  afterEach(() => vi.useRealTimers());

  it("derives the four proof numbers from data", () => {
    const both = ["appStore", "googlePlay"] as const;
    const facts = getProofFacts(
      [project("a", [...both]), project("b", [...both]), project("c", [...both]), project("d", ["appStore"])],
      ["2020-04", "2026-07"],
    );
    expect(facts).toEqual([
      { id: "apps", value: 3, suffix: "" },
      { id: "seller", value: 1700, suffix: "+", sinceYear: 2022 },
      { id: "mobile", value: 900, suffix: "+" },
      { id: "years", value: 6, suffix: "+" },
    ]);
  });
});

describe("formatProof", () => {
  it("groups thousands per locale", () => {
    expect(formatProof(1700, "en")).toBe("1,700");
    expect(formatProof(1700, "tr")).toBe("1.700");
    expect(formatProof(6, "tr")).toBe("6");
  });
});
