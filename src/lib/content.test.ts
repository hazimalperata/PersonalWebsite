import { rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { getProject, getProjectSlugs, getProjects } from "./content";

describe("content", () => {
  it("lists featured projects first by order", async () => {
    const list = await getProjects("en");
    const featured = list.filter((p) => p.featured).map((p) => p.order);
    expect(featured).toEqual([...featured].sort((a, b) => a - b));
    expect(list.length).toBe(9);
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
    expect(slugs.length).toBe(9);
    expect(new Set(slugs).size).toBe(9);
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
