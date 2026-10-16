// Prints what dominates a Lighthouse JSON: node scripts/lh-detail.mjs desktop|mobile
import { readFileSync } from "node:fs";

const name = process.argv[2] ?? "mobile";
const r = JSON.parse(readFileSync(new URL(`../docs/perf/lh-${name}.json`, import.meta.url), "utf8"));
const show = (id, n = 8) => {
  const a = r.audits[id];
  if (!a) return;
  console.log(`\n${id}: ${a.displayValue ?? a.score}`);
  for (const i of (a.details?.items ?? []).slice(0, n)) console.log(" ", JSON.stringify(i).slice(0, 400));
};
console.log("FCP", r.audits["first-contentful-paint"].numericValue, "SI", r.audits["speed-index"].numericValue);
show("largest-contentful-paint-element", 3);
show("lcp-breakdown-insight", 3);
show("mainthread-work-breakdown", 4);
show("bootup-time", 6);
show("long-tasks", 6);
console.log("\nbiggest requests");
for (const i of r.audits["network-requests"].details.items.filter((i) => i.transferSize > 30000))
  console.log(" ", i.url.slice(-60), i.transferSize, Math.round(i.networkRequestTime), "->", Math.round(i.networkEndTime));
