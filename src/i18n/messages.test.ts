import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.join(process.cwd(), "messages");
const NAMESPACES = ["a11y", "footer", "gallery", "home", "locale", "meta", "nav", "notFound", "project", "signal"];

// Brand and stack names that are the same in both languages.
const SAME_IN_BOTH = new Set([
  "home.name",
  "nav.name",
  "nav.ai",
  "footer.rights",
  "project.stores.appStore",
  "project.stores.googlePlay",
  "home.ai.tag",
  "home.ai.products.dremly.name",
  "home.ai.products.posme.name",
  "home.work.store.appStore",
  "home.work.store.googlePlay",
  "home.work.illustration.api",
  "home.work.illustration.apiNote",
  "home.work.illustration.panelNote",
]);

type Tree = { [k: string]: string | Tree };

function load(locale: string, ns: string): Tree {
  return JSON.parse(readFileSync(path.join(root, locale, `${ns}.json`), "utf8")) as Tree;
}

function flatten(tree: Tree, prefix: string, into: Record<string, string> = {}): Record<string, string> {
  for (const [k, v] of Object.entries(tree)) {
    const key = `${prefix}.${k}`;
    if (typeof v === "string") into[key] = v;
    else flatten(v, key, into);
  }
  return into;
}

describe("messages", () => {
  it("has exactly the agreed namespace files in both locales", () => {
    for (const locale of ["en", "tr"]) {
      const files = readdirSync(path.join(root, locale)).map((f) => f.replace(/\.json$/, ""));
      expect(files.sort()).toEqual([...NAMESPACES].sort());
    }
  });

  for (const ns of NAMESPACES) {
    describe(ns, () => {
      const en = flatten(load("en", ns), ns);
      const tr = flatten(load("tr", ns), ns);

      it("has identical EN and TR key sets", () => {
        expect(Object.keys(tr).sort()).toEqual(Object.keys(en).sort());
      });

      it("has no empty values", () => {
        for (const [k, v] of [...Object.entries(en), ...Object.entries(tr)]) {
          expect(v.trim(), k).not.toBe("");
        }
      });

      it("translates every value except allowlisted brand names", () => {
        for (const [k, v] of Object.entries(en)) {
          if (SAME_IN_BOTH.has(k)) continue;
          expect(tr[k], k).not.toBe(v);
        }
      });
    });
  }

  it("carries the keys the Signal engine reads", () => {
    for (const locale of ["en", "tr"]) {
      const s = load(locale, "signal");
      for (const k of ["pointRatio", "illustration"]) expect(s[k], k).toBeTruthy();
    }
  });
});
