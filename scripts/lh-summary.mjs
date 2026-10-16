import { readFileSync } from "node:fs";

for (const name of ["desktop", "mobile"]) {
  const file = new URL(`../docs/perf/lh-${name}.json`, import.meta.url);
  const r = JSON.parse(readFileSync(file, "utf8"));
  const c = r.categories;
  console.log(
    `${name}: performance ${c.performance.score}, accessibility ${c.accessibility.score}, ` +
      `best-practices ${c["best-practices"].score}, seo ${c.seo.score}, ` +
      `LCP ${Math.round(r.audits["largest-contentful-paint"].numericValue)} ms, ` +
      `TBT ${Math.round(r.audits["total-blocking-time"].numericValue)} ms, ` +
      `CLS ${r.audits["cumulative-layout-shift"].numericValue}`,
  );
}
