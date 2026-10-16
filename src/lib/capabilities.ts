export type Tier = "poster" | "low" | "high";

export interface CapEnv {
  reducedMotion: boolean;
  coarsePointer: boolean;
  cores: number;
  memoryGb: number | null;
  saveData: boolean;
  webgl2: boolean;
  width: number;
}

export function detectTier(env: CapEnv): Tier {
  if (env.reducedMotion || !env.webgl2 || env.saveData) return "poster";
  if (env.coarsePointer || env.cores <= 4 || (env.memoryGb !== null && env.memoryGb <= 4) || env.width < 768) {
    return "low";
  }
  return "high";
}

interface NavigatorExtras {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
}

// GL support does not change at runtime; probing creates a context, so do it once.
let webgl2Probe: boolean | null = null;
function probeWebgl2(): boolean {
  if (webgl2Probe === null) {
    try {
      webgl2Probe = !!document.createElement("canvas").getContext("webgl2");
    } catch {
      webgl2Probe = false;
    }
  }
  return webgl2Probe;
}

/** Reads capability signals from the browser. Browser-only. */
export function readEnv(): CapEnv {
  const nav = navigator as Navigator & NavigatorExtras;
  const webgl2 = probeWebgl2();
  return {
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    coarsePointer: window.matchMedia("(pointer: coarse)").matches,
    cores: nav.hardwareConcurrency ?? 8,
    memoryGb: nav.deviceMemory ?? null,
    saveData: nav.connection?.saveData === true,
    webgl2,
    width: window.innerWidth,
  };
}

export interface TextureSet {
  map: string;
  lights: string;
  clouds: string;
  cloudsAlpha: string;
  bump: string;
}

export function textureSet(tier: "low" | "high"): TextureSet {
  const dir = `/textures/earth/${tier === "high" ? "4k" : "2k"}`;
  return {
    map: `${dir}/day.webp`,
    lights: `${dir}/lights.webp`,
    clouds: `${dir}/clouds.webp`,
    cloudsAlpha: `${dir}/clouds-alpha.webp`,
    bump: `${dir}/bump.webp`,
  };
}

/** The star sprite the Stars layer uses (every tier). */
export const STAR_TEXTURE = "/textures/space/star.png";

/** Every texture URL the scene requests for a tier: Earth, Clouds and Stars. Used to preflight before mounting. */
export function sceneTextureUrls(tier: "low" | "high"): string[] {
  const set = textureSet(tier);
  return [set.map, set.lights, set.bump, set.clouds, set.cloudsAlpha, STAR_TEXTURE];
}

export function posterFor(theme: "dark" | "light"): string {
  return theme === "dark" ? "/posters/earth-dark.webp" : "/posters/earth-light.webp";
}

export interface TierStore {
  /** Cached detection; runs readEnv/detectTier once until invalidate() is called. */
  getSnapshot: () => Tier;
  /** Drops the cache so the next getSnapshot re-detects. */
  invalidate: () => void;
}

export function createTierStore(read: () => CapEnv = readEnv): TierStore {
  let cached: Tier | null = null;
  return {
    getSnapshot: () => cached ?? (cached = detectTier(read())),
    invalidate: () => {
      cached = null;
    },
  };
}
