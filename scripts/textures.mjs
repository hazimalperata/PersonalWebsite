// Builds the web texture sets and hero posters from the 10k source JPEGs.
// Usage: yarn textures   (needs the sources in public/textures/earth/*.jpg)
// The sources were removed from the tree after the first run; restore them from git history
// (commit before "feat: add texture pipeline") with `git checkout <sha> -- public/textures/earth`.
// Budgets: 4k set <= 6 MB, 2k set <= 2 MB, each poster <= 150 KB. Quality drops by 5 per step (min 60).
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = (name) => path.join(root, "public/textures/earth", name);
const earthOut = (set, name) => path.join(root, "public/textures/earth", set, `${name}.webp`);
const posterOut = (name) => path.join(root, "public/posters", `${name}.webp`);

const MB = 1024 * 1024;
const KB = 1024;
const MIN_QUALITY = 60;
const DARK_BG = "#0B1628";

// name -> source file, whether it uses the (smaller) bump size, whether native size is kept
const LAYERS = [
  { name: "day", file: "8081earthmap10k.jpg" },
  { name: "lights", file: "8081earthlights10k.jpg" },
  // 8k_earth_clouds.jpg is not in the repo; the color cloud map and its alpha are only 1024x512.
  // Never enlarge them: upscaling adds bytes, not detail.
  { name: "clouds", file: "04_earthcloudmap.jpg", noEnlarge: true },
  { name: "clouds-alpha", file: "05_earthcloudmaptrans.jpg", noEnlarge: true },
  { name: "bump", file: "8081earthbump10k.jpg", bump: true },
];

const SETS = [
  { set: "4k", width: 4096, height: 2048, bumpWidth: 2048, bumpHeight: 1024, startQuality: 80, budget: 6 * MB },
  { set: "2k", width: 2048, height: 1024, bumpWidth: 1024, bumpHeight: 512, startQuality: 78, budget: 2 * MB },
];

const failures = [];
const kb = (n) => `${(n / KB).toFixed(1)} KB`;

async function toRaw(file, width, height, noEnlarge) {
  const { data, info } = await sharp(src(file), { limitInputPixels: false })
    .resize(width, height, { fit: "fill", kernel: "lanczos3", withoutEnlargement: !!noEnlarge })
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data, info };
}

const encode = ({ data, info }, quality) =>
  sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
    .webp({ quality })
    .toBuffer();

async function write(file, buf) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, buf);
  console.log(`  ${path.relative(root, file).replaceAll("\\", "/")}  ${buf.length} B (${kb(buf.length)})`);
}

// Lowers quality in steps of 5 until encode() fits the budget. Returns { quality, bufs, total, ok }.
async function fitBudget(label, startQuality, budget, encodeAll) {
  let quality = startQuality;
  for (;;) {
    const bufs = await encodeAll(quality);
    const total = bufs.reduce((n, b) => n + b.length, 0);
    if (total <= budget) return { quality, bufs, total, ok: true };
    if (quality - 5 < MIN_QUALITY) {
      failures.push(`${label}: ${total} B over budget ${budget} B at min quality ${quality}`);
      return { quality, bufs, total, ok: false };
    }
    quality -= 5;
  }
}

// Horizon crop: bottom 40% of height, middle 60% of width, resized to 1600x900 (cover).
async function horizon({ data, info }) {
  const left = Math.round(info.width * 0.2);
  const width = Math.round(info.width * 0.6);
  const top = Math.round(info.height * 0.6);
  const height = info.height - top;
  return sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
    .extract({ left, top, width, height })
    .resize(1600, 900, { fit: "cover" });
}

async function main() {
  const rawCache = {}; // 4k day + lights kept for the posters

  for (const cfg of SETS) {
    console.log(`\n${cfg.set} set`);
    const raws = [];
    for (const layer of LAYERS) {
      const w = layer.bump ? cfg.bumpWidth : cfg.width;
      const h = layer.bump ? cfg.bumpHeight : cfg.height;
      const raw = await toRaw(layer.file, w, h, layer.noEnlarge);
      raws.push(raw);
      if (cfg.set === "4k" && (layer.name === "day" || layer.name === "lights")) rawCache[layer.name] = raw;
    }
    const res = await fitBudget(`${cfg.set} set`, cfg.startQuality, cfg.budget, (q) => Promise.all(raws.map((r) => encode(r, q))));
    for (let i = 0; i < LAYERS.length; i++) await write(earthOut(cfg.set, LAYERS[i].name), res.bufs[i]);
    console.log(
      `  ${cfg.set} total ${res.total} B (${(res.total / MB).toFixed(2)} MB) / budget ${(cfg.budget / MB).toFixed(0)} MB, final quality ${res.quality}${res.ok ? "" : "  OVER BUDGET"}`,
    );
  }

  console.log("\nposters");
  const { day, lights } = rawCache;

  const lightPipe = (await horizon(day)).modulate({ brightness: 0.9 });
  const lightPng = await lightPipe.clone().raw().toBuffer({ resolveWithObject: true });

  // dark: lights screened over the dark background, then the same crop
  const bg = await sharp({
    create: { width: lights.info.width, height: lights.info.height, channels: 3, background: DARK_BG },
  })
    .composite([
      {
        input: lights.data,
        raw: { width: lights.info.width, height: lights.info.height, channels: lights.info.channels },
        blend: "screen",
      },
    ])
    .raw()
    .toBuffer({ resolveWithObject: true });
  const darkPipe = await horizon(bg);
  const darkPng = await darkPipe.clone().raw().toBuffer({ resolveWithObject: true });

  for (const [name, pic] of [
    ["earth-light", lightPng],
    ["earth-dark", darkPng],
  ]) {
    const res = await fitBudget(name, 80, 150 * KB, async (q) => [await encode(pic, q)]);
    await write(posterOut(name), res.bufs[0]);
    console.log(`  ${name} final quality ${res.quality}${res.ok ? "" : "  OVER BUDGET"}`);
  }

  if (failures.length) {
    console.error("\nBudget failures:\n  " + failures.join("\n  "));
    process.exit(1);
  }
  console.log("\nAll budgets met.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
