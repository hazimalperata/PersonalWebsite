"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { BufferAttribute, BufferGeometry, SRGBColorSpace, type PointsMaterial } from "three";
import { STAR_TEXTURE } from "@/lib/capabilities";
import { useSceneTheme } from "./useSceneTheme";

const RADIUS = 60;
const DEPTH = 20;

// Deterministic, so the sky is the same on every mount (and render stays pure).
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildSky(count: number): BufferGeometry {
  const rand = mulberry32(1969);
  const position = new Float32Array(count * 3);
  const color = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = RADIUS + rand() * DEPTH;
    const theta = 2 * Math.PI * rand();
    const phi = Math.acos(2 * rand() - 1);
    position[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    position[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    position[i * 3 + 2] = r * Math.cos(phi);
    // Mostly white, a few warm or cool, each at its own brightness.
    const v = 0.45 + rand() * 0.55;
    const tint = rand();
    color[i * 3] = v * (tint > 0.9 ? 1 : tint < 0.1 ? 0.75 : 0.95);
    color[i * 3 + 1] = v * (tint > 0.9 ? 0.85 : tint < 0.1 ? 0.88 : 0.96);
    color[i * 3 + 2] = v * (tint > 0.9 ? 0.7 : 1);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(position, 3));
  geometry.setAttribute("color", new BufferAttribute(color, 3));
  return geometry;
}

export default function Stars({ tier }: { tier: "low" | "high" }) {
  const theme = useSceneTheme();
  const star = useTexture(STAR_TEXTURE, (texture) => {
    texture.colorSpace = SRGBColorSpace;
  });
  const geometry = useMemo(() => buildSky(tier === "high" ? 2500 : 1200), [tier]);
  const material = useRef<PointsMaterial>(null);

  useFrame(() => {
    if (material.current) material.current.opacity = theme.starsOpacity;
  });

  return (
    <points geometry={geometry}>
      <pointsMaterial
        ref={material}
        map={star}
        size={tier === "high" ? 0.9 : 1.1}
        sizeAttenuation
        vertexColors
        transparent
        depthWrite={false}
        opacity={theme.starsOpacity}
      />
    </points>
  );
}
