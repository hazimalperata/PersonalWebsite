// Collects per-day commit counts (dates and counts only) for the owner's own commits from local repos.
// Read-only: runs `git log` only. Output: src/lab/d4/signal.json
import { execFileSync } from "node:child_process";
import { existsSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const W = "C:\\Users\\hazim\\WebstormProjects\\";
const A = "C:\\Users\\hazim\\AndroidStudioProjects\\";
const SOURCES = [
  { name: "1likte Mobile", repos: [W + "birlikte-mobile"] },
  { name: "1likte Seller Panel", repos: [W + "birlikte-sellerweb"] },
  { name: "1likte Admin Panel", repos: [W + "birlikte-adminweb"] },
  { name: "1likte Landing", repos: [W + "1likte-LandingPage"] },
  { name: "Dremly", repos: [W + "dremly-app"] },
  { name: "Posme", repos: [A + "Framy"] },
  { name: "Rommer", repos: [W + "rommer-mobile-app", W + "rommer-platform"] },
  { name: "This site", repos: [W + "personal-website"] },
];

const projects = [];
for (const src of SOURCES) {
  const counts = new Map();
  for (const repo of src.repos) {
    if (!existsSync(repo)) continue;
    const out = execFileSync(
      "git",
      ["-C", repo, "log", "--all", "--author=Hazim\\|hazimalperata\\|Alper Ata", "--format=%ad", "--date=short"],
      { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
    );
    for (const line of out.split(/\r?\n/)) {
      const d = line.trim();
      if (/^\d{4}-\d{2}-\d{2}$/.test(d)) counts.set(d, (counts.get(d) ?? 0) + 1);
    }
  }
  const days = [...counts.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([d, n]) => ({ d, n }));
  if (days.length) projects.push({ name: src.name, days });
}

const here = dirname(fileURLToPath(import.meta.url));
writeFileSync(join(here, "..", "signal.json"), JSON.stringify({ generatedAt: new Date().toISOString().slice(0, 10), projects }));
let total = 0;
for (const p of projects) {
  const t = p.days.reduce((s, x) => s + x.n, 0);
  total += t;
  console.log(p.name, t, p.days[0].d, p.days[p.days.length - 1].d);
}
console.log("TOTAL", total);
