import { readFileSync, readdirSync } from "node:fs";
import { rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { getProject, getProjectSlugs, getProjects } from "./content";
import { laneTotal, type LaneId } from "@/lib/signal/data";

const ENGLISH_PROJECT_COUNT = readdirSync(path.join(process.cwd(), "content", "projects")).filter((f) =>
  f.endsWith(".en.mdx"),
).length;

describe("content", () => {
  it("lists featured projects first by order", async () => {
    const list = await getProjects("en");
    const featured = list.filter((p) => p.featured).map((p) => p.order);
    expect(featured).toEqual([...featured].sort((a, b) => a - b));
    expect(list.length).toBe(ENGLISH_PROJECT_COUNT);
    // featured block comes before every non-featured project
    const firstRest = list.findIndex((p) => !p.featured);
    expect(list.slice(firstRest).every((p) => !p.featured)).toBe(true);
  });

  it("sorts the non-featured projects by publishedAt descending", async () => {
    const list = await getProjects("en");
    const rest = list.filter((p) => !p.featured).map((p) => p.publishedAt);
    expect(rest).toEqual([...rest].sort().reverse());
  });

  it("falls back to English when Turkish is missing", async () => {
    const p = await getProject("react-window-modals", "tr");
    expect(p?.meta.fallback).toBe(true);
    expect(p?.meta.locale).toBe("en");
  });

  it("uses the Turkish file when it exists", async () => {
    const p = await getProject("1likte-landing-page", "tr");
    expect(p?.meta.fallback).toBe(false);
    expect(p?.meta.locale).toBe("tr");
  });

  it("normalises metadata", async () => {
    const p = await getProject("1likte-landing-page", "en");
    expect(p?.meta.status).toBe("completed");
    expect(p?.meta.cover).toBe(p?.meta.images[0]);
    expect(p?.meta.stack.length).toBeGreaterThan(0);
    expect(p?.content).toContain("## Overview");
  });

  it("returns null for unknown slug", async () => {
    expect(await getProject("nope", "en")).toBeNull();
  });

  it("lists every slug once", async () => {
    const slugs = await getProjectSlugs();
    expect(slugs.length).toBe(ENGLISH_PROJECT_COUNT);
    expect(new Set(slugs).size).toBe(ENGLISH_PROJECT_COUNT);
  });

  it("ignores a slug that only has a Turkish file", async () => {
    const file = path.join(process.cwd(), "content", "projects", "zz-tr-only.tr.mdx");
    await writeFile(file, '---\ntitle: "x"\n---\n\nbody\n');
    try {
      expect(await getProjectSlugs()).not.toContain("zz-tr-only");
      expect((await getProjects("tr")).map((p) => p.slug)).not.toContain("zz-tr-only");
    } finally {
      await rm(file, { force: true });
    }
  });
});

describe("Living Signal content model", () => {
  const FEATURED = [
    "dremly",
    "posme",
    "rommer-movement-analysis",
    "1likte-mobile-application",
    "1likte-seller-panel",
  ];

  it("features exactly the chosen five, in order, each tied to a lane with commits", async () => {
    const list = await getProjects("en");
    const featured = list.filter((p) => p.featured);
    expect(featured.map((p) => p.slug)).toEqual(FEATURED);
    expect(featured.map((p) => p.order)).toEqual([1, 2, 3, 4, 5]);
    for (const p of featured) {
      expect(p.signal).not.toBeNull();
      expect(laneTotal(p.signal as LaneId)).toBeGreaterThan(0);
    }
  });

  it("applies defaults and rejects an unknown signal lane", async () => {
    const file = path.join(process.cwd(), "content", "projects", "zz-defaults.en.mdx");
    await writeFile(file, '---\ntitle: "x"\nsignal: "nonsense"\n---\n\nbody\n');
    try {
      const p = await getProject("zz-defaults", "en");
      expect(p?.meta).toMatchObject({ kind: "personal", platforms: [], storeLinks: [], portraitImages: false, signal: null });
    } finally {
      await rm(file, { force: true });
    }
  });

  it("gives every 1likte project the CTO role and the mobile app both store links", async () => {
    for (const locale of ["en", "tr"] as const) {
      const list = await getProjects(locale);
      for (const p of list.filter((x) => x.slug.startsWith("1likte-"))) expect(p.role).toBe("CTO");
    }
    const mobile = await getProject("1likte-mobile-application", "en");
    expect(mobile?.meta.storeLinks.map((s) => s.store)).toEqual(["appStore", "googlePlay"]);
  });

  it("marks the two library and game projects completed", async () => {
    for (const slug of ["react-window-modals", "adventures-of-the-knight"]) {
      expect((await getProject(slug, "en"))?.meta.status).toBe("completed");
    }
  });

  it("never mentions GPA or NDA, nor calls the app Rommer", () => {
    const dir = path.join(process.cwd(), "content", "projects");
    for (const f of readdirSync(dir).filter((x) => x.endsWith(".mdx"))) {
      const text = readFileSync(path.join(dir, f), "utf8");
      expect(text, f).not.toMatch(/\bGPA\b|\bNDA\b/);
      // "Rommer" is the client: only "Movement analysis for Rommer" / "Rommer International" (and the TR title) may use it
      const rest = text
        .replace(/Movement analysis for Rommer/g, "")
        .replace(/Rommer için hareket analizi/g, "")
        .replace(/Rommer International/g, "");
      expect(rest, f).not.toMatch(/Rommer/);
    }
  });
});
