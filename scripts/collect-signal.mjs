// Collects per-day commit counts (dates and counts only) from local repos.
// Read-only: runs `git log` only. Config: signal.config.local.json (git-ignored).
// Output: src/data/signal.json. Never overwritten when nothing was collected.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { countByDay, hasCollectedData, toSignal } from "./signal-lib.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const configPath = join(root, "signal.config.local.json");

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!existsSync(configPath)) {
  fail("Missing signal.config.local.json. Copy signal.config.example.json and fill in your paths.");
}

let config;
try {
  config = JSON.parse(readFileSync(configPath, "utf8"));
} catch (err) {
  fail(`Cannot read signal.config.local.json: ${err instanceof Error ? err.message : err}`);
}
if (!config || typeof config.author !== "string" || !Array.isArray(config.lanes)) {
  fail('signal.config.local.json must have an "author" string and a "lanes" array.');
}

const lanes = [];

for (const lane of config.lanes) {
  const counts = {};
  for (const repo of lane.repos ?? []) {
    if (!existsSync(repo)) {
      console.warn(`skip (missing): ${repo}`);
      continue;
    }
    const out = execFileSync(
      "git",
      ["-C", repo, "log", "--all", `--author=${config.author}`, "--format=%ad", "--date=short"],
      { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
    );
    for (const [d, n] of Object.entries(countByDay(out))) counts[d] = (counts[d] ?? 0) + n;
  }
  if (Object.keys(counts).length) lanes.push({ id: lane.id, counts });
}

if (!hasCollectedData(lanes)) {
  fail("No commits collected from any lane. Check the repo paths and the author pattern. src/data/signal.json was left untouched.");
}

const data = toSignal(lanes, new Date().toISOString().slice(0, 10));
writeFileSync(join(root, "src", "data", "signal.json"), JSON.stringify(data));

let total = 0;
for (const l of data.lanes) {
  const t = l.days.reduce((s, x) => s + x.n, 0);
  total += t;
  console.log(l.id, t, l.days[0].d, l.days[l.days.length - 1].d);
}
console.log("TOTAL", total);
