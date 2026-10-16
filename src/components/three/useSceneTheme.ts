"use client";

import { createContext, useContext, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, MathUtils } from "three";
import type { Theme } from "@/lib/theme";

/** Damping rate: about one second to settle. */
const LAMBDA = 4;

const TARGETS = {
  dark: {
    sunAngle: 3.8,
    atmosphere: "#8CCBFF",
    atmosphereIntensity: 1.1,
    atmosphereAlpha: 0,
    emissive: 1.2,
    ambient: 0.12,
    ambientColor: "#112244",
    starsOpacity: 1,
  },
  light: {
    sunAngle: 1.4,
    atmosphere: "#5FA8E8",
    atmosphereIntensity: 1.3,
    atmosphereAlpha: 0.9,
    emissive: 0.15,
    ambient: 0.45,
    ambientColor: "#7f9cc4",
    starsOpacity: 0,
  },
} as const;

const NUMBER_KEYS = [
  "sunAngle",
  "atmosphereIntensity",
  "atmosphereAlpha",
  "emissive",
  "ambient",
  "starsOpacity",
] as const;

/** Mutable and read every frame by the scene; `step` is the only writer. */
export class SceneTheme {
  sunAngle: number;
  atmosphere: Color;
  atmosphereIntensity: number;
  /** 0 = additive glow (dark), 1 = normal "over" blending (light). */
  atmosphereAlpha: number;
  emissive: number;
  ambient: number;
  ambientColor: Color;
  starsOpacity: number;
  private readonly goal = new Color();

  constructor(theme: Theme) {
    const t = TARGETS[theme];
    this.sunAngle = t.sunAngle;
    this.atmosphere = new Color(t.atmosphere);
    this.atmosphereIntensity = t.atmosphereIntensity;
    this.atmosphereAlpha = t.atmosphereAlpha;
    this.emissive = t.emissive;
    this.ambient = t.ambient;
    this.ambientColor = new Color(t.ambientColor);
    this.starsOpacity = t.starsOpacity;
  }

  step(theme: Theme, dt: number) {
    const t = TARGETS[theme];
    for (const key of NUMBER_KEYS) this[key] = MathUtils.damp(this[key], t[key], LAMBDA, dt);
    const k = 1 - Math.exp(-LAMBDA * dt);
    this.atmosphere.lerp(this.goal.set(t.atmosphere), k);
    this.ambientColor.lerp(this.goal.set(t.ambientColor), k);
  }
}

export const SceneThemeContext = createContext<SceneTheme | null>(null);

/**
 * Owns the damped, mutable scene theme. Call once, inside the Canvas; children read it with
 * `useSceneTheme()` and mutate nothing. The returned object is stable, its fields move every frame.
 */
export function useSceneThemeDriver(theme: Theme): SceneTheme {
  // the initial theme only; later changes are damped toward the target in useFrame
  const [current] = useState(() => new SceneTheme(theme));
  useFrame((_, dt) => current.step(theme, dt));
  return current;
}

export function useSceneTheme(): SceneTheme {
  const ctx = useContext(SceneThemeContext);
  if (!ctx) throw new Error("useSceneTheme must be used within <EarthScene>");
  return ctx;
}
