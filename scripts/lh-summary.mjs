import { existsSync, readFileSync } from "node:fs";

// Reads docs/perf/lh-<page>-<form>.json (see docs/perf/README.md for the commands).
for (const page of ["home", "work", "gallery"]) {
  for (const name of ["desktop", "mobile"]) {
    const file = new URL(`../docs/perf/lh-${page}-${name}.json`, import.meta.url);
    if (!existsSync(file)) continue;
    const r = JSON.parse(readFileSync(file, "utf8"));
    const c = r.categories;
    console.log(
      `${page} ${name}: performance ${c.performance.score}, accessibility ${c.accessibility.score}, ` +
        `best-practices ${c["best-practices"].score}, seo ${c.seo.score}, ` +
        `LCP ${Math.round(r.audits["largest-contentful-paint"].numericValue)} ms, ` +
        `TBT ${Math.round(r.audits["total-blocking-time"].numericValue)} ms, ` +
        `CLS ${r.audits["cumulative-layout-shift"].numericValue}`,
    );
  }
}
